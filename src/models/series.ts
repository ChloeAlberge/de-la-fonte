export type EquipmentType = 'machine' | 'poids_libre' | 'poids_du_corps';

export interface Series {
  id: string;
  exerciseName: string;
  equipmentType: EquipmentType;
  weightKg: number | null;
  reps: number | null;
  setsCount: number;
  performedAt: string;
}

export type NewSeries = Omit<Series, 'id'>;