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

**Justification** — Angular impose sa propre architecture (Dependency Injection, modules, structure de dossiers) : l'utiliser aurait démontré une capacité à *respecter* un cadre existant, pas à en *concevoir* un. Concevoir sa propre organisation en couches (storage / logique / UI) avec React est plus formateur pour une compétence de conception.

---

## 3. Langage

**Question** — JavaScript ou TypeScript ?

**Décision** — TypeScript.

**Justification** — Impose un typage explicite des contrats de données entre les couches (ex: la forme d'une `Series`), ce qui structure la réflexion de conception et réduit une classe entière de bugs.

---

## 4. Outil de build

**Question** — Vite ou Next.js ?

**Options envisagées**
- **Vite** — outil de build, génère une SPA (Single Page Application) classique
- **Next.js** — framework complet avec rendu serveur (SSR/SSG), routing par fichiers, API routes

**Décision** — Vite.

**Justification** — Next.js résout des problèmes qu'on n'a pas ici : SEO, temps de chargement initial d'un site public. Le SSR ajoute de la complexité (hydratation) qui entre en friction avec l'architecture offline-first qu'on veut construire. Vite donne une SPA pure qui tourne entièrement côté client, cohérente avec le choix "pas de backend" (point 6).

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

**Justification** — Isoler la couche de stockage permet de faire évoluer la persistance (ex: `localStorage` → API en V2) sans toucher à l'UI ni à la logique métier. La couche "statistiques" est séparée du stockage brut car elle *dérive* des données plutôt que de les stocker.

---

## 6. Stockage des données

**Question** — Comment et où stocker les séries ?

**Options envisagées**
- `localStorage` (stockage clé-valeur du navigateur)
- `IndexedDB` (base de données du navigateur, plus complexe)
- Backend distant (API + base de données serveur)

**Décision** — `localStorage` pour le MVP, backend explicitement écarté pour cette phase.

**Justification** — Usage solo, un seul appareil, pas de partage de données entre utilisateurs/appareils. `localStorage` suffit largement (~5-10 Mo). Un backend n'apporterait aucune valeur tant que le besoin de synchronisation multi-appareils ne se confirme pas (principe **YAGNI**) ; ce choix est documenté explicitement pour ne pas être lu comme un oubli.

---

## 7. Périmètre du MVP — User Stories

**Décision** — Voir `docs/USER-STORIES.md` pour la liste complète.

**Point notable** — Les statistiques et la visualisation ont été initialement classées en "nice-to-have V2", puis remontées dans le périmètre MVP après réflexion.

---

## 8. Gestion de projet

**Décision** — Dépôt GitHub créé et géré manuellement. Stratégie de branches : une branche par feature (`feature/us1-...`), fusionnée dans `main` via Pull Request (GitHub Flow).

**Justification** — Choix délibéré de faire les manipulations soi-même pour ancrer la pratique Git/GitHub. Une branche "conception" permanente a été envisagée puis écartée : une branche est faite pour être fusionnée, pas pour héberger indéfiniment de la documentation — les docs de conception vivent directement sur `main`.

---

## 9. Nom du projet

**Décision** — "De la Fonte" (nom d'affichage) / `de-la-fonte` (slug technique).

---

## 10. Généralisation au-delà des machines

**Question** — Le modèle initial ne couvrait que les machines (`machineName`). Comment intégrer les exercices sans machine (squats, fentes, curls...) ?

**Options envisagées**
- Simple renommage (`machineName` → `exerciseName`), tout reste un texte libre
- Ajout d'une catégorie `equipmentType` distinguant machine / poids libre / poids du corps

**Décision** — Ajout d'un `equipmentType` (`'machine' | 'poids_libre' | 'poids_du_corps'`), en plus du renommage `exerciseName`.

**Justification** — Documenter la catégorie dès le modèle de données évite une migration de données a posteriori, et permet de distinguer ces catégories dans les statistiques (US4, US9).

**Conséquence directe** — Le poids (`weightKg`) devient optionnel (`number | null`), un exercice au poids du corps pouvant n'avoir aucune charge externe.

---

## 11. Modèle de données final (MVP)

```typescript
export type EquipmentType = 'machine' | 'poids_libre' | 'poids_du_corps';

export interface Series {
  id: string;              // uuid généré à la création
  exerciseName: string;    // texte libre (pas d'entité Exercice séparée au MVP)
  equipmentType: EquipmentType;
  weightKg: number | null; // null autorisé (ex: poids du corps sans charge)
  reps: number | null;     // optionnel
  performedAt: string;     // ISO date string
}

export type NewSeries = Omit<Series, 'id'>;
```

**Pourquoi `performedAt` en `string` (ISO) et pas en `Date`** — `localStorage` ne stocke que du texte (`JSON.stringify`/`parse`). Un objet `Date` sérialisé en JSON redevient une string à la lecture : le typer honnêtement en `string` dès le départ évite un type qui mentirait sur ce qui survit réellement au stockage.

### Découpage des couches

```
src/
├── models/
│   └── series.ts               → Series, NewSeries, EquipmentType
├── storage/
│   └── seriesStorage.ts        → getAllSeries, addSeries, updateSeries, deleteSeries
├── stats/
│   └── seriesStats.ts          → fonctions dérivées (voir point 12)
├── components/
│   ├── SeriesForm.tsx          → US1
│   ├── SeriesList.tsx          → US2, US5
│   ├── ExerciseFilter.tsx      → US3
│   ├── FrequencyView.tsx       → US4
│   ├── ProgressChart.tsx       → US8
│   └── StatsSummary.tsx        → US9
├── App.tsx
└── main.tsx
```

`storage/seriesStorage.ts` est la seule couche qui connaît `localStorage` — c'est elle qui devra changer si le stockage migre vers une API en V2. `stats/seriesStats.ts` ne touche jamais `localStorage` directement : elle reçoit un tableau de `Series` déjà chargé et en dérive des résultats, ce qui la rend testable unitairement sans mock de stockage.

---

## 12. Calcul du volume total (US9) avec le poids du corps

**Question** — Le volume (US9) se calcule normalement `poids × répétitions`. Comment le calculer pour une série au poids du corps où `weightKg` est `null` ?

**Options envisagées**
- Exclure ces séries du volume total
- Compter les répétitions seules comme "volume" alternatif pour le poids du corps
- Permettre de saisir un poids de corps estimé pour l'inclure dans le calcul

**Décision** — Résultat à deux composantes distinctes plutôt qu'un chiffre unique :

```typescript
interface VolumeResult {
  weightedVolumeKg: number;   // Σ (poids × reps) pour machine / poids libre
  bodyweightReps: number;     // Σ reps pour poids du corps (weightKg null)
}

function computeTotalVolume(series: Series[], equipmentType?: EquipmentType): VolumeResult
```

**Justification** — Additionner des kg et des répétitions dans un seul total mélangerait deux grandeurs sans unité commune, donc un résultat trompeur. Le paramètre `equipmentType` optionnel évite de dupliquer la fonction : un seul appel en mode global (`computeTotalVolume(series)`) ou filtré (`computeTotalVolume(series, 'machine')`).

**Fonctions finales de `stats/seriesStats.ts` :**

```typescript
function computeFrequencyByExercise(series: Series[]): Record<string, number>
function computeFrequencyByEquipmentType(series: Series[]): Record<EquipmentType, number>
function computeMostUsedExercise(series: Series[], equipmentType?: EquipmentType): string | null
function computeWeeklySessionCount(series: Series[], equipmentType?: EquipmentType): number
function computeTotalVolume(series: Series[], equipmentType?: EquipmentType): VolumeResult
function computeProgressionForExercise(series: Series[], exerciseName: string): { date: string; weightKg: number | null }[]
```

---

## Décisions en attente

- Structure de test détaillée (Vitest) — à documenter à l'implémentation
- Détail du pipeline CI (GitHub Actions) — à documenter à sa mise en place
- Création des Issues GitHub par User Story — pas encore faite
- Découpage éventuel en ADR individuels si le nombre de décisions futures le justifie