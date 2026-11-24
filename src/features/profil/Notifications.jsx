import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import Bouton from '../../components/Bouton'
import EtatChargement from '../../components/EtatChargement'
import LienRetour from '../../components/LienRetour'
import Message from '../../components/Message'
import { NOTIFICATIONS } from '../../utils/constants'
import { lireProfil, modifierProfil } from '../../services/profil'
import { lireUtilisateur } from '../../services/session'
import './profil.css'

// Cases cochées au départ
const PAR_DEFAUT = Object.fromEntries(NOTIFICATIONS.map((n) => [n.value, n.parDefaut]))

export default function Notifications() {
  const depuisAccueil = useLocation().state?.depuis === 'accueil'
  const id = lireUtilisateur()?.id

  const [choix, setChoix] = useState(null) // null tant que les choix enregistrés ne sont pas chargés
  const [erreur, setErreur] = useState('') // erreur au chargement
  const [essai, setEssai] = useState(0) // +1 à chaque « Réessayer »
  const [envoi, setEnvoi] = useState(false)
  const [erreurEnvoi, setErreurEnvoi] = useState('') // erreur à l'enregistrement
  const [succes, setSucces] = useState(false)

  // Charger les choix enregistrés
  useEffect(() => {
    if (!id) return
    setErreur('')
    lireProfil(id)
      .then((profil) => setChoix({ ...PAR_DEFAUT, ...profil.notifications }))
      .catch((e) => setErreur(e.message))
  }, [id, essai])

  // Cocher / décocher une case
  function basculer(nom) {
    setChoix({ ...choix, [nom]: !choix[nom] })
    setSucces(false)
  }

  async function enregistrer(e) {
    e.preventDefault()
    setEnvoi(true)
    setErreurEnvoi('')
    try {
      await modifierProfil(id, { notifications: choix })
      setSucces(true)
    } catch (erreur) {
      setErreurEnvoi(erreur.message)
    }
    setEnvoi(false)
  }

  if (!id) return <Navigate to="/connexion" replace />

  return (
    <main id="contenu" className="page">
      {/* Retour vers la page d'où l'on vient (Accueil via la cloche, sinon Profil) */}
      {depuisAccueil ? <LienRetour to="/accueil">Accueil</LienRetour> : <LienRetour to="/profil">Profil</LienRetour>}
      <h1>Notifications</h1>
      <p className="notifications__intro">Choisis quand Sport Ensemble te prévient.</p>

      <EtatChargement chargement={!choix && !erreur} erreur={erreur} onReessayer={() => setEssai(essai + 1)} />

      {choix && (
        <form onSubmit={enregistrer}>
          <fieldset className="cases">
            <legend className="visuellement-cache">Me prévenir pour</legend>
            {NOTIFICATIONS.map((n) => (
              <label key={n.value} className="case">
                <span className="case__textes">
                  <span className="case__titre">{n.label}</span>
                  {n.aide && <span className="case__aide">{n.aide}</span>}
                </span>
                <input type="checkbox" checked={choix[n.value]} onChange={() => basculer(n.value)} />
              </label>
            ))}
          </fieldset>

          <Message type="erreur">{erreurEnvoi}</Message>
          <Message type="succes">{succes && 'Préférences enregistrées.'}</Message>
          <Bouton type="submit" chargement={envoi}>
            Enregistrer
          </Bouton>
        </form>
      )}
    </main>
  )
}
