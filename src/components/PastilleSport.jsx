import { libelleSport, NOMS_COURTS } from '../utils/constants'
import Icone from './Icone'

// Pastille de couleur avec le nom du sport. `avecIcone` : icône + nom court (« Course »), comme sur les cartes
export default function PastilleSport({ sport, avecIcone }) {
  return (
    <span className={`pastille pastille--${sport}`}>
      {avecIcone && <Icone nom={sport} className="icone icone--petite" />}
      {avecIcone ? NOMS_COURTS[sport] : libelleSport(sport)}
    </span>
  )
}
