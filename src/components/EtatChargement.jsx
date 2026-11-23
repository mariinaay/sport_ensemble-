import Bouton from './Bouton'
import Message from './Message'

// Affiche « Chargement… » ou l'erreur avec « Réessayer » (sinon rien)
export default function EtatChargement({ chargement, erreur, onReessayer }) {
  if (chargement) return <p role="status">Chargement…</p>

  if (erreur) {
    return (
      <>
        <Message type="erreur">{erreur}</Message>
        <Bouton onClick={onReessayer}>Réessayer</Bouton>
      </>
    )
  }

  return null
}
