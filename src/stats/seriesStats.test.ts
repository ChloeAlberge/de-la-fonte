import { describe, it, expect } from "vitest";
import {
  computeFrequencyByExercise,
  computeFrequencyByEquipmentType,
  getUniqueExerciseNames,
  filterByExercise,
  computeAverageWeeklySessionCount,
  computeCurrentWeekSessionCount,
  computeMostUsedExercise,
  computeTotalVolume,
  computeProgressionForExercise,
} from "./seriesStats";
import type { Series } from "../models/series";

const legPress: Series = {
  id: "1",
  kind: "strength",
  exerciseName: "LegPress",
  equipmentType: "machine",
  weightKg: 91,
  reps: 10,
  setsCount: 3,
  performedAt: "2026-08-12T10:36:38.000Z",
  sessionId: null,
};

const legPressAgain: Series = {
  ...legPress,
  id: "2",
  performedAt: "2026-08-11T10:00:00.000Z",
};

const running: Series = {
  id: "3",
  kind: "cardio",
  exerciseName: "Course à pieds",
  distanceKm: 10,
  durationMin: 60,
  performedAt: "2026-08-12T13:52:51.000Z",
  sessionId: null,
};

const squat: Series = {
  id: "4",
  kind: "strength",
  exerciseName: "Squat",
  equipmentType: "poids_libre",
  weightKg: 80,
  reps: 8,
  setsCount: 4,
  performedAt: "2026-08-12T09:00:00.000Z",
  sessionId: null,
};

describe("getUniqueExerciseNames", () => {
  it("renvoie un tableau vide si aucune série", () => {
    expect(getUniqueExerciseNames([])).toEqual([]);
  });

  it("dédoublonne les noms d’exercice", () => {
    const names = getUniqueExerciseNames([legPress, legPressAgain, running]);

    expect(names).toEqual(["Course à pieds", "LegPress"]);
  });
});

describe("filterByExercise", () => {
  it("ne renvoie que les séries de l’exercice demandé", () => {
    const result = filterByExercise(
      [legPress, legPressAgain, running],
      "LegPress",
    );

    expect(result).toHaveLength(2);
    expect(result.every((s) => s.exerciseName === "LegPress")).toBe(true);
  });

  it("renvoie un tableau vide si aucune série ne correspond", () => {
    const result = filterByExercise([legPress, running], "Squat");

    expect(result).toEqual([]);
  });

  describe("computeFrequencyByExercise", () => {
    it("renvoie un objet vide si aucune série", () => {
      expect(computeFrequencyByExercise([])).toEqual({});
    });

    it("compte le nombre de séries et de jours distincts par exercice", () => {
      const result = computeFrequencyByExercise([
        legPress,
        legPressAgain,
        running,
      ]);

      expect(result["LegPress"]).toEqual({
        seriesCount: 2,
        distinctDaysCount: 2,
      });
      expect(result["Course à pieds"]).toEqual({
        seriesCount: 1,
        distinctDaysCount: 1,
      });
    });

    it("compte un seul jour distinct pour plusieurs séries le même jour", () => {
      const sameDaySecondSeries: Series = {
        ...legPress,
        id: "5",
        performedAt: "2026-08-12T18:00:00.000Z",
      };

      const result = computeFrequencyByExercise([
        legPress,
        sameDaySecondSeries,
      ]);

      expect(result["LegPress"]).toEqual({
        seriesCount: 2,
        distinctDaysCount: 1,
      });
    });
  });

  describe("computeFrequencyByEquipmentType", () => {
    it("ignore les séries cardio", () => {
      const result = computeFrequencyByEquipmentType([legPress, running]);

      expect(Object.keys(result)).toEqual(["machine"]);
    });

    it("regroupe par type d’équipement", () => {
      const result = computeFrequencyByEquipmentType([
        legPress,
        legPressAgain,
        squat,
      ]);

      expect(result["machine"]).toEqual({
        seriesCount: 2,
        distinctDaysCount: 2,
      });
      expect(result["poids_libre"]).toEqual({
        seriesCount: 1,
        distinctDaysCount: 1,
      });
    });
  });
});

describe('computeMostUsedExercise', () => {
  it('renvoie null si aucune série', () => {
    expect(computeMostUsedExercise([])).toBeNull();
  });

  it('renvoie l’exercice avec le plus de séries', () => {
    const result = computeMostUsedExercise([legPress, legPressAgain, running]);

    expect(result).toBe('LegPress');
  });
});

describe('computeTotalVolume', () => {
  it('renvoie un volume nul si aucune série', () => {
    expect(computeTotalVolume([])).toEqual({ weightedVolumeKg: 0, bodyweightReps: 0 });
  });

  it('calcule le volume pondéré (poids × reps × setsCount)', () => {
    // legPress : 91kg × 10 reps × 3 sets = 2730
    const result = computeTotalVolume([legPress]);

    expect(result.weightedVolumeKg).toBe(2730);
    expect(result.bodyweightReps).toBe(0);
  });

  it('ignore le cardio dans le calcul du volume', () => {
    const result = computeTotalVolume([legPress, running]);

    expect(result.weightedVolumeKg).toBe(2730);
  });

  it('comptabilise le poids du corps séparément', () => {
    const bodyweightSquat: Series = {
      id: '6',
      kind: 'strength',
      exerciseName: 'Squat au poids du corps',
      equipmentType: 'poids_du_corps',
      weightKg: null,
      reps: 15,
      setsCount: 3,
      performedAt: '2026-08-12T09:00:00.000Z',
      sessionId: null,
    };

    const result = computeTotalVolume([bodyweightSquat]);

    expect(result.weightedVolumeKg).toBe(0);
    expect(result.bodyweightReps).toBe(45); // 15 reps × 3 sets
  });
});

describe('computeCurrentWeekSessionCount', () => {
  it('renvoie 0 si aucune série cette semaine', () => {
    const oldSeries: Series = { ...legPress, id: '7', performedAt: '2020-01-01T10:00:00.000Z' };

    expect(computeCurrentWeekSessionCount([oldSeries])).toBe(0);
  });

  it('compte les séances de la semaine en cours', () => {
    const today: Series = { ...legPress, id: '8', performedAt: new Date().toISOString() };

    expect(computeCurrentWeekSessionCount([today])).toBe(1);
  });
});

describe('computeAverageWeeklySessionCount', () => {
  it('renvoie 0 si aucune série', () => {
    expect(computeAverageWeeklySessionCount([])).toBe(0);
  });

  it('ne divise pas par zéro pour une seule journée', () => {
    const today: Series = { ...legPress, id: '9', performedAt: new Date().toISOString() };

    const result = computeAverageWeeklySessionCount([today]);

    expect(result).toBeGreaterThan(0);
    expect(Number.isFinite(result)).toBe(true);
  });
});

describe('computeProgressionForExercise', () => {
  it('renvoie un tableau vide si aucune série pour cet exercice', () => {
    expect(computeProgressionForExercise([legPress], 'Squat')).toEqual([]);
  });

  it('exclut le cardio même si le nom d’exercice correspond', () => {
    const fakeCardio: Series = { ...running, exerciseName: 'LegPress' };

    const result = computeProgressionForExercise([fakeCardio], 'LegPress');

    expect(result).toEqual([]);
  });

  it('exclut les séries au poids du corps sans poids connu', () => {
    const bodyweight: Series = {
      id: '10',
      kind: 'strength',
      exerciseName: 'Squat',
      equipmentType: 'poids_du_corps',
      weightKg: null,
      reps: 15,
      setsCount: 3,
      performedAt: '2026-08-12T09:00:00.000Z',
      sessionId: null,
    };

    expect(computeProgressionForExercise([bodyweight], 'Squat')).toEqual([]);
  });

  it('trie les points chronologiquement, du plus ancien au plus récent', () => {
    const result = computeProgressionForExercise([legPress, legPressAgain], 'LegPress');

    expect(result).toEqual([
      { date: '2026-08-11', weightKg: 91 },
      { date: '2026-08-12', weightKg: 91 },
    ]);
  });
});