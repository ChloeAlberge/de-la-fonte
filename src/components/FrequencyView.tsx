import type { Series } from '../models/series';
import { computeFrequencyByExercise, computeFrequencyByEquipmentType } from '../stats/seriesStats';

interface FrequencyViewProps {
  series: Series[];
}

export function FrequencyView({ series }: FrequencyViewProps) {
  const byExercise = computeFrequencyByExercise(series);
  const byEquipmentType = computeFrequencyByEquipmentType(series);

  return (
    <div>
      <h2>Fréquence par exercice</h2>
      <ul>
        {Object.entries(byExercise).map(([exerciseName, freq]) => (
          <li key={exerciseName}>
            {exerciseName} — {freq.seriesCount} série(s) sur {freq.distinctDaysCount} jour(s)
          </li>
        ))}
      </ul>

      <h2>Fréquence par type d'équipement</h2>
      <ul>
        {Object.entries(byEquipmentType).map(([equipmentType, freq]) => (
          <li key={equipmentType}>
            {equipmentType} — {freq.seriesCount} série(s) sur {freq.distinctDaysCount} jour(s)
          </li>
        ))}
      </ul>
    </div>
  );
}