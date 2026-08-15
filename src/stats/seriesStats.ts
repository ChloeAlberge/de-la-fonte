import type { Series } from "../models/series";

export function getUniqueExerciseNames(series: Series[]): string[] {
  const names = series.map((s) => s.exerciseName);
  return Array.from(new Set(names)).sort();
}

export function filterByExercise(
  series: Series[],
  exerciseName: string,
): Series[] {
  return series.filter((s) => s.exerciseName === exerciseName);
}

export interface ExerciseFrequency {
  seriesCount: number;
  distinctDaysCount: number;
}

export function computeFrequencyByExercise(
  series: Series[],
): Record<string, ExerciseFrequency> {
  const result: Record<string, ExerciseFrequency> = {};

  for (const entry of series) {
    if (!result[entry.exerciseName]) {
      result[entry.exerciseName] = { seriesCount: 0, distinctDaysCount: 0 };
    }
    result[entry.exerciseName].seriesCount += 1;
  }

  for (const exerciseName of Object.keys(result)) {
    const entriesForExercise = series.filter(
      (s) => s.exerciseName === exerciseName,
    );
    const uniqueDays = new Set(
      entriesForExercise.map((s) => s.performedAt.slice(0, 10)),
    );
    result[exerciseName].distinctDaysCount = uniqueDays.size;
  }

  return result;
}

export function computeFrequencyByEquipmentType(
  series: Series[],
): Record<string, ExerciseFrequency> {
  const strengthOnly = series.filter(
    (s): s is Extract<Series, { kind: "strength" }> => s.kind === "strength",
  );

  const result: Record<string, ExerciseFrequency> = {};

  for (const entry of strengthOnly) {
    if (!result[entry.equipmentType]) {
      result[entry.equipmentType] = { seriesCount: 0, distinctDaysCount: 0 };
    }
    result[entry.equipmentType].seriesCount += 1;
  }

  for (const equipmentType of Object.keys(result)) {
    const entriesForType = strengthOnly.filter(
      (s) => s.equipmentType === equipmentType,
    );
    const uniqueDays = new Set(
      entriesForType.map((s) => s.performedAt.slice(0, 10)),
    );
    result[equipmentType].distinctDaysCount = uniqueDays.size;
  }

  return result;
}

export function computeAverageWeeklySessionCount(series: Series[]): number {
  if (series.length === 0) return 0;

  const uniqueDays = new Set(series.map((s) => s.performedAt.slice(0, 10)));
  const sortedDates = Array.from(uniqueDays).sort();

  const firstDate = new Date(sortedDates[0]);
  const lastDate = new Date();

  const msPerWeek = 1000 * 60 * 60 * 24 * 7;
  const weeksElapsed = Math.max(
    1,
    (lastDate.getTime() - firstDate.getTime()) / msPerWeek,
  );

  return uniqueDays.size / weeksElapsed;
}

export function computeCurrentWeekSessionCount(series: Series[]): number {
  const now = new Date();
  const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay(); // dimanche = 7, pas 0
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(now.getDate() - (dayOfWeek - 1));

  const daysThisWeek = series
    .filter((s) => new Date(s.performedAt) >= startOfWeek)
    .map((s) => s.performedAt.slice(0, 10));

  return new Set(daysThisWeek).size;
}

export function computeMostUsedExercise(series: Series[]): string | null {
  const frequencies = computeFrequencyByExercise(series);
  const entries = Object.entries(frequencies);

  if (entries.length === 0) return null;

  const [mostUsed] = entries.reduce((best, current) =>
    current[1].seriesCount > best[1].seriesCount ? current : best,
  );

  return mostUsed;
}

export interface VolumeResult {
  weightedVolumeKg: number;
  bodyweightReps: number;
}

export function computeTotalVolume(series: Series[]): VolumeResult {
  const strengthOnly = series.filter(
    (s): s is Extract<Series, { kind: "strength" }> => s.kind === "strength",
  );

  let weightedVolumeKg = 0;
  let bodyweightReps = 0;

  for (const entry of strengthOnly) {
    if (entry.weightKg !== null && entry.reps !== null) {
      weightedVolumeKg += entry.weightKg * entry.reps * entry.setsCount;
    } else if (
      entry.equipmentType === "poids_du_corps" &&
      entry.reps !== null
    ) {
      bodyweightReps += entry.reps * entry.setsCount;
    }
  }

  return { weightedVolumeKg, bodyweightReps };
}

export interface ProgressPoint {
  date: string;
  weightKg: number;
}

export function computeProgressionForExercise(
  series: Series[],
  exerciseName: string,
): ProgressPoint[] {
  return series
    .filter(
      (s): s is Extract<Series, { kind: "strength" }> =>
        s.kind === "strength" &&
        s.exerciseName === exerciseName &&
        s.weightKg !== null,
    )
    .map((s) => ({
      date: s.performedAt.slice(0, 10),
      weightKg: s.weightKg as number,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
