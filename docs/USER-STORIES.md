# User Stories : De la Fonte

## Terminé (MVP complet)

### Epic : Suivi des séances

- **US1** ✅ : En tant qu'utilisateur, je veux enregistrer une série (exercice, type d'équipement, poids, répétitions, nombre de séries identiques, date) afin de garder une trace de ma séance.
- **US2** ✅ : En tant qu'utilisateur, je veux consulter l'historique de mes séries afin de suivre mon activité dans le temps.
- **US3** ✅ : En tant qu'utilisateur, je veux filtrer l'historique par exercice afin de voir l'évolution de mes performances sur un exercice précis.
- **US4** ✅ : En tant qu'utilisateur, je veux voir la fréquence d'utilisation de chaque exercice (nombre de séries et jours distincts), y compris par type d'équipement, afin d'identifier mes habitudes d'entraînement.
- **US5** ✅ : En tant qu'utilisateur, je veux corriger ou supprimer une série déjà enregistrée afin de rectifier une erreur de saisie.

### Epic : Cardio et suivi de séance

- **US10** ✅ : En tant qu'utilisateur, je veux enregistrer une séance de cardio (exercice, distance en km, durée en minutes, date) afin de suivre mes activités qui ne relèvent pas de la musculation.
- **US11** ✅ : En tant qu'utilisateur, je veux démarrer et terminer une séance afin que mes séries (muscu et cardio) soient regroupées et que je puisse suivre la durée réelle de mon entraînement.

### Epic : Visualisation et statistiques

- **US8** ✅ : En tant qu'utilisateur, je veux visualiser un graphique de progression du poids dans le temps, par exercice, afin de suivre ma progression visuellement.
- **US9** ✅ : En tant qu'utilisateur, je veux voir des statistiques globales (volume soulevé, répétitions au poids du corps, séances par semaine, exercice le plus pratiqué), y compris par type d'équipement, afin d'avoir une vue d'ensemble de mon activité.

### Epic : Identité visuelle

- **US12 (epic)** ✅ : En tant qu'utilisatrice, je veux une interface visuelle cohérente et lisible (HUD néon cyberpunk pour le tableau de bord, terminal phosphore vert pour la saisie) afin que l'appli soit réellement utilisable au quotidien, pas seulement fonctionnelle.
  - **US12.1** ✅ : Design tokens (polices Orbitron/Chakra Petch/Share Tech Mono/VT323, palette néon, styles globaux)
  - **US12.2** ✅ : Dashboard HUD (header, indicateur de séance, tuiles de stats, historique), version mobile-first
  - **US12.3** ✅ : Style néon du graphique de progression (recharts)
  - **US12.4** ✅ : Modales terminal (formulaires de saisie muscu/cardio en modale, esthétique phosphore vert années 80)
  - **US12.5** ✅ : Transition "commutation d'écran" entre dashboard et modales

### Epic : Expérience mobile

- **US6** ✅ : En tant qu'utilisateur, je veux installer l'appli sur mon écran d'accueil afin d'y accéder comme une vraie appli.
- **US7** ✅ : En tant qu'utilisateur, je veux pouvoir enregistrer une série sans connexion réseau afin de l'utiliser à la salle où le signal est mauvais.

**MVP complet.** Toutes les User Stories planifiées sont terminées et vérifiées concrètement (installation et mode hors ligne testés, pas seulement supposés).

## À prioriser (identifiées en cours de route, pas encore planifiées)

### Epic : Gamification, succès à débloquer

- Système de cartes/succès à débloquer façon Steam, selon des jalons (nombre de séances, fréquence, partie du corps, durée d'entraînement via US11)
- Roster de 4 personnages originaux (pixel art) : bas du corps, haut du corps, vétéran (longévité, premier personnage esquissé : Patrick), personnage mystère (régularité, révélé progressivement)
- Dépend de la segmentation `bodyPart` et de `Session` (US11)
- Conception détaillée : journal, points 15-16

- **US13** : En tant qu'utilisatrice, je veux un profil (nom d'affichage, avatar choisi parmi les personnages, succès débloqués visibles) afin de personnaliser mon expérience et visualiser ma progression de façon incarnée.
  - Dépend d'US12 (identité visuelle) pour s'intégrer au bon style
  - Rejoint le roster de personnages et le système de succès ci-dessus
  - Conception : journal, point 28

### Epic : Catalogue d'exercices

- **US14** ✅ : En tant qu'utilisatrice, je veux choisir mon exercice dans un catalogue filtrable par partie du corps (avec une option "Autre" personnalisée) afin d'enrichir mes statistiques sans perdre la liberté de saisie.
  - Conception détaillée : journal, point 33

## Backlog V2 (hors périmètre proche)

- Détection automatique de record personnel (PR)
- Objectifs par exercice (ex : atteindre un poids cible)
- Notion de "programme" / séance type regroupant plusieurs exercices
- Export CSV/JSON de l'historique
- Synchronisation multi-appareils (nécessite un backend et une authentification)
- Notifications/rappels, widget écran d'accueil