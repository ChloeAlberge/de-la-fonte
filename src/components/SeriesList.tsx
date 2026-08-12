import type { Series } from '../models/series';

interface SeriesListProps {
  series: Series[];
}

export function SeriesList({ series }: SeriesListProps) {
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
          <SeriesListItem entry={entry} />
        </li>
      ))}
    </ul>
  );
}

function SeriesListItem({ entry }: { entry: Series }) {
  const date = new Date(entry.performedAt).toLocaleString();

  if (entry.kind === 'strength') {
    return (
      <span>
        <strong>{entry.exerciseName}</strong> ({entry.equipmentType}) —{' '}
        {entry.weightKg !== null ? `${entry.weightKg}kg` : 'poids du corps'}
        {entry.reps !== null && ` × ${entry.reps} reps`} × {entry.setsCount} série(s)
        <br />
        {date}
      </span>
    );
  }

  return (
    <span>
      <strong>{entry.exerciseName}</strong> (cardio) —{' '}
      {entry.durationMin} min
      {entry.distanceKm !== null && `, ${entry.distanceKm}km`}
      <br />
      {date}
    </span>
  );
}