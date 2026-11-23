// Textes communs à toute l'appli (value = dans db.json, label = affiché)

export const SPORTS = [
  { value: 'course', label: 'Course à pied' },
  { value: 'velo', label: 'Vélo' },
  { value: 'padel', label: 'Padel' },
  { value: 'foot', label: 'Foot à 5' },
  { value: 'rando', label: 'Rando' },
]

// 'foot' → 'Foot à 5'
export const libelleSport = (valeur) => SPORTS.find((s) => s.value === valeur)?.label ?? valeur

// Page Notifications (parDefaut = cochée au départ)
export const NOTIFICATIONS = [
  { value: 'rappelSeance', label: 'Rappel avant une séance', aide: 'La veille et 1 h avant.', parDefaut: true },
  { value: 'nouveauParticipant', label: 'Nouveau participant à mes séances', parDefaut: true },
  { value: 'seanceAnnulee', label: 'Séance annulée ou modifiée', parDefaut: true },
  { value: 'messages', label: 'Nouveaux messages', parDefaut: true },
  { value: 'recapEmail', label: 'Récapitulatif par email', aide: 'Les séances près de chez toi, une fois par semaine.', parDefaut: false },
]
