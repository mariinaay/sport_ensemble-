import { useCallback, useEffect, useState } from 'react'
import { requete, envoyer } from './api'
import { dateSeance } from '../utils/constants'

// Une séance avec ses inscriptions, ses participants et son organisateur
async function chargerSeance(id) {
  const [seance, inscriptions, utilisateurs] = await Promise.all([
    requete(`/sessions/${id}`), requete(`/registrations?sessionId=${id}`), requete('/users'),
  ])
  const participants = inscriptions
    .map((inscription) => utilisateurs.find((utilisateur) => utilisateur.id === inscription.userId))
    .filter(Boolean)
  return { seance, inscriptions, participants, organisateur: utilisateurs.find((u) => u.id === seance.organizerId) }
}

// Fiche et confirmation : charge la séance ; `charger` sert aussi au bouton « Réessayer »
export function useSeance(id) {
  const [donnees, setDonnees] = useState(null)
  const [erreur, setErreur] = useState('')

  const charger = useCallback(() => {
    setErreur('')
    chargerSeance(id).then(setDonnees).catch((e) => setErreur(e.message))
  }, [id])

  useEffect(() => { charger() }, [charger])

  return { donnees, erreur, setErreur, charger }
}

// Déjà inscrit : on ne crée pas une deuxième inscription
export async function rejoindreSeance(id, utilisateur, inscriptions) {
  const existante = inscriptions.find((i) => i.userId === utilisateur.id)
  return existante || envoyer('POST', '/registrations', { sessionId: Number(id), userId: utilisateur.id })
}

export function annulerInscription(id) {
  return requete(`/registrations/${id}`, { method: 'DELETE' })
}

// Les séances où l'utilisateur est inscrit (une inscription dont la séance n'existe plus est ignorée)
export async function chargerMesSeances(id) {
  const [inscriptions, seances, utilisateurs] = await Promise.all([
    requete(`/registrations?userId=${id}`), requete('/sessions'), requete('/users'),
  ])
  return inscriptions.map((inscription) => {
    const seance = seances.find((s) => s.id === inscription.sessionId)
    return seance && { inscription, seance, organisateur: utilisateurs.find((u) => u.id === seance.organizerId) }
  }).filter(Boolean)
}

// En minuscule : il s'affiche au milieu d'une phrase (« niveau débutant »)
export function niveauTexte(seance) {
  return seance.level === 'intermediaire' ? 'intermédiaire' : 'débutant'
}

// '2026-10-18' → 'dim. 18 oct.' (ou 'dimanche 18 octobre' avec les options longues)
export function dateTexte(seance, options = { weekday: 'short', day: 'numeric', month: 'short' }) {
  return new Intl.DateTimeFormat('fr-FR', options).format(dateSeance(seance))
}

// '09:00' → '09h00'
export function heureSeance(seance) {
  return seance.time.replace(':', 'h')
}
