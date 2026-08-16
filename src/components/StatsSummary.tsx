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
    <div className="panel">
      <h2>Statistiques globales</h2>
      <div className="stats-grid">
        <div className="stat-tile">
          <div className="stat-label">Volume soulevé</div>
          <div className="stat-value">{globalVolume.weightedVolumeKg} kg</div>
        </div>
        <div className="stat-tile">
          <div className="stat-label">Reps au poids du corps</div>
          <div className="stat-value">{globalVolume.bodyweightReps}</div>
        </div>
        <div className="stat-tile">
          <div className="stat-label">Exercice favori</div>
          <div className="stat-value">{mostUsedExercise ?? 'aucun'}</div>
        </div>
        <div className="stat-tile">
          <div className="stat-label">Séances cette semaine</div>
          <div className="stat-value">{currentWeek}</div>
        </div>
        <div className="stat-tile">
          <div className="stat-label">Moyenne séances/semaine</div>
          <div className="stat-value">{averageWeekly.toFixed(1)}</div>
        </div>
      </div>

      <h3>Par type d'équipement</h3>
      <div className="stats-grid">
        {equipmentTypes.map((type) => {
          const filtered = series.filter(
            (s): s is Extract<Series, { kind: 'strength' }> =>
              s.kind === 'strength' && s.equipmentType === type
          );
          const volume = computeTotalVolume(filtered);

          return (
            <div className="stat-tile" key={type}>
              <div className="stat-label">{type}</div>
              <div className="stat-value">
                {volume.weightedVolumeKg} kg
                {volume.bodyweightReps > 0 && `, ${volume.bodyweightReps} reps`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}