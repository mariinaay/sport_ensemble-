import { NavLink } from 'react-router-dom'
import Icone from './Icone'

// Barre de navigation en bas (l'onglet de la page affichée a une pastille orange ; « Proposer » est mis en avant)
const ONGLETS = [
  { to: '/accueil', texte: 'Accueil', icone: 'maison' },
  { to: '/seances', texte: 'Séances', icone: 'liste' },
  { to: '/proposer', texte: 'Proposer', icone: 'plus', accent: true },
  { to: '/mes-seances', texte: 'Mes séances', icone: 'calendrier' },
  { to: '/profil', texte: 'Profil', icone: 'personne' },
]

export default function BarreDuBas() {
  return (
    <nav className="barre" aria-label="Navigation principale">
      <ul>
        {ONGLETS.map((onglet) => (
          <li key={onglet.to}>
            <NavLink to={onglet.to} end className={onglet.accent ? 'barre__onglet--accent' : undefined}>
              <span className="barre__indicateur">
                <Icone nom={onglet.icone} />
              </span>
              <span>{onglet.texte}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
