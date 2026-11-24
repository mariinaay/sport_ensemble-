// Les filtres de la page Séances : leurs choix, et le test d'une séance
import { dateSeance } from '../../utils/constants'

// Rien de coché
export const FILTRES_VIDES = { sports: [], jours: [], creneaux: [], niveaux: [], distances: [] }

// Les groupes de la feuille « Filtres » (dans un groupe, on peut cocher plusieurs choix)
export const GROUPES = [
  {
    cle: 'jours',
    titre: 'Jour',
    choix: [
      { value: 'dimanche', label: 'Dimanche' },
      { value: 'samedi', label: 'Samedi' },
    ],
  },
  {
    cle: 'creneaux',
    titre: 'Créneau',
    choix: [
      { value: 'matin', label: 'Matin' },
      { value: 'midi', label: 'Midi' },
      { value: 'soir', label: 'Soir' },
    ],
  },
  {
    cle: 'niveaux',
    titre: 'Niveau',
    choix: [
      { value: 'debutant', label: 'Débutant' },
      { value: 'intermediaire', label: 'Intermédiaire' },
      { value: 'confirme', label: 'Confirmé' },
    ],
  },
  {
    cle: 'distances',
    titre: 'Distance & allure',
    choix: [
      { value: 'moins5', label: '≤ 5 km' },
      { value: '5a10', label: '5–10 km' },
      { value: 'allure6a7', label: '6:00–7:00 /km' },
    ],
  },
]

// Libellé d'un choix : ('creneaux', 'matin') → 'Matin'
export const libelleChoix = (cle, valeur) =>
  GROUPES.find((g) => g.cle === cle).choix.find((c) => c.value === valeur).label

// '6:30' → 390 (secondes par km)
function secondes(allure) {
  const [min, sec] = allure.split(':').map(Number)
  return min * 60 + sec
}

// Une séance passe-t-elle les filtres ? (pour chaque groupe : un des choix cochés)
export function passeLesFiltres(seance, filtres) {
  const date = dateSeance(seance)
  const jour = date.getDay() === 0 ? 'dimanche' : date.getDay() === 6 ? 'samedi' : ''
  const heure = date.getHours()
  let creneau = ''
  if (heure < 12) creneau = 'matin'
  else if (heure < 15) creneau = 'midi'
  else if (heure >= 17) creneau = 'soir'

  if (filtres.sports.length > 0 && !filtres.sports.includes(seance.sport)) return false
  if (filtres.jours.length > 0 && !filtres.jours.includes(jour)) return false
  if (filtres.creneaux.length > 0 && !filtres.creneaux.includes(creneau)) return false
  if (filtres.niveaux.length > 0 && !filtres.niveaux.includes(seance.level)) return false

  // Distance du parcours : ≤ 5 km ou 5–10 km
  const km = seance.distanceKm
  const moins5 = filtres.distances.includes('moins5')
  const de5a10 = filtres.distances.includes('5a10')
  if (moins5 || de5a10) {
    const bonne = (moins5 && km <= 5) || (de5a10 && km > 5 && km <= 10)
    if (!km || !bonne) return false
  }

  // Allure entre 6:00 et 7:00 /km
  if (filtres.distances.includes('allure6a7')) {
    if (!seance.pace || secondes(seance.pace) < 360 || secondes(seance.pace) > 420) return false
  }
  return true
}
