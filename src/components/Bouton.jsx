import { Link } from 'react-router-dom'

// Bouton de l'appli : variante 'primaire', 'secondaire', 'lien' ou 'lien-gris'. Avec `to`, c'est un lien.
export default function Bouton({ children, variante = 'primaire', to, chargement, ...reste }) {
  const classe = `bouton bouton--${variante}`

  if (to) {
    return (
      <Link to={to} className={classe}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" className={classe} disabled={chargement} {...reste}>
      {chargement ? 'Envoi en cours…' : children}
    </button>
  )
}
