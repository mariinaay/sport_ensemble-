import { useCallback, useEffect, useState } from 'react'
import { requete, envoyer } from './api'
import { dateSeance } from '../utils/constants'

// Charge une séance avec ses participants et son organisateur
async function chargerSeance(id) {
  const [seance, inscriptions, utilisateurs] = await Promise.all([
    requete(`/sessions/${id}`), requete(`/registrations?sessionId=${id}`), requete('/users'),
  ])
  const participants = inscriptions
    .map((inscription) => utilisateurs.find((utilisateur) => utilisateur.id === inscription.userId))
    .filter(Boolean)
  return { seance, inscriptions, participants, organisateur: utilisateurs.find((u) => u.id === seance.organizerId) }
}

// Charge une séance pour les pages détail et confirmation
export function useSeance(id) {
  const [donnees, setDonnees] = useState(null) // la séance chargée
  const [erreur, setErreur] = useState('') // le message d'erreur

  // Lance le chargement (sert aussi pour le bouton « Réessayer »)
  const charger = useCallback(() => {
    setErreur('')
    chargerSeance(id).then(setDonnees).catch((e) => setErreur(e.message))
  }, [id])

  useEffect(() => { charger() }, [charger])

  return { donnees, erreur, setErreur, charger }
}

// Inscrit l'utilisateur à une séance (sauf s'il est déjà inscrit)
export async function rejoindreSeance(id, utilisateur, inscriptions) {
  const existante = inscriptions.find((i) => i.userId === utilisateur.id)
  return existante || envoyer('POST', '/registrations', { sessionId: Number(id), userId: utilisateur.id })
}

// Annule l'inscription à une séance
export function annulerInscription(id) {
  return requete(`/registrations/${id}`, { method: 'DELETE' })
}

// Charge les séances où l'utilisateur est inscrit
export async function chargerMesSeances(id) {
  const [inscriptions, seances, utilisateurs] = await Promise.all([
    requete(`/registrations?userId=${id}`), requete('/sessions'), requete('/users'),
  ])
  return inscriptions.map((inscription) => {
    const seance = seances.find((s) => s.id === inscription.sessionId)
    return seance && { inscription, seance, organisateur: utilisateurs.find((u) => u.id === seance.organizerId) }
  }).filter(Boolean)
}

// Donne le niveau en texte : 'débutant', 'intermédiaire' ou 'expert'
export function niveauTexte(seance) {
  if (seance.level === 'intermediaire') return 'intermédiaire'
  if (seance.level === 'expert') return 'expert'
  return 'débutant'
}

// Affiche la date en français, ex. 'dim. 18 oct.'
export function dateTexte(seance, options = { weekday: 'short', day: 'numeric', month: 'short' }) {
  return new Intl.DateTimeFormat('fr-FR', options).format(dateSeance(seance))
}

// Affiche l'heure, ex. '09h00'
export function heureSeance(seance) {
  return seance.time.replace(':', 'h')
}
