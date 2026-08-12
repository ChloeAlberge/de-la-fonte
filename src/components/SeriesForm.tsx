import { useState, type FormEvent } from "react";
import type { EquipmentType, NewSeries } from "../models/series";
import { addSeries } from "../storage/seriesStorage";

interface SeriesFormProps {
  onSeriesAdded: () => void;
}

const EQUIPMENT_TYPES: EquipmentType[] = [
  "machine",
  "poids_libre",
  "poids_du_corps",
];

export function SeriesForm({ onSeriesAdded }: SeriesFormProps) {
  const [exerciseName, setExerciseName] = useState("");
  const [equipmentType, setEquipmentType] = useState<EquipmentType>("machine");
  const [weightKg, setWeightKg] = useState("");
  const [reps, setReps] = useState("");
  const [setsCount, setSetsCount] = useState("1");

  const isBodyweight = equipmentType === "poids_du_corps";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newSeries: NewSeries = {
      kind: "strength",
      exerciseName,
      equipmentType,
      weightKg: weightKg === "" ? null : Number(weightKg),
      reps: reps === "" ? null : Number(reps),
      setsCount: Number(setsCount),
      performedAt: new Date().toISOString(),
      sessionId: null,
    };

    addSeries(newSeries);

    setExerciseName("");
    setEquipmentType("machine");
    setWeightKg("");
    setReps("");
    setSetsCount("1");

    onSeriesAdded();
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Exercice
        <input
          type="text"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
          required
        />
      </label>

      <fieldset>
        <legend>Type d'équipement</legend>
        {EQUIPMENT_TYPES.map((type) => (
          <label key={type}>
            <input
              type="radio"
              name="equipmentType"
              value={type}
              checked={equipmentType === type}
              onChange={() => setEquipmentType(type)}
            />
            {type}
          </label>
        ))}
      </fieldset>

      <label>
        Poids (kg) {isBodyweight && "— optionnel"}
        <input
          type="number"
          value={weightKg}
          onChange={(e) => setWeightKg(e.target.value)}
          required={!isBodyweight}
        />
      </label>

      <label>
        Nombre de séries
        <input
          type="number"
          min="1"
          value={setsCount}
          onChange={(e) => setSetsCount(e.target.value)}
          required
        />
      </label>

      <label>
        Répétitions
        <input
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
        />
      </label>

      <button type="submit">Enregistrer</button>
    </form>
  );
}
