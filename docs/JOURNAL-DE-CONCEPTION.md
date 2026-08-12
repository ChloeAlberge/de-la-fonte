# Journal de conception — De la Fonte

Ce document trace les questionnements, options envisagées et décisions prises pendant la conception du projet, dans l'ordre chronologique.

---

## 1. Type d'application

**Décision** — PWA. Installable sur l'écran d'accueil, fonctionne hors ligne, sans store ni langage natif séparé.

---

## 2. Framework front-end

**Décision** — React, sans framework "complet" imposant une architecture (donc pas Angular).

**Justification** — Concevoir sa propre organisation en couches (storage / logique / UI) est plus formateur pour une compétence de conception que de suivre une architecture déjà imposée par le framework.

---

## 3. Langage

**Décision** — TypeScript, pour le typage explicite des contrats de données entre les couches.

---

## 4. Outil de build

**Décision** — Vite plutôt que Next.js. Pas de SSR nécessaire (PWA offline-first, pas de SEO à gérer), Vite donne une SPA pure cohérente avec l'absence de backend.

---

## 5. Architecture en couches

**Décision** — 4 couches : `models` → `storage` → `stats` → `UI`, pour isoler la persistance (migrable en V2) de la logique métier et de l'affichage.

---

## 6. Stockage des données

**Décision** — `localStorage` pour le MVP, backend explicitement écarté (principe YAGNI). Usage solo, un seul appareil, pas de besoin de synchronisation actuellement.

---

## 7. Périmètre du MVP — User Stories

**Décision** — Voir `docs/USER-STORIES.md`. Les statistiques/visualisation, initialement V2, ont été remontées dans le MVP.

---

## 8. Gestion de projet

**Décision** — Dépôt GitHub géré manuellement, GitHub Flow (une branche par feature, PR avec `Closes #N`), une Issue par User Story.

---

## 9. Nom du projet

**Décision** — "De la Fonte" / `de-la-fonte` (slug technique).

---

## 10. Généralisation au-delà des machines

**Décision** — Ajout d'un `equipmentType` (`'machine' | 'poids_libre' | 'poids_du_corps'`) et renommage `machineName` → `exerciseName`. Conséquence : `weightKg` devient `number | null`.

---

## 11. Modèle de données (version initiale musculation)

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
```

*(Ce modèle est révisé au point 15 avec l'ajout de `sessionId` et l'union discriminée du point 14.)*

**`performedAt` en `string` (ISO)** — `localStorage` ne stocke que du texte ; un type honnête évite de mentir sur ce qui survit à la sérialisation.

---

## 12. Calcul du volume total (US9) avec le poids du corps

**Décision** — Deux composantes distinctes (`weightedVolumeKg`, `bodyweightReps`) plutôt qu'un total unique — kg et reps ne s'additionnent pas.

---

## 13. Ajout du nombre de séries identiques (`setsCount`)

**Décision** — Champ `setsCount: number` (jamais `null`, défaut `1`) pour regrouper des sets identiques en une saisie ("3×10"), plutôt qu'une entrée par set.

**Compromis assumé** — Ne fonctionne que pour des sets strictement identiques (même poids, mêmes reps). Impacte le calcul du volume : `poids × reps × setsCount`.

---

## 14. Support du cardio — modélisation et séquencement

**Décision (modélisation)** — Union discriminée `StrengthSeries | CardioSeries` (champ discriminant `kind`), plutôt que des champs optionnels ajoutés à un seul `Series`.

**Justification** — Empêche à la compilation les combinaisons incohérentes (ex: `reps` rempli sur une entrée cardio).

**Décision (séquencement)** — Cardio traité comme User Story séparée (US10), après stabilisation d'US1, pour ne pas rouvrir un modèle en cours de merge.

**Statut** — Non planifiée dans le MVP initial. Voir `docs/USER-STORIES.md`.

---

## 15. Concept de Session (séance) — durée et regroupement

**Contexte** — Née d'une réflexion sur le système de succès (point 16) : certains succès envisagés dépendent de la **durée** d'un entraînement de musculation. Or le modèle `Series` n'a qu'un horodatage ponctuel par set, aucune notion de bloc temporel regroupant plusieurs séries.

**Distinction posée avec le cardio** — La durée d'une séance de cardio (`CardioSeries.durationMin`, point 14) est indépendante et déjà couverte : une entrée cardio a intrinsèquement une durée. Le trou concerne uniquement la musculation, où la durée n'existe qu'au niveau d'un regroupement de séries.

**Décisions prises (par questionnement direct)**

| Question | Décision |
|---|---|
| Saisie d'une série sans séance active ? | Autorisée — les deux cas coexistent : séance active OU saisie libre a posteriori (`sessionId: null`) |
| Séance jamais terminée (oubli) ? | Reste manuel — pas de fermeture automatique par délai, gérée par l'utilisateur |
| Le cardio peut-il appartenir à une Session ? | Oui — une séance de cardio peut être rattachée à une `Session`, comme la musculation |

**Modèle retenu**

```typescript
interface BaseSeries {
  id: string;
  exerciseName: string;
  performedAt: string;
  sessionId: string | null;   // null = saisie libre, hors séance
}

interface StrengthSeries extends BaseSeries {
  kind: 'strength';
  equipmentType: EquipmentType;
  weightKg: number | null;
  reps: number | null;
  setsCount: number;
}

interface CardioSeries extends BaseSeries {
  kind: 'cardio';
  distanceKm: number | null;
  durationMin: number;
}

type Series = StrengthSeries | CardioSeries;

interface Session {
  id: string;
  startedAt: string;
  endedAt: string | null;   // null = en cours (ou oubliée, cf. décision ci-dessus)
}
```

**Pourquoi le lien est porté par `Series` (`sessionId`) et non l'inverse (`Session.seriesIds`)** — relation un-vers-plusieurs classique (une séance contient plusieurs séries, chaque série appartient à au plus une séance). Porter la référence côté `Series` évite une double source de vérité qui pourrait se désynchroniser.

**Règle métier ajoutée : une seule séance active à la fois** — rien dans le modèle n'empêche techniquement de démarrer une deuxième séance pendant qu'une première reste ouverte. Cette contrainte est donc appliquée dans la couche `storage`, pas dans le typage :

```typescript
function startSession(): Session {
  if (getActiveSession()) {
    throw new Error('Une séance est déjà en cours');
  }
  // ...
}
```

**Répercussions architecturales**
- `models/session.ts` (nouveau) — `Session`
- `storage/sessionStorage.ts` (nouveau) — `getAllSessions`, `startSession`, `endSession`, `getActiveSession`
- `stats/sessionStats.ts` (nouveau ou fusionné) — `computeSessionDurationMinutes`, `getSeriesForSession`
- `SeriesForm.tsx` — doit lire `getActiveSession()` pour préremplir `sessionId` automatiquement si une séance est en cours
- Nouveau composant `ActiveSessionBar.tsx` — bandeau "Séance en cours" avec Démarrer/Terminer

**Statut** — Conception validée, non implémentée. Rattachée au backlog V2 (epic Gamification/Succès), voir `docs/USER-STORIES.md`.

---

## 16. Système de succès (gamification) — concept

**Origine** — Idée inspirée des succès Steam : débloquer des cartes à collectionner façon pixel art selon des jalons d'entraînement.

**Décision (personnages)** — Écarté : concevoir un personnage visant délibérément la ressemblance avec une personne réelle identifiable (même non nommée), pour des raisons de droit à l'image. Retenu : un roster de personnages **originaux**, inspirés d'archétypes génériques du genre (bodybuilder, athlète) plutôt que d'individus précis.

**Roster envisagé (4 personnages)**
- Personnage bas du corps — jambes/fessiers très musclés
- Personnage haut du corps — bras/dos développés, jambes fines ("don't skip leg day")
- Le vétéran — bodybuilder archétype années 80, jalons de longévité/ancienneté
- Le mystère — capuche, genre non identifiable au départ, révélation progressive liée à la régularité dans le temps

**Décision (segmentation par partie du corps)** — Ajout d'un axe `bodyPart` (`'haut_du_corps' | 'bas_du_corps'`), simple et binaire (pas de granularité par groupe musculaire). Rejoint et affine l'item déjà présent au backlog V2 ("entité Exercice avec catégorie").

**Décision (durée)** — A entraîné la conception du concept de `Session` (point 15), pour permettre des succès basés sur la durée d'un entraînement de musculation, pas seulement de cardio.

**Statut** — Concept exploré en profondeur (roster, déclencheurs, contrainte technique `bodyPart`/`Session`), mais **aucune implémentation**. Reste un item du backlog V2 — voir `docs/USER-STORIES.md` pour le suivi.

---

## 17. Limite connue — désynchronisation multi-onglets

**Contexte** — `ActiveSessionBar` lit `getActiveSession()` une seule fois au montage (`useState(() => ...)`). Si un onglet est ouvert **avant** qu'une séance ne soit démarrée dans un autre onglet, il continue d'afficher le bouton "Démarrer" sans savoir qu'une séance est déjà active ailleurs — cliquer dessus déclenche alors l'erreur `Une séance est déjà en cours` (`storage/sessionStorage.ts`), sans message utilisateur dédié pour l'instant.

**Cause** — `localStorage` est partagé entre tous les onglets d'un même domaine, mais React ne réagit pas automatiquement à un changement fait dans un **autre** onglet — il n'y a pas d'écoute en temps réel mise en place.

**Décision** — Non corrigé pour l'instant, noté comme limite connue plutôt que traité.

**Justification** — Usage prévu : un seul appareil, une appli installée en PWA (comportement standalone qui réutilise l'instance existante plutôt que d'en ouvrir une nouvelle). Le risque réel est faible, et l'impact d'une occurrence reste un message d'erreur en console, pas une perte ou incohérence de données.

**Piste d'amélioration (backlog)** — Écouter l'événement `storage` du navigateur (déclenché automatiquement dans les autres onglets quand `localStorage` change) pour resynchroniser `ActiveSessionBar` en temps réel. Non priorisé.

---

## Décisions en attente

- Détail des seuils exacts de déblocage par succès (ex: "10 séances" vs "50 séries")
- Où stocker `bodyPart` : sur `Series` directement, ou sur une future entité `Exercise` dédiée (lié à l'item backlog existant)
- Détail du pipeline CI (GitHub Actions) — à documenter à sa mise en place
- Création des Issues GitHub pour les US restantes — faites au fur et à mesure
- Journaliser (leçon de méthode) l'incident de commit oublié avant merge sur US1 — noté, pas encore fait