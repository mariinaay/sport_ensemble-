// Recherche et filtres de la page Séances : les choix, le test d'une séance, la phrase « Rien de… »
import { dateSeance, libelleSport, NOMS_COURTS } from '../../utils/constants'

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

// ('creneaux', 'matin') → 'Matin'
export const libelleChoix = (cle, valeur) =>
  GROUPES.find((g) => g.cle === cle).choix.find((c) => c.value === valeur).label

// 'Vélo' → 'velo' (pour chercher sans se soucier des accents ni des majuscules)
const simplifier = (texte) =>
  texte
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // retire les accents (é → e)
    .toLowerCase()

// Le texte tapé est-il dans un de ces textes ? (rien de tapé : tout passe)
const contient = (textes, cherche) =>
  !cherche || textes.some((texte) => texte && simplifier(texte).includes(simplifier(cherche)))

// « Quel sport ? » cherche seulement dans le nom du sport, « Où ? » seulement dans le lieu
export const bonSport = (seance, cherche) => contient([libelleSport(seance.sport), NOMS_COURTS[seance.sport]], cherche)
export const bonEndroit = (seance, cherche) => contient([seance.title, seance.place, seance.city], cherche)

// '6:30' → 390 (secondes par km)
function secondes(allure) {
  const [min, sec] = allure.split(':').map(Number)
  return min * 60 + sec
}

// Dans un groupe sans rien de coché, tout passe ; sinon il faut un des choix cochés
const passe = (coches, valeur) => coches.length === 0 || coches.includes(valeur)

const JOURS = { 0: 'dimanche', 6: 'samedi' } // getDay() : 0 = dimanche, 6 = samedi

// 9 → 'matin', 13 → 'midi', 18 → 'soir' (entre 15 h et 17 h : aucun créneau)
function creneau(heure) {
  if (heure < 12) return 'matin'
  if (heure < 15) return 'midi'
  if (heure >= 17) return 'soir'
  return ''
}

// Une séance passe-t-elle les filtres ?
export function passeLesFiltres(seance, filtres) {
  const date = dateSeance(seance)
  if (!passe(filtres.sports, seance.sport)) return false
  if (!passe(filtres.jours, JOURS[date.getDay()])) return false
  if (!passe(filtres.creneaux, creneau(date.getHours()))) return false
  if (!passe(filtres.niveaux, seance.level)) return false

  // Distance du parcours : ≤ 5 km ou 5–10 km (une séance sans distance ne passe pas)
  const km = seance.distanceKm
  const moins5 = filtres.distances.includes('moins5')
  const de5a10 = filtres.distances.includes('5a10')
  if (moins5 || de5a10) {
    const bonne = (moins5 && km <= 5) || (de5a10 && km > 5 && km <= 10)
    if (!km || !bonne) return false
  }

  // Allure entre 6:00 et 7:00 /km (une séance sans allure ne passe pas)
  if (filtres.distances.includes('allure6a7')) {
    const allure = seance.pace ? secondes(seance.pace) : 0
    if (allure < 360 || allure > 420) return false
  }
  return true
}

// « de padel », mais « d'escalade »
const de = (mot) => (/^[aeiouyéèêh]/i.test(mot) ? `d'${mot}` : `de ${mot}`)

// Phrase de l'état vide : « Rien de padel dimanche matin à Belleville avec ces critères. Élargis… »
// (recherche et endroit déjà sans espaces autour)
export function phraseRien(filtres, recherche, endroit) {
  let phrase = 'Rien'
  if (filtres.sports.length > 0) phrase += ` ${de(filtres.sports.map((s) => libelleSport(s).toLowerCase()).join(' ou '))}`
  if (recherche) phrase += ` ${de(recherche)}`
  if (filtres.jours.length === 1) phrase += ` ${filtres.jours[0]}`
  if (filtres.jours.length === 2) phrase += ' ce week-end'
  if (filtres.creneaux.length > 0) phrase += ` ${filtres.creneaux.join(' ou ')}`
  if (endroit) phrase += ` à ${endroit}`
  return `${phrase} avec ces critères. Élargis ta recherche ou lance ta propre sortie`
}
