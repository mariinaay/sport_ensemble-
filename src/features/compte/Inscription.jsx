import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Bouton from '../../components/Bouton'
import Champ from '../../components/Champ'
import Message from '../../components/Message'
import { inscrire } from '../../services/compte'
import { estEmailValide, estMotDePasseValide, MESSAGES } from '../../utils/validation'
import { sauverUtilisateur } from '../../services/session'
import './compte.css'

export default function Inscription() {
  const navigate = useNavigate()
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreurs, setErreurs] = useState({})
  const [envoi, setEnvoi] = useState(false)

  async function envoyer(e) {
    e.preventDefault()

    // 1. Vérifier les champs
    const nouvellesErreurs = {}
    if (!prenom.trim()) nouvellesErreurs.prenom = MESSAGES.prenom
    if (!nom.trim()) nouvellesErreurs.nom = MESSAGES.nom
    if (!estEmailValide(email)) nouvellesErreurs.email = MESSAGES.email
    if (!estMotDePasseValide(motDePasse)) nouvellesErreurs.motDePasse = MESSAGES.motDePasse
    setErreurs(nouvellesErreurs)
    if (Object.keys(nouvellesErreurs).length > 0) return

    // 2. Demander au back
    setEnvoi(true)
    try {
      sauverUtilisateur(await inscrire(prenom, nom, email, motDePasse))
      navigate('/accueil')
    } catch (erreur) {
      // Erreur sous le champ concerné, sinon en haut
      setErreurs({ [erreur.champ ?? 'serveur']: erreur.message })
      setEnvoi(false)
    }
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

        <Champ
          id="prenom"
          label="Prénom"
          obligatoire
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          erreur={erreurs.prenom}
        />
        <Champ
          id="nom"
          label="Nom"
          obligatoire
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          erreur={erreurs.nom}
        />
        <Champ
          id="email"
          label="Email"
          type="email"
          obligatoire
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          erreur={erreurs.email}
        />
        <Champ
          id="motDePasse"
          label="Mot de passe (8 caractères minimum)"
          type="password"
          obligatoire
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
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
