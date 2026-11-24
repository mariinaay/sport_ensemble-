// Textes communs à toute l'appli (value = dans db.json, label = affiché)

export const SPORTS = [
  { value: 'course', label: 'Course à pied' },
  { value: 'velo', label: 'Vélo' },
  { value: 'padel', label: 'Padel' },
  { value: 'foot', label: 'Foot à 5' },
  { value: 'rando', label: 'Rando' },
]

// Noms courts (pastilles des cartes, tuiles de l'accueil)
export const NOMS_COURTS = { course: 'Course', velo: 'Vélo', padel: 'Padel', foot: 'Foot', rando: 'Rando' }

// Autres sports du menu de recherche (pas encore de séance : on tombe sur « Aucune séance »)
export const AUTRES_SPORTS = [
  { value: 'tennis', label: 'Tennis' },
  { value: 'natation', label: 'Natation' },
  { value: 'basket', label: 'Basket' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'escalade', label: 'Escalade' },
]

// 'foot' → 'Foot à 5'
export const libelleSport = (valeur) =>
  [...SPORTS, ...AUTRES_SPORTS].find((s) => s.value === valeur)?.label ?? valeur

// Page Notifications (parDefaut = cochée au départ)
export const NOTIFICATIONS = [
  { value: 'rappelSeance', label: 'Rappel avant une séance', aide: 'La veille et 1 h avant.', parDefaut: true },
  { value: 'nouveauParticipant', label: 'Nouveau participant à mes séances', parDefaut: true },
  { value: 'seanceAnnulee', label: 'Séance annulée ou modifiée', parDefaut: true },
  { value: 'messages', label: 'Nouveaux messages', parDefaut: true },
  { value: 'recapEmail', label: 'Récapitulatif par email', aide: 'Les séances près de chez toi, une fois par semaine.', parDefaut: false },
]

// Niveaux (value = dans db.json, label = affiché)
export const NIVEAUX = {
  debutant: 'Débutant',
  intermediaire: 'Intermédiaire',
  confirme: 'Confirmé',
}

// Date de démo : les séances de db.json sont en octobre 2026, on fait comme si on était le 16 octobre au soir
export const AUJOURDHUI = new Date('2026-10-16T19:00:00')

// Date et heure d'une séance : new Date('2026-10-18T09:00')
export const dateSeance = (seance) => new Date(`${seance.date}T${seance.time}`)

const JOURS_COURTS = ['DIM.', 'LUN.', 'MAR.', 'MER.', 'JEU.', 'VEN.', 'SAM.']
const MOIS_COURTS = ['JANV', 'FÉVR', 'MARS', 'AVR', 'MAI', 'JUIN', 'JUIL', 'AOÛT', 'SEPT', 'OCT', 'NOV', 'DÉC']

// '2026-10-18' + '09:00' → 'DIM. 18 OCT · 9:00'
export function dateCourte(seance) {
  const date = dateSeance(seance)
  const heure = `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
  return `${JOURS_COURTS[date.getDay()]} ${date.getDate()} ${MOIS_COURTS[date.getMonth()]} · ${heure}`
}

// 0.8 → 'à 800 m' ; 2.1 → 'à 2,1 km'
export function distanceTexte(km) {
  if (km < 1) return `à ${Math.round(km * 1000)} m`
  return `à ${String(km).replace('.', ',')} km`
}

// Position de l'utilisatrice pour la démo (Paris 19e, près des Buttes-Chaumont)
export const MA_POSITION = [48.8785, 2.382]
