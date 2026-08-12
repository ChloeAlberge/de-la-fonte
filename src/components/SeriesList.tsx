import { useState } from 'react';
import type { Series, EquipmentType } from '../models/series';
import { updateSeries, deleteSeries } from '../storage/seriesStorage';

interface SeriesListProps {
  series: Series[];
  onSeriesChanged: () => void;
}

export function SeriesList({ series, onSeriesChanged }: SeriesListProps) {
  const sortedSeries = [...series].sort(
    (a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime()
  );

  if (sortedSeries.length === 0) {
    return <p>Aucune série enregistrée pour l'instant.</p>;
  }

  return (
    <ul>
      {sortedSeries.map((entry) => (
        <li key={entry.id}>
          <SeriesListItem entry={entry} onChanged={onSeriesChanged} />
        </li>
      ))}
    </ul>
  );
}

function SeriesListItem({ entry, onChanged }: { entry: Series; onChanged: () => void }) {
  const [isEditing, setIsEditing] = useState(false);

  function handleDelete() {
    const confirmed = window.confirm(`Supprimer "${entry.exerciseName}" ?`);
    if (!confirmed) return;

    deleteSeries(entry.id);
    onChanged();
  }

  if (isEditing) {
    return (
      <SeriesEditForm
        entry={entry}
        onCancel={() => setIsEditing(false)}
        onSaved={() => {
          setIsEditing(false);
          onChanged();
        }}
      />
    );
  }

  const date = new Date(entry.performedAt).toLocaleString();

  return (
    <span>
      {entry.kind === 'strength' ? (
        <>
          <strong>{entry.exerciseName}</strong> ({entry.equipmentType}) —{' '}
          {entry.weightKg !== null ? `${entry.weightKg}kg` : 'poids du corps'}
          {entry.reps !== null && ` × ${entry.reps} reps`} × {entry.setsCount} série(s)
        </>
      ) : (
        <>
          <strong>{entry.exerciseName}</strong> (cardio) — {entry.durationMin} min
          {entry.distanceKm !== null && `, ${entry.distanceKm}km`}
        </>
      )}
      <br />
      {date}
      <br />
      <button onClick={() => setIsEditing(true)}>Modifier</button>
      <button onClick={handleDelete}>Supprimer</button>
    </span>
  );
}

function SeriesEditForm({
  entry,
  onCancel,
  onSaved,
}: {
  entry: Series;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [exerciseName, setExerciseName] = useState(entry.exerciseName);

  const [equipmentType, setEquipmentType] = useState<EquipmentType>(
    entry.kind === 'strength' ? entry.equipmentType : 'machine'
  );
  const [weightKg, setWeightKg] = useState(
    entry.kind === 'strength' && entry.weightKg !== null ? String(entry.weightKg) : ''
  );
  const [reps, setReps] = useState(
    entry.kind === 'strength' && entry.reps !== null ? String(entry.reps) : ''
  );
  const [setsCount, setSetsCount] = useState(
    entry.kind === 'strength' ? String(entry.setsCount) : '1'
  );

  const [distanceKm, setDistanceKm] = useState(
    entry.kind === 'cardio' && entry.distanceKm !== null ? String(entry.distanceKm) : ''
  );
  const [durationMin, setDurationMin] = useState(
    entry.kind === 'cardio' ? String(entry.durationMin) : ''
  );

  function handleSave() {
    if (entry.kind === 'strength') {
      updateSeries(entry.id, {
        exerciseName,
        equipmentType,
        weightKg: weightKg === '' ? null : Number(weightKg),
        reps: reps === '' ? null : Number(reps),
        setsCount: Number(setsCount),
      });
    } else {
      updateSeries(entry.id, {
        exerciseName,
        distanceKm: distanceKm === '' ? null : Number(distanceKm),
        durationMin: Number(durationMin),
      });
    }

    onSaved();
  }

  return (
    <span>
      <input value={exerciseName} onChange={(e) => setExerciseName(e.target.value)} />

      {entry.kind === 'strength' ? (
        <>
          <select value={equipmentType} onChange={(e) => setEquipmentType(e.target.value as EquipmentType)}>
            <option value="machine">machine</option>
            <option value="poids_libre">poids_libre</option>
            <option value="poids_du_corps">poids_du_corps</option>
          </select>
          <input type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder="poids (kg)" />
          <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} placeholder="reps" />
          <input type="number" value={setsCount} onChange={(e) => setSetsCount(e.target.value)} placeholder="séries" />
        </>
      ) : (
        <>
          <input type="number" value={distanceKm} onChange={(e) => setDistanceKm(e.target.value)} placeholder="distance (km)" />
          <input type="number" value={durationMin} onChange={(e) => setDurationMin(e.target.value)} placeholder="durée (min)" />
        </>
      )}

      <button onClick={handleSave}>Enregistrer</button>
      <button onClick={onCancel}>Annuler</button>
    </span>
  );
}