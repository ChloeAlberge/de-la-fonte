import { useState, type FormEvent } from 'react';
import type { NewSeries } from '../models/series';
import { addSeries } from '../storage/seriesStorage';
import { getActiveSession } from '../storage/sessionStorage';

interface CardioFormProps {
  onSeriesAdded: () => void;
}

export function CardioForm({ onSeriesAdded }: CardioFormProps) {
  const [exerciseName, setExerciseName] = useState('');
  const [distanceKm, setDistanceKm] = useState('');
  const [durationMin, setDurationMin] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newSeries: NewSeries = {
      kind: 'cardio',
      exerciseName,
      distanceKm: distanceKm === '' ? null : Number(distanceKm),
      durationMin: Number(durationMin),
      performedAt: new Date().toISOString(),
      sessionId: getActiveSession()?.id ?? null,
    };

    addSeries(newSeries);

    setExerciseName('');
    setDistanceKm('');
    setDurationMin('');

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
          placeholder="ex: Course à pied, Vélo..."
        />
      </label>

      <label>
        Distance (km) — optionnel
        <input
          type="number"
          value={distanceKm}
          onChange={(e) => setDistanceKm(e.target.value)}
        />
      </label>

      <label>
        Durée (minutes)
        <input
          type="number"
          value={durationMin}
          onChange={(e) => setDurationMin(e.target.value)}
          required
        />
      </label>

      <button type="submit">Enregistrer</button>
    </form>
  );
}