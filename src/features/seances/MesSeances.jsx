import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Bouton from '../../components/Bouton'
import EtatChargement from '../../components/EtatChargement'
import { lireUtilisateur } from '../../services/session'
import { chargerMesSeances, dateTexte, heureSeance, niveauTexte } from '../../services/mes-seances'
import { dateSeance, libelleSport } from '../../utils/constants'
import '../../styles/theme.css'
import './mes-pages.css'

export default function MesSeances() {
  const [aVenir, setAVenir] = useState(true)
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

  const liste = seances?.filter(({ seance }) => (dateSeance(seance) >= new Date()) === aVenir)

  return (
    <main id="contenu" className="page mes-seances theme">
      <h1>Mes séances</h1>

      <div className="onglets" aria-label="Filtrer les séances">
        <button type="button" className={aVenir ? 'actif' : ''} aria-pressed={aVenir} onClick={() => setAVenir(true)}>
          À venir
        </button>
        <button type="button" className={aVenir ? '' : 'actif'} aria-pressed={!aVenir} onClick={() => setAVenir(false)}>
          Passées
        </button>
      </div>

      <EtatChargement chargement={!seances && !erreur} erreur={erreur} onReessayer={charger} />
      {!utilisateur && <p>Connecte-toi pour retrouver tes séances. <Link to="/connexion">Se connecter</Link></p>}
      {utilisateur && liste?.length === 0 && (
        <p className="texte-secondaire">Aucune séance {aVenir ? 'à venir' : 'passée'} pour le moment.</p>
      )}

      <div className="liste-seances">
        {liste?.map(({ inscription, seance, organisateur }) => (
          <Link to={`/seances/${seance.id}`} className="carte mes-carte" key={inscription.id}>
            <div className="mes-carte__titre">
              <strong>{libelleSport(seance.sport)} · {niveauTexte(seance)}</strong>
              <span className={aVenir ? 'statut' : 'statut statut--passe'}>
                {aVenir ? '● Inscrite' : '✓ Passée'}
              </span>
            </div>
            <small>{dateTexte(seance)} · {heureSeance(seance)} · {seance.place}</small>
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
