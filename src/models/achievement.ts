import type { BodyPart } from './exercise';

export type Character = 'coach' | 'veteran' | 'upper_body' | 'lower_body' | 'mystery';

export type AchievementTrigger =
  | { type: 'totalSeriesCount'; threshold: number }
  | { type: 'sessionCompletedCount'; threshold: number }
  | { type: 'distinctExerciseCount'; threshold: number }
  | { type: 'cardioSeriesCount'; threshold: number }
  | { type: 'cardioDurationCumulated'; thresholdMinutes: number }
  | { type: 'cardioDistanceCumulated'; thresholdKm: number }
  | { type: 'totalVolumeCumulated'; thresholdKg: number }
  | { type: 'seriesCountByBodyPart'; bodyPart: BodyPart; threshold: number }
  | { type: 'personalRecordCount'; bodyPart: BodyPart; threshold: number }
  | { type: 'regularityMonths'; months: number; minWeeklySessions: number };

export interface Achievement {
  id: string;
  title: string;
  description: string;
  character: Character;
  trigger: AchievementTrigger;
}

export const ACHIEVEMENTS: Achievement[] = [
  // --- Le coach ---
  {
    id: 'coach-first-series',
    title: 'Premiers pas',
    description: 'Tu as enregistré ta première série.',
    character: 'coach',
    trigger: { type: 'totalSeriesCount', threshold: 1 },
  },
  {
    id: 'coach-first-session',
    title: 'Première séance',
    description: 'Tu as complété une séance entière.',
    character: 'coach',
    trigger: { type: 'sessionCompletedCount', threshold: 1 },
  },
  {
    id: 'coach-five-series',
    title: 'On prend le rythme',
    description: '5 séries enregistrées.',
    character: 'coach',
    trigger: { type: 'totalSeriesCount', threshold: 5 },
  },
  {
    id: 'coach-ten-exercises',
    title: 'Touche-à-tout',
    description: '10 exercices différents essayés.',
    character: 'coach',
    trigger: { type: 'distinctExerciseCount', threshold: 10 },
  },
  {
    id: 'coach-first-cardio',
    title: 'Premier pas de course',
    description: 'Première séance de cardio enregistrée.',
    character: 'coach',
    trigger: { type: 'cardioSeriesCount', threshold: 1 },
  },
  {
    id: 'coach-cardio-endurance',
    title: 'Endurance',
    description: '10h de cardio cumulées.',
    character: 'coach',
    trigger: { type: 'cardioDurationCumulated', thresholdMinutes: 600 },
  },
  {
    id: 'coach-cardio-distance',
    title: 'Distance parcourue',
    description: '50km cumulés.',
    character: 'coach',
    trigger: { type: 'cardioDistanceCumulated', thresholdKm: 50 },
  },

  // --- Le vétéran, Patrick ---
  {
    id: 'veteran-50-total',
    title: '50 exercices enregistrés !',
    description: "Patrick t'encourage à continuer !",
    character: 'veteran',
    trigger: { type: 'totalSeriesCount', threshold: 50 },
  },
  {
    id: 'veteran-30-sessions',
    title: 'Habituée',
    description: '30 séances complètes.',
    character: 'veteran',
    trigger: { type: 'sessionCompletedCount', threshold: 30 },
  },
  {
    id: 'veteran-100-sessions',
    title: 'Pilier de salle',
    description: '100 séances complètes.',
    character: 'veteran',
    trigger: { type: 'sessionCompletedCount', threshold: 100 },
  },
  {
    id: 'veteran-1000kg',
    title: 'Une tonne soulevée',
    description: '1000kg de volume total cumulé.',
    character: 'veteran',
    trigger: { type: 'totalVolumeCumulated', thresholdKg: 1000 },
  },
  {
    id: 'veteran-10000kg',
    title: 'Dix tonnes soulevées',
    description: '10 000kg de volume total cumulé.',
    character: 'veteran',
    trigger: { type: 'totalVolumeCumulated', thresholdKg: 10000 },
  },

  // --- Haut du corps ---
  {
    id: 'upper-bronze',
    title: 'Haut du corps, bronze',
    description: '50 séries haut du corps.',
    character: 'upper_body',
    trigger: { type: 'seriesCountByBodyPart', bodyPart: 'haut_du_corps', threshold: 50 },
  },
  {
    id: 'upper-silver',
    title: 'Haut du corps, argent',
    description: '200 séries haut du corps.',
    character: 'upper_body',
    trigger: { type: 'seriesCountByBodyPart', bodyPart: 'haut_du_corps', threshold: 200 },
  },
  {
    id: 'upper-gold',
    title: 'Haut du corps, or',
    description: '500 séries haut du corps.',
    character: 'upper_body',
    trigger: { type: 'seriesCountByBodyPart', bodyPart: 'haut_du_corps', threshold: 500 },
  },
  {
    id: 'upper-record-bronze',
    title: 'Premier record',
    description: '1 record personnel battu (haut du corps).',
    character: 'upper_body',
    trigger: { type: 'personalRecordCount', bodyPart: 'haut_du_corps', threshold: 1 },
  },
  {
    id: 'upper-record-silver',
    title: 'Recordwoman',
    description: '5 records personnels battus (haut du corps).',
    character: 'upper_body',
    trigger: { type: 'personalRecordCount', bodyPart: 'haut_du_corps', threshold: 5 },
  },
  {
    id: 'upper-record-gold',
    title: 'Record perpétuel',
    description: '15 records personnels battus (haut du corps).',
    character: 'upper_body',
    trigger: { type: 'personalRecordCount', bodyPart: 'haut_du_corps', threshold: 15 },
  },

  // --- Bas du corps ---
  {
    id: 'lower-bronze',
    title: 'Bas du corps, bronze',
    description: '50 séries bas du corps.',
    character: 'lower_body',
    trigger: { type: 'seriesCountByBodyPart', bodyPart: 'bas_du_corps', threshold: 50 },
  },
  {
    id: 'lower-silver',
    title: 'Bas du corps, argent',
    description: '200 séries bas du corps.',
    character: 'lower_body',
    trigger: { type: 'seriesCountByBodyPart', bodyPart: 'bas_du_corps', threshold: 200 },
  },
  {
    id: 'lower-gold',
    title: 'Bas du corps, or',
    description: '500 séries bas du corps.',
    character: 'lower_body',
    trigger: { type: 'seriesCountByBodyPart', bodyPart: 'bas_du_corps', threshold: 500 },
  },
  {
    id: 'lower-record-bronze',
    title: 'Premier record',
    description: '1 record personnel battu (bas du corps).',
    character: 'lower_body',
    trigger: { type: 'personalRecordCount', bodyPart: 'bas_du_corps', threshold: 1 },
  },
  {
    id: 'lower-record-silver',
    title: 'Recordwoman',
    description: '5 records personnels battus (bas du corps).',
    character: 'lower_body',
    trigger: { type: 'personalRecordCount', bodyPart: 'bas_du_corps', threshold: 5 },
  },
  {
    id: 'lower-record-gold',
    title: 'Record perpétuel',
    description: '15 records personnels battus (bas du corps).',
    character: 'lower_body',
    trigger: { type: 'personalRecordCount', bodyPart: 'bas_du_corps', threshold: 15 },
  },

  // --- Le mystère ---
  {
    id: 'mystery-tier-1',
    title: '???',
    description: 'Un mystère se dévoile avec la régularité...',
    character: 'mystery',
    trigger: { type: 'regularityMonths', months: 3, minWeeklySessions: 1 },
  },
  {
    id: 'mystery-tier-2',
    title: '???',
    description: 'Le mystère se précise.',
    character: 'mystery',
    trigger: { type: 'regularityMonths', months: 6, minWeeklySessions: 1 },
  },
  {
    id: 'mystery-tier-3',
    title: 'Révélation',
    description: 'Le mystère est enfin dévoilé.',
    character: 'mystery',
    trigger: { type: 'regularityMonths', months: 12, minWeeklySessions: 1 },
  },
];