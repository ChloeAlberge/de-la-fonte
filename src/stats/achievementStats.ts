import type { Series, StrengthSeries } from '../models/series';
import type { Session } from '../models/session';
import type { BodyPart } from '../models/exercise';
import { ACHIEVEMENTS, type Achievement, type AchievementTrigger } from '../models/achievement';
import { computeTotalVolume, computeAverageWeeklySessionCount } from './seriesStats';

function countDistinctExercises(series: Series[]): number {
  return new Set(series.map((s) => s.exerciseName)).size;
}

function countCardioSeries(series: Series[]): number {
  return series.filter((s) => s.kind === 'cardio').length;
}

function sumCardioDuration(series: Series[]): number {
  return series
    .filter((s): s is Extract<Series, { kind: 'cardio' }> => s.kind === 'cardio')
    .reduce((sum, s) => sum + s.durationMin, 0);
}

function sumCardioDistance(series: Series[]): number {
  return series
    .filter((s): s is Extract<Series, { kind: 'cardio' }> => s.kind === 'cardio')
    .reduce((sum, s) => sum + (s.distanceKm ?? 0), 0);
}

function countSeriesByBodyPart(series: Series[], bodyPart: BodyPart): number {
  return series.filter((s) => s.bodyPart === bodyPart).length;
}

function countSessionsCompleted(sessions: Session[]): number {
  return sessions.filter((s) => s.endedAt !== null).length;
}

function countPersonalRecords(series: Series[], bodyPart: BodyPart): number {
  const eligible = series.filter(
    (s): s is StrengthSeries =>
      s.kind === 'strength' && s.bodyPart === bodyPart && s.weightKg !== null
  );

  const byExercise = new Map<string, StrengthSeries[]>();
  for (const entry of eligible) {
    const list = byExercise.get(entry.exerciseName) ?? [];
    list.push(entry);
    byExercise.set(entry.exerciseName, list);
  }

  let recordCount = 0;

  for (const entries of byExercise.values()) {
    const sorted = [...entries].sort((a, b) => a.performedAt.localeCompare(b.performedAt));
    let maxSoFar = -Infinity;

    for (const entry of sorted) {
      const weight = entry.weightKg as number;
      if (maxSoFar !== -Infinity && weight > maxSoFar) {
        recordCount += 1;
      }
      if (weight > maxSoFar) {
        maxSoFar = weight;
      }
    }
  }

  return recordCount;
}

function monthsSinceFirstSeries(series: Series[]): number {
  if (series.length === 0) return 0;

  const timestamps = series.map((s) => new Date(s.performedAt).getTime());
  const firstDate = Math.min(...timestamps);
  const msPerMonth = 1000 * 60 * 60 * 24 * 30.44;

  return (Date.now() - firstDate) / msPerMonth;
}

export function isAchievementUnlocked(
  trigger: AchievementTrigger,
  series: Series[],
  sessions: Session[]
): boolean {
  switch (trigger.type) {
    case 'totalSeriesCount':
      return series.length >= trigger.threshold;
    case 'sessionCompletedCount':
      return countSessionsCompleted(sessions) >= trigger.threshold;
    case 'distinctExerciseCount':
      return countDistinctExercises(series) >= trigger.threshold;
    case 'cardioSeriesCount':
      return countCardioSeries(series) >= trigger.threshold;
    case 'cardioDurationCumulated':
      return sumCardioDuration(series) >= trigger.thresholdMinutes;
    case 'cardioDistanceCumulated':
      return sumCardioDistance(series) >= trigger.thresholdKm;
    case 'totalVolumeCumulated':
      return computeTotalVolume(series).weightedVolumeKg >= trigger.thresholdKg;
    case 'seriesCountByBodyPart':
      return countSeriesByBodyPart(series, trigger.bodyPart) >= trigger.threshold;
    case 'personalRecordCount':
      return countPersonalRecords(series, trigger.bodyPart) >= trigger.threshold;
    case 'regularityMonths':
      return (
        monthsSinceFirstSeries(series) >= trigger.months &&
        computeAverageWeeklySessionCount(series) >= trigger.minWeeklySessions
      );
  }
}

export function computeUnlockedAchievements(series: Series[], sessions: Session[]): Achievement[] {
  return ACHIEVEMENTS.filter((achievement) => isAchievementUnlocked(achievement.trigger, series, sessions));
}