import { libelleSport } from '../utils/constants'

// Pastille de couleur avec le nom du sport
export default function PastilleSport({ sport }) {
  return <span className={`pastille pastille--${sport}`}>{libelleSport(sport)}</span>
}
