// Base de tous les appels au back (json-server : npm run api)
const ADRESSE_API = 'http://localhost:3001'

// Envoie une requête au back et renvoie la réponse
export async function requete(chemin, options) {
  const reponse = await fetch(ADRESSE_API + chemin, options).catch(() => {
    throw new Error('Impossible de joindre le serveur.')
  })
  if (!reponse.ok) throw new Error('Erreur du serveur.')
  return reponse.json()
}

// Envoie des données (POST = créer, PATCH = modifier)
export function envoyer(methode, chemin, donnees) {
  return requete(chemin, {
    method: methode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(donnees),
  })
}

// Erreur à afficher sous un champ du formulaire
export function erreurSousChamp(message, champ) {
  const erreur = new Error(message)
  erreur.champ = champ
  return erreur
}
