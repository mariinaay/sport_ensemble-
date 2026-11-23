import { Link } from 'react-router-dom'
import Icone from '../../components/Icone'

// Une rubrique du profil : un lien (`to`) ou un bouton qui se déplie (`onClick`)
export default function LigneMenu({ icone, titre, sousTitre, to, onClick, ouvert }) {
  const contenu = (
    <>
      <span className="ligne-menu__icone">
        <Icone nom={icone} />
      </span>
      <span className="ligne-menu__textes">
        <span className="ligne-menu__titre">{titre}</span>
        <span className="ligne-menu__sous-titre">{sousTitre}</span>
      </span>
      <Icone nom="chevron" className={ouvert ? 'icone ligne-menu__fleche--ouverte' : 'icone'} />
    </>
  )

  if (to) {
    return (
      <Link to={to} className="ligne-menu">
        {contenu}
      </Link>
    )
  }

  return (
    <button type="button" className="ligne-menu" onClick={onClick} aria-expanded={ouvert}>
      {contenu}
    </button>
  )
}
