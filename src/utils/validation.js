// Vérifications des formulaires (true = c'est bon) et leurs messages d'erreur

export function estEmailValide(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export function estMotDePasseValide(motDePasse) {
  return motDePasse.length >= 8
}

export const MESSAGES = {
  email: 'Saisis une adresse email valide.',
  motDePasse: 'Il faut au moins 8 caractères.',
  prenom: 'Saisis ton prénom.',
  nom: 'Saisis ton nom.',
}
