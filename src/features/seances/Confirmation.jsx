import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Bouton from '../../components/Bouton'
import Icone from '../../components/Icone'
import EtatChargement from '../../components/EtatChargement'
import { lireUtilisateur } from '../../services/session'
import { annulerInscription, dateTexte, heureSeance, useSeance } from '../../services/mes-seances'
import { dateSeance, libelleSport } from '../../utils/constants'
import '../../styles/theme.css'
import './mes-pages.css'

// Met la date au format du fichier calendrier
const formatIcs = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

// Enlève les caractères qui posent problème dans le fichier calendrier
const echapper = (texte) => texte.replace(/\\/g, '\\\\').replace(/[,;]/g, '\\$&').replace(/\n/g, '\\n')

// Télécharge la séance pour l'ajouter à son agenda
function telechargerCalendrier(seance) {
  const debut = dateSeance(seance)
  const fin = new Date(debut.getTime() + (seance.durationMin || 60) * 60000)
  // Contenu du fichier calendrier
  const contenu = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sport Ensemble//FR',
    'BEGIN:VEVENT',
    `UID:seance-${seance.id}@sport-ensemble`,
    `DTSTAMP:${formatIcs(new Date())}`,
    `DTSTART:${formatIcs(debut)}`,
    `DTEND:${formatIcs(fin)}`,
    `SUMMARY:${echapper(seance.title)}`,
    `LOCATION:${echapper(seance.place)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  // Crée le fichier et lance le téléchargement
  const url = URL.createObjectURL(new Blob([contenu], { type: 'text/calendar;charset=utf-8' }))
  const lien = document.createElement('a')
  lien.href = url
  lien.download = 'seance.ics'
  lien.click()
  URL.revokeObjectURL(url)
}

export default function Confirmation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { donnees, erreur, setErreur, charger } = useSeance(id)
  const [envoi, setEnvoi] = useState(false) // true pendant l'annulation

  // Pendant le chargement ou en cas d'erreur
  if (!donnees) {
    return (
      <main id="contenu" className="page">
        <EtatChargement chargement={!erreur} erreur={erreur} onReessayer={charger} />
      </main>
    )
  }

  const { seance, organisateur } = donnees
  // On cherche l'inscription de l'utilisateur à cette séance
  const inscription = donnees.inscriptions.find((i) => i.userId === lireUtilisateur()?.id)

  // Si l'utilisateur n'est pas inscrit
  if (!inscription) {
    return (
      <main id="contenu" className="page">
        <h1>Aucune réservation</h1>
        <p>Tu n’es pas inscrit à cette séance.</p>
        <Bouton to={`/seances/${id}`}>Voir la séance</Bouton>
      </main>
    )
  }

  // Annule la place et revient à « Mes séances »
  async function annuler() {
    if (!window.confirm('Annuler ta place pour cette séance ?')) return
    setEnvoi(true)
    try {
      await annulerInscription(inscription.id)
      navigate('/mes-seances')
    } catch (e) {
      setErreur(e.message)
      setEnvoi(false)
    }
  }

  return (
    <main id="contenu" className="confirmation theme">
      <div className="confirmation__contenu">
        <Link className="retour-rond" to={`/seances/${id}`} aria-label="Retour à la séance">←</Link>
        <div className="confirmation__icone">
          <Icone nom="verifie" />
        </div>
        <h1>C’est réservé !</h1>
        <p className="texte-secondaire">Ta place est réservée. On se retrouve bientôt !</p>

        {/* Résumé de la séance : date, lieu, sport */}
        <div className="carte recapitulatif">
          <p><Icone nom="calendrier" />{dateTexte(seance, { weekday: 'long', day: 'numeric', month: 'long' })} · {heureSeance(seance)}</p>
          <p><span aria-hidden="true">⌖</span>{seance.place}</p>
          <p><Icone nom="personne" />{libelleSport(seance.sport)}{seance.distanceKm ? ` · ${seance.distanceKm} km` : ''} · avec {organisateur?.firstName}</p>
        </div>

        <div className="confirmation__info">Pense à prévenir l’organisateur si tu ne peux plus venir.</div>
        <EtatChargement erreur={erreur} onReessayer={charger} />
      </div>

      {/* Boutons en bas de la page */}
      <div className="actions-seance">
        <Bouton onClick={() => telechargerCalendrier(seance)}>Ajouter au calendrier</Bouton>
        <button className="annuler-place" type="button" disabled={envoi} onClick={annuler}>Annuler ma place</button>
      </div>
    </main>
  )
}
