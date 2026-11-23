import { useState } from 'react'
import { Link } from 'react-router-dom'
import Bouton from '../../components/Bouton'
import Champ from '../../components/Champ'
import Message from '../../components/Message'
import { motDePasseOublie } from '../../services/compte'
import { estEmailValide, MESSAGES } from '../../utils/validation'
import './compte.css'

export default function MotDePasseOublie() {
  const [email, setEmail] = useState('')
  const [erreurs, setErreurs] = useState({})
  const [envoi, setEnvoi] = useState(false)
  const [envoye, setEnvoye] = useState(false)

  async function envoyer(e) {
    e.preventDefault()

    // 1. Vérifier le champ
    if (!estEmailValide(email)) {
      setErreurs({ email: MESSAGES.email })
      return
    }
    setErreurs({})

    // 2. Demander au back
    setEnvoi(true)
    try {
      await motDePasseOublie(email)
      setEnvoye(true)
    } catch (erreur) {
      setErreurs({ serveur: erreur.message })
    }
    setEnvoi(false)
  }

  // Demande envoyée
  if (envoye) {
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

        <Champ
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          erreur={erreurs.email}
        />

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
