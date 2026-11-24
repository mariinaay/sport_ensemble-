import { useCallback, useEffect, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import Bouton from '../../components/Bouton'
import CarteSeance from '../../components/CarteSeance'
import Icone from '../../components/Icone'
import PlanSeances from '../../components/PlanSeances'
import { lireProfil } from '../../services/profil'
import { lireSeances } from '../../services/seances'
import { lireUtilisateur } from '../../services/session'
import { nomCourt } from '../../utils/constants'
import FeuilleFiltres from './FeuilleFiltres'
import { bonEndroit, bonSport, FILTRES_VIDES, GROUPES, libelleChoix, passeLesFiltres, phraseRien } from './filtres'
import '../../styles/theme.css'
import './seances.css'

// Petit dessin affiché quand il n'y a aucune séance
function IconeParcours() {
  return (
    <svg
      className="seances__etat-dessin"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="5" r="2" />
      <path d="M8 19h8.5a3.5 3.5 0 0 0 0-7h-9a3.5 3.5 0 0 1 0-7H16" />
    </svg>
  )
}

export default function Seances() {
  const id = lireUtilisateur()?.id
  const [parametres] = useSearchParams()
  const sportDeLAccueil = parametres.get('sport') // le sport choisi sur la page d'accueil

  const [seances, setSeances] = useState([]) // toutes les séances
  const [ville, setVille] = useState('') // la ville de l'utilisateur
  const [etat, setEtat] = useState('chargement') // 'chargement', 'erreur' ou 'pret'
  const [essai, setEssai] = useState(0) // augmente quand on clique sur « Réessayer »

  const [recherche, setRecherche] = useState('') // le sport écrit dans la recherche
  const [endroit, setEndroit] = useState('') // le lieu écrit dans la recherche
  const [filtres, setFiltres] = useState({ ...FILTRES_VIDES, sports: sportDeLAccueil ? [sportDeLAccueil] : [] }) // les filtres cochés
  const [feuilleOuverte, setFeuilleOuverte] = useState(false) // true si la fenêtre des filtres est ouverte
  const [vueCarte, setVueCarte] = useState(false) // true pour voir la carte, false pour la liste
  const [choisie, setChoisie] = useState(null) // la séance choisie sur la carte
  const [alerte, setAlerte] = useState(false) // true si l'alerte est activée

  // Charge le profil et les séances depuis l'API
  useEffect(() => {
    if (!id) return
    setEtat('chargement')
    Promise.all([lireProfil(id), lireSeances()])
      .then(([profil, liste]) => {
        setVille(profil.city ?? '')
        setSeances(liste)
        setEtat('pret')
      })
      .catch(() => setEtat('erreur'))
  }, [id, essai])

  // Ferme la fenêtre des filtres
  const fermerFeuille = useCallback(() => setFeuilleOuverte(false), [])

  // Si on n'est pas connecté, on va à la page de connexion
  if (!id) return <Navigate to="/connexion" replace />

  const cherche = recherche.trim()
  const lieu = endroit.trim()

  // Les séances qui correspondent à la recherche et aux filtres, de la plus proche à la plus loin
  const resultats = seances
    .filter((s) => bonSport(s, cherche) && bonEndroit(s, lieu) && passeLesFiltres(s, filtres))
    .sort((a, b) => a.distanceFromUserKm - b.distanceFromUserKm)
  const aucune = resultats.length === 0
  const une = resultats.length === 1
  // La séance affichée sous la carte : celle choisie, sinon la plus proche
  const seanceChoisie = resultats.find((s) => s.id === choisie) ?? resultats[0]

  // La liste des filtres cochés
  const coches = [
    ...filtres.sports.map((sport) => ({ cle: 'sports', valeur: sport, texte: nomCourt(sport) })),
    ...GROUPES.flatMap((g) => filtres[g.cle].map((v) => ({ cle: g.cle, valeur: v, texte: libelleChoix(g.cle, v) }))),
  ]

  // Enlève un filtre
  function retirer(cle, valeur) {
    setFiltres({ ...filtres, [cle]: filtres[cle].filter((v) => v !== valeur) })
  }

  // Enlève la recherche et tous les filtres
  function toutEffacer() {
    setRecherche('')
    setEndroit('')
    setFiltres(FILTRES_VIDES)
  }

  const quelqueChoseActif = cherche !== '' || lieu !== '' || coches.length > 0 // true si une recherche ou un filtre est utilisé
  const unSeulJour = filtres.jours.length === 1 // true si un seul jour est coché
  // Phrase affichée quand il n'y a aucune séance
  const phraseVide = quelqueChoseActif
    ? phraseRien(filtres, cherche, lieu)
    : "Personne n'a encore proposé de séance. Lance la tienne"

  return (
    <main id="contenu" className="page theme">
      {/* Titre et bouton des filtres */}
      <div className="seances__entete">
        <div>
          <h1 className="seances__titre">Séances</h1>
          <p className="seances__sous-titre">Trouve une sortie à ton rythme</p>
        </div>
        <button
          type="button"
          className="seances__bouton-filtres"
          aria-label={coches.length > 0 ? `Filtres (${coches.length} cochés)` : 'Filtres'}
          aria-haspopup="dialog"
          onClick={() => setFeuilleOuverte(true)}
        >
          <Icone nom="reglages" />
          {coches.length > 0 && (
            <span className="seances__nombre-filtres" aria-hidden="true">
              {coches.length}
            </span>
          )}
        </button>
      </div>

      {/* Fenêtre des filtres */}
      {feuilleOuverte && (
        <FeuilleFiltres filtres={filtres} setFiltres={setFiltres} nombre={resultats.length} onFermer={fermerFeuille} />
      )}

      {/* Recherche par sport et par lieu */}
      <div className="seances__filtres">
        <label htmlFor="recherche" className="visuellement-cache">
          Quel sport ?
        </label>
        <div className="seances__lieu">
          <Icone nom="loupe" className="icone seances__lieu-icone" />
          <input
            id="recherche"
            type="search"
            className="champ__input seances__lieu-champ"
            placeholder="Un sport : course, padel…"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
        </div>

        <label htmlFor="lieu" className="visuellement-cache">
          Où ? (vide : autour de moi{ville ? `, ${ville}` : ''})
        </label>
        <div className="seances__ou">
          <div className="seances__lieu">
            <Icone nom="repere" className="icone seances__lieu-icone" />
            <input
              id="lieu"
              type="search"
              className="champ__input seances__lieu-champ"
              placeholder="Parc, quartier, adresse…"
              value={endroit}
              onChange={(e) => setEndroit(e.target.value)}
            />
          </div>
          {/* Bouton pour passer de la liste à la carte */}
          <button
            type="button"
            className={vueCarte ? 'seances__bouton-carte seances__bouton-carte--actif' : 'seances__bouton-carte'}
            aria-pressed={vueCarte}
            onClick={() => setVueCarte(!vueCarte)}
          >
            <Icone nom={vueCarte ? 'liste' : 'carte'} className="icone icone--petite" />
            {vueCarte ? 'Liste' : 'Carte'}
          </button>
        </div>

        {/* Les filtres cochés : un clic dessus les enlève */}
        {coches.length > 0 && (
          <div className="seances__pastilles" role="group" aria-label="Filtres cochés">
            {coches.map((c) => (
              <button
                key={c.cle + c.valeur}
                type="button"
                className="filtre filtre--coche"
                aria-label={`${c.texte} (retirer)`}
                onClick={() => retirer(c.cle, c.valeur)}
              >
                <span className="filtre__forme">
                  <Icone nom="verifie" className="icone icone--petite" />
                  {c.texte}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Pendant le chargement */}
      {etat === 'chargement' && (
        <p role="status" className="seances__chargement">
          Chargement…
        </p>
      )}

      {/* Si le chargement a échoué */}
      {etat === 'erreur' && (
        <section className="seances__etat">
          <div className="seances__etat-rond seances__etat-rond--erreur">
            <Icone nom="croix" className="seances__etat-dessin" />
          </div>
          <div role="alert">
            <h2 className="seances__etat-titre">Impossible de charger les séances</h2>
            <p className="seances__etat-texte">Vérifie ta connexion. Tes filtres sont gardés.</p>
          </div>
          <div className="seances__actions">
            <Bouton onClick={() => setEssai(essai + 1)}>Réessayer</Bouton>
            <Bouton variante="secondaire" to="/proposer">
              Proposer ma séance
            </Bouton>
          </div>
        </section>
      )}

      {etat === 'pret' && (
        <>
          {/* Nombre de séances trouvées */}
          <p role="status" className={aucune ? 'visuellement-cache' : 'seances__compteur'}>
            {aucune ? (
              'Aucune séance ne correspond à ta recherche.'
            ) : (
              <>
                <strong className="seances__compteur-nombre">{une ? '1 séance' : `${resultats.length} séances`}</strong>
                <span className="visuellement-cache"> · </span>
                <span>{une ? 'Triée par distance' : 'Triées par distance'}</span>
              </>
            )}
          </p>

          {/* Les séances : sur la carte ou en liste */}
          {!aucune &&
            (vueCarte ? (
              <div className="seances__vue-carte">
                <PlanSeances
                  seances={resultats}
                  centre={[48.857, 2.38]} /* La carte est centrée sur Paris */
                  zoom={12}
                  choisie={seanceChoisie.id}
                  onChoisir={setChoisie}
                />
                <CarteSeance seance={seanceChoisie} idUtilisateur={id} />
              </div>
            ) : (
              <ul className="seances__liste">
                {resultats.map((s) => (
                  <li key={s.id}>
                    <CarteSeance seance={s} idUtilisateur={id} />
                  </li>
                ))}
              </ul>
            ))}

          {/* Si aucune séance n'est trouvée */}
          {aucune && (
            <>
              <section className="seances__etat">
                <div className="seances__etat-rond">
                  <IconeParcours />
                </div>
                <h2 className="seances__etat-titre">Aucune séance trouvée</h2>
                <p className="seances__etat-texte">
                  {phraseVide} : d&apos;autres sportifs te rejoindront.
                </p>
                <div className="seances__actions">
                  {unSeulJour && (
                    <Bouton variante="noir" onClick={() => setFiltres({ ...filtres, jours: ['samedi', 'dimanche'] })}>
                      Élargir à tout le week-end
                    </Bouton>
                  )}
                  {!unSeulJour && quelqueChoseActif && (
                    <Bouton variante="noir" onClick={toutEffacer}>
                      Voir toutes les séances
                    </Bouton>
                  )}
                  <Bouton variante="secondaire" to="/proposer">
                    Proposer ma séance
                  </Bouton>
                </div>
              </section>

              {/* Bouton pour être prévenu quand une séance correspond */}
              <button
                type="button"
                className="seances__alerte"
                aria-pressed={alerte}
                onClick={() => setAlerte(!alerte)}
              >
                <Icone nom="cloche" className="icone seances__alerte-icone" />
                <span>
                  <strong>{alerte ? 'Alerte activée ✓' : "Active l'alerte"}</strong>
                  {`${alerte ? ' — ' : ' : '}on te prévient dès qu'une séance correspond.`}
                </span>
              </button>
            </>
          )}
        </>
      )}
    </main>
  )
}
