import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Bouton from '../../components/Bouton'
import Champ from '../../components/Champ'
import Message from '../../components/Message'
import { connecter } from '../../services/compte'
import { estEmailValide, MESSAGES } from '../../utils/validation'
import { sauverUtilisateur } from '../../services/session'
import './compte.css'

export default function Connexion() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreurs, setErreurs] = useState({})
  const [envoi, setEnvoi] = useState(false)

  async function envoyer(e) {
    e.preventDefault()

    // 1. Vérifier les champs
    const nouvellesErreurs = {}
    if (!estEmailValide(email)) nouvellesErreurs.email = MESSAGES.email
    if (!motDePasse) nouvellesErreurs.motDePasse = 'Saisis ton mot de passe.'
    setErreurs(nouvellesErreurs)
    if (Object.keys(nouvellesErreurs).length > 0) return

    // 2. Demander au back
    setEnvoi(true)
    try {
      sauverUtilisateur(await connecter(email, motDePasse))
      navigate('/accueil')
    } catch (erreur) {
      setErreurs({ serveur: erreur.message })
      setEnvoi(false)
    }
  }

  return (
    <main id="contenu" className="page">
      <h1>Connexion</h1>
      <p>Connecte-toi pour accéder à ton compte.</p>

      <form onSubmit={envoyer} noValidate>
        <Message type="erreur">{erreurs.serveur}</Message>

        <Champ
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          erreur={erreurs.email}
        />
        <Champ
          id="motDePasse"
          label="Mot de passe"
          type="password"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
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
