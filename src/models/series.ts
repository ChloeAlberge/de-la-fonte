export type EquipmentType = 'machine' | 'poids_libre' | 'poids_du_corps';

interface BaseSeries {
  id: string;
  exerciseName: string;
  performedAt: string;
  sessionId: string | null;
}

export interface StrengthSeries extends BaseSeries {
  kind: 'strength';
  equipmentType: EquipmentType;
  weightKg: number | null;
  reps: number | null;
  setsCount: number;
}

export interface CardioSeries extends BaseSeries {
  kind: 'cardio';
  distanceKm: number | null;
  durationMin: number;
}

export type Series = StrengthSeries | CardioSeries;

export type NewSeries = Omit<StrengthSeries, 'id'> | Omit<CardioSeries, 'id'>;