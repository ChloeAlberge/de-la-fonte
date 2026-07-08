# User Stories — De la Fonte

## MVP

### Epic : Suivi des séances

- **US1** — En tant qu'utilisateur, je veux enregistrer une série (machine, poids, répétitions, date) afin de garder une trace de ma séance.
- **US2** — En tant qu'utilisateur, je veux consulter l'historique de mes séries afin de suivre mon activité dans le temps.
- **US3** — En tant qu'utilisateur, je veux filtrer l'historique par machine afin de voir l'évolution de mes performances sur un exercice précis.
- **US4** — En tant qu'utilisateur, je veux voir la fréquence d'utilisation de chaque machine afin d'identifier mes habitudes d'entraînement.
- **US5** — En tant qu'utilisateur, je veux corriger ou supprimer une série déjà enregistrée afin de rectifier une erreur de saisie.

### Epic : Expérience mobile

- **US6** — En tant qu'utilisateur, je veux installer l'appli sur mon écran d'accueil afin d'y accéder comme une vraie appli.
- **US7** — En tant qu'utilisateur, je veux pouvoir enregistrer une série sans connexion réseau afin de l'utiliser à la salle où le signal est mauvais.

### Epic : Visualisation & statistiques

- **US8** — En tant qu'utilisateur, je veux visualiser un graphique de progression du poids dans le temps, par machine, afin de suivre ma progression visuellement.
- **US9** — En tant qu'utilisateur, je veux voir des statistiques globales (volume total soulevé, nombre de séances par semaine, machine la plus utilisée) afin d'avoir une vue d'ensemble de mon activité.

## Backlog V2 (hors périmètre MVP)

- Entité `Machine` dédiée (catégorie, autocomplétion) plutôt qu'un texte libre
- Détection automatique de record personnel (PR)
- Objectifs par machine (ex: atteindre un poids cible)
- Notion de "programme" / séance type regroupant plusieurs machines
- Export CSV/JSON de l'historique
- Synchronisation multi-appareils (nécessite un backend + authentification)
- Notifications/rappels, mode sombre, widget écran d'accueil