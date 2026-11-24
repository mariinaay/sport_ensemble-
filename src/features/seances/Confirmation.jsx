import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Bouton from '../../components/Bouton'
import Icone from '../../components/Icone'
import EtatChargement from '../../components/EtatChargement'
import { lireUtilisateur } from '../../services/session'
import { annulerInscription, chargerSeance, dateSeance, heureSeance } from '../../services/mes-seances'
import { libelleSport } from '../../utils/constants'
import '../../styles/theme-v2.css'
import './mes-pages.css'

export default function Confirmation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [donnees, setDonnees] = useState(null)
  const [erreur, setErreur] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const charger = useCallback(() => { setErreur(''); chargerSeance(id).then(setDonnees).catch((e) => setErreur(e.message)) }, [id])
  useEffect(() => { charger() }, [charger])
  const inscription = donnees?.inscriptions.find((i) => i.userId === lireUtilisateur()?.id)
  async function annuler() {
    if (!inscription || !window.confirm('Annuler ta place pour cette séance ?')) return
    setEnvoi(true)
    try { await annulerInscription(inscription.id); navigate('/mes-seances') } catch (e) { setErreur(e.message); setEnvoi(false) }
  }
  function calendrier() {
    const { seance } = donnees
    const debut = new Date(`${seance.date}T${seance.time}:00`)
    const fin = new Date(debut.getTime() + (seance.durationMin || 60) * 60000)
    const format = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
    const echapper = (texte) => texte.replace(/\\/g, '\\\\').replace(/[,;]/g, '\\$&').replace(/\n/g, '\\n')
    const contenu = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Sport Ensemble//FR', 'BEGIN:VEVENT', `UID:seance-${seance.id}@sport-ensemble`, `DTSTAMP:${format(new Date())}`, `DTSTART:${format(debut)}`, `DTEND:${format(fin)}`, `SUMMARY:${echapper(seance.title)}`, `LOCATION:${echapper(seance.place)}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n')
    const url = URL.createObjectURL(new Blob([contenu], { type: 'text/calendar;charset=utf-8' }))
    const lien = document.createElement('a'); lien.href = url; lien.download = 'seance.ics'; lien.click(); URL.revokeObjectURL(url)
  }
  if (!donnees) return <main id="contenu" className="page"><EtatChargement chargement={!erreur} erreur={erreur} onReessayer={charger} /></main>
  const { seance, organisateur } = donnees
  if (!inscription) return <main id="contenu" className="page"><h1>Aucune réservation</h1><p>Tu n’es pas inscrit à cette séance.</p><Bouton to={`/seances/${id}`}>Voir la séance</Bouton></main>
  return <main id="contenu" className="confirmation theme-v2"><div className="confirmation__contenu"><Link className="retour-rond" to={`/seances/${id}`} aria-label="Retour à la séance">←</Link><div className="confirmation__icone"><Icone nom="verifie" /></div><h1>C’est réservé !</h1><p className="texte-secondaire">Ta place est réservée. On se retrouve bientôt !</p><div className="carte recapitulatif"><p><Icone nom="calendrier" />{dateSeance(seance, { weekday: 'long', day: 'numeric', month: 'long' })} · {heureSeance(seance)}</p><p><span aria-hidden="true">⌖</span>{seance.place}</p><p><Icone nom="personne" />{libelleSport(seance.sport)}{seance.distanceKm ? ` · ${seance.distanceKm} km` : ''} · avec {organisateur?.firstName}</p></div><div className="confirmation__info">Pense à prévenir l’organisateur si tu ne peux plus venir.</div><EtatChargement erreur={erreur} onReessayer={charger} /></div><div className="actions-seance"><Bouton onClick={calendrier}>Ajouter au calendrier</Bouton><button className="annuler-place" type="button" disabled={envoi} onClick={annuler}>Annuler ma place</button></div></main>
}
