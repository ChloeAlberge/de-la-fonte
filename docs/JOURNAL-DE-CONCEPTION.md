# Journal de conception : De la Fonte

Ce document trace les questionnements, options envisagées et décisions prises pendant la conception du projet, dans l'ordre chronologique.

---

## 1. Type d'application

**Décision** : PWA. Installable sur l'écran d'accueil, fonctionne hors ligne, sans store ni langage natif séparé.

---

## 2. Framework front-end

**Décision** : React, sans framework "complet" imposant une architecture (donc pas Angular).

**Justification** : Concevoir sa propre organisation en couches (storage / logique / UI) est plus formateur pour une compétence de conception que de suivre une architecture déjà imposée par le framework.

---

## 3. Langage

**Décision** : TypeScript, pour le typage explicite des contrats de données entre les couches.

---

## 4. Outil de build

**Décision** : Vite plutôt que Next.js. Pas de SSR nécessaire (PWA offline-first, pas de SEO à gérer), Vite donne une SPA pure cohérente avec l'absence de backend.

---

## 5. Architecture en couches

**Décision** : 4 couches : `models` → `storage` → `stats` → `UI`, pour isoler la persistance (migrable en V2) de la logique métier et de l'affichage.

---

## 6. Stockage des données

**Décision** : `localStorage` pour le MVP, backend explicitement écarté (principe YAGNI). Usage solo, un seul appareil, pas de besoin de synchronisation actuellement.

---

## 7. Périmètre du MVP : User Stories

**Décision** : Voir `docs/USER-STORIES.md`. Les statistiques/visualisation, initialement V2, ont été remontées dans le MVP.

---

## 8. Gestion de projet

**Décision** : Dépôt GitHub géré manuellement, GitHub Flow (une branche par feature, PR avec `Closes #N`), une Issue par User Story.

---

## 9. Nom du projet

**Décision** : "De la Fonte" / `de-la-fonte` (slug technique).

---

## 10. Généralisation au-delà des machines

**Décision** : Ajout d'un `equipmentType` (`'machine' | 'poids_libre' | 'poids_du_corps'`) et renommage `machineName` → `exerciseName`. Conséquence : `weightKg` devient `number | null`.

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

**`performedAt` en `string` (ISO)** : `localStorage` ne stocke que du texte ; un type honnête évite de mentir sur ce qui survit à la sérialisation.

---

## 12. Calcul du volume total (US9) avec le poids du corps

**Décision** : Deux composantes distinctes (`weightedVolumeKg`, `bodyweightReps`) plutôt qu'un total unique, kg et reps ne s'additionnent pas.

---

## 13. Ajout du nombre de séries identiques (`setsCount`)

**Décision** : Champ `setsCount: number` (jamais `null`, défaut `1`) pour regrouper des sets identiques en une saisie ("3×10"), plutôt qu'une entrée par set.

**Compromis assumé** : Ne fonctionne que pour des sets strictement identiques (même poids, mêmes reps). Impacte le calcul du volume : `poids × reps × setsCount`.

---

## 14. Support du cardio : modélisation et séquencement

**Décision (modélisation)** : Union discriminée `StrengthSeries | CardioSeries` (champ discriminant `kind`), plutôt que des champs optionnels ajoutés à un seul `Series`.

**Justification** : Empêche à la compilation les combinaisons incohérentes (ex: `reps` rempli sur une entrée cardio).

**Décision (séquencement)** : Cardio traité comme User Story séparée (US10), après stabilisation d'US1, pour ne pas rouvrir un modèle en cours de merge.

**Statut** : ✅ Terminée (US10). Union discriminée implémentée dans `models/series.ts`, formulaire cardio (`CardioForm.tsx`) opérationnel, persistance validée dans `localStorage`.

---

## 15. Concept de Session (séance) : durée et regroupement

**Contexte** : Née d'une réflexion sur le système de succès (point 16) : certains succès envisagés dépendent de la **durée** d'un entraînement de musculation. Or le modèle `Series` n'a qu'un horodatage ponctuel par set, aucune notion de bloc temporel regroupant plusieurs séries.

**Distinction posée avec le cardio** : La durée d'une séance de cardio (`CardioSeries.durationMin`, point 14) est indépendante et déjà couverte : une entrée cardio a intrinsèquement une durée. Le trou concerne uniquement la musculation, où la durée n'existe qu'au niveau d'un regroupement de séries.

**Décisions prises (par questionnement direct)**

| Question | Décision |
|---|---|
| Saisie d'une série sans séance active ? | Autorisée, les deux cas coexistent : séance active OU saisie libre a posteriori (`sessionId: null`) |
| Séance jamais terminée (oubli) ? | Reste manuel, pas de fermeture automatique par délai, gérée par l'utilisateur |
| Le cardio peut-il appartenir à une Session ? | Oui, une séance de cardio peut être rattachée à une `Session`, comme la musculation |

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

**Pourquoi le lien est porté par `Series` (`sessionId`) et non l'inverse (`Session.seriesIds`)** : relation un-vers-plusieurs classique (une séance contient plusieurs séries, chaque série appartient à au plus une séance). Porter la référence côté `Series` évite une double source de vérité qui pourrait se désynchroniser.

**Règle métier ajoutée : une seule séance active à la fois** : rien dans le modèle n'empêche techniquement de démarrer une deuxième séance pendant qu'une première reste ouverte. Cette contrainte est donc appliquée dans la couche `storage`, pas dans le typage :

```typescript
function startSession(): Session {
  if (getActiveSession()) {
    throw new Error('Une séance est déjà en cours');
  }
  // ...
}
```

**Répercussions architecturales**
- `models/session.ts` (nouveau), `Session`
- `storage/sessionStorage.ts` (nouveau), `getAllSessions`, `startSession`, `endSession`, `getActiveSession`
- `stats/sessionStats.ts` (nouveau ou fusionné), `computeSessionDurationMinutes`, `getSeriesForSession`
- `SeriesForm.tsx`, doit lire `getActiveSession()` pour préremplir `sessionId` automatiquement si une séance est en cours
- Nouveau composant `ActiveSessionBar.tsx`, bandeau "Séance en cours" avec Démarrer/Terminer

**Statut** : ✅ Terminée (US11). `models/session.ts`, `storage/sessionStorage.ts` (avec contrainte "une seule séance active" testée), et `ActiveSessionBar.tsx` (Démarrer/Terminer) implémentés et branchés sur `SeriesForm`/`CardioForm` via `sessionId`.

---

## 16. Système de succès (gamification) : concept

**Origine** : Idée inspirée des succès Steam : débloquer des cartes à collectionner façon pixel art selon des jalons d'entraînement.

**Décision (personnages)** : Écarté : concevoir un personnage visant délibérément la ressemblance avec une personne réelle identifiable (même non nommée), pour des raisons de droit à l'image. Retenu : un roster de personnages **originaux** : inspirés d'archétypes génériques du genre (bodybuilder, athlète) plutôt que d'individus précis.

**Roster envisagé (4 personnages)**
- Personnage bas du corps, jambes/fessiers très musclés
- Personnage haut du corps, bras/dos développés, jambes fines ("don't skip leg day")
- Le vétéran, bodybuilder archétype années 80, jalons de longévité/ancienneté
- Le mystère, capuche, genre non identifiable au départ, révélation progressive liée à la régularité dans le temps

**Décision (segmentation par partie du corps)** : Ajout d'un axe `bodyPart` (`'haut_du_corps' | 'bas_du_corps'`), simple et binaire (pas de granularité par groupe musculaire). Rejoint et affine l'item déjà présent au backlog V2 ("entité Exercice avec catégorie").

**Décision (durée)** : A entraîné la conception du concept de `Session` (point 15), pour permettre des succès basés sur la durée d'un entraînement de musculation, pas seulement de cardio.

**Statut** : Concept exploré en profondeur (roster, déclencheurs, contrainte technique `bodyPart`/`Session`), mais **aucune implémentation**. Reste un item du backlog V2, voir `docs/USER-STORIES.md` pour le suivi.

---

## 17. Limite connue : désynchronisation multi-onglets

**Contexte** : `ActiveSessionBar` lit `getActiveSession()` une seule fois au montage (`useState(() => ...)`). Si un onglet est ouvert **avant** qu'une séance ne soit démarrée dans un autre onglet, il continue d'afficher le bouton "Démarrer" sans savoir qu'une séance est déjà active ailleurs, cliquer dessus déclenche alors l'erreur `Une séance est déjà en cours` (`storage/sessionStorage.ts`), sans message utilisateur dédié pour l'instant.

**Cause** : `localStorage` est partagé entre tous les onglets d'un même domaine, mais React ne réagit pas automatiquement à un changement fait dans un **autre** onglet, il n'y a pas d'écoute en temps réel mise en place.

**Décision** : Non corrigé pour l'instant, noté comme limite connue plutôt que traité.

**Justification** : Usage prévu : un seul appareil, une appli installée en PWA (comportement standalone qui réutilise l'instance existante plutôt que d'en ouvrir une nouvelle). Le risque réel est faible, et l'impact d'une occurrence reste un message d'erreur en console, pas une perte ou incohérence de données.

**Piste d'amélioration (backlog)** : Écouter l'événement `storage` du navigateur (déclenché automatiquement dans les autres onglets quand `localStorage` change) pour resynchroniser `ActiveSessionBar` en temps réel. Non priorisé.

---

## État d'avancement (au 16 août 2026)

| US | Sujet | Statut |
|---|---|---|
| US1 | Enregistrer une série (muscu) | ✅ |
| US10 | Enregistrer une séance de cardio | ✅ |
| US11 | Suivi de séance (Session) | ✅ |
| US2 | Consulter l'historique | ✅ |
| US3 | Filtrer par exercice | ✅ |
| US4 | Fréquence par exercice | ✅ |
| US5 | Corriger/supprimer une série | ✅ |
| US6 | Installer l'appli (PWA) | ⏳ |
| US7 | Fonctionnement hors ligne | ⏳ |
| US8 | Graphique de progression | ✅ |
| US12 | Identité visuelle (epic, 5 sous-Issues) | ✅ |
| US9 | Statistiques globales | ✅ |

---

## 18. US2 : Consultation de l'historique

**Décision** : `SeriesList.tsx` reçoit le tableau `Series[]` en prop plutôt que de lire `storage` lui-même ; `App.tsx` reste seul responsable de charger/recharger les données.

**Justification** : Garde le composant "bête" (affichage pur), évite de dupliquer la logique de lecture à plusieurs endroits si d'autres composants ont un jour besoin des mêmes données.

**Tri** : Décroissant par `performedAt` (le plus récent en premier), calculé sur une **copie** du tableau (`[...series].sort(...)`) pour ne jamais muter la prop reçue.

**Affichage par type** : Un sous-composant `SeriesListItem` centralise la discrimination `kind` (`if (entry.kind === 'strength')`) pour éviter de disperser cette logique dans plusieurs endroits du rendu.

**Statut** : ✅ Terminée.

---

## 19. US3 : Filtre par exercice et démarrage de la couche `stats/`

**Décision** : Création de `stats/seriesStats.ts`, première fonction de cette couche (`getUniqueExerciseNames`, `filterByExercise`). Ne dépend que de `models/`, jamais de `storage/`, reçoit des données déjà chargées, ce qui la rend testable sans mock ni `localStorage.clear()`.

**Dédoublonnage** : Passage par un `Set` JS (élimine les doublons nativement) plutôt qu'une boucle manuelle, puis retour en tableau trié alphabétiquement pour un affichage prévisible dans le sélecteur.

**`ExerciseFilter.tsx`** : Composant contrôlé sans état interne : la valeur sélectionnée vit dans `App.tsx` (qui en a aussi besoin pour filtrer `SeriesList`), le composant ne fait que refléter/notifier. `selected: string | null` converti en `''` côté `<select>` HTML natif (qui ne comprend pas `null`), et inversement à la sortie.

**Valeurs dérivées, pas de nouvel état** : `exerciseNames` et `displayedSeries` recalculés à chaque rendu de `App.tsx` à partir de `allSeries`/`selectedExercise`, sans `useState`/`useEffect` dédié, même principe que `isBodyweight` dans `SeriesForm` (point 11), appliqué à des données dérivées plus complexes.

**Statut** : ✅ Terminée.

---

## 20. US5 : Édition et suppression, mise en place des tests de composants React

**Décision (édition inline)** : Chaque `SeriesListItem` gère son propre état `isEditing` local, indépendant des autres lignes. Basculement entre affichage et `SeriesEditForm` via rendu conditionnel, plutôt qu'une page/modale séparée, reste cohérent avec la simplicité du MVP.

**Décision (suppression)** : Confirmation via `window.confirm` (natif navigateur), pas de modale personnalisée pour l'instant. Compromis assumé : non stylable, mais suffisant et rapide à mettre en place pour un usage solo.

**Point de compréhension notable, `Partial<T>` sur une union est homomorphique.** `NewSeries` est une union (`Omit<StrengthSeries,'id'> | Omit<CardioSeries,'id'>`). `Partial<NewSeries>` aurait pu être compris comme limité aux champs communs aux deux variantes ; en réalité, TypeScript **distribue** automatiquement `Partial` (comme `Pick`, `Required`, `Readonly`) sur chaque membre de l'union séparément. Conséquence pratique : `updateSeries(id, { weightKg: 65 })` et `updateSeries(id, { durationMin: 20 })` sont tous deux valides sans code supplémentaire, chacun vérifié contre la bonne variante.

**Décision (tests de composants)** : Ajout de `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, jusque-là absents (seule la couche storage/stats était testée). Nécessite `globals: true` dans la config Vitest, sans cette option, `jest-dom` échoue (`expect is not defined`) car il s'attend à un `expect` global, que Vitest n'expose pas par défaut contrairement à Jest.

**Approche de test retenue** : `vi.fn()` pour espionner les callbacks (`onSeriesChanged`), `vi.spyOn(window, 'confirm')` pour simuler la confirmation sans jamais ouvrir de vraie boîte de dialogue pendant les tests, `userEvent` (plutôt que `fireEvent`) pour des interactions utilisateur plus réalistes.

**Statut** : ✅ Terminée.

---

## 21. US4 : Fréquence par exercice et par équipement

**Décision (double mesure)** : Deux informations distinctes calculées ensemble plutôt qu'une seule métrique de "fréquence" : `seriesCount` (nombre brut de séries) et `distinctDaysCount` (nombre de jours calendaires distincts). Nécessaire car les deux répondent à des questions différentes ("combien de fois ai-je fait cet exercice" vs "sur combien de séances distinctes").

**Calcul des jours distincts** : `performedAt.slice(0, 10)` tronque la string ISO à sa partie date (`"2026-08-12"`), puis dédoublonnage via `Set`, même technique que `getUniqueExerciseNames` (point 19), appliquée aux dates plutôt qu'aux noms d'exercice. Deux séries le même jour à des heures différentes comptent pour un seul jour.

**Fréquence par équipement, filtrage du cardio** : `equipmentType` n'existe que sur `StrengthSeries`. Utilisation d'une fonction de garde de type (`s is Extract<Series, { kind: 'strength' }>`) pour écarter le cardio avant tout traitement, plutôt qu'une vérification `if` répétée dans la boucle. Testé explicitement (`computeFrequencyByEquipmentType` ignore les séries cardio).

**`FrequencyView` branché sur `allSeries`, pas `displayedSeries`** : la fréquence doit refléter l'activité globale, indépendamment du filtre par exercice actif dans `ExerciseFilter` ; la brancher sur les données déjà filtrées aurait rendu les chiffres trompeurs.

**Statut** : ✅ Terminée.

---

## 22. US8 : Graphique de progression

**Décision (librairie)** : `recharts`, seule nouvelle dépendance de production ajoutée depuis le début du projet (toutes les précédentes, Vitest/Testing Library, sont des dépendances de développement).

**Décision (fonction `computeProgressionForExercise`)** : Filtre triple combiné dans une seule garde de type : `kind === 'strength'` (exclut le cardio), `exerciseName` correspondant, et `weightKg !== null` (exclut le poids du corps sans charge, qui n'a rien à tracer sur un axe de poids). Testé explicitement contre le cas piégeux d'une entrée cardio portant volontairement le même `exerciseName` qu'une entrée muscu, pour vérifier que c'est bien le discriminant `kind` qui protège.

**Tri chronologique croissant** : contrairement à `SeriesList` (décroissant, le plus récent en premier), le graphique doit se lire de gauche à droite dans le temps, `sort` inversé par rapport au reste de l'appli, décision volontaire liée à l'usage, pas une incohérence.

**Réutilisation du sélecteur existant** : `ProgressChart` reçoit le même état `selectedExercise` que `ExerciseFilter` (US3), plutôt que d'introduire un second sélecteur dédié. Un seul contrôle pilote à la fois le filtre de liste et le graphique.

**Statut** : ✅ Terminée.

---

## 23. Pause sur le MVP fonctionnel : passage au style avant déploiement

**Contexte** : Le MVP fonctionnel (US1 à US5, US8, US9, US10, US11) est complet, mais sans aucun style (HTML/composants natifs par défaut, sans CSS travaillé), rendant l'appli peu lisible et peu utilisable en pratique.

**Décision** : US6/US7 (PWA installable + hors ligne) volontairement reportées après un passage sur le style, plutôt qu'enchaînées immédiatement. Installer et utiliser au quotidien une appli illisible n'aurait pas de sens.

**Note de méthode** : Un travail sur l'interface visuelle n'était pas dans les User Stories initiales (US1-US11 couvrent uniquement la logique/données). Sera formalisé comme un nouvel item (à numéroter, ex. US12) dans `docs/USER-STORIES.md` le moment venu, pour garder la traçabilité même si ce n'était pas prévu dès la conception initiale.

**Statut** : Non commencé.

---

## 24. US12 : identité visuelle, epic et cadrage

**Contexte** : le MVP fonctionnel (US1-US5, US8-US11) était complet mais sans aucun style, rendant l'appli peu lisible et peu utilisable en pratique (point 23). Décision de traiter ce chantier avant US6/US7 (PWA/installation).

**Brief retenu, à l'issue d'un questionnaire de cadrage** :
- Ambiance : ludique, rétro années 80, cyberpunk (référence explicite : Cyberpunk 2077)
- Thème sombre avec touches néon
- Palette : `#27b0ff` (cyan), `#6e00ff` (violet), `#0b1026` (fond secondaire), `#020309` (fond principal), chrome/acier en complément. Rouge et marron explicitement exclus
- Typographie : caractère fort pour les titres, très lisible pour le reste
- Priorité affichée : la progression visuelle prime sur les champs de saisie, qui passent en modale plutôt qu'en flux direct
- Palette et univers de Patrick (mascotte pixel art, backlog gamification) explicitement connectés au style de l'appli, pas isolés

**Décision (contraste modales/dashboard)** : les modales de saisie adoptent un style radicalement différent, pastiche de terminal informatique années 80 (phosphore vert monochrome, VT323, bordures ASCII), plutôt que de prolonger l'esthétique néon. Rupture volontaire pour marquer un changement de mode ("écran de saisie" vs "tableau de bord"). L'historique reste dans l'esthétique HUD néon malgré tout, la lisibilité de la donnée déjà enregistrée primant sur la cohérence stylistique stricte.

**Décision (découpage en sous-Issues)** : 5 sous-Issues sous une Issue epic (US12), chacune sur sa propre branche, plutôt qu'une seule branche englobant tout le chantier. Motivation : éviter un diff unique massif touchant quasiment tous les composants, permettre de merger chaque partie stable indépendamment.

```
1. Fondations (design tokens)
      ↓
2. Dashboard HUD ──┬── 3. Graphique
                    │
4. Modales terminal (peut démarrer après 1, en parallèle de 2/3)
      ↓
5. Transition (nécessite 2 et 4 stables)
```

**Statut** : Epic en cours. Sous-Issues 1, 2, 3 terminées. 4 et 5 restantes.

---

## 25. US12.1 : design tokens

**Décision (typographies)** :
- Titres : **Orbitron** (géométrique, anguleuse, esprit HUD)
- Texte courant : **Chakra Petch**, choisie après essai comparatif contre Inter (jugée trop ronde/neutre pour le brief) et contre Rajdhani/Space Grotesk. Retenue pour son équilibre "tranchée mais très lisible", conforme à l'exigence explicite du brief
- Données chiffrées (poids, reps, dates) : **Share Tech Mono**, esprit terminal/console
- Modales (réservé à la sous-Issue 4) : **VT323**, esprit CRT basse résolution

**Décision (chargement des polices)** : Google Fonts via `<link rel="preconnect">` + `display=swap`, graisses limitées au strict nécessaire par police plutôt que toutes les graisses disponibles, pour limiter le poids téléchargé.

**Décision (variables CSS)** : toute la palette (y compris la palette terminal, non utilisée avant la sous-Issue 4) posée dès cette étape dans `:root`, pour centraliser les couleurs à un seul endroit dès le départ plutôt que d'en ajouter éparpillées plus tard.

**Statut** : ✅ Terminée.

---

## 26. US12.2 : dashboard HUD et bascule mobile-first

**Décision (structure du style)** : classes CSS génériques réutilisables (`.panel`, `.stats-grid`, `.stat-tile`, `.series-list`) plutôt que des styles ad hoc par composant, pour garder une cohérence visuelle sans dupliquer les règles.

**Incident et correction : mobile-first oublié au départ.** Le CSS a été écrit une première fois en pensant desktop (grille 2+ colonnes par défaut, marges larges, aucune taille minimale sur les boutons), alors que l'usage réel de l'appli est mobile. Repéré avant merge, corrigé par une réécriture complète en approche mobile-first : styles de base ciblant le petit écran, ajustements desktop regroupés dans un seul `@media (min-width: 640px)` plutôt que l'inverse.

**Décision (accessibilité tactile)** : règle globale `button { min-height: 44px; }`, conforme à la recommandation standard de zone tactile minimale, plutôt que de fixer une taille composant par composant.

**Décision (indicateur de séance)** : pastille colorée (`.session-dot`) avec animation `pulse` en CSS pur (variation d'opacité en boucle) quand une séance est active, plutôt qu'un texte clignotant. Taille ajustée de 10px à 16px après retour utilisateur (meilleure visibilité).

**Statut** : ✅ Terminée.

---

## 27. US12.3 : style néon du graphique

**Décision (limite technique recharts)** : les couleurs ne peuvent pas être passées en `var(--color-xxx)` de façon fiable aux props SVG de `recharts` (`stroke`, styles de tooltip). Constantes JS dupliquant les valeurs hexadécimales déjà définies en CSS, documenté comme duplication assumée plutôt qu'un oubli d'harmonisation.

**Décision (effet de glow)** : filtre SVG natif (`feGaussianBlur` + `feMerge`) plutôt qu'un effet CSS externe, pour rester dans le système de rendu propre à `recharts`/SVG.

**Correction (responsive)** : le graphique avait une largeur fixe (`width={500}`) héritée de l'implémentation initiale (US8), incompatible avec l'approche mobile-first adoptée en US12.2. Remplacé par `ResponsiveContainer`, qui mesure et s'adapte automatiquement à l'espace disponible dans le panneau parent.

**Statut** : ✅ Terminée.

---

## 28. Idées en attente, non formalisées en code

**Profil utilisateur enrichi (piste US13)** : nom d'affichage, avatar choisi parmi les personnages du backlog gamification, succès débloqués visibles. Explicitement séquencée après US12 (l'identité visuelle doit exister avant d'habiller un profil). Rejoint et enrichit l'epic Gamification déjà noté (points 15-16).

**Catalogue d'exercices avec segmentation par partie du corps (haut du corps / bas du corps / full body)** : proposée en cours de session comme alternative au champ `exerciseName` en texte libre actuel. Introduit une troisième catégorie (`full_body`) non présente dans la segmentation `bodyPart` déjà envisagée pour la gamification (point 16, qui ne prévoyait que haut/bas) : à harmoniser si les deux systèmes sont conservés.

Impact identifié si implémentée : nouveau modèle (`models/exercise.ts` ou équivalent), migration ou coexistence avec les données déjà saisies en texte libre, et **remplacement du champ `<input>` "Exercice"** dans les modales de saisie (actuellement en cours de stylisation en US12.4) par un composant de sélection filtrable. Ce dernier point est identifié comme le seul vrai point de friction avec le chantier visuel en cours : le champ actuel sera à retravailler une fois le catalogue en place, ce qui a été jugé acceptable plutôt que bloquant.

**Décision de séquencement** : les deux idées sont explicitement mises de côté, non traitées avant la fin d'US12, pour ne pas interrompre un chantier déjà engagé.

---

## 29. US12.4 : modales terminal

**Décision (architecture)** : composant `Modal` générique et réutilisable (accepte `children`), plutôt qu'une modale dédiée par formulaire. `SeriesForm` et `CardioForm` passent d'un affichage en flux direct dans la page à un contenu injecté dans cette modale commune, déclenchée par un bouton "+ Ajouter" sur le dashboard.

**Décision (fermeture)** : trois déclencheurs équivalents, clic sur l'overlay, touche Échap, croix explicite ajoutée après retour sur l'usage mobile (cliquer en dehors n'étant pas un geste naturel au toucher). Les trois passent par la même fonction pour garantir un comportement (et une animation) identique quel que soit le déclencheur.

**Décision (esthétique)** : rupture stylistique volontaire déjà actée au point 24, réalisée via scanlines en CSS pur (`repeating-linear-gradient`), préfixe `> ` généré automatiquement sur les labels (`::before`), et `caret-color` pour teinter le curseur de texte natif du navigateur plutôt que de recréer un clignotement en JS.

**Correction en cours de route** : les boutons radio (type d'équipement) héritaient par défaut du style des champs texte, taille disproportionnée et alignement vertical cassé. Corrigé par une règle ciblée (exclusion des radios de la règle générale sur les `input`), `accent-color` pour teinter les radios nativement, et `display: flex` sur leurs labels.

**Statut** : ✅ Terminée. Notable : mergée directement sur `main` sans passer par une Pull Request (voir point 31, incident de méthode).

---

## 30. US12.5 : transition d'écran et refacto CSS

**Décision (effet visuel)** : animation CSS pure (`@keyframes`, `scaleY` et `filter: brightness`) simulant un allumage/extinction d'écran CRT, plutôt qu'un simple fade. Durée ajustée de 180ms à 800ms après retour utilisateur (effet initial jugé trop rapide).

**Point technique : synchronisation animation CSS et démontage JS.** La fermeture ne peut pas démonter immédiatement le composant `Modal` (`onClose`), sinon l'animation de fermeture n'aurait pas le temps de se jouer visuellement. Un état local `isClosing` change la classe CSS appliquée, et un `setTimeout` de même durée que l'animation retarde l'appel réel à `onClose`. Les deux valeurs (durée CSS et délai JS) doivent rester strictement identiques, sous peine de coupure brutale (délai trop court) ou de temps mort visible (délai trop long).

**Décision (refactoring CSS)** : à la demande explicite, `App.css` (atteignant ~400 lignes après 4 sous-Issues) réorganisé en 5 sections commentées (fondations, dashboard, terminal, animations, responsive) au sein d'un seul fichier, plutôt qu'un découpage en plusieurs fichiers CSS envisagé puis écarté par préférence. Corrige au passage un contre-ordre CSS existant (règle radio annulée juste après avoir été posée) par une exclusion ciblée (`:not([type="radio"])`) plutôt que deux règles contradictoires.

**Statut** : ✅ Terminée.

---

## 31. Incident de méthode : commit direct sur `main` (US12.4)

**Contexte** : lors de l'ouverture de la branche `feature/us12-terminal-modals`, la commande `git checkout -b` a échoué silencieusement dans l'enchaînement de commandes (la branche existait déjà depuis l'ouverture initiale de l'Issue). Le travail de la sous-Issue 4 a été commité et poussé directement sur `main`, sans Pull Request.

**Conséquence** : aucun impact fonctionnel (le code est correct et sur `main`), mais rupture de traçabilité, l'Issue `#27` ne s'est pas fermée automatiquement faute de PR mergée.

**Correction** : Issue fermée manuellement avec un commentaire explicite documentant l'écart, branche fantôme supprimée (locale et distante).

**Leçon retenue, appliquée dès la sous-Issue suivante** : après tout `git checkout -b`, vérifier immédiatement `git branch` pour confirmer qu'on est bien sur la nouvelle branche avant d'enchaîner d'autres commandes, plutôt que de supposer que l'enchaînement a fonctionné.

---

## Décisions en attente

- Détail des seuils exacts de déblocage par succès (ex: "10 séances" vs "50 séries")
- Où stocker `bodyPart` : sur `Series` directement, ou sur une future entité `Exercise` dédiée (lié à l'item backlog existant)
- Détail du pipeline CI (GitHub Actions), à documenter à sa mise en place
- Création des Issues GitHub pour les US restantes, faites au fur et à mesure
- Journaliser (leçon de méthode) l'incident de commit oublié avant merge sur US1, noté, pas encore fait