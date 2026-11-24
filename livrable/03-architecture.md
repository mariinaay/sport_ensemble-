# 3. Architecture du projet

## Arborescence

```
sport_ensemble-/
├── index.html
├── package.json
├── vite.config.js
├── database/
│   └── db.json
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── assets/
    │   └── img/
    │       ├── accueil.jpg
    │       └── motif-parcours.svg
    ├── components/
    │   ├── BarreDuBas.jsx
    │   ├── Bouton.jsx
    │   ├── CarteSeance.jsx
    │   ├── carte-seance.css
    │   ├── Champ.jsx
    │   ├── EtatChargement.jsx
    │   ├── Icone.jsx
    │   ├── LienRetour.jsx
    │   ├── Message.jsx
    │   ├── PastilleSport.jsx
    │   ├── PlanSeances.jsx
    │   └── plan-seances.css
    ├── features/
    │   ├── accueil/
    │   │   ├── Accueil.jsx
    │   │   ├── AccueilConnecte.jsx
    │   │   ├── accueil.css
    │   │   └── accueil-connecte.css
    │   ├── compte/
    │   │   ├── Connexion.jsx
    │   │   ├── Inscription.jsx
    │   │   ├── MotDePasseOublie.jsx
    │   │   ├── useFormulaire.js
    │   │   └── compte.css
    │   ├── seances/
    │   │   ├── Seances.jsx
    │   │   ├── FeuilleFiltres.jsx
    │   │   ├── filtres.js
    │   │   ├── FicheSeance.jsx
    │   │   ├── Confirmation.jsx
    │   │   ├── MesSeances.jsx
    │   │   ├── seances.css
    │   │   └── mes-pages.css
    │   ├── profil/
    │   │   ├── Profil.jsx
    │   │   ├── LigneMenu.jsx
    │   │   ├── FormulaireInfos.jsx
    │   │   ├── FormulaireEmail.jsx
    │   │   ├── FormulaireMotDePasse.jsx
    │   │   ├── Notifications.jsx
    │   │   └── profil.css
    │   └── aide/
    │       ├── Aide.jsx
    │       └── aide.css
    ├── services/
    │   ├── api.js
    │   ├── compte.js
    │   ├── profil.js
    │   ├── seances.js
    │   ├── mes-seances.js
    │   ├── aide.js
    │   └── session.js
    ├── styles/
    │   ├── variables.css
    │   ├── theme.css
    │   └── global.css
    └── utils/
        ├── constants.js
        └── validation.js
```

## Rôle des dossiers

- **database** : les données de l'API (`db.json`).
- **assets** : les images.
- **components** : éléments utilisés sur plusieurs pages (bouton, champ, barre de navigation…).
- **features** : chaque dossier contient les pages d'une fonctionnalité et leur CSS.
- **services** : toutes les requêtes vers l'API.
- **styles** : couleurs, polices et style général.
- **utils** : constantes et vérification des formulaires.
- **App.jsx** : la liste des pages (routes).
- **main.jsx** : le point d'entrée qui lance l'application.

## Pourquoi cette organisation

- On trouve facilement les fichiers d'une fonctionnalité.
- Chaque membre travaille dans son dossier, donc moins de conflits Git.
- Les appels à l'API sont au même endroit : facile de changer pour le vrai back-end.
