import { Link } from 'react-router-dom'
import Bouton from '../../components/Bouton'
import Champ from '../../components/Champ'
import Message from '../../components/Message'
import { motDePasseOublie } from '../../services/compte'
import { estEmailValide, MESSAGES } from '../../utils/validation'
import useFormulaire from './useFormulaire'
import './compte.css'

export default function MotDePasseOublie() {
  const { valeurs, erreurs, envoi, succes, changer, soumettre } = useFormulaire({ email: '' })
  const { email } = valeurs

  function envoyer(e) {
    e.preventDefault()
    const nouvellesErreurs = estEmailValide(email) ? {} : { email: MESSAGES.email }
    soumettre(nouvellesErreurs, () => motDePasseOublie(email))
  }

  // Email envoyé : la page de confirmation remplace le formulaire
  if (succes) {
    return (
      <main id="contenu" className="page">
        <h1>Vérifie ta boîte mail</h1>
        <p role="status">
          Un email vient d’être envoyé à <strong>{email}</strong>. Clique sur le lien qu’il contient pour choisir un
          nouveau mot de passe.
        </p>
        <Link to="/connexion">Retour à la connexion</Link>
      </main>
    )
  }

  return (
    <main id="contenu" className="page">
      <h1>Mot de passe oublié</h1>
      <p>Saisis ton email : on t’envoie un lien pour choisir un nouveau mot de passe.</p>

      <form onSubmit={envoyer} noValidate>
        <Message type="erreur">{erreurs.serveur}</Message>

        <Champ id="email" label="Email" type="email" value={email} onChange={changer} erreur={erreurs.email} />

        <Bouton type="submit" chargement={envoi}>
          Recevoir le lien
        </Bouton>
      </form>

      <p className="pied-formulaire">
        <Link to="/connexion">Retour à la connexion</Link>
      </p>
    </main>
  )
}
