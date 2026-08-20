import { describe, it, expect, beforeEach } from "vitest";
import {
  getAllSeries,
  addSeries,
  updateSeries,
  deleteSeries,
} from "./seriesStorage";
import type { NewSeries } from "../models/series";

const sampleSeries: NewSeries = {
  kind: "strength",
  exerciseName: "Développé couché",
  equipmentType: "machine",
  weightKg: 60,
  reps: 10,
  setsCount: 3,
  performedAt: "2026-08-11T10:00:00.000Z",
  sessionId: null,
  bodyPart: 'haut_du_corps',
};

describe("seriesStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renvoie un tableau vide quand rien n’est stocké", () => {
    expect(getAllSeries()).toEqual([]);
  });

  it("ajoute une série et lui génère un id", () => {
    const created = addSeries(sampleSeries);

    expect(created.id).toBeTruthy();
    expect(created.exerciseName).toBe("Développé couché");
    expect(getAllSeries()).toHaveLength(1);
  });

  it("modifie une série existante", () => {
    const created = addSeries(sampleSeries);

    const updated = updateSeries(created.id, { weightKg: 65 });

    if (updated.kind !== "strength") {
      throw new Error("Expected a strength series");
    }

    expect(updated.weightKg).toBe(65);
    expect(updated.exerciseName).toBe("Développé couché");
  });

  it("lève une erreur si on modifie un id inexistant", () => {
    expect(() => updateSeries("id-inexistant", { weightKg: 10 })).toThrow();
  });

  it("supprime une série", () => {
    const created = addSeries(sampleSeries);

    deleteSeries(created.id);

    expect(getAllSeries()).toEqual([]);
  });
});
