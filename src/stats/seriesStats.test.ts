import { describe, it, expect } from "vitest";
import {
  computeFrequencyByExercise,
  computeFrequencyByEquipmentType,
  getUniqueExerciseNames,
  filterByExercise,
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
