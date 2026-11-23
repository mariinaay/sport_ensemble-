import Bouton from '../../components/Bouton'
import PastilleSport from '../../components/PastilleSport'
import { SPORTS } from '../../utils/constants'
import './accueil.css'

// La page d'accueil (maquette 01)
export default function Accueil() {
  return (
    <main id="contenu" className="splash">
      <p className="splash__surtitre">Sport ensemble</p>
      <h1>Fais du sport avec des gens fiables.</h1>
      <p>
        Course, vélo, padel, foot, rando : rejoins une séance près de chez toi.
        Chaque profil est vérifié.
      </p>

      <ul className="splash__pastilles" aria-label="Sports proposés">
        {SPORTS.map((sport) => (
          <li key={sport.value}>
            <PastilleSport sport={sport.value} />
          </li>
        ))}
      </ul>

      <div className="splash__actions">
        <Bouton to="/inscription">Inscris-toi</Bouton>
        <Bouton to="/connexion" variante="secondaire">J’ai déjà un compte</Bouton>
      </div>
    </main>
  )
}
