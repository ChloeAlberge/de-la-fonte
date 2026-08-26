# De la Fonte

Application mobile (PWA) de suivi de performances de musculation et cardio : machine ou exercice utilisé, poids soulevé, fréquence d'entraînement, évolution dans le temps, et un système de succès à débloquer selon la progression.

Voir [`docs/JOURNAL-DE-CONCEPTION.md`](docs/JOURNAL-DE-CONCEPTION.md) pour le détail des décisions d'architecture et leur justification, et [`docs/USER-STORIES.md`](docs/USER-STORIES.md) pour le périmètre fonctionnel.

**Démo en ligne** : [chloealberge.github.io/de-la-fonte](https://chloealberge.github.io/de-la-fonte/)

## Fonctionnalités

- Suivi de séances de musculation (machine, poids libre, poids du corps) et de cardio
- Catalogue de ~130 exercices avec autocomplétion et segmentation par partie du corps
- Gestion de séances (démarrer/terminer), avec regroupement automatique des séries
- Historique filtrable, fréquence par exercice et par type d'équipement
- Statistiques globales (volume soulevé, séances par semaine, exercice le plus pratiqué)
- Graphique de progression par exercice
- Système de succès à débloquer (27 succès, 5 personnages), profil utilisateur
- Installable comme une application (PWA), fonctionne hors connexion

## Stack technique

| Domaine | Choix |
|---|---|
| Framework UI | React |
| Langage | TypeScript |
| Build tool | Vite |
| Stockage | `localStorage` |
| Tests | Vitest, @testing-library/react |
| PWA | vite-plugin-pwa |
| Visualisation | Recharts |

## Architecture

Architecture en couches, isolant le stockage de la logique métier et de l'affichage :

```
UI (composants React)
   ↓
Statistiques (calculs dérivés)
   ↓
Storage (accès aux données)
   ↓
Models (types partagés)
```

Modélisation par unions discriminées (types de séries, déclencheurs de succès) pour garantir à la compilation la cohérence des données selon leur variante. Détail complet dans le [journal de conception](docs/JOURNAL-DE-CONCEPTION.md).

## Installation

```bash
npm install
npm run dev
```

## Tests

```bash
npm test
```

## Build

```bash
npm run build
```