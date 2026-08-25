# Journal de conception : De la Fonte

Ce document trace les principales décisions d'architecture et de conception prises pendant le développement du projet, avec leur justification. Il est organisé par thème plutôt que chronologiquement, pour rester lisible indépendamment de l'ordre réel de construction.

Pour le détail fonctionnel (User Stories, périmètre), voir [`docs/USER-STORIES.md`](USER-STORIES.md).

---

## Vue d'ensemble

"De la Fonte" est une PWA (Progressive Web App) de suivi de performances de musculation et de cardio : saisie de séries, historique, statistiques, graphiques de progression, et un système de succès à débloquer basé sur l'historique d'entraînement.

Stack : React, TypeScript, Vite, `localStorage`, Vitest, `vite-plugin-pwa`.

---

## Choix technologiques fondamentaux

### Framework : React plutôt qu'un framework imposant sa structure

Angular (ou un framework équivalent) impose sa propre architecture : modules, injection de dépendances, structure de dossiers. React laisse cette organisation à la charge du développeur. Ce projet fait volontairement ce second choix : concevoir sa propre séparation en couches est plus démonstratif d'une compétence d'architecture que d'appliquer une structure déjà décidée par un framework.

### TypeScript

Typage explicite des contrats de données entre les couches de l'application. Utilisé de façon avancée dans ce projet : unions discriminées, garde de types, `Extract<T>`, types homomorphiques (voir sections suivantes).

### Vite plutôt que Next.js

L'application est une SPA offline-first sans besoin de rendu serveur (pas de SEO à gérer, pas de contenu à indexer). Next.js aurait ajouté de la complexité (hydratation) sans bénéfice pour ce cas d'usage.

### Stockage : `localStorage`, pas de backend

Usage mono-utilisateur, un seul appareil. Un backend n'apporterait aucune valeur tant qu'un besoin de synchronisation multi-appareils ne se confirme pas ; application du principe **YAGNI**. Cette architecture est conçue pour migrer vers une API en V2 sans réécriture (voir section Architecture).

---

## Architecture logicielle

### Séparation en couches

```
UI (composants React)
   ↓
Statistiques (calculs dérivés)
   ↓
Storage (accès aux données)
   ↓
Models (types partagés)
```

La couche `storage` est la seule à connaître `localStorage` : c'est elle qui devra changer si la persistance évolue vers une API, sans impact sur l'UI ni la logique métier. La couche `stats` ne dépend que des `models`, jamais de `storage` : elle reçoit des données déjà chargées et en dérive des résultats, ce qui la rend testable sans mock.

### Modélisation par union discriminée

Le suivi couvre deux types d'activité (musculation, cardio) aux données incompatibles (poids/répétitions vs distance/durée). Plutôt qu'un modèle unique avec des champs optionnels non pertinents selon le cas, le projet utilise une **union discriminée** :

```typescript
export type Series = StrengthSeries | CardioSeries;
```

Chaque variante ne porte que les champs qui la concernent, et TypeScript empêche à la compilation les combinaisons incohérentes (accéder à `reps` sur une entrée cardio, par exemple). Le même pattern structure le catalogue de succès (10 types de déclencheurs métier), avec un `switch` exhaustif sur le discriminant : le compilateur signale toute variante non gérée, un garde-fou volontairement préféré à une table de handlers plus "élégante" visuellement mais qui aurait nécessité un cast TypeScript perdant cette garantie.

### Règles métier portées par la couche storage

Certaines contraintes (une seule séance d'entraînement active à la fois) ne peuvent pas être exprimées dans le typage seul : elles sont donc appliquées explicitement dans la couche storage, qui lève une erreur plutôt que de laisser un état incohérent s'installer silencieusement.

### Statistiques et succès comme données dérivées, jamais stockées

Le système de succès à débloquer (27 succès, 5 catégories, seuils cumulatifs et détection de records personnels) est **entièrement recalculé à la volée** à partir de l'historique existant, plutôt que stocké comme un état séparé. Ce choix évite un risque de désynchronisation entre "l'état des succès" et "les données réelles" : le même principe que les statistiques globales (US9), qui ne sont jamais mises en cache mais toujours recalculées depuis la source.

---

## Modélisation des données

### Séries, séances, exercices

- **`Series`** : une série d'exercice (union `StrengthSeries` / `CardioSeries`), avec un identifiant de séance optionnel (`sessionId: string | null`) permettant la saisie libre hors séance suivie.
- **`Session`** : une séance (début/fin), reliée aux séries qu'elle contient. Contrainte métier : une seule séance active à la fois.
- **Catalogue d'exercices** : ~130 exercices prédéfinis avec une segmentation par partie du corps (haut du corps / bas du corps / full body), utilisés pour l'autocomplétion et le calcul automatique de la catégorie. Une option "personnalisé" reste toujours disponible en saisie libre.

**Décision notable** : la partie du corps (`bodyPart`) est stockée directement sur chaque série au moment de la saisie, plutôt qu'une référence vers le catalogue. Ce choix rend chaque série autonome : modifier ou faire évoluer le catalogue plus tard n'affecte jamais rétroactivement les données déjà enregistrées.

### Système de succès

Le moteur de succès couvre 10 types de déclencheurs (seuils cumulatifs, cumuls de cardio, volume soulevé, détection de record personnel, régularité dans le temps). La détection de record est le cas le plus délicat : une série ne compte comme record que si elle dépasse un maximum **déjà existant** sur ce même exercice : la toute première entrée d'un exercice ne peut jamais être un "record" par définition, un point vérifié explicitement par les tests.

---

## Qualité et tests

Suite de tests unitaires (Vitest) et de composants (`@testing-library/react`), couvrant les couches storage, statistiques, et le moteur de succès, 58 tests au total. L'architecture en couches permet de tester la logique métier (calculs, règles de déblocage) sans dépendance à `localStorage` ni au rendu React, en isolant les fonctions pures.

---

## Identité visuelle et expérience utilisateur

Interface construite mobile-first, avec deux registres visuels volontairement contrastés :
- **Tableau de bord** : esthétique "HUD" néon (cyan, violet, magenta), pensée pour la lisibilité des données déjà enregistrées.
- **Formulaires de saisie** : pastiche de terminal informatique (police monospace, bordures ASCII, curseur natif teinté), une rupture stylistique délibérée pour marquer le changement de mode entre consultation et saisie.

PWA installable (manifest, Service Worker via `vite-plugin-pwa`), fonctionnement hors ligne vérifié.

---

## Méthodologie de développement

- **GitHub Flow** : une branche par fonctionnalité, Pull Request systématique, Issues liées aux commits (`Closes #N`).
- **Décomposition en sous-Issues** pour les chantiers transverses (identité visuelle, système de succès), chacune mergée indépendamment plutôt qu'un unique gros changement.
- **Documentation continue** : chaque décision d'architecture significative est tracée avec les alternatives envisagées et la justification du choix retenu, y compris quand une décision antérieure a été révisée suite à un nouveau besoin (ex : le champ `bodyPart`, ajouté après coup sans migration des données existantes, un compromis assumé et documenté plutôt qu'un oubli).

---

## Perspectives

- Illustrations complètes du système de succès (roster de personnages)
- Enrichissement du catalogue d'exercices
- Tests automatisés en intégration continue (actuellement exécutés localement)
- Optimisation du poids du bundle (code-splitting)