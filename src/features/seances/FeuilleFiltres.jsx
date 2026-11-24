import { useEffect, useRef } from 'react'
import Bouton from '../../components/Bouton'
import Icone from '../../components/Icone'
import { nomCourt, TOUS_LES_SPORTS } from '../../utils/constants'
import { FILTRES_VIDES, GROUPES } from './filtres'

// Feuille « Filtres » qui monte du bas de l'écran (bouton réglages de la page Séances)
export default function FeuilleFiltres({ filtres, setFiltres, nombre, onFermer }) {
  const feuille = useRef(null)

  // À l'ouverture : focus dans la feuille, la page derrière ne défile plus, Échap ferme
  useEffect(() => {
    feuille.current.focus()
    document.body.style.overflow = 'hidden'
    const touche = (e) => {
      if (e.key === 'Escape') onFermer()
    }
    document.addEventListener('keydown', touche)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', touche)
    }
  }, [onFermer])

  // Coche ou décoche un choix dans un groupe (ex. 'jours', 'dimanche')
  function basculer(cle, valeur) {
    const liste = filtres[cle]
    setFiltres({ ...filtres, [cle]: liste.includes(valeur) ? liste.filter((v) => v !== valeur) : [...liste, valeur] })
  }

  let texteBouton = `Voir ${nombre} séances`
  if (nombre === 0) texteBouton = 'Aucune séance'
  else if (nombre === 1) texteBouton = 'Voir 1 séance'

  return (
    <>
      {/* Fond sombre : un clic dessus ferme la feuille */}
      <div className="feuille-fond" onClick={onFermer} aria-hidden="true" />

      <div className="feuille" role="dialog" aria-modal="true" aria-labelledby="titre-filtres" tabIndex={-1} ref={feuille}>
        <span className="feuille__poignee" aria-hidden="true" />

        <div className="feuille__entete">
          <h2 id="titre-filtres">Filtres</h2>
          <button type="button" className="feuille__reinitialiser" onClick={() => setFiltres(FILTRES_VIDES)}>
            Réinitialiser
          </button>
        </div>

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

        <div className="feuille__pied">
          <Bouton onClick={onFermer}>{texteBouton}</Bouton>
        </div>
      </div>
    </>
  )
}
