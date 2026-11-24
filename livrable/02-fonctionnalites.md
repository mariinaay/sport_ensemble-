# 2. Identification des fonctionnalités

## Fonctionnalités principales

1. Inscription
2. Connexion
3. Mot de passe oublié
4. Accueil
5. Liste des séances, avec filtres et carte
6. Détail d'une séance
7. Rejoindre ou quitter une séance
8. Mes séances
9. Profil
10. Notifications
11. Aide et formulaire de contact

## Fonctionnalités qui communiquent avec l'API

| # | Fonctionnalité | Requête |
|---|---|---|
| 1 | Inscription | `POST /users` |
| 2 | Connexion | `GET /users?email=...` |
| 3 | Mot de passe oublié | `GET /users?email=...` |
| 4 | Accueil | `GET /users/:id` et `GET /sessions` |
| 5 | Liste des séances | `GET /sessions` |
| 6 | Détail d'une séance | `GET /sessions/:id` |
| 7 | Rejoindre une séance | `POST /registrations` |
| 7 | Quitter une séance | `DELETE /registrations/:id` |
| 8 | Mes séances | `GET /registrations?userId=...` |
| 9 | Profil | `GET /users/:id` et `PATCH /users/:id` |
| 10 | Notifications | `PATCH /users/:id` |
| 11 | Formulaire de contact | `POST /messages` |

## Données échangées

- **Utilisateur** : prénom, nom, email, mot de passe, ville, sports, notifications
- **Séance** : sport, titre, date, heure, lieu, niveau, nombre de places, organisateur
- **Inscription** : id de la séance, id de l'utilisateur
- **Message** : email, sujet, message
