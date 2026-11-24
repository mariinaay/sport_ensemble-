import Bouton from '../../components/Bouton'
import Champ from '../../components/Champ'
import Message from '../../components/Message'
import { changerMotDePasse } from '../../services/profil'
import { estMotDePasseValide, MESSAGES } from '../../utils/validation'
import useFormulaire from '../compte/useFormulaire'

const VIDE = { motDePasseActuel: '', nouveauMotDePasse: '', confirmation: '' }

// Changer son mot de passe
export default function FormulaireMotDePasse({ profil }) {
  const { valeurs, setValeurs, erreurs, envoi, succes, changer, soumettre } = useFormulaire(VIDE)
  const { motDePasseActuel, nouveauMotDePasse, confirmation } = valeurs

  function envoyer(e) {
    e.preventDefault()
    const nouvellesErreurs = {}
    if (!motDePasseActuel) nouvellesErreurs.motDePasseActuel = 'Saisis ton mot de passe actuel.'
    if (!estMotDePasseValide(nouveauMotDePasse)) {
      nouvellesErreurs.nouveauMotDePasse = MESSAGES.motDePasse
    } else if (nouveauMotDePasse === motDePasseActuel) {
      nouvellesErreurs.nouveauMotDePasse = 'Choisis un mot de passe différent de l’actuel.'
    }
    if (confirmation !== nouveauMotDePasse) {
      nouvellesErreurs.confirmation = 'Les deux mots de passe ne sont pas identiques.'
    }

    soumettre(nouvellesErreurs, async () => {
      await changerMotDePasse(profil.id, motDePasseActuel, nouveauMotDePasse)
      setValeurs(VIDE)
    })
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
        value={motDePasseActuel}
        onChange={changer}
        erreur={erreurs.motDePasseActuel}
      />
      <Champ
        id="nouveauMotDePasse"
        label="Nouveau mot de passe (8 caractères minimum)"
        type="password"
        obligatoire
        value={nouveauMotDePasse}
        onChange={changer}
        erreur={erreurs.nouveauMotDePasse}
      />
      <Champ
        id="confirmation"
        label="Confirme le nouveau mot de passe"
        type="password"
        obligatoire
        value={confirmation}
        onChange={changer}
        erreur={erreurs.confirmation}
      />

      <Bouton type="submit" chargement={envoi}>
        Changer de mot de passe
      </Bouton>
    </form>
  )
}
