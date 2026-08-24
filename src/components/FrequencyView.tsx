import type { Series } from '../models/series';
import { computeFrequencyByExercise, computeFrequencyByEquipmentType } from '../stats/seriesStats';

interface FrequencyViewProps {
  series: Series[];
}

export function FrequencyView({ series }: FrequencyViewProps) {
  const byExercise = computeFrequencyByExercise(series);
  const byEquipmentType = computeFrequencyByEquipmentType(series);

  return (
    <div className="panel">
      <h2>Fréquence par exercice</h2>
      <ul className="series-list">
        {Object.entries(byExercise).map(([exerciseName, freq]) => (
          <li key={exerciseName}>
            {exerciseName} — {freq.seriesCount} série(s) sur {freq.distinctDaysCount} jour(s)
          </li>
        ))}
      </ul>

      <h3>Par type d'équipement</h3>
      <ul className="series-list">
        {Object.entries(byEquipmentType).map(([equipmentType, freq]) => (
          <li key={equipmentType}>
            {equipmentType} — {freq.seriesCount} série(s) sur {freq.distinctDaysCount} jour(s)
          </li>
        ))}
      </ul>
    </div>
  );
}