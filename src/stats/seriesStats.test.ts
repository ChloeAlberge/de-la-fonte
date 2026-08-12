import { describe, it, expect } from 'vitest';
import { getUniqueExerciseNames, filterByExercise } from './seriesStats';
import type { Series } from '../models/series';

const legPress: Series = {
  id: '1',
  kind: 'strength',
  exerciseName: 'LegPress',
  equipmentType: 'machine',
  weightKg: 91,
  reps: 10,
  setsCount: 3,
  performedAt: '2026-08-12T10:36:38.000Z',
  sessionId: null,
};

const legPressAgain: Series = {
  ...legPress,
  id: '2',
  performedAt: '2026-08-11T10:00:00.000Z',
};

const running: Series = {
  id: '3',
  kind: 'cardio',
  exerciseName: 'Course à pieds',
  distanceKm: 10,
  durationMin: 60,
  performedAt: '2026-08-12T13:52:51.000Z',
  sessionId: null,
};

describe('getUniqueExerciseNames', () => {
  it('renvoie un tableau vide si aucune série', () => {
    expect(getUniqueExerciseNames([])).toEqual([]);
  });

  it('dédoublonne les noms d’exercice', () => {
    const names = getUniqueExerciseNames([legPress, legPressAgain, running]);

    expect(names).toEqual(['Course à pieds', 'LegPress']);
  });
});

describe('filterByExercise', () => {
  it('ne renvoie que les séries de l’exercice demandé', () => {
    const result = filterByExercise([legPress, legPressAgain, running], 'LegPress');

    expect(result).toHaveLength(2);
    expect(result.every((s) => s.exerciseName === 'LegPress')).toBe(true);
  });

  it('renvoie un tableau vide si aucune série ne correspond', () => {
    const result = filterByExercise([legPress, running], 'Squat');

    expect(result).toEqual([]);
  });
});