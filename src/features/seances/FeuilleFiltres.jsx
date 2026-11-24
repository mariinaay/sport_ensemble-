import { useEffect, useRef } from 'react'
import Bouton from '../../components/Bouton'
import Icone from '../../components/Icone'
import { nomCourt, TOUS_LES_SPORTS } from '../../utils/constants'
import { FILTRES_VIDES, GROUPES } from './filtres'

// Fenêtre des filtres de la page Séances
export default function FeuilleFiltres({ filtres, setFiltres, nombre, onFermer }) {
  const feuille = useRef(null)

  // Quand la fenêtre s'ouvre : on bloque la page derrière et la touche Échap ferme la fenêtre
  useEffect(() => {
    const boutonFiltres = document.activeElement // on retient le bouton « Filtres »
    feuille.current.focus()
    document.body.style.overflow = 'hidden'

    const touche = (e) => {
      if (e.key === 'Escape') onFermer()

      // La touche Tab reste dans la fenêtre : après le dernier bouton, on revient au premier
      if (e.key === 'Tab') {
        const boutons = feuille.current.querySelectorAll('button')
        const premier = boutons[0]
        const dernier = boutons[boutons.length - 1]
        if (e.shiftKey && document.activeElement === premier) {
          e.preventDefault()
          dernier.focus()
        } else if (!e.shiftKey && document.activeElement === dernier) {
          e.preventDefault()
          premier.focus()
        }
      }
    }
    document.addEventListener('keydown', touche)

    // Quand la fenêtre se ferme : on remet tout comme avant et on revient sur le bouton « Filtres »
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', touche)
      boutonFiltres?.focus()
    }
  }, [onFermer])

  // Coche ou décoche un filtre
  function basculer(cle, valeur) {
    const liste = filtres[cle]
    setFiltres({ ...filtres, [cle]: liste.includes(valeur) ? liste.filter((v) => v !== valeur) : [...liste, valeur] })
  }

  // Texte du bouton en bas selon le nombre de séances trouvées
  let texteBouton = `Voir ${nombre} séances`
  if (nombre === 0) texteBouton = 'Aucune séance'
  else if (nombre === 1) texteBouton = 'Voir 1 séance'

  return (
    <>
      {/* Fond gris : un clic dessus ferme la fenêtre */}
      <div className="feuille-fond" onClick={onFermer} aria-hidden="true" />

      <div className="feuille" role="dialog" aria-modal="true" aria-labelledby="titre-filtres" tabIndex={-1} ref={feuille}>
        <span className="feuille__poignee" aria-hidden="true" />

        {/* Titre et bouton Réinitialiser */}
        <div className="feuille__entete">
          <h2 id="titre-filtres">Filtres</h2>
          <button type="button" className="feuille__reinitialiser" onClick={() => setFiltres(FILTRES_VIDES)}>
            Réinitialiser
          </button>
        </div>

        {/* Choix des sports */}
        <div className="feuille__sports" role="group" aria-label="Sports">
          {TOUS_LES_SPORTS.map((sport) => (
            <button
              key={sport.value}
              type="button"
              className={`tuile-filtre sport--${sport.value}`}
              aria-pressed={filtres.sports.includes(sport.value)}
              aria-label={sport.label}
              onClick={() => basculer('sports', sport.value)}
            >
              <Icone nom={sport.value} />
              <span aria-hidden="true">{nomCourt(sport.value)}</span>
            </button>
          ))}
        </div>

        {/* Les autres filtres (jour, niveau, distance…) */}
        {GROUPES.map((groupe) => (
          <fieldset key={groupe.cle} className="feuille__groupe">
            <legend>{groupe.titre}</legend>
            {groupe.choix.map((choix) => {
              const coche = filtres[groupe.cle].includes(choix.value)
              return (
                <button
                  key={choix.value}
                  type="button"
                  className="choix"
                  aria-pressed={coche}
                  onClick={() => basculer(groupe.cle, choix.value)}
                >
                  {coche && <Icone nom="verifie" className="icone icone--petite" />}
                  {choix.label}
                </button>
              )
            })}
          </fieldset>
        ))}

        {/* Bouton pour fermer et voir les résultats */}
        <div className="feuille__pied">
          <Bouton onClick={onFermer}>{texteBouton}</Bouton>
        </div>
      </div>
    </>
  )
}
