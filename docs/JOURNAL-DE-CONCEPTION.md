# Journal de conception — De la Fonte

Ce document trace les questionnements, options envisagées et décisions prises pendant la conception du projet, dans l'ordre chronologique.

---

## 1. Type d'application

**Question** — Appli web classique, PWA installable, ou appli native ?

**Options envisagées**
- Appli web simple (utilisable dans le navigateur du téléphone)
- PWA (Progressive Web App) installable sur l'écran d'accueil, avec support hors ligne
- Appli native (React Native, Swift/Kotlin...)

**Décision** — PWA.

**Justification** — Installable comme une vraie appli, fonctionne hors ligne (utile en salle de sport où le réseau est mauvais), sans passer par un store ni apprendre un langage natif séparé.

---

## 2. Framework front-end

**Question** — Quel framework pour construire l'interface ?

**Options envisagées**
- Vanilla JS (aucun framework)
- React
- Vue
- Angular
- Svelte

**Décision** — React, sans framework "complet" imposant une architecture (donc pas Angular).

**Justification** — Angular impose sa propre architecture (Dependency Injection, modules, structure de dossiers) : l'utiliser aurait démontré une capacité à *respecter* un cadre existant, pas à en *concevoir* un. Pour un objectif d'apprentissage de l'architecture logicielle, concevoir sa propre organisation en couches (storage / logique / UI) avec React est plus formateur et plus démonstratif d'une compétence de conception.

---

## 3. Langage

**Question** — JavaScript ou TypeScript ?

**Décision** — TypeScript.

**Justification** — Impose un typage explicite des contrats de données entre les couches (ex: la forme d'une `Series`), ce qui structure la réflexion de conception et réduit une classe entière de bugs. Standard de facto sur les projets React sérieux.

---

## 4. Outil de build

**Question** — Vite ou Next.js ?

**Options envisagées**
- **Vite** — outil de build, génère une SPA (Single Page Application) classique
- **Next.js** — framework complet avec rendu serveur (SSR/SSG), routing par fichiers, API routes

**Décision** — Vite.

**Justification** — Next.js résout des problèmes qu'on n'a pas ici : SEO, temps de chargement initial d'un site public. Le SSR ajoute de la complexity (hydratation) qui entre en friction avec l'architecture offline-first qu'on veut construire. Vite donne une SPA pure qui tourne entièrement côté client, cohérente avec le choix "pas de backend" (voir point 6).

---

## 5. Architecture en couches

**Question** — Comment organiser le code pour qu'il soit lisible, testable et évolutif ?

**Décision** — Séparation en 4 couches :

```
UI (composants React)
   ↓
Logique dérivée / statistiques
   ↓
Storage (accès aux données)
   ↓
Models (types partagés)
```

**Justification** — Isoler la couche de stockage du reste permet de faire évoluer la persistance (ex: passer de `localStorage` à une API en V2) sans toucher à l'UI ni à la logique métier. La couche "statistiques" est séparée du stockage brut car elle *dérive* des données plutôt que de les stocker (ex: fréquence d'utilisation, machine la plus utilisée).

---

## 6. Stockage des données

**Question** — Comment et où stocker les séries de musculation ?

**Options envisagées**
- `localStorage` (stockage clé-valeur du navigateur)
- `IndexedDB` (base de données du navigateur, plus complexe)
- Backend distant (API + base de données serveur)

**Décision** — `localStorage` pour le MVP, backend explicitement écarté pour cette phase.

**Justification** — Le MVP est un usage solo, sur un seul appareil, sans besoin de partager les données entre plusieurs utilisateurs ou plusieurs appareils. `localStorage` suffit largement en volume (~5-10 Mo) et en simplicité. Un backend n'apporterait aucune valeur tant que le besoin de synchronisation multi-appareils ne se confirme pas (principe **YAGNI** — *You Aren't Gonna Need It*) ; ce choix est documenté explicitement pour ne pas être lu comme un oubli.

---

## 7. Périmètre du MVP — User Stories

**Question** — Quelles fonctionnalités appartiennent au MVP vs à une V2 ?

**Décision** — Voir `docs/USER-STORIES.md` pour la liste complète.

**Point notable** — Les statistiques et la visualisation (graphique de progression, statistiques globales) ont été initialement classées en "nice-to-have V2", puis remontées dans le périmètre MVP après réflexion : elles apportent une valeur d'usage suffisamment centrale pour ne pas être reportées.

---

## 8. Gestion de projet

**Question** — Comment structurer le suivi du projet (dépôt, tickets, branches) ?

**Décision** — Dépôt GitHub créé et géré manuellement, sans automatisation ni outil tiers pour cette étape.

**Justification** — Choix délibéré de faire les manipulations soi-même (création du repo, premier commit, connexion du remote) plutôt que de les déléguer, pour ancrer la pratique Git/GitHub.

---

## 9. Nom du projet

**Décision** — "De la Fonte" (nom d'affichage) / `de-la-fonte` (slug technique pour le dossier, `package.json`, et le nom du dépôt GitHub).

---

## Décisions en attente

- Structure de test détaillée (Vitest) — à documenter à l'implémentation
- Détail du pipeline CI (GitHub Actions) — à documenter à sa mise en place
- Découpage éventuel en ADR individuels si le nombre de décisions futures le justifie