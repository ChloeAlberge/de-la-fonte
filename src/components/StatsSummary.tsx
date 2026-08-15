import type { Series, EquipmentType } from '../models/series';
import {
  computeTotalVolume,
  computeMostUsedExercise,
  computeAverageWeeklySessionCount,
  computeCurrentWeekSessionCount,
} from '../stats/seriesStats';

interface StatsSummaryProps {
  series: Series[];
}

export function StatsSummary({ series }: StatsSummaryProps) {
  const globalVolume = computeTotalVolume(series);
  const mostUsedExercise = computeMostUsedExercise(series);
  const averageWeekly = computeAverageWeeklySessionCount(series);
  const currentWeek = computeCurrentWeekSessionCount(series);

  const equipmentTypes: EquipmentType[] = ['machine', 'poids_libre', 'poids_du_corps'];

  return (
    <div>
      <h2>Statistiques globales</h2>
      <p>Volume soulevé : {globalVolume.weightedVolumeKg} kg</p>
      <p>Répétitions au poids du corps : {globalVolume.bodyweightReps}</p>
      <p>Exercice le plus pratiqué : {mostUsedExercise ?? 'aucun'}</p>
      <p>Séances cette semaine : {currentWeek}</p>
      <p>Moyenne de séances par semaine : {averageWeekly.toFixed(1)}</p>

      <h3>Par type d'équipement</h3>
      {equipmentTypes.map((type) => {
        const filtered = series.filter(
          (s): s is Extract<Series, { kind: 'strength' }> =>
            s.kind === 'strength' && s.equipmentType === type
        );
        const volume = computeTotalVolume(filtered);

        return (
          <p key={type}>
            {type} — {volume.weightedVolumeKg} kg
            {volume.bodyweightReps > 0 && `, ${volume.bodyweightReps} reps (poids du corps)`}
          </p>
        );
      })}
    </div>
  );
}