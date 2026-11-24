import { requete, envoyer } from './api'

export async function chargerSeance(id) {
  const [seance, inscriptions, utilisateurs] = await Promise.all([
    requete(`/sessions/${id}`), requete(`/registrations?sessionId=${id}`), requete('/users'),
  ])
  const participants = inscriptions
    .map((inscription) => utilisateurs.find((utilisateur) => utilisateur.id === inscription.userId))
    .filter(Boolean)
  return { seance, inscriptions, participants, organisateur: utilisateurs.find((u) => u.id === seance.organizerId) }
}

export async function rejoindreSeance(id, utilisateur, inscriptions) {
  const existante = inscriptions.find((i) => i.userId === utilisateur.id)
  return existante || envoyer('POST', '/registrations', { sessionId: Number(id), userId: utilisateur.id })
}

export function annulerInscription(id) {
  return requete(`/registrations/${id}`, { method: 'DELETE' })
}

export async function chargerMesSeances(id) {
  const [inscriptions, seances, utilisateurs] = await Promise.all([
    requete(`/registrations?userId=${id}`), requete('/sessions'), requete('/users'),
  ])
  return inscriptions.map((inscription) => {
    const seance = seances.find((s) => s.id === inscription.sessionId)
    return seance && { inscription, seance, organisateur: utilisateurs.find((u) => u.id === seance.organizerId) }
  }).filter(Boolean)
}

export function dateSeance(seance, options = { weekday: 'short', day: 'numeric', month: 'short' }) {
  return new Intl.DateTimeFormat('fr-FR', options).format(new Date(`${seance.date}T${seance.time}:00`))
}
export function heureSeance(seance) { return seance.time.replace(':', 'h') }
