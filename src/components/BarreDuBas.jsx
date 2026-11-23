import { NavLink } from 'react-router-dom'
import Icone from './Icone'

// Barre de navigation en bas (l'onglet de la page affichée passe en bleu)
const ONGLETS = [
  { to: '/accueil', texte: 'Accueil', icone: 'maison' },
  { to: '/seances', texte: 'Séances', icone: 'liste' },
  { to: '/proposer', texte: 'Proposer', icone: 'plus' },
  { to: '/mes-seances', texte: 'Mes séances', icone: 'calendrier' },
  { to: '/profil', texte: 'Profil', icone: 'personne' },
]

export default function BarreDuBas() {
  return (
    <nav className="barre" aria-label="Navigation principale">
      <ul>
        {ONGLETS.map((onglet) => (
          <li key={onglet.to}>
            <NavLink to={onglet.to} end>
              <Icone nom={onglet.icone} />
              <span>{onglet.texte}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
