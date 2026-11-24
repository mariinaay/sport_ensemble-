import { Link, useNavigate } from 'react-router-dom'
import Bouton from '../../components/Bouton'
import Champ from '../../components/Champ'
import Message from '../../components/Message'
import { inscrire } from '../../services/compte'
import { sauverUtilisateur } from '../../services/session'
import { estEmailValide, estMotDePasseValide, MESSAGES } from '../../utils/validation'
import useFormulaire from './useFormulaire'
import './compte.css'

export default function Inscription() {
  const navigate = useNavigate()
  const { valeurs, erreurs, envoi, changer, soumettre } = useFormulaire({ prenom: '', nom: '', email: '', motDePasse: '' })
  const { prenom, nom, email, motDePasse } = valeurs

  function envoyer(e) {
    e.preventDefault()
    const nouvellesErreurs = {}
    if (!prenom.trim()) nouvellesErreurs.prenom = MESSAGES.prenom
    if (!nom.trim()) nouvellesErreurs.nom = MESSAGES.nom
    if (!estEmailValide(email)) nouvellesErreurs.email = MESSAGES.email
    if (!estMotDePasseValide(motDePasse)) nouvellesErreurs.motDePasse = MESSAGES.motDePasse

    soumettre(nouvellesErreurs, async () => {
      sauverUtilisateur(await inscrire(prenom, nom, email, motDePasse))
      navigate('/accueil')
    })
  }

  return (
    <main id="contenu" className="page">
      <h1>Créer un compte</h1>
      <p>
        <span className="champ__etoile" aria-hidden="true">* </span>
        Champs obligatoires
      </p>

      <form onSubmit={envoyer} noValidate>
        <Message type="erreur">{erreurs.serveur}</Message>

        <Champ id="prenom" label="Prénom" obligatoire value={prenom} onChange={changer} erreur={erreurs.prenom} />
        <Champ id="nom" label="Nom" obligatoire value={nom} onChange={changer} erreur={erreurs.nom} />
        <Champ
          id="email"
          label="Email"
          type="email"
          obligatoire
          value={email}
          onChange={changer}
          erreur={erreurs.email}
        />
        <Champ
          id="motDePasse"
          label="Mot de passe (8 caractères minimum)"
          type="password"
          obligatoire
          value={motDePasse}
          onChange={changer}
          erreur={erreurs.motDePasse}
        />

        <Bouton type="submit" chargement={envoi}>
          Créer mon compte
        </Bouton>
      </form>

      <p className="pied-formulaire">
        Tu as déjà un compte ? <Link to="/connexion">Se connecter</Link>
      </p>
    </main>
  )
}
