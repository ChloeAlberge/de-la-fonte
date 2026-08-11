# Journal de conception — De la Fonte

Ce document trace les questionnements, options envisagées et décisions prises pendant la conception du projet, dans l'ordre chronologique.

---

## 1. Type d'application

**Question** — Appli web classique, PWA installable, ou appli native ?

**Décision** — PWA.

**Justification** — Installable comme une vraie appli, fonctionne hors ligne (utile en salle de sport où le réseau est mauvais), sans passer par un store ni apprendre un langage natif séparé.

---

## 2. Framework front-end

**Question** — Quel framework pour construire l'interface ?

**Options envisagées** — Vanilla JS, React, Vue, Angular, Svelte.

**Décision** — React, sans framework "complet" imposant une architecture (donc pas Angular).

**Justification** — Angular impose sa propre architecture (Dependency Injection, modules, structure de dossiers) : l'utiliser aurait démontré une capacité à *respecter* un cadre existant, pas à en *concevoir* un. Concevoir sa propre organisation en couches (storage / logique / UI) avec React est plus formateur pour une compétence de conception.

---

## 3. Langage

**Question** — JavaScript ou TypeScript ?

**Décision** — TypeScript.

**Justification** — Impose un typage explicite des contrats de données entre les couches, ce qui structure la réflexion de conception et réduit une classe entière de bugs.

---

## 4. Outil de build

**Question** — Vite ou Next.js ?

**Décision** — Vite.

**Justification** — Next.js résout des problèmes qu'on n'a pas ici : SEO, temps de chargement initial d'un site public. Le SSR ajoute de la complexité (hydratation) qui entre en friction avec l'architecture offline-first qu'on veut construire.

---

## 5. Architecture en couches

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

**Justification** — Isoler la couche de stockage permet de faire évoluer la persistance (ex: `localStorage` → API en V2) sans toucher à l'UI ni à la logique métier.

---

## 6. Stockage des données

**Question** — Comment et où stocker les séries ?

**Options envisagées** — `localStorage`, `IndexedDB`, backend distant.

**Décision** — `localStorage` pour le MVP, backend explicitement écarté pour cette phase.

**Justification** — Usage solo, un seul appareil. `localStorage` suffit largement. Un backend n'apporterait aucune valeur tant que le besoin de synchronisation multi-appareils ne se confirme pas (principe **YAGNI**).

---

## 7. Périmètre du MVP — User Stories

**Décision** — Voir `docs/USER-STORIES.md` pour la liste complète.

**Point notable** — Les statistiques et la visualisation ont été initialement classées en "nice-to-have V2", puis remontées dans le périmètre MVP après réflexion.

---

## 8. Gestion de projet

**Décision** — Dépôt GitHub géré manuellement. Stratégie de branches : une branche par feature (`feature/us1-...`), fusionnée dans `main` via Pull Request (GitHub Flow). Une Issue GitHub par User Story, fermée automatiquement via `Closes #N` dans la description de la PR.

**Justification** — Choix délibéré de faire les manipulations soi-même pour ancrer la pratique Git/GitHub. Une branche "conception" permanente a été envisagée puis écartée : une branche est faite pour être fusionnée, pas pour héberger indéfiniment de la documentation.

---

## 9. Nom du projet

**Décision** — "De la Fonte" (nom d'affichage) / `de-la-fonte` (slug technique).

---

## 10. Généralisation au-delà des machines

**Question** — Le modèle initial ne couvrait que les machines (`machineName`). Comment intégrer les exercices sans machine (squats, fentes, curls...) ?

**Décision** — Ajout d'un `equipmentType` (`'machine' | 'poids_libre' | 'poids_du_corps'`), en plus du renommage `exerciseName`.

**Conséquence directe** — Le poids (`weightKg`) devient optionnel (`number | null`), un exercice au poids du corps pouvant n'avoir aucune charge externe.

---

## 11. Modèle de données (version musculation)

```typescript
export type EquipmentType = 'machine' | 'poids_libre' | 'poids_du_corps';

export interface Series {
  id: string;
  exerciseName: string;
  equipmentType: EquipmentType;
  weightKg: number | null;
  reps: number | null;
  setsCount: number;
  performedAt: string;
}

export type NewSeries = Omit<Series, 'id'>;
```

**Pourquoi `performedAt` en `string` (ISO) et pas en `Date`** — `localStorage` ne stocke que du texte. Un objet `Date` sérialisé en JSON redevient une string à la lecture : le typer honnêtement en `string` dès le départ évite un type qui mentirait sur ce qui survit réellement au stockage.

### Découpage des couches

```
src/
├── models/series.ts             → Series, NewSeries, EquipmentType
├── storage/seriesStorage.ts     → getAllSeries, addSeries, updateSeries, deleteSeries
├── stats/seriesStats.ts         → fonctions dérivées (à venir)
├── components/
│   ├── SeriesForm.tsx           → US1 ✅
│   ├── SeriesList.tsx           → US2, US5
│   ├── ExerciseFilter.tsx       → US3
│   ├── FrequencyView.tsx        → US4
│   ├── ProgressChart.tsx        → US8
│   └── StatsSummary.tsx         → US9
├── App.tsx
└── main.tsx
```

---

## 12. Calcul du volume total (US9) avec le poids du corps

**Décision** — Résultat à deux composantes distinctes plutôt qu'un chiffre unique (kg et reps ne peuvent pas s'additionner) :

```typescript
interface VolumeResult {
  weightedVolumeKg: number;   // Σ (poids × reps × setsCount) pour machine / poids libre
  bodyweightReps: number;     // Σ (reps × setsCount) pour poids du corps
}
```

**Note (mise à jour point 13)** — la formule intègre désormais `setsCount` en facteur, voir ci-dessous.

---

## 13. Ajout du nombre de séries identiques (`setsCount`)

**Question** — Une séance normale comprend plusieurs sets identiques par exercice (ex: 3×10 à 60kg). Fallait-il créer une entrée `Series` par set, ou permettre de regrouper des sets identiques en une seule saisie ?

**Options envisagées**
- **Option A** — Ajouter `setsCount` au modèle : une entrée représente N sets identiques (même poids, mêmes reps)
- **Option B** — Garder une entrée = un set, optimiser la saisie plus tard (ex: fonctionnalité "dupliquer le dernier set")

**Décision** — Option A : ajout du champ `setsCount: number` (jamais `null`, défaut `1`) à l'interface `Series`.

**Justification** — Correspond à comment une séance se pense naturellement ("3x10"), réduit la saisie répétitive. Compromis assumé : si le poids ou les reps varient d'un set à l'autre (fréquent en pratique réelle, ex: dernier set plus léger), plusieurs entrées restent nécessaires — `setsCount` ne modélise que des sets strictement identiques.

**Conséquence sur les stats (US9, pas encore codé)** — le calcul du volume devient `poids × reps × setsCount` (et non plus `poids × reps` seul).

**Répercussion dans le code** — modèle (`models/series.ts`), test (`seriesStorage.test.ts`), formulaire (`SeriesForm.tsx`, nouveau champ + état `setsCount`). Couche `storage` inchangée (elle ne connaît pas la forme précise de `Series`, juste qu'elle la persiste telle quelle).

---

## 14. Support du cardio — modélisation et séquencement

**Question** — Le modèle actuel (`Series`) ne couvre que la musculation. Comment intégrer des séances de cardio (distance, durée), qui n'ont ni poids, ni reps, ni sets au sens musculation ?

**Options envisagées pour la modélisation**
- **Option A** — Ajouter des champs optionnels (`distanceKm`, `durationMin`) directement sur `Series`
- **Option B** — Union discriminée : deux interfaces distinctes (`StrengthSeries` / `CardioSeries`) réunies par un type `Series = StrengthSeries | CardioSeries`, avec un champ discriminant (`kind`)

**Décision (modélisation)** — Option B, union discriminée.

**Justification** — Avec l'option A, rien n'empêche techniquement de remplir `reps` et `distanceKm` sur la même entrée, une incohérence que TypeScript ne peut pas détecter. L'union discriminée rend ces combinaisons invalides impossibles à la compilation : accéder à `series.reps` sur une entrée de type `'cardio'` devient une erreur de typage, pas une valeur `null` silencieusement ignorée.

**Décision (séquencement)** — Le cardio n'est pas intégré dans US1. US1 reste limitée à la musculation, mergée telle quelle. Le cardio devient une **User Story séparée (US10)**, traitée dans sa propre branche une fois US1 stabilisée.

**Justification** — Éviter de rouvrir et complexifier un modèle en cours de stabilisation. Le refactoring vers une union discriminée impactera toutes les couches déjà écrites (`storage`, `SeriesForm`, futurs `stats`) — mérite sa propre itération plutôt qu'un ajout de dernière minute sur US1.

**Statut** — Non planifiée dans le MVP initial (US1-US9). À prioriser : voir `docs/USER-STORIES.md`.

---

## Décisions en attente

- Structure de test détaillée pour les couches restantes (`SeriesForm`, futurs composants UI)
- Détail du pipeline CI (GitHub Actions) — à documenter à sa mise en place
- Design détaillé de l'union discriminée `StrengthSeries`/`CardioSeries` (US10) — à faire au démarrage de cette US
- Création des Issues GitHub pour les US restantes (US2 à US9, US10) — faites au fur et à mesure, pas toutes à l'avance
- Découpage éventuel en ADR individuels si le nombre de décisions futures le justifie