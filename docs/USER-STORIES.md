# User Stories — De la Fonte

## MVP

### Epic : Suivi des séances

- **US1** ✅ *(terminée)* — En tant qu'utilisateur, je veux enregistrer une série (exercice, type d'équipement, poids, répétitions, nombre de séries identiques, date) afin de garder une trace de ma séance.
- **US2** — En tant qu'utilisateur, je veux consulter l'historique de mes séries afin de suivre mon activité dans le temps.
- **US3** — En tant qu'utilisateur, je veux filtrer l'historique par exercice afin de voir l'évolution de mes performances sur un exercice précis.
- **US4** — En tant qu'utilisateur, je veux voir la fréquence d'utilisation de chaque exercice, y compris par type d'équipement (machine / poids libre / poids du corps), afin d'identifier mes habitudes d'entraînement.
- **US5** — En tant qu'utilisateur, je veux corriger ou supprimer une série déjà enregistrée afin de rectifier une erreur de saisie.

### Epic : Expérience mobile

- **US6** — En tant qu'utilisateur, je veux installer l'appli sur mon écran d'accueil afin d'y accéder comme une vraie appli.
- **US7** — En tant qu'utilisateur, je veux pouvoir enregistrer une série sans connexion réseau afin de l'utiliser à la salle où le signal est mauvais.

### Epic : Visualisation & statistiques

- **US8** — En tant qu'utilisateur, je veux visualiser un graphique de progression du poids dans le temps, par exercice, afin de suivre ma progression visuellement.
- **US9** — En tant qu'utilisateur, je veux voir des statistiques globales (volume soulevé, répétitions au poids du corps, séances par semaine, exercice le plus pratiqué), y compris par type d'équipement, afin d'avoir une vue d'ensemble de mon activité.

## En cours de planification (formalisées, pas encore codées)

### Epic : Cardio & suivi de séance

- **US10** — En tant qu'utilisateur, je veux enregistrer une séance de cardio (exercice, distance en km, durée en minutes, date) afin de suivre mes activités qui ne relèvent pas de la musculation.
  - **Critères d'acceptation :**
    - [ ] Le modèle de données distingue `StrengthSeries` et `CardioSeries` via une union discriminée (champ `kind`)
    - [ ] Le formulaire propose une saisie adaptée au cardio (exercice, distance, durée) sans les champs muscu (poids, reps, équipement, sets)
    - [ ] Les entrées cardio sont persistées dans la même couche storage que la musculation
  - **Conception détaillée :** journal, point 14.

- **US11** — En tant qu'utilisateur, je veux démarrer et terminer une séance afin que mes séries (muscu et cardio) soient regroupées et que je puisse suivre la durée réelle de mon entraînement.
  - **Critères d'acceptation :**
    - [ ] Entité `Session` (`startedAt`, `endedAt`)
    - [ ] Bouton "Démarrer une séance" / "Terminer la séance"
    - [ ] Une seule séance active à la fois (erreur si tentative d'en démarrer une deuxième)
    - [ ] Chaque `Series` (muscu ou cardio) peut être rattachée à la séance active via `sessionId`, ou rester `null` (saisie libre, hors séance)
    - [ ] Une séance jamais terminée reste "en cours" indéfiniment — pas de fermeture automatique (choix assumé)
  - **Conception détaillée :** journal, point 15.
  - **Note de méthode :** US10 et US11 sont traitées dans une branche commune (`feature/us10-us11-model-refactor`), exception au principe "une branche = une US", justifiée par le couplage fort des deux modèles (`Series` et `Session` évoluent ensemble).

## Backlog V2 (hors périmètre MVP, pas encore priorisé)

### Suivi enrichi

- Entité `Exercice` dédiée (catégorie/groupe musculaire, autocomplétion) plutôt qu'un texte libre
- Segmentation `bodyPart` (haut du corps / bas du corps) — nécessaire pour le système de succès (voir épic Gamification)
- Détection automatique de record personnel (PR)
- Objectifs par exercice (ex: atteindre un poids cible)

### Epic : Gamification — succès à débloquer

- Système de cartes/succès à débloquer façon Steam, selon des jalons (nombre de séances, fréquence, partie du corps, durée d'entraînement via US11)
- Roster de 4 personnages originaux (pixel art) : bas du corps, haut du corps, vétéran (longévité), personnage mystère (régularité, révélé progressivement)
- Dépend de `bodyPart` et de `Session` (US11)
- Conception détaillée : journal, point 16 — seuils de déblocage précis encore à définir

### Autres

- Notion de "programme" / séance type regroupant plusieurs exercices
- Export CSV/JSON de l'historique
- Synchronisation multi-appareils (nécessite un backend + authentification)
- Notifications/rappels, mode sombre, widget écran d'accueil