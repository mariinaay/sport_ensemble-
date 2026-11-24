import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import BarreDuBas from './components/BarreDuBas'
import Accueil from './features/accueil/Accueil'
import AccueilConnecte from './features/accueil/AccueilConnecte'
import Aide from './features/aide/Aide'
import Connexion from './features/compte/Connexion'
import Inscription from './features/compte/Inscription'
import MotDePasseOublie from './features/compte/MotDePasseOublie'
import Notifications from './features/profil/Notifications'
import Profil from './features/profil/Profil'
import Seances from './features/seances/Seances'
import FicheSeance from './features/seances/FicheSeance'
import Confirmation from './features/seances/Confirmation'
import MesSeances from './features/seances/MesSeances'

// Le titre de l'onglet du navigateur pour chaque page (annoncé par les lecteurs d'écran)
const TITRES = {
  '/': 'Bienvenue',
  '/accueil': 'Accueil',
  '/connexion': 'Connexion',
  '/inscription': 'Créer un compte',
  '/mot-de-passe-oublie': 'Mot de passe oublié',
  '/profil': 'Profil',
  '/notifications': 'Notifications',
  '/aide': 'Aide & contact',
  '/seances': 'Séances',
  '/proposer': 'Proposer une séance',
  '/messages': 'Messages',
  '/mes-seances': 'Mes séances',
  '/profil/avis': 'Mes avis reçus',
}

// Pages sans barre du bas (on n'est pas encore connecté)
const PAGES_SANS_BARRE = ['/', '/connexion', '/inscription', '/mot-de-passe-oublie']

// Page vide (pas encore codée) : seulement son titre
function PageVide({ titre }) {
  return (
    <main id="contenu" className="page">
      <h1>{titre}</h1>
    </main>
  )
}

export default function App() {
  // À chaque changement de page : « Connexion · Sport Ensemble »
  const { pathname, search } = useLocation()
  useEffect(() => {
    document.title = `${TITRES[pathname] ?? 'Page'} · Sport Ensemble`
  }, [pathname])

  const avecBarre = !PAGES_SANS_BARRE.includes(pathname) && !/^\/seances\/\d+/.test(pathname)

  return (
    <div className={avecBarre ? 'app app--avec-barre' : 'app'}>
      <a href="#contenu" className="lien-evitement">
        Aller au contenu
      </a>

      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/aide" element={<Aide />} />
        <Route path="/accueil" element={<AccueilConnecte />} />
        {/* key : la page repart de zéro quand on arrive d'une tuile sport (?sport=…) */}
        <Route path="/seances" element={<Seances key={search} />} />

        {/* Pages pas encore codées */}
        <Route path="/seances/:id" element={<FicheSeance />} />
        <Route path="/seances/:id/confirmation" element={<Confirmation />} />
        <Route path="/messages" element={<PageVide titre="Messages" />} />
        <Route path="/proposer" element={<PageVide titre="Proposer une séance" />} />
        <Route path="/mes-seances" element={<MesSeances />} />
        <Route path="/profil/avis" element={<PageVide titre="Mes avis reçus" />} />

        {/* Adresse inconnue : retour à l'accueil */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {avecBarre && <BarreDuBas />}
    </div>
  )
}
