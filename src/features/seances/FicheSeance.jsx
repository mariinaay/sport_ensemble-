import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Bouton from '../../components/Bouton'
import EtatChargement from '../../components/EtatChargement'
import Icone from '../../components/Icone'
import PastilleSport from '../../components/PastilleSport'
import { lireUtilisateur } from '../../services/session'
import { chargerSeance, dateSeance, heureSeance, rejoindreSeance } from '../../services/mes-seances'
import '../../styles/theme-v2.css'
import './mes-pages.css'

export default function FicheSeance() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [donnees, setDonnees] = useState(null)
  const [erreur, setErreur] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const charger = useCallback(() => {
    setErreur('')
    chargerSeance(id).then(setDonnees).catch((e) => setErreur(e.message))
  }, [id])
  useEffect(() => { charger() }, [charger])

  async function rejoindre() {
    const utilisateur = lireUtilisateur()
    if (!utilisateur) { navigate('/connexion', { state: { retour: `/seances/${id}` } }); return }
    setEnvoi(true)
    try {
      await rejoindreSeance(id, utilisateur, donnees.inscriptions)
      navigate(`/seances/${id}/confirmation`)
    } catch (e) { setErreur(e.message); setEnvoi(false) }
  }
  if (!donnees) return <main id="contenu" className="page"><EtatChargement chargement={!erreur} erreur={erreur} onReessayer={charger} /></main>
  const { seance, inscriptions, organisateur, participants } = donnees
  const places = Math.max(0, seance.capacity - inscriptions.length)
  const dejaInscrit = inscriptions.some((i) => i.userId === lireUtilisateur()?.id)
  return (
    <main id="contenu" className="fiche-seance theme-v2">
      <div className="fiche-seance__contenu">
        <div className="fiche-seance__haut"><Link className="retour-rond" to="/seances" aria-label="Retour aux séances">←</Link><PastilleSport sport={seance.sport} /></div>
        <div><p className="fiche-seance__date">{dateSeance(seance)} · {heureSeance(seance)}</p><h1>{seance.title}</h1><p className="texte-secondaire">{seance.sport === 'padel' ? 'Match en double' : 'Séance'} · niveau {seance.level === 'intermediaire' ? 'intermédiaire' : 'débutant'}</p></div>
        <div className="metriques">
          {seance.pace && <div><small>Allure</small><strong>{seance.pace} <span>min / km</span></strong></div>}
          {seance.distanceKm && <div><small>Distance</small><strong>{seance.distanceKm} <span>km</span></strong></div>}
          <div><small>Participants</small><strong>{inscriptions.length} <span>/ {seance.capacity} places</span></strong></div>
          {seance.pricePerPerson > 0 && <div><small>Prix par personne</small><strong>{seance.pricePerPerson} <span>€</span></strong></div>}
        </div>
        <div className="carte rendez-vous"><Icone nom="repere" /><div><strong>Lieu de rendez-vous</strong><p>{seance.place}</p></div></div>
        <div className="carte organisation"><span className="fiche-avatar">{organisateur?.firstName?.slice(0, 2).toUpperCase()}</span><div><strong>Organisé par {organisateur?.firstName}</strong><small>{organisateur?.verified ? 'Profil vérifié' : 'Organisateur'}</small></div>{organisateur?.reliability != null && <span className="fiabilite">{organisateur.reliability} %<small>Fiable</small></span>}</div>
        <div className="carte places"><strong>{places} {places === 1 ? 'place restante' : 'places restantes'}</strong><div className="jauge" role="progressbar" aria-label="Places occupées" aria-valuemin="0" aria-valuemax={seance.capacity} aria-valuenow={inscriptions.length}><span style={{ width: `${Math.min(100, inscriptions.length / seance.capacity * 100)}%` }} /></div><small>{seance.verifiedOnly ? 'Profils vérifiés uniquement.' : 'Séance ouverte à tous.'}</small></div>
        <div className="carte participants">
          <strong>Participants</strong>
          {participants.length > 0 ? <ul>{participants.map((participant) => <li key={participant.id}><span className="participant-avatar">{participant.firstName.slice(0, 1).toUpperCase()}</span>{participant.firstName}{participant.id === lireUtilisateur()?.id ? ' (toi)' : ''}</li>)}</ul> : <p>Personne n’a encore rejoint cette séance.</p>}
        </div>
        <EtatChargement erreur={erreur} onReessayer={charger} />
      </div>
      <div className="actions-seance"><Bouton onClick={rejoindre} chargement={envoi} disabled={!places && !dejaInscrit}>{dejaInscrit ? 'Voir ma réservation' : seance.sport === 'padel' ? 'Rejoindre le match' : 'Rejoindre la séance'}</Bouton></div>
    </main>
  )
}
