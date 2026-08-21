import { describe, it, expect } from 'vitest';
import { isAchievementUnlocked, computeUnlockedAchievements } from './achievementStats';
import type { Series, StrengthSeries, CardioSeries } from '../models/series';
import type { Session } from '../models/session';

function makeStrength(overrides: Partial<StrengthSeries> = {}): StrengthSeries {
  return {
    id: crypto.randomUUID(),
    kind: 'strength',
    exerciseName: 'Bench Press',
    equipmentType: 'machine',
    weightKg: 50,
    reps: 10,
    setsCount: 3,
    performedAt: new Date().toISOString(),
    sessionId: null,
    bodyPart: 'haut_du_corps',
    ...overrides,
  };
}

function makeCardio(overrides: Partial<CardioSeries> = {}): CardioSeries {
  return {
    id: crypto.randomUUID(),
    kind: 'cardio',
    exerciseName: 'Course à pied',
    distanceKm: 5,
    durationMin: 30,
    performedAt: new Date().toISOString(),
    sessionId: null,
    bodyPart: 'full_body',
    ...overrides,
  };
}

function makeSession(overrides: Partial<Session> = {}): Session {
  return {
    id: crypto.randomUUID(),
    startedAt: new Date().toISOString(),
    endedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('isAchievementUnlocked — totalSeriesCount', () => {
  it('non débloqué si en dessous du seuil', () => {
    const series: Series[] = [makeStrength(), makeStrength()];
    expect(isAchievementUnlocked({ type: 'totalSeriesCount', threshold: 5 }, series, [])).toBe(false);
  });

  it('débloqué si le seuil est atteint exactement', () => {
    const series: Series[] = [makeStrength(), makeStrength()];
    expect(isAchievementUnlocked({ type: 'totalSeriesCount', threshold: 2 }, series, [])).toBe(true);
  });
});

describe('isAchievementUnlocked — sessionCompletedCount', () => {
  it('ne compte que les séances terminées (endedAt non null)', () => {
    const sessions: Session[] = [makeSession(), makeSession({ endedAt: null })];
    expect(isAchievementUnlocked({ type: 'sessionCompletedCount', threshold: 2 }, [], sessions)).toBe(false);
    expect(isAchievementUnlocked({ type: 'sessionCompletedCount', threshold: 1 }, [], sessions)).toBe(true);
  });
});

describe('isAchievementUnlocked — distinctExerciseCount', () => {
  it('compte les noms d’exercice uniques, pas le nombre de séries', () => {
    const series: Series[] = [
      makeStrength({ exerciseName: 'Squat' }),
      makeStrength({ exerciseName: 'Squat' }),
      makeStrength({ exerciseName: 'Deadlift' }),
    ];
    expect(isAchievementUnlocked({ type: 'distinctExerciseCount', threshold: 2 }, series, [])).toBe(true);
    expect(isAchievementUnlocked({ type: 'distinctExerciseCount', threshold: 3 }, series, [])).toBe(false);
  });
});

describe('isAchievementUnlocked — cardio (count, durée, distance)', () => {
  it('cardioSeriesCount ignore les séries de muscu', () => {
    const series: Series[] = [makeStrength(), makeCardio()];
    expect(isAchievementUnlocked({ type: 'cardioSeriesCount', threshold: 1 }, series, [])).toBe(true);
    expect(isAchievementUnlocked({ type: 'cardioSeriesCount', threshold: 2 }, series, [])).toBe(false);
  });

  it('cardioDurationCumulated additionne les durées', () => {
    const series: Series[] = [makeCardio({ durationMin: 30 }), makeCardio({ durationMin: 45 })];
    expect(isAchievementUnlocked({ type: 'cardioDurationCumulated', thresholdMinutes: 75 }, series, [])).toBe(true);
    expect(isAchievementUnlocked({ type: 'cardioDurationCumulated', thresholdMinutes: 76 }, series, [])).toBe(false);
  });

  it('cardioDistanceCumulated gère une distance null sans planter', () => {
    const series: Series[] = [makeCardio({ distanceKm: null }), makeCardio({ distanceKm: 10 })];
    expect(isAchievementUnlocked({ type: 'cardioDistanceCumulated', thresholdKm: 10 }, series, [])).toBe(true);
  });
});

describe('isAchievementUnlocked — totalVolumeCumulated', () => {
  it('utilise le volume pondéré (poids × reps × sets)', () => {
    // 50kg × 10 reps × 3 sets = 1500
    const series: Series[] = [makeStrength({ weightKg: 50, reps: 10, setsCount: 3 })];
    expect(isAchievementUnlocked({ type: 'totalVolumeCumulated', thresholdKg: 1500 }, series, [])).toBe(true);
    expect(isAchievementUnlocked({ type: 'totalVolumeCumulated', thresholdKg: 1501 }, series, [])).toBe(false);
  });
});

describe('isAchievementUnlocked — seriesCountByBodyPart', () => {
  it('filtre strictement sur la bonne partie du corps', () => {
    const series: Series[] = [
      makeStrength({ bodyPart: 'haut_du_corps' }),
      makeStrength({ bodyPart: 'bas_du_corps' }),
    ];
    expect(
      isAchievementUnlocked({ type: 'seriesCountByBodyPart', bodyPart: 'haut_du_corps', threshold: 1 }, series, [])
    ).toBe(true);
    expect(
      isAchievementUnlocked({ type: 'seriesCountByBodyPart', bodyPart: 'haut_du_corps', threshold: 2 }, series, [])
    ).toBe(false);
  });
});

describe('isAchievementUnlocked — personalRecordCount (cas piégeux)', () => {
  it('la toute première série d’un exercice ne compte jamais comme record', () => {
    const series: Series[] = [makeStrength({ exerciseName: 'Squat', weightKg: 80 })];
    expect(
      isAchievementUnlocked({ type: 'personalRecordCount', bodyPart: 'haut_du_corps', threshold: 1 }, series, [])
    ).toBe(false);
  });

  it('une série qui dépasse le max précédent compte comme record', () => {
    const series: Series[] = [
      makeStrength({ exerciseName: 'Squat', weightKg: 80, performedAt: '2026-01-01T10:00:00.000Z' }),
      makeStrength({ exerciseName: 'Squat', weightKg: 90, performedAt: '2026-01-08T10:00:00.000Z' }),
    ];
    expect(
      isAchievementUnlocked({ type: 'personalRecordCount', bodyPart: 'haut_du_corps', threshold: 1 }, series, [])
    ).toBe(true);
  });

  it('une série égale ou inférieure au max ne compte pas comme record', () => {
    const series: Series[] = [
      makeStrength({ exerciseName: 'Squat', weightKg: 80, performedAt: '2026-01-01T10:00:00.000Z' }),
      makeStrength({ exerciseName: 'Squat', weightKg: 80, performedAt: '2026-01-08T10:00:00.000Z' }),
      makeStrength({ exerciseName: 'Squat', weightKg: 70, performedAt: '2026-01-15T10:00:00.000Z' }),
    ];
    expect(
      isAchievementUnlocked({ type: 'personalRecordCount', bodyPart: 'haut_du_corps', threshold: 1 }, series, [])
    ).toBe(false);
  });

  it('les records sont comptés indépendamment par exercice', () => {
    const series: Series[] = [
      makeStrength({ exerciseName: 'Squat', weightKg: 80, performedAt: '2026-01-01T10:00:00.000Z' }),
      makeStrength({ exerciseName: 'Squat', weightKg: 90, performedAt: '2026-01-08T10:00:00.000Z' }),
      makeStrength({ exerciseName: 'Deadlift', weightKg: 100, performedAt: '2026-01-01T10:00:00.000Z' }),
      makeStrength({ exerciseName: 'Deadlift', weightKg: 110, performedAt: '2026-01-08T10:00:00.000Z' }),
    ];
    expect(
      isAchievementUnlocked({ type: 'personalRecordCount', bodyPart: 'haut_du_corps', threshold: 2 }, series, [])
    ).toBe(true);
  });

  it('ignore le poids du corps (weightKg null)', () => {
    const series: Series[] = [
      makeStrength({ exerciseName: 'Squat', weightKg: null, equipmentType: 'poids_du_corps' }),
      makeStrength({ exerciseName: 'Squat', weightKg: null, equipmentType: 'poids_du_corps' }),
    ];
    expect(
      isAchievementUnlocked({ type: 'personalRecordCount', bodyPart: 'haut_du_corps', threshold: 1 }, series, [])
    ).toBe(false);
  });
});

describe('isAchievementUnlocked — regularityMonths (cas piégeux)', () => {
  it('non débloqué si le temps n’est pas encore écoulé, même avec une bonne activité', () => {
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 10); // il y a 10 jours seulement
    const series: Series[] = [makeStrength({ performedAt: recentDate.toISOString() })];

    expect(
      isAchievementUnlocked({ type: 'regularityMonths', months: 3, minWeeklySessions: 1 }, series, [])
    ).toBe(false);
  });

  it('non débloqué si le temps est écoulé mais l’activité est trop faible', () => {
    const oldDate = new Date();
    oldDate.setMonth(oldDate.getMonth() - 4); // il y a 4 mois
    // Une seule série sur toute la période = activité très faible
    const series: Series[] = [makeStrength({ performedAt: oldDate.toISOString() })];

    expect(
      isAchievementUnlocked({ type: 'regularityMonths', months: 3, minWeeklySessions: 1 }, series, [])
    ).toBe(false);
  });
});

describe('computeUnlockedAchievements', () => {
  it('renvoie une liste vide sans aucune donnée', () => {
    expect(computeUnlockedAchievements([], [])).toEqual([]);
  });

  it('inclut bien "Premiers pas" dès la première série', () => {
    const series: Series[] = [makeStrength()];
    const unlocked = computeUnlockedAchievements(series, []);

    expect(unlocked.some((a) => a.id === 'coach-first-series')).toBe(true);
  });
});