# 1. Choix de la stack technique

## Technologies utilisées

- **React** : pour créer l'interface
- **React Router** : pour la navigation entre les pages
- **Vite** : pour lancer et construire le projet
- **CSS** : pour le style
- **Leaflet** : pour afficher la carte des séances
- **json-server** : pour simuler l'API du back-end

## Pourquoi ces choix

**React**
- Besoin : beaucoup d'éléments qui se répètent (cartes de séance, boutons, champs).
- Pourquoi : on crée un composant une fois et on le réutilise partout. L'écran se met à jour tout seul (filtres, inscription).

**React Router**
- Besoin : une douzaine de pages et une barre de navigation.
- Pourquoi : chaque page a son adresse et on change de page sans recharger, comme une appli mobile.

**Vite**
- Besoin : travailler vite à plusieurs.
- Pourquoi : démarre en une seconde, presque rien à configurer.

**CSS**
- Besoin : suivre notre maquette, avec une couleur par sport.
- Pourquoi : les couleurs sont au même endroit, donc toutes les pages ont le même style. Pas besoin de framework.

**Leaflet**
- Besoin : voir les séances près de chez soi.
- Pourquoi : carte gratuite et sans clé d'API, contrairement à Google Maps.

**json-server**
- Besoin : récupérer et envoyer des données alors que le back-end n'était pas prêt.
- Pourquoi : crée une API à partir d'un fichier `db.json`. On pourra passer au vrai back-end en changeant juste l'adresse.
