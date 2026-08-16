import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Series } from '../models/series';
import { computeProgressionForExercise } from '../stats/seriesStats';

interface ProgressChartProps {
  series: Series[];
  exerciseName: string | null;
}

const NEON_CYAN = '#27b0ff';
const CHROME = '#9aa5b8';
const DEEP = '#0b1026';

export function ProgressChart({ series, exerciseName }: ProgressChartProps) {
  if (!exerciseName) {
    return (
      <div className="panel">
        <p>Sélectionne un exercice pour voir sa progression.</p>
      </div>
    );
  }

  const data = computeProgressionForExercise(series, exerciseName);

  if (data.length === 0) {
    return (
      <div className="panel">
        <p>Aucune donnée de poids pour {exerciseName}.</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <h3>Progression : {exerciseName}</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <defs>
            <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={CHROME} strokeOpacity={0.2} />
          <XAxis dataKey="date" stroke={CHROME} tick={{ fill: CHROME, fontSize: 12 }} />
          <YAxis stroke={CHROME} tick={{ fill: CHROME, fontSize: 12 }} />
          <Tooltip
            contentStyle={{ background: DEEP, border: `1px solid ${NEON_CYAN}`, borderRadius: 4 }}
            labelStyle={{ color: CHROME }}
            itemStyle={{ color: NEON_CYAN }}
          />
          <Line
            type="monotone"
            dataKey="weightKg"
            stroke={NEON_CYAN}
            strokeWidth={2}
            dot={{ fill: NEON_CYAN, r: 4 }}
            filter="url(#neonGlow)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}