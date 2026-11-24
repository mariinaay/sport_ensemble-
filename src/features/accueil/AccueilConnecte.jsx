import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import Bouton from '../../components/Bouton'
import CarteSeance, { Avatars } from '../../components/CarteSeance'
import EtatChargement from '../../components/EtatChargement'
import Icone from '../../components/Icone'
import { lireProfil } from '../../services/profil'
import { lireSeances } from '../../services/seances'
import { lireUtilisateur } from '../../services/session'
import { AUJOURDHUI, dateSeance, heureCourte, NOMS_COURTS, SPORTS } from '../../utils/constants'
import '../../styles/theme.css'
import './accueil-connecte.css'

// Tracé du parcours dessiné dans le bloc sombre (un halo large + une ligne en pointillés par-dessus)
const TRACE = 'M118 4 C 96 40, 112 70, 86 104 S 40 150, 22 198'

const UNE_HEURE = 60 * 60 * 1000
const UN_JOUR = 24 * UNE_HEURE

// 'vendredi 16 octobre' → 'Vendredi 16 octobre'
const majuscule = (texte) => texte[0].toUpperCase() + texte.slice(1)

const DATE_DU_JOUR = majuscule(AUJOURDHUI.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }))

// Minuit du même jour : pour compter en jours du calendrier, pas en tranches de 24 h
const minuit = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

// 'Aujourd’hui', 'Demain' ou 'Dans 2 jours'
function delai(seance) {
  const jours = Math.round((minuit(dateSeance(seance)) - minuit(AUJOURDHUI)) / UN_JOUR)
  if (jours === 0) return 'Aujourd’hui'
  if (jours === 1) return 'Demain'
  return `Dans ${jours} jours`
}

// Temps restant pour annuler gratuitement (jusqu'à 1 h avant le début) : '1 j 13 h', ou '' si c'est trop tard
function tempsAnnulation(seance) {
  const heures = Math.floor((dateSeance(seance) - UNE_HEURE - AUJOURDHUI) / UNE_HEURE)
  if (heures <= 0) return ''
  if (heures < 24) return `${heures} h`
  return `${Math.floor(heures / 24)} j ${heures % 24} h`
}

// 'Dim. 18 oct. · 9:00 · 5 km · 6:30 /km'
function infosSeance(seance) {
  const debut = dateSeance(seance)
  const jour = debut.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
  const morceaux = [majuscule(jour), heureCourte(debut)]
  if (seance.distanceKm) morceaux.push(`${seance.distanceKm} km`)
  if (seance.pace) morceaux.push(`${seance.pace} /km`)
  return morceaux.join(' · ')
}

// ['Sarah', 'Léo', 'Tom'] → 'Sarah, Léo et Tom'
const listePrenoms = (prenoms) => new Intl.ListFormat('fr').format(prenoms)

// Page d'accueil quand on est connecté (maquette 01 — Accueil)
export default function AccueilConnecte() {
  const id = lireUtilisateur()?.id

  const [profil, setProfil] = useState(null)
  const [seances, setSeances] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')
  const [essai, setEssai] = useState(0) // +1 à chaque « Réessayer »

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

  if (!id) return <Navigate to="/connexion" replace />

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

  // Chiffres du bloc sombre (week-end = samedi ou dimanche des 7 prochains jours)
  const ceWeekEnd = aVenir.filter((s) => {
    const debut = dateSeance(s)
    return [0, 6].includes(debut.getDay()) && debut - AUJOURDHUI < 7 * UN_JOUR
  })
  const sportifs = new Set(aVenir.flatMap((s) => s.inscrits.map((u) => u.id)))

  // Infos de ma prochaine séance (utilisées seulement s'il y en a une)
  const annulation = prochaine && tempsAnnulation(prochaine)
  const autresPrenoms = prochaine?.inscrits.filter((u) => u.id !== id).map((u) => u.firstName)

  return (
    <main id="contenu" className="page theme accueil-connecte">
      <EtatChargement chargement={chargement} erreur={erreur} onReessayer={() => setEssai(essai + 1)} />

      {!chargement && profil && (
        <>
          {/* 1. En-tête : date, prénom, notifications */}
          <header className="accueil-connecte__entete">
            <div>
              <p className="accueil-connecte__date">{DATE_DU_JOUR}</p>
              <h1 className="accueil-connecte__bonjour">
                Salut {profil.firstName} <span aria-hidden="true">👋</span>
              </h1>
            </div>
            <Link to="/notifications" state={{ depuis: 'accueil' }} className="accueil-connecte__cloche" aria-label="Notifications">
              <Icone nom="cloche" />
            </Link>
          </header>

          {/* 2. Grand bloc sombre : l'invitation à bouger */}
          <section className="accroche" aria-labelledby="titre-accroche">
            <svg className="accroche__trace" viewBox="0 0 120 200" preserveAspectRatio="none" aria-hidden="true">
              <path className="accroche__halo" d={TRACE} />
              <path className="accroche__ligne" d={TRACE} />
            </svg>

            <p className="accroche__badge">Sport ensemble</p>
            <h2 id="titre-accroche" className="accroche__titre">Ce week-end, on bouge&nbsp;?</h2>
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
                <dd>{profil.reliability == null ? '—' : `${profil.reliability} %`}</dd>
              </div>
            </dl>

            <Bouton to="/seances">Trouver ma séance</Bouton>
          </section>

          {/* 3. Ma prochaine séance */}
          <section className="accueil-connecte__bloc" aria-labelledby="titre-prochaine">
            <h2 id="titre-prochaine" className="accueil-connecte__titre">Ma prochaine séance</h2>

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

                <span className="prochaine__delai">{delai(prochaine)}</span>
                <span className="prochaine__lieu">{prochaine.title}</span>
                <span className="prochaine__infos">{infosSeance(prochaine)}</span>

                <span className="prochaine__bas">
                  <span className="prochaine__groupe">
                    <Avatars inscrits={prochaine.inscrits} />
                    {autresPrenoms.length > 0 ? `Avec ${listePrenoms(autresPrenoms)}` : 'Tu es le premier inscrit·e'}
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
              <div className="accueil-connecte__vide">
                <span className="accueil-connecte__vide-icone">
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
          <section className="accueil-connecte__bloc" aria-labelledby="titre-sports">
            <h2 id="titre-sports" className="accueil-connecte__titre">Choisis ton sport</h2>
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
          <section className="accueil-connecte__bloc" aria-labelledby="titre-pres">
            <div className="accueil-connecte__titre-ligne">
              <h2 id="titre-pres" className="accueil-connecte__titre">Près de toi</h2>
              <Link to="/seances" className="accueil-connecte__tout-voir">
                Tout voir
                <Icone nom="fleche" className="icone icone--petite" />
              </Link>
            </div>

            {presDeMoi.length === 0 && <p className="accueil-connecte__aucune">Aucune autre séance pour l’instant.</p>}
            <ul className="accueil-connecte__liste">
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
