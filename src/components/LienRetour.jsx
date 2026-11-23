import { Link } from 'react-router-dom'

// Lien « ‹ Profil » en haut d'une sous-page
export default function LienRetour({ to, children }) {
  return (
    <Link to={to} className="lien-retour">
      ‹ {children}
    </Link>
  )
}
