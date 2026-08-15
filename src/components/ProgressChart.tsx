import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import type { Series } from '../models/series';
import { computeProgressionForExercise } from '../stats/seriesStats';

interface ProgressChartProps {
  series: Series[];
  exerciseName: string | null;
}

export function ProgressChart({ series, exerciseName }: ProgressChartProps) {
  if (!exerciseName) {
    return <p>Sélectionne un exercice pour voir sa progression.</p>;
  }

  const data = computeProgressionForExercise(series, exerciseName);

  if (data.length === 0) {
    return <p>Aucune donnée de poids pour {exerciseName}.</p>;
  }

  return (
    <div>
      <h3>Progression — {exerciseName}</h3>
      <LineChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="weightKg" stroke="#8884d8" />
      </LineChart>
    </div>
  );
}