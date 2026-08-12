import type { Series } from '../models/series';

export function getUniqueExerciseNames(series: Series[]): string[] {
  const names = series.map((s) => s.exerciseName);
  return Array.from(new Set(names)).sort();
}

export function filterByExercise(series: Series[], exerciseName: string): Series[] {
  return series.filter((s) => s.exerciseName === exerciseName);
}

export interface ExerciseFrequency {
  seriesCount: number;
  distinctDaysCount: number;
}

export function computeFrequencyByExercise(series: Series[]): Record<string, ExerciseFrequency> {
  const result: Record<string, ExerciseFrequency> = {};

  for (const entry of series) {
    if (!result[entry.exerciseName]) {
      result[entry.exerciseName] = { seriesCount: 0, distinctDaysCount: 0 };
    }
    result[entry.exerciseName].seriesCount += 1;
  }

  for (const exerciseName of Object.keys(result)) {
    const entriesForExercise = series.filter((s) => s.exerciseName === exerciseName);
    const uniqueDays = new Set(entriesForExercise.map((s) => s.performedAt.slice(0, 10)));
    result[exerciseName].distinctDaysCount = uniqueDays.size;
  }

  return result;
}

export function computeFrequencyByEquipmentType(
  series: Series[]
): Record<string, ExerciseFrequency> {
  const strengthOnly = series.filter((s): s is Extract<Series, { kind: 'strength' }> => s.kind === 'strength');

  const result: Record<string, ExerciseFrequency> = {};

  for (const entry of strengthOnly) {
    if (!result[entry.equipmentType]) {
      result[entry.equipmentType] = { seriesCount: 0, distinctDaysCount: 0 };
    }
    result[entry.equipmentType].seriesCount += 1;
  }

  for (const equipmentType of Object.keys(result)) {
    const entriesForType = strengthOnly.filter((s) => s.equipmentType === equipmentType);
    const uniqueDays = new Set(entriesForType.map((s) => s.performedAt.slice(0, 10)));
    result[equipmentType].distinctDaysCount = uniqueDays.size;
  }

  return result;
}