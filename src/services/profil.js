// Appels au back pour le profil : lire, modifier, changer d'email ou de mot de passe
import { envoyer, erreurSousChamp, requete } from './api'
import { chercherCompte } from './compte'

export function lireProfil(id) {
  return requete(`/users/${id}`)
}

export function modifierProfil(id, modifications) {
  return envoyer('PATCH', `/users/${id}`, modifications)
}

// Vérifie le mot de passe actuel (comparé ici, comme pour la connexion)
async function verifierMotDePasse(id, motDePasse, champ) {
  const compte = await lireProfil(id)
  if (compte.password !== motDePasse) throw erreurSousChamp('Mot de passe incorrect.', champ)
}

export async function changerEmail(id, nouvelEmail, motDePasse) {
  await verifierMotDePasse(id, motDePasse, 'motDePasseEmail')
  const compte = await chercherCompte(nouvelEmail)
  if (compte && compte.id !== id) throw erreurSousChamp('Un compte existe déjà avec cet email.', 'nouvelEmail')
  return modifierProfil(id, { email: nouvelEmail.trim() })
}

export async function changerMotDePasse(id, ancien, nouveau) {
  await verifierMotDePasse(id, ancien, 'motDePasseActuel')
  return modifierProfil(id, { password: nouveau })
}
