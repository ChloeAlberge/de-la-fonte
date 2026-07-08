# De la Fonte

Application mobile (PWA) de suivi de performances de musculation : machine utilisée, poids soulevé, fréquence d'entraînement et évolution dans le temps.

Projet personnel développé pour remplacer un suivi papier/notes par une appli installée sur téléphone, utilisable hors ligne à la salle.

Voir [`docs/JOURNAL-DE-CONCEPTION.md`](docs/JOURNAL-DE-CONCEPTION.md) pour le détail des décisions techniques et leur justification, et [`docs/USER-STORIES.md`](docs/USER-STORIES.md) pour le périmètre fonctionnel détaillé.

## Stack technique

| Domaine | Choix | Pourquoi (résumé — détail dans le journal) |
|---|---|---|
| Framework UI | React | Architecture non imposée → à concevoir et justifier soi-même |
| Langage | TypeScript | Typage des contrats entre couches, rigueur attendue en architecture |
| Build tool | Vite | Pas de SSR nécessaire (PWA offline-first, pas de SEO à gérer) |
| Stockage (MVP) | `localStorage` | Suffisant pour un usage solo, pas de backend nécessaire au MVP |
| Tests | Vitest | Intégré nativement à l'écosystème Vite |
| CI | GitHub Actions | Lint + tests automatiques à chaque push |

## Architecture (résumé)

Architecture en couches, pensée pour isoler le stockage du reste (pour pouvoir migrer `localStorage` → une API en V2 sans toucher l'UI) :

```
UI (composants React)
   ↓
Logique dérivée / statistiques (calculs à partir des données)
   ↓
Storage (accès aux données, actuellement localStorage)
   ↓
Models (types TypeScript partagés)
```

## Installation

```bash
npm install
npm run dev
```

## Statut du projet

En cours de conception — aucune ligne de code métier écrite pour l'instant, phase de spécification en cours.