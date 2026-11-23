// Retient qui est connecté (seulement son id) dans le navigateur
const CLE = 'utilisateur'

export function sauverUtilisateur(compte) {
  localStorage.setItem(CLE, JSON.stringify({ id: compte.id }))
}

export function lireUtilisateur() {
  return JSON.parse(localStorage.getItem(CLE))
}

export function oublierUtilisateur() {
  localStorage.removeItem(CLE)
}
