import { Link } from 'react-router-dom'
import { dateCourte, distanceTexte, libelleSport, NIVEAUX, NOMS_COURTS } from '../utils/constants'
import Icone from './Icone'
import '../styles/theme-v2.css'
import './carte-seance.css'

// Les infos de la séance, selon le sport
function details(seance) {
  const liste = []
  if (seance.pace) liste.push({ icone: 'allure', texte: `${seance.pace} /km` })
  if (seance.distanceKm) liste.push({ icone: 'distance', texte: `${seance.distanceKm} km` })
  if (seance.sport === 'padel') {
    liste.push({ icone: 'trophee', texte: NIVEAUX[seance.level] })
    liste.push({ icone: 'joueurs', texte: `${seance.inscrits.length} / ${seance.capacity} joueurs` })
  } else {
    liste.push({ icone: 'niveau', texte: NIVEAUX[seance.level] })
  }
  if (seance.pricePerPerson) liste.push({ icone: 'prix', texte: `${seance.pricePerPerson} € / pers.` })
  return liste
}

// Carte d'une séance (liste des séances, accueil) — design V2. Toute la carte est un lien.
export default function CarteSeance({ seance, idUtilisateur }) {
  const inscrit = seance.inscrits.some((u) => u.id === idUtilisateur)
  const placesRestantes = seance.capacity - seance.inscrits.length
  const complet = placesRestantes <= 0

  let bas = `${placesRestantes} places restantes`
  if (placesRestantes === 1) bas = '1 place restante'
  if (complet) bas = `${seance.inscrits.length} / ${seance.capacity} inscrits`
  if (inscrit) bas = 'Tu es inscrit·e'

  return (
    <Link
      to={`/seances/${seance.id}`}
      className="carte-seance"
      aria-label={`${libelleSport(seance.sport)}, ${seance.title}, ${dateCourte(seance)}, ${distanceTexte(seance.distanceFromUserKm)}. ${complet ? 'Complet' : bas}.`}
    >
      <div className="carte-seance__haut">
        <span className="carte-seance__date">{dateCourte(seance)}</span>
        <span className="carte-seance__distance">
          <Icone nom="repere" className="icone icone--petite" />
          {distanceTexte(seance.distanceFromUserKm)}
        </span>
      </div>

      <h3 className="carte-seance__titre">{seance.title}</h3>

      <ul className="carte-seance__details">
        {/* Le sport, dans sa couleur */}
        <li>
          <span className={`etiquette-sport sport--${seance.sport}`}>
            <Icone nom={seance.sport} className="icone icone--petite" />
            {NOMS_COURTS[seance.sport] ?? libelleSport(seance.sport)}
          </span>
        </li>
        {details(seance).map((d) => (
          <li key={d.texte}>
            <Icone nom={d.icone} className="icone icone--petite" />
            {d.texte}
          </li>
        ))}
      </ul>

      <div className="carte-seance__bas">
        {seance.inscrits.length > 0 && (
          <span className="carte-seance__avatars" aria-hidden="true">
            {seance.inscrits.slice(0, 3).map((u) => (
              <span key={u.id} className="avatar">
                {u.firstName.slice(0, 2).toUpperCase()}
              </span>
            ))}
          </span>
        )}
        <span className={inscrit ? 'carte-seance__places carte-seance__places--inscrit' : 'carte-seance__places'}>
          {inscrit && <Icone nom="verifie" className="icone icone--petite" />}
          {bas}
        </span>
        {complet ? (
          <span className="carte-seance__complet">Complet</span>
        ) : (
          <span className="carte-seance__fleche" aria-hidden="true">
            <Icone nom="fleche" className="icone icone--petite" />
          </span>
        )}
      </div>
    </Link>
  )
}
