// Petites icônes décoratives (cachées aux lecteurs d'écran)
const DESSINS = {
  calendrier: <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 10h18M8 3v4M16 3v4" />,
  personne: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 3.6-7 8-7s8 3 8 7" />,
  etoile: <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z" />,
  cloche: <path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 21h4" />,
  aide: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9.5a2.5 2.5 0 0 1 5 0c0 1.7-2.5 2-2.5 4M12 17h.01" />,
  cadenas: <path d="M6 11h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1zM8 11V8a4 4 0 0 1 8 0v3" />,
  maison: <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" />,
  liste: <path d="M5 7h14M5 12h14M5 17h14" />,
  plus: <path d="M12 5v14M5 12h14" />,
  chevron: <path d="M9 6l6 6-6 6" />,
  verifie: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  // Sports
  course: <path d="M13 4.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0zM6 12l3-3 4 1 3 4h3M11 10l-2 5 4 2-1 4M9 15l-4 5" />,
  velo: <path d="M5.5 18.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM18.5 18.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM5.5 15l4-7h6l3 7M9.5 8 12 15h-6.5M14 5h3" />,
  padel: <path d="M14.5 3a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zM9.8 13.7 4 19.5 5.5 21l5.8-5.8M5 6a1.5 1.5 0 1 0 0-.01" />,
  foot: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 8l3.5 2.5-1.3 4h-4.4l-1.3-4zM12 3v5M15.5 10.5l5-1.5M14.2 14.5l3 4.5M9.8 14.5l-3 4.5M8.5 10.5l-5-1.5" />,
  rando: <path d="M3 20h18L14.5 8l-3.5 6-2-3zM12.5 11.5 14.5 8l2 3.5" />,
  tennis: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM5.6 5.6a9 9 0 0 1 0 12.8M18.4 5.6a9 9 0 0 0 0 12.8" />,
  natation: <path d="M2 18c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5M15 7.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0zM5 14l4-4 3 2 2-2.5" />,
  basket: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3v18M5.6 5.6c3 3 3 9.8 0 12.8M18.4 5.6c-3 3-3 9.8 0 12.8" />,
  yoga: <path d="M12 6.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM12 9v6M6 11l6-2 6 2M8 21l4-6 4 6M5 21h14" />,
  escalade: <path d="M4 21 12 4l8 17M9 12h2M13 16h2M10.5 8.5h2" />,
  // Détails d'une séance
  repere: <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />,
  allure: <path d="M3 12h4l2.5-6 5 12 2.5-6h4" />,
  distance: <path d="M4 17c3 0 3-4 6-4s3 4 6 4 3-4 4-4M4 7h4M16 7h4" />,
  niveau: <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5.5a3 3 0 0 1 0 5.5M18 14.5c1.8.8 3 2.8 3 5.5" />,
  trophee: <path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M9 17h6v4H9z" />,
  joueurs: <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5.5a3 3 0 0 1 0 5.5M18 14.5c1.8.8 3 2.8 3 5.5" />,
  prix: <path d="M4 6h16M4 12h16M4 18h10" />,
  horloge: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2" />,
  reglages: <path d="M4 7h10M18 7h2M4 17h4M12 17h8M14 4v6M8 14v6" />,
  loupe: <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4" />,
  croix: <path d="M6 6l12 12M18 6 6 18" />,
  carte: <path d="M9 4 3 6.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5zM9 4v13.5M15 6.5V20" />,
  fleche: <path d="M5 12h14M13 6l6 6-6 6" />,
}

export default function Icone({ nom, className = 'icone' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {DESSINS[nom]}
    </svg>
  )
}
