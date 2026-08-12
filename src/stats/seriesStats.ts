import type { Series } from '../models/series';

export function getUniqueExerciseNames(series: Series[]): string[] {
  const names = series.map((s) => s.exerciseName);
  return Array.from(new Set(names)).sort();
}

export function filterByExercise(series: Series[], exerciseName: string): Series[] {
  return series.filter((s) => s.exerciseName === exerciseName);
}