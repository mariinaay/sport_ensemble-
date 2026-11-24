import Bouton from '../../components/Bouton'
import Champ from '../../components/Champ'
import Message from '../../components/Message'
import { changerEmail } from '../../services/profil'
import { estEmailValide, MESSAGES } from '../../utils/validation'
import useFormulaire from '../compte/useFormulaire'

const VIDE = { nouvelEmail: '', motDePasseEmail: '' }

// Changer son email (le mot de passe est demandé)
export default function FormulaireEmail({ profil, onEnregistre }) {
  const { valeurs, setValeurs, erreurs, envoi, succes, changer, soumettre } = useFormulaire(VIDE)
  const { nouvelEmail, motDePasseEmail } = valeurs

  function envoyer(e) {
    e.preventDefault()
    const nouvellesErreurs = {}
    if (!estEmailValide(nouvelEmail)) nouvellesErreurs.nouvelEmail = MESSAGES.email
    else if (nouvelEmail.trim() === profil.email) nouvellesErreurs.nouvelEmail = 'C’est déjà ton adresse actuelle.'
    if (!motDePasseEmail) nouvellesErreurs.motDePasseEmail = 'Saisis ton mot de passe pour confirmer.'

    soumettre(nouvellesErreurs, async () => {
      onEnregistre(await changerEmail(profil.id, nouvelEmail, motDePasseEmail))
      setValeurs(VIDE)
    })
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
        onChange={changer}
        erreur={erreurs.nouvelEmail}
      />
      <Champ
        id="motDePasseEmail"
        label="Mot de passe actuel"
        type="password"
        obligatoire
        value={motDePasseEmail}
        onChange={changer}
        erreur={erreurs.motDePasseEmail}
      />

      <Bouton type="submit" chargement={envoi}>
        Changer d’email
      </Bouton>
    </form>
  )
}
