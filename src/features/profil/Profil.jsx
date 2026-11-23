import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Bouton from '../../components/Bouton'
import EtatChargement from '../../components/EtatChargement'
import Icone from '../../components/Icone'
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

  const [profil, setProfil] = useState(null)
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')
  const [essai, setEssai] = useState(0) // +1 à chaque « Réessayer »
  const [ouverte, setOuverte] = useState(null) // rubrique dépliée : 'infos', 'securite' ou null
  const [confirmer, setConfirmer] = useState(false)

  // Charger le profil
  useEffect(() => {
    if (!id) return
    setChargement(true)
    setErreur('')
    lireProfil(id)
      .then(setProfil)
      .catch((e) => setErreur(e.message))
      .finally(() => setChargement(false))
  }, [id, essai])

  // Ouvre ou ferme une rubrique (une seule ouverte à la fois)
  function basculer(nom) {
    setOuverte(ouverte === nom ? null : nom)
  }

  function deconnecter() {
    oublierUtilisateur()
    navigate('/')
  }

  // Pas connecté : on va à la page de connexion
  if (!id) return <Navigate to="/connexion" replace />

  return (
    <main id="contenu" className="page">
      <h1>Profil</h1>

      <EtatChargement chargement={chargement} erreur={erreur} onReessayer={() => setEssai(essai + 1)} />

      {!chargement && profil && (
        <>
          {/* En-tête : avatar, nom, email, ville, fiabilité */}
          <section className="profil">
            <div className="profil__avatar-cadre">
              <div className="profil__avatar" aria-hidden="true">
                {profil.firstName[0]}
                {profil.lastName[0]}
              </div>
              {profil.verified && (
                <span className="profil__badge" title="Profil vérifié">
                  <Icone nom="verifie" className="icone icone--mini" />
                </span>
              )}
            </div>
            <h2>
              {profil.firstName} {profil.lastName}
            </h2>
            <p className="profil__email">{profil.email}</p>
            {profil.city && <p className="profil__ville">{profil.city}</p>}
            {profil.reliability !== undefined && (
              <p className="profil__fiabilite">
                Fiabilité : <strong>{profil.reliability} %</strong>
                {profil.verified ? ' · Profil vérifié' : ' · Profil non vérifié'}
              </p>
            )}
          </section>

          {/* Les rubriques */}
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
              {/* Deux formulaires indépendants */}
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

          {/* Déconnexion, avec confirmation */}
          <div className="profil__deconnexion">
            {!confirmer && (
              <Bouton variante="lien" onClick={() => setConfirmer(true)}>
                Se déconnecter
              </Bouton>
            )}
            {confirmer && (
              <>
                <Bouton variante="lien" onClick={deconnecter}>
                  Me déconnecter
                </Bouton>
                <Bouton variante="lien-gris" onClick={() => setConfirmer(false)}>
                  Annuler
                </Bouton>
              </>
            )}
          </div>
        </>
      )}
    </main>
  )
}
