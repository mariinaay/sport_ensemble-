import { useState } from 'react'
import Bouton from '../../components/Bouton'
import LienRetour from '../../components/LienRetour'
import Champ from '../../components/Champ'
import Message from '../../components/Message'
import { envoyerMessage } from '../../services/aide'
import { estEmailValide, MESSAGES } from '../../utils/validation'
import './aide.css'

// Les questions fréquentes (question + réponse)
const QUESTIONS = [
  {
    question: 'Comment rejoindre une séance ?',
    reponse:
      'Choisis une séance dans la liste, puis appuie sur « Rejoindre la séance ». L’organisateur est prévenu et tu reçois un rappel la veille.',
  },
  {
    question: 'Les profils sont-ils vraiment vérifiés ?',
    reponse:
      'Oui. Chaque profil vérifié a confirmé son identité. Tu vois la pastille verte « vérifié » sous sa photo, et tu peux choisir de ne rejoindre que des séances entre profils vérifiés.',
  },
  {
    question: 'C’est quoi la fiabilité ?',
    reponse:
      'C’est le pourcentage de séances où la personne est venue comme prévu. Elle baisse si tu annules au dernier moment ou si tu ne viens pas.',
  },
  {
    question: 'Comment annuler ma place ?',
    reponse:
      'Ouvre la séance depuis « Mes séances » et appuie sur « Annuler ma place ». L’annulation est gratuite jusqu’à 2 heures avant le début.',
  },
  {
    question: 'Comment changer mon email ou mon mot de passe ?',
    reponse: 'Va dans ton Profil, rubrique « Connexion et sécurité ».',
  },
]

export default function Aide() {
  const [email, setEmail] = useState('')
  const [sujet, setSujet] = useState('')
  const [message, setMessage] = useState('')
  const [erreurs, setErreurs] = useState({})
  const [envoi, setEnvoi] = useState(false)
  const [envoye, setEnvoye] = useState(false)

  async function envoyer(e) {
    e.preventDefault()

    // 1. Vérifier les champs
    const nouvellesErreurs = {}
    if (!estEmailValide(email)) nouvellesErreurs.email = MESSAGES.email
    if (!sujet.trim()) nouvellesErreurs.sujet = 'Saisis le sujet de ton message.'
    if (message.trim().length < 10) nouvellesErreurs.message = 'Écris au moins 10 caractères.'
    setErreurs(nouvellesErreurs)
    if (Object.keys(nouvellesErreurs).length > 0) return

    // 2. Envoyer au back
    setEnvoi(true)
    try {
      await envoyerMessage(email, sujet, message)
      setEnvoye(true)
    } catch (erreur) {
      setErreurs({ serveur: erreur.message })
    }
    setEnvoi(false)
  }

  return (
    <main id="contenu" className="page">
      <LienRetour to="/profil">Profil</LienRetour>
      <h1>Aide & contact</h1>

      {/* Questions fréquentes (clic = réponse) */}
      <section aria-labelledby="titre-faq">
        <h2 id="titre-faq">Questions fréquentes</h2>
        <div className="faq">
          {QUESTIONS.map((q) => (
            <details key={q.question} className="faq__item">
              <summary>{q.question}</summary>
              <p>{q.reponse}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Formulaire de contact */}
      <section aria-labelledby="titre-contact" className="contact">
        <h2 id="titre-contact">Nous écrire</h2>

        {envoye ? (
          <Message type="succes">Merci ! Ton message est bien envoyé. On te répond par email sous 48 h.</Message>
        ) : (
          <form onSubmit={envoyer} noValidate>
            <p>Tu n’as pas trouvé ta réponse ? Écris-nous.</p>
            <Message type="erreur">{erreurs.serveur}</Message>

            <Champ
              id="email"
              label="Ton email"
              type="email"
              obligatoire
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              erreur={erreurs.email}
            />
            <Champ
              id="sujet"
              label="Sujet"
              obligatoire
              value={sujet}
              onChange={(e) => setSujet(e.target.value)}
              erreur={erreurs.sujet}
            />
            <Champ
              id="message"
              label="Message"
              multiligne
              rows={5}
              obligatoire
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              erreur={erreurs.message}
            />

            <Bouton type="submit" chargement={envoi}>
              Envoyer
            </Bouton>
          </form>
        )}
      </section>
    </main>
  )
}
