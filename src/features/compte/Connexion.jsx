import { Link, useLocation, useNavigate } from 'react-router-dom'
import Bouton from '../../components/Bouton'
import Champ from '../../components/Champ'
import Message from '../../components/Message'
import { connecter } from '../../services/compte'
import { sauverUtilisateur } from '../../services/session'
import { estEmailValide, MESSAGES } from '../../utils/validation'
import useFormulaire from './useFormulaire'
import './compte.css'

export default function Connexion() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { valeurs, erreurs, envoi, changer, soumettre } = useFormulaire({ email: '', motDePasse: '' })
  const { email, motDePasse } = valeurs

  function envoyer(e) {
    e.preventDefault()
    const nouvellesErreurs = {}
    if (!estEmailValide(email)) nouvellesErreurs.email = MESSAGES.email
    if (!motDePasse) nouvellesErreurs.motDePasse = 'Saisis ton mot de passe.'

    soumettre(nouvellesErreurs, async () => {
      sauverUtilisateur(await connecter(email, motDePasse))
      navigate(state?.retour || '/accueil')
    })
  }

  return (
    <main id="contenu" className="page">
      <h1>Connexion</h1>
      <p>Connecte-toi pour accéder à ton compte.</p>

      <form onSubmit={envoyer} noValidate>
        <Message type="erreur">{erreurs.serveur}</Message>

        <Champ id="email" label="Email" type="email" value={email} onChange={changer} erreur={erreurs.email} />
        <Champ
          id="motDePasse"
          label="Mot de passe"
          type="password"
          value={motDePasse}
          onChange={changer}
          erreur={erreurs.motDePasse}
        />
        <p className="lien-oubli">
          <Link to="/mot-de-passe-oublie">Mot de passe oublié ?</Link>
        </p>

        <Bouton type="submit" chargement={envoi}>
          Se connecter
        </Bouton>
      </form>

      <p className="pied-formulaire">
        Pas encore de compte ? <Link to="/inscription">Créer un compte</Link>
      </p>
    </main>
  )
}
