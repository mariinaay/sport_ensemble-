import { useState } from 'react'
import Bouton from '../../components/Bouton'
import Champ from '../../components/Champ'
import Message from '../../components/Message'
import { changerEmail } from '../../services/profil'
import { estEmailValide, MESSAGES } from '../../utils/validation'

// Changer son email (le mot de passe est demandé)
export default function FormulaireEmail({ profil, onEnregistre }) {
  const [nouvelEmail, setNouvelEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreurs, setErreurs] = useState({})
  const [envoi, setEnvoi] = useState(false)
  const [succes, setSucces] = useState(false)

  async function envoyer(e) {
    e.preventDefault()
    setSucces(false)

    // 1. Vérifier les champs
    const nouvellesErreurs = {}
    if (!estEmailValide(nouvelEmail)) nouvellesErreurs.nouvelEmail = MESSAGES.email
    else if (nouvelEmail.trim() === profil.email) nouvellesErreurs.nouvelEmail = 'C’est déjà ton adresse actuelle.'
    if (!motDePasse) nouvellesErreurs.motDePasseEmail = 'Saisis ton mot de passe pour confirmer.'
    setErreurs(nouvellesErreurs)
    if (Object.keys(nouvellesErreurs).length > 0) return

    // 2. Enregistrer dans le back
    setEnvoi(true)
    try {
      onEnregistre(await changerEmail(profil.id, nouvelEmail, motDePasse))
      setNouvelEmail('')
      setMotDePasse('')
      setSucces(true)
    } catch (erreur) {
      // Erreur sous le champ concerné, sinon en haut
      setErreurs({ [erreur.champ ?? 'serveur']: erreur.message })
    }
    setEnvoi(false)
  }

  return (
    <form onSubmit={envoyer} noValidate className="ligne-menu__panneau">
      <h3>Changer d’email</h3>
      <p className="panneau__actuel">Actuel : {profil.email}</p>
      <Message type="succes">{succes && 'Adresse email modifiée.'}</Message>
      <Message type="erreur">{erreurs.serveur}</Message>

      <Champ
        id="nouvelEmail"
        label="Nouvelle adresse email"
        type="email"
        obligatoire
        value={nouvelEmail}
        onChange={(e) => setNouvelEmail(e.target.value)}
        erreur={erreurs.nouvelEmail}
      />
      <Champ
        id="motDePasseEmail"
        label="Mot de passe actuel"
        type="password"
        obligatoire
        value={motDePasse}
        onChange={(e) => setMotDePasse(e.target.value)}
        erreur={erreurs.motDePasseEmail}
      />

      <Bouton type="submit" chargement={envoi}>
        Changer d’email
      </Bouton>
    </form>
  )
}
