import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import Bouton from '../../components/Bouton'
import CarteSeance from '../../components/CarteSeance'
import EtatChargement from '../../components/EtatChargement'
import Icone from '../../components/Icone'
import { lireProfil } from '../../services/profil'
import { lireSeances } from '../../services/seances'
import { lireUtilisateur } from '../../services/session'
import { AUJOURDHUI, dateSeance, NOMS_COURTS, SPORTS } from '../../utils/constants'
import '../../styles/theme-v2.css'
import './accueil-connecte.css'

const UNE_HEURE = 60 * 60 * 1000
const UN_JOUR = 24 * UNE_HEURE

// 16 oct. 2026 → 'Vendredi 16 octobre'
function dateDuJour() {
  const texte = AUJOURDHUI.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  return texte[0].toUpperCase() + texte.slice(1)
}

// Nombre de jours entre aujourd'hui et la séance (en jours du calendrier)
function joursAvant(seance) {
  const debut = dateSeance(seance)
  const jourSeance = new Date(debut.getFullYear(), debut.getMonth(), debut.getDate())
  const jourActuel = new Date(AUJOURDHUI.getFullYear(), AUJOURDHUI.getMonth(), AUJOURDHUI.getDate())
  return Math.round((jourSeance - jourActuel) / UN_JOUR)
}

// 0 → 'Aujourd’hui' ; 1 → 'Demain' ; 2 → 'Dans 2 jours'
function texteJours(jours) {
  if (jours === 0) return 'Aujourd’hui'
  if (jours === 1) return 'Demain'
  return `Dans ${jours} jours`
}

// Temps restant pour annuler gratuitement (jusqu'à 1 h avant le début) : '1 j 13 h', ou '' si c'est trop tard
function tempsAnnulation(seance) {
  const limite = dateSeance(seance).getTime() - UNE_HEURE
  const heures = Math.floor((limite - AUJOURDHUI.getTime()) / UNE_HEURE)
  if (heures <= 0) return ''
  const jours = Math.floor(heures / 24)
  if (jours === 0) return `${heures} h`
  return `${jours} j ${heures % 24} h`
}

// 'Dim. 18 oct. · 9:00 · 5 km · 6:30 /km'
function infosSeance(seance) {
  const debut = dateSeance(seance)
  const jour = debut.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
  const morceaux = [jour[0].toUpperCase() + jour.slice(1), `${debut.getHours()}:${String(debut.getMinutes()).padStart(2, '0')}`]
  if (seance.distanceKm) morceaux.push(`${seance.distanceKm} km`)
  if (seance.pace) morceaux.push(`${seance.pace} /km`)
  return morceaux.join(' · ')
}

// ['Sarah', 'Léo', 'Tom'] → 'Sarah, Léo et Tom'
function listePrenoms(prenoms) {
  if (prenoms.length <= 1) return prenoms.join('')
  return `${prenoms.slice(0, -1).join(', ')} et ${prenoms[prenoms.length - 1]}`
}

// Page d'accueil quand on est connecté (maquette V2 · 01 — Accueil)
export default function AccueilConnecte() {
  const id = lireUtilisateur()?.id

  const [profil, setProfil] = useState(null)
  const [seances, setSeances] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')
  const [essai, setEssai] = useState(0) // +1 à chaque « Réessayer »

  // Charger le profil et les séances en même temps
  useEffect(() => {
    if (!id) return
    setChargement(true)
    setErreur('')
    Promise.all([lireProfil(id), lireSeances()])
      .then(([p, s]) => {
        setProfil(p)
        setSeances(s)
      })
      .catch((e) => setErreur(e.message))
      .finally(() => setChargement(false))
  }, [id, essai])

  // Pas connecté : on va à la page de connexion
  if (!id) return <Navigate to="/connexion" replace />

  // Les séances pas encore commencées
  const aVenir = seances.filter((s) => dateSeance(s) >= AUJOURDHUI)

  // Ma prochaine séance : la plus proche dans le temps parmi celles où je suis inscrit·e
  const prochaine = aVenir
    .filter((s) => s.inscrits.some((u) => u.id === id))
    .sort((a, b) => dateSeance(a) - dateSeance(b))[0]

  // Les 2 séances les plus proches de chez moi (sauf ma prochaine séance)
  const presDeMoi = aVenir
    .filter((s) => s.id !== prochaine?.id)
    .sort((a, b) => a.distanceFromUserKm - b.distanceFromUserKm)
    .slice(0, 2)

  // Chiffres du bloc sombre
  const ceWeekEnd = aVenir.filter((s) => {
    const jour = dateSeance(s).getDay()
    return (jour === 0 || jour === 6) && dateSeance(s) - AUJOURDHUI < 7 * UN_JOUR
  })
  const sportifs = new Set(aVenir.flatMap((s) => s.inscrits.map((u) => u.id)))

  const annulation = prochaine ? tempsAnnulation(prochaine) : ''
  const autresInscrits = prochaine ? prochaine.inscrits.filter((u) => u.id !== id) : []

  return (
    <main id="contenu" className="page theme-v2 accueil-v2">
      <EtatChargement chargement={chargement} erreur={erreur} onReessayer={() => setEssai(essai + 1)} />

      {!chargement && profil && (
        <>
          {/* 1. En-tête : date, prénom, notifications */}
          <header className="accueil-v2__entete">
            <div>
              <p className="accueil-v2__date">{dateDuJour()}</p>
              <h1 className="accueil-v2__bonjour">
                Salut {profil.firstName} <span aria-hidden="true">👋</span>
              </h1>
            </div>
            <Link to="/notifications" state={{ depuis: 'accueil' }} className="accueil-v2__cloche" aria-label="Notifications">
              <Icone nom="cloche" />
            </Link>
          </header>

          {/* 2. Grand bloc sombre : l'invitation à bouger */}
          <section className="accroche" aria-labelledby="titre-accroche">
            <svg className="accroche__trace" viewBox="0 0 120 200" preserveAspectRatio="none" aria-hidden="true">
              <path className="accroche__halo" d="M118 4 C 96 40, 112 70, 86 104 S 40 150, 22 198" />
              <path className="accroche__ligne" d="M118 4 C 96 40, 112 70, 86 104 S 40 150, 22 198" />
            </svg>

            <p className="accroche__badge">Sport ensemble</p>
            <h2 id="titre-accroche" className="accroche__titre">
              Ce week-end, on bouge&nbsp;?
            </h2>
            <p className="accroche__texte">Des sorties à ton rythme, près de chez toi.</p>

            <dl className="accroche__chiffres">
              <div>
                <dt>séances ce week‑end</dt>
                <dd>{ceWeekEnd.length}</dd>
              </div>
              <div>
                <dt>sportifs actifs</dt>
                <dd>{sportifs.size}</dd>
              </div>
              <div>
                <dt>ta fiabilité</dt>
                <dd>{profil.reliability ?? '—'}{profil.reliability !== undefined && ' %'}</dd>
              </div>
            </dl>

            <Bouton to="/seances">Trouver ma séance</Bouton>
          </section>

          {/* 3. Ma prochaine séance */}
          <section className="accueil-v2__bloc" aria-labelledby="titre-prochaine">
            <h2 id="titre-prochaine" className="accueil-v2__titre">
              Ma prochaine séance
            </h2>

            {prochaine ? (
              <Link to={`/seances/${prochaine.id}`} className="prochaine">
                <span className="prochaine__haut">
                  <span className={`etiquette-sport sport--${prochaine.sport}`}>
                    <Icone nom={prochaine.sport} className="icone icone--petite" />
                    {NOMS_COURTS[prochaine.sport]}
                  </span>
                  <span className="prochaine__reservee">
                    <Icone nom="verifie" className="icone icone--petite" />
                    Réservée
                  </span>
                </span>

                <span className="prochaine__delai">{texteJours(joursAvant(prochaine))}</span>
                <span className="prochaine__lieu">{prochaine.title}</span>
                <span className="prochaine__infos">{infosSeance(prochaine)}</span>

                <span className="prochaine__bas">
                  <span className="prochaine__groupe">
                    <span className="carte-seance__avatars" aria-hidden="true">
                      {prochaine.inscrits.slice(0, 3).map((u) => (
                        <span key={u.id} className="avatar">
                          {u.firstName.slice(0, 2).toUpperCase()}
                        </span>
                      ))}
                    </span>
                    {autresInscrits.length > 0
                      ? `Avec ${listePrenoms(autresInscrits.map((u) => u.firstName))}`
                      : 'Tu es le premier inscrit·e'}
                  </span>
                  <span className="carte-seance__fleche" aria-hidden="true">
                    <Icone nom="fleche" className="icone icone--petite" />
                  </span>
                </span>

                {annulation && (
                  <span className="prochaine__annulation">
                    <Icone nom="horloge" className="icone icone--petite" />
                    Annulation gratuite encore&nbsp;<strong>{annulation}</strong>
                  </span>
                )}
              </Link>
            ) : (
              <div className="accueil-v2__vide">
                <span className="accueil-v2__vide-icone">
                  <Icone nom="calendrier" />
                </span>
                <p>
                  <strong>Rien de prévu pour l’instant</strong>
                  <span>Rejoins une sortie, elle s’affichera ici.</span>
                </p>
              </div>
            )}
          </section>

          {/* 4. Les 5 sports, chacun dans sa couleur */}
          <section className="accueil-v2__bloc" aria-labelledby="titre-sports">
            <h2 id="titre-sports" className="accueil-v2__titre">
              Choisis ton sport
            </h2>
            <ul className="sports">
              {SPORTS.map((sport) => (
                <li key={sport.value}>
                  <Link to={`/seances?sport=${sport.value}`} className={`sports__tuile sport--${sport.value}`} aria-label={sport.label}>
                    <span className="sports__rond">
                      <Icone nom={sport.value} />
                    </span>
                    <span aria-hidden="true">{NOMS_COURTS[sport.value]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* 5. Les séances les plus proches */}
          <section className="accueil-v2__bloc" aria-labelledby="titre-pres">
            <div className="accueil-v2__titre-ligne">
              <h2 id="titre-pres" className="accueil-v2__titre">
                Près de toi
              </h2>
              <Link to="/seances" className="accueil-v2__tout-voir">
                Tout voir
                <Icone nom="fleche" className="icone icone--petite" />
              </Link>
            </div>

            {presDeMoi.length === 0 && <p className="accueil-v2__aucune">Aucune autre séance pour l’instant.</p>}
            <ul className="accueil-v2__liste">
              {presDeMoi.map((seance) => (
                <li key={seance.id}>
                  <CarteSeance seance={seance} idUtilisateur={id} />
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </main>
  )
}
