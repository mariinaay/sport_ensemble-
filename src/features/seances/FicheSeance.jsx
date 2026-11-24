import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Bouton from '../../components/Bouton'
import EtatChargement from '../../components/EtatChargement'
import Icone from '../../components/Icone'
import PastilleSport from '../../components/PastilleSport'
import { lireUtilisateur } from '../../services/session'
import { dateTexte, heureSeance, niveauTexte, rejoindreSeance, useSeance } from '../../services/mes-seances'
import '../../styles/theme.css'
import './mes-pages.css'

// Une case de la grille « métriques » : titre, valeur et unité
function Metrique({ titre, valeur, unite }) {
  return <div><small>{titre}</small><strong>{valeur} <span>{unite}</span></strong></div>
}

export default function FicheSeance() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { donnees, erreur, setErreur, charger } = useSeance(id)
  const [envoi, setEnvoi] = useState(false)
  const utilisateur = lireUtilisateur()

  async function rejoindre() {
    // Pas connecté : on passe par la connexion, qui ramène ensuite sur cette fiche
    if (!utilisateur) {
      navigate('/connexion', { state: { retour: `/seances/${id}` } })
      return
    }
    setEnvoi(true)
    try {
      await rejoindreSeance(id, utilisateur, donnees.inscriptions)
      navigate(`/seances/${id}/confirmation`)
    } catch (e) {
      setErreur(e.message)
      setEnvoi(false)
    }
  }

  if (!donnees) {
    return (
      <main id="contenu" className="page">
        <EtatChargement chargement={!erreur} erreur={erreur} onReessayer={charger} />
      </main>
    )
  }

  const { seance, inscriptions, organisateur, participants } = donnees
  const places = Math.max(0, seance.capacity - inscriptions.length)
  const dejaInscrit = inscriptions.some((i) => i.userId === utilisateur?.id)
  const estPadel = seance.sport === 'padel'

  return (
    <main id="contenu" className="fiche-seance theme">
      <div className="fiche-seance__contenu">
        <div className="fiche-seance__haut">
          <Link className="retour-rond" to="/seances" aria-label="Retour aux séances">←</Link>
          <PastilleSport sport={seance.sport} />
        </div>

        <div>
          <p className="fiche-seance__date">{dateTexte(seance)} · {heureSeance(seance)}</p>
          <h1>{seance.title}</h1>
          <p className="texte-secondaire">{estPadel ? 'Match en double' : 'Séance'} · niveau {niveauTexte(seance)}</p>
        </div>

        <div className="metriques">
          {seance.pace && <Metrique titre="Allure" valeur={seance.pace} unite="min / km" />}
          {seance.distanceKm && <Metrique titre="Distance" valeur={seance.distanceKm} unite="km" />}
          <Metrique titre="Participants" valeur={inscriptions.length} unite={<>/ {seance.capacity} places</>} />
          {seance.pricePerPerson > 0 && <Metrique titre="Prix par personne" valeur={seance.pricePerPerson} unite="€" />}
        </div>

        <div className="carte rendez-vous">
          <Icone nom="repere" />
          <div>
            <strong>Lieu de rendez-vous</strong>
            <p>{seance.place}</p>
          </div>
        </div>

        <div className="carte organisation">
          <span className="fiche-avatar">{organisateur?.firstName?.slice(0, 2).toUpperCase()}</span>
          <div>
            <strong>Organisé par {organisateur?.firstName}</strong>
            <small>{organisateur?.verified ? 'Profil vérifié' : 'Organisateur'}</small>
          </div>
          {organisateur?.reliability != null && (
            <span className="fiabilite">{organisateur.reliability} %<small>Fiable</small></span>
          )}
        </div>

        <div className="carte places">
          <strong>{places} {places === 1 ? 'place restante' : 'places restantes'}</strong>
          <div
            className="jauge"
            role="progressbar"
            aria-label="Places occupées"
            aria-valuemin="0"
            aria-valuemax={seance.capacity}
            aria-valuenow={inscriptions.length}
          >
            <span style={{ width: `${Math.min(100, inscriptions.length / seance.capacity * 100)}%` }} />
          </div>
          <small>{seance.verifiedOnly ? 'Profils vérifiés uniquement.' : 'Séance ouverte à tous.'}</small>
        </div>

        <div className="carte participants">
          <strong>Participants</strong>
          {participants.length > 0 ? (
            <ul>
              {participants.map((participant) => (
                <li key={participant.id}>
                  <span className="participant-avatar">{participant.firstName.slice(0, 1).toUpperCase()}</span>
                  {participant.firstName}
                  {participant.id === utilisateur?.id && ' (toi)'}
                </li>
              ))}
            </ul>
          ) : (
            <p>Personne n’a encore rejoint cette séance.</p>
          )}
        </div>

        <EtatChargement erreur={erreur} onReessayer={charger} />
      </div>

      <div className="actions-seance">
        {/* Déjà inscrit : le bouton reste actif même si c'est complet, pour revoir sa réservation */}
        <Bouton onClick={rejoindre} chargement={envoi} disabled={!places && !dejaInscrit}>
          {dejaInscrit ? 'Voir ma réservation' : estPadel ? 'Rejoindre le match' : 'Rejoindre la séance'}
        </Bouton>
      </div>
    </main>
  )
}
