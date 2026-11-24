import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Bouton from '../../components/Bouton'
import EtatChargement from '../../components/EtatChargement'
import { lireUtilisateur } from '../../services/session'
import { chargerMesSeances, dateSeance, heureSeance } from '../../services/mes-seances'
import { libelleSport } from '../../utils/constants'
import '../../styles/theme-v2.css'
import './mes-pages.css'

export default function MesSeances() {
  const [onglet, setOnglet] = useState('avenir')
  const [seances, setSeances] = useState(null)
  const [erreur, setErreur] = useState('')
  const utilisateur = lireUtilisateur()

  const charger = useCallback(() => {
    if (!utilisateur?.id) {
      setSeances([])
      return
    }
    setErreur('')
    chargerMesSeances(utilisateur.id).then(setSeances).catch((e) => setErreur(e.message))
  }, [utilisateur?.id])

  useEffect(() => { charger() }, [charger])

  const liste = seances?.filter(({ seance }) => {
    const date = new Date(`${seance.date}T${seance.time}:00`)
    return (date >= new Date()) === (onglet === 'avenir')
  })

  return (
    <main id="contenu" className="page mes-seances theme-v2">
      <h1>Mes séances</h1>

      <div className="onglets" aria-label="Filtrer les séances">
        <button type="button" className={onglet === 'avenir' ? 'actif' : ''} aria-pressed={onglet === 'avenir'} onClick={() => setOnglet('avenir')}>
          À venir
        </button>
        <button type="button" className={onglet === 'passees' ? 'actif' : ''} aria-pressed={onglet === 'passees'} onClick={() => setOnglet('passees')}>
          Passées
        </button>
      </div>

      <EtatChargement chargement={!seances && !erreur} erreur={erreur} onReessayer={charger} />
      {!utilisateur && <p>Connecte-toi pour retrouver tes séances. <Link to="/connexion">Se connecter</Link></p>}
      {utilisateur && liste?.length === 0 && (
        <p className="texte-secondaire">Aucune séance {onglet === 'avenir' ? 'à venir' : 'passée'} pour le moment.</p>
      )}

      <div className="liste-seances">
        {liste?.map(({ inscription, seance, organisateur }) => (
          <Link to={`/seances/${seance.id}`} className="carte mes-carte" key={inscription.id}>
            <div className="mes-carte__titre">
              <strong>{libelleSport(seance.sport)} · {seance.level === 'intermediaire' ? 'intermédiaire' : 'débutant'}</strong>
              <span className={onglet === 'avenir' ? 'statut' : 'statut statut--passe'}>
                {onglet === 'avenir' ? '● Inscrite' : '✓ Passée'}
              </span>
            </div>
            <small>{dateSeance(seance)} · {heureSeance(seance)} · {seance.place}</small>
            <small>{organisateur?.firstName} (organise)</small>
          </Link>
        ))}
      </div>

      <div className="mes-seances__action">
        <Bouton to="/seances">Trouver une séance</Bouton>
      </div>
    </main>
  )
}
