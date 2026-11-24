import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Bouton from '../../components/Bouton'
import EtatChargement from '../../components/EtatChargement'
import { lireProfil } from '../../services/profil'
import { lireUtilisateur, oublierUtilisateur } from '../../services/session'
import FormulaireEmail from './FormulaireEmail'
import FormulaireInfos from './FormulaireInfos'
import FormulaireMotDePasse from './FormulaireMotDePasse'
import LigneMenu from './LigneMenu'
import './profil.css'

export default function Profil() {
  const navigate = useNavigate()
  const id = lireUtilisateur()?.id

  const [profil, setProfil] = useState(null) // les infos de l'utilisateur
  const [erreur, setErreur] = useState('') // le message d'erreur
  const [essai, setEssai] = useState(0) // augmente quand on clique sur « Réessayer »
  const [ouverte, setOuverte] = useState(null) // la partie du menu qui est ouverte
  const [confirmer, setConfirmer] = useState(false) // true quand on demande de confirmer la déconnexion

  // On attend la réponse du serveur
  const chargement = !profil && !erreur

  // Charge le profil depuis l'API
  useEffect(() => {
    if (!id) return
    setErreur('')
    lireProfil(id)
      .then(setProfil)
      .catch((e) => setErreur(e.message))
  }, [id, essai])

  // Ouvre ou ferme une partie du menu
  function basculer(nom) {
    setOuverte(ouverte === nom ? null : nom)
  }

  // Déconnecte l'utilisateur et revient à l'accueil
  function deconnecter() {
    oublierUtilisateur()
    navigate('/')
  }

  // Si on n'est pas connecté, on va à la page de connexion
  if (!id) return <Navigate to="/connexion" replace />

  return (
    <main id="contenu" className="page">
      <h1>Profil</h1>

      <EtatChargement chargement={chargement} erreur={erreur} onReessayer={() => setEssai(essai + 1)} />

      {profil && (
        <>
          {/* Haut de la page : photo, nom, email, ville */}
          <section className="profil">
            <div className="profil__avatar-cadre">
              <div className="profil__avatar" aria-hidden="true">
                {profil.firstName[0]}
                {profil.lastName[0]}
              </div>
            </div>
            <h2>
              {profil.firstName} {profil.lastName}
            </h2>
            <p className="profil__email">{profil.email}</p>
            {profil.city && <p className="profil__ville">{profil.city}</p>}
            {profil.reliability !== undefined && (
              <p className="profil__fiabilite">
                Fiabilité : <strong>{profil.reliability} %</strong>
              </p>
            )}
          </section>

          {/* Menu du profil */}
          <ul className="menu-profil">
            <li>
              <LigneMenu icone="calendrier" titre="Mes séances" sousTitre="À venir · Passées" to="/mes-seances" />
            </li>
            <li>
              <LigneMenu
                icone="personne"
                titre="Mes informations"
                sousTitre="Prénom, nom, ville"
                onClick={() => basculer('infos')}
                ouvert={ouverte === 'infos'}
              />
              {ouverte === 'infos' && <FormulaireInfos profil={profil} onEnregistre={setProfil} />}
            </li>
            <li>
              <LigneMenu
                icone="cadenas"
                titre="Connexion et sécurité"
                sousTitre="Email, mot de passe"
                onClick={() => basculer('securite')}
                ouvert={ouverte === 'securite'}
              />
              {/* Formulaires pour changer l'email et le mot de passe */}
              {ouverte === 'securite' && (
                <>
                  <FormulaireEmail profil={profil} onEnregistre={setProfil} />
                  <FormulaireMotDePasse profil={profil} />
                </>
              )}
            </li>
            <li>
              <LigneMenu icone="etoile" titre="Mes avis reçus" sousTitre="Aucun pour l’instant" to="/profil/avis" />
            </li>
            <li>
              <LigneMenu icone="cloche" titre="Notifications" sousTitre="Rappels de séance, messages" to="/notifications" />
            </li>
            <li>
              <LigneMenu icone="aide" titre="Aide & contact" sousTitre="Questions fréquentes, nous écrire" to="/aide" />
            </li>
          </ul>

          {/* Bouton de déconnexion (on demande de confirmer) */}
          <div className="profil__deconnexion">
            {confirmer ? (
              <>
                <Bouton variante="lien" onClick={deconnecter}>
                  Me déconnecter
                </Bouton>
                <Bouton variante="lien-gris" onClick={() => setConfirmer(false)}>
                  Annuler
                </Bouton>
              </>
            ) : (
              <Bouton variante="lien" onClick={() => setConfirmer(true)}>
                Se déconnecter
              </Bouton>
            )}
          </div>
        </>
      )}
    </main>
  )
}
