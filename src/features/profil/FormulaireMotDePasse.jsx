import { useState } from 'react'
import Bouton from '../../components/Bouton'
import Champ from '../../components/Champ'
import Message from '../../components/Message'
import { changerMotDePasse } from '../../services/profil'
import { estMotDePasseValide, MESSAGES } from '../../utils/validation'

// Changer son mot de passe
export default function FormulaireMotDePasse({ profil }) {
  const [actuel, setActuel] = useState('')
  const [nouveau, setNouveau] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [erreurs, setErreurs] = useState({})
  const [envoi, setEnvoi] = useState(false)
  const [succes, setSucces] = useState(false)

  async function envoyer(e) {
    e.preventDefault()
    setSucces(false)

    // 1. Vérifier les champs
    const nouvellesErreurs = {}
    if (!actuel) nouvellesErreurs.motDePasseActuel = 'Saisis ton mot de passe actuel.'
    if (!estMotDePasseValide(nouveau)) nouvellesErreurs.nouveauMotDePasse = MESSAGES.motDePasse
    else if (nouveau === actuel) nouvellesErreurs.nouveauMotDePasse = 'Choisis un mot de passe différent de l’actuel.'
    if (confirmation !== nouveau) nouvellesErreurs.confirmation = 'Les deux mots de passe ne sont pas identiques.'
    setErreurs(nouvellesErreurs)
    if (Object.keys(nouvellesErreurs).length > 0) return

    // 2. Enregistrer dans le back
    setEnvoi(true)
    try {
      await changerMotDePasse(profil.id, actuel, nouveau)
      setActuel('')
      setNouveau('')
      setConfirmation('')
      setSucces(true)
    } catch (erreur) {
      // Erreur sous le champ concerné, sinon en haut
      setErreurs({ [erreur.champ ?? 'serveur']: erreur.message })
    }
    setEnvoi(false)
  }

  return (
    <form onSubmit={envoyer} noValidate className="ligne-menu__panneau panneau--separe">
      <h3>Changer de mot de passe</h3>
      <Message type="succes">{succes && 'Mot de passe modifié.'}</Message>
      <Message type="erreur">{erreurs.serveur}</Message>

      <Champ
        id="motDePasseActuel"
        label="Mot de passe actuel"
        type="password"
        obligatoire
        value={actuel}
        onChange={(e) => setActuel(e.target.value)}
        erreur={erreurs.motDePasseActuel}
      />
      <Champ
        id="nouveauMotDePasse"
        label="Nouveau mot de passe (8 caractères minimum)"
        type="password"
        obligatoire
        value={nouveau}
        onChange={(e) => setNouveau(e.target.value)}
        erreur={erreurs.nouveauMotDePasse}
      />
      <Champ
        id="confirmation"
        label="Confirme le nouveau mot de passe"
        type="password"
        obligatoire
        value={confirmation}
        onChange={(e) => setConfirmation(e.target.value)}
        erreur={erreurs.confirmation}
      />

      <Bouton type="submit" chargement={envoi}>
        Changer de mot de passe
      </Bouton>
    </form>
  )
}
