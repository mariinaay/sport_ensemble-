// Appels au back pour le compte : connexion, inscription, mot de passe oublié
import { envoyer, erreurSousChamp, requete } from './api'

export async function chercherCompte(email) {
  const comptes = await requete(`/users?email=${encodeURIComponent(email.trim())}`)
  return comptes[0]
}

// Pas de vraie authentification avec json-server : on compare le mot de passe ici
export async function connecter(email, motDePasse) {
  const compte = await chercherCompte(email)
  if (!compte || compte.password !== motDePasse) throw new Error('Email ou mot de passe incorrect.')
  return compte
}

export async function inscrire(prenom, nom, email, motDePasse) {
  if (await chercherCompte(email)) throw erreurSousChamp('Un compte existe déjà avec cet email.', 'email')
  return envoyer('POST', '/users', { firstName: prenom, lastName: nom, email: email.trim(), password: motDePasse })
}

// Simulé : aucun email n'est envoyé
export async function motDePasseOublie(email) {
  await chercherCompte(email)
}
