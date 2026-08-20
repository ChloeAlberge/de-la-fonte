export type BodyPart = 'haut_du_corps' | 'bas_du_corps' | 'full_body';

export interface ExerciseCatalogEntry {
  name: string;
  bodyPart: BodyPart;
}

export const EXERCISE_CATALOG: ExerciseCatalogEntry[] = [
  // --- Haut du corps : pectoraux ---
  { name: 'Bench Press', bodyPart: 'haut_du_corps' },
  { name: 'Dumbbell Bench Press', bodyPart: 'haut_du_corps' },
  { name: 'Close-Grip Bench Press', bodyPart: 'haut_du_corps' },
  { name: 'Wide-Grip Bench Press', bodyPart: 'haut_du_corps' },
  { name: 'Incline Bench Press', bodyPart: 'haut_du_corps' },
  { name: 'Incline Dumbbell Press', bodyPart: 'haut_du_corps' },
  { name: 'Decline Bench Press', bodyPart: 'haut_du_corps' },
  { name: 'Decline Dumbbell Press', bodyPart: 'haut_du_corps' },
  { name: 'Smith Machine Bench Press', bodyPart: 'haut_du_corps' },
  { name: 'Dumbbell Fly', bodyPart: 'haut_du_corps' },
  { name: 'Incline Dumbbell Fly', bodyPart: 'haut_du_corps' },
  { name: 'Cable Crossover', bodyPart: 'haut_du_corps' },
  { name: 'Pec Deck', bodyPart: 'haut_du_corps' },
  { name: 'Push-ups', bodyPart: 'haut_du_corps' },
  { name: 'Weighted Push-ups', bodyPart: 'haut_du_corps' },
  { name: 'Chest Dips', bodyPart: 'haut_du_corps' },
  { name: 'Dumbbell Pullover', bodyPart: 'haut_du_corps' },
  { name: 'Chest Press Machine', bodyPart: 'haut_du_corps' },

  // --- Haut du corps : dos ---
  { name: 'Seated Cable Row', bodyPart: 'haut_du_corps' },
  { name: 'Lat Pulldown Wide Grip', bodyPart: 'haut_du_corps' },
  { name: 'Lat Pulldown Close Grip', bodyPart: 'haut_du_corps' },
  { name: 'Lat Pulldown Underhand', bodyPart: 'haut_du_corps' },
  { name: 'Barbell Row', bodyPart: 'haut_du_corps' },
  { name: 'One-Arm Dumbbell Row', bodyPart: 'haut_du_corps' },
  { name: 'T-Bar Row', bodyPart: 'haut_du_corps' },
  { name: 'Low Cable Row', bodyPart: 'haut_du_corps' },
  { name: 'Inverted Row', bodyPart: 'haut_du_corps' },
  { name: 'Pull-up Wide Grip', bodyPart: 'haut_du_corps' },
  { name: 'Pull-up Close Grip', bodyPart: 'haut_du_corps' },
  { name: 'Chin-up', bodyPart: 'haut_du_corps' },
  { name: 'Weighted Pull-up', bodyPart: 'haut_du_corps' },
  { name: 'Deadlift', bodyPart: 'haut_du_corps' },
  { name: 'Romanian Deadlift', bodyPart: 'haut_du_corps' },
  { name: 'Sumo Deadlift', bodyPart: 'haut_du_corps' },
  { name: 'Back Extension', bodyPart: 'haut_du_corps' },
  { name: 'Good Morning', bodyPart: 'haut_du_corps' },
  { name: 'Barbell Shrug', bodyPart: 'haut_du_corps' },
  { name: 'Dumbbell Shrug', bodyPart: 'haut_du_corps' },

  // --- Haut du corps : épaules ---
  { name: 'Military Press', bodyPart: 'haut_du_corps' },
  { name: 'Dumbbell Shoulder Press', bodyPart: 'haut_du_corps' },
  { name: 'Arnold Press', bodyPart: 'haut_du_corps' },
  { name: 'Lateral Raise', bodyPart: 'haut_du_corps' },
  { name: 'Cable Lateral Raise', bodyPart: 'haut_du_corps' },
  { name: 'Single-Arm Cable Lateral Raise', bodyPart: 'haut_du_corps' },
  { name: 'Front Raise Dumbbell', bodyPart: 'haut_du_corps' },
  { name: 'Front Raise Barbell', bodyPart: 'haut_du_corps' },
  { name: 'Bent-Over Rear Delt Fly', bodyPart: 'haut_du_corps' },
  { name: 'Face Pull', bodyPart: 'haut_du_corps' },
  { name: 'Upright Row', bodyPart: 'haut_du_corps' },

  // --- Haut du corps : bras ---
  { name: 'Barbell Curl', bodyPart: 'haut_du_corps' },
  { name: 'Dumbbell Curl', bodyPart: 'haut_du_corps' },
  { name: 'Hammer Curl', bodyPart: 'haut_du_corps' },
  { name: 'Preacher Curl', bodyPart: 'haut_du_corps' },
  { name: 'Concentration Curl', bodyPart: 'haut_du_corps' },
  { name: 'Spider Curl', bodyPart: 'haut_du_corps' },
  { name: 'Cable Curl', bodyPart: 'haut_du_corps' },
  { name: 'EZ-Bar Skull Crusher', bodyPart: 'haut_du_corps' },
  { name: 'Triceps Pushdown', bodyPart: 'haut_du_corps' },
  { name: 'Single-Arm Triceps Pushdown', bodyPart: 'haut_du_corps' },
  { name: 'Overhead Dumbbell Extension', bodyPart: 'haut_du_corps' },
  { name: 'Triceps Dips', bodyPart: 'haut_du_corps' },
  { name: 'Triceps Kickback', bodyPart: 'haut_du_corps' },
  { name: 'French Press', bodyPart: 'haut_du_corps' },

  // --- Haut du corps : abdominaux ---
  { name: 'Crunch', bodyPart: 'haut_du_corps' },
  { name: 'Cable Crunch', bodyPart: 'haut_du_corps' },
  { name: 'Reverse Crunch', bodyPart: 'haut_du_corps' },
  { name: 'Hanging Leg Raise', bodyPart: 'haut_du_corps' },
  { name: 'Hanging Knee Raise', bodyPart: 'haut_du_corps' },
  { name: 'Plank', bodyPart: 'haut_du_corps' },
  { name: 'Side Plank', bodyPart: 'haut_du_corps' },
  { name: 'Russian Twist', bodyPart: 'haut_du_corps' },
  { name: 'Ab Wheel Rollout', bodyPart: 'haut_du_corps' },

  // --- Bas du corps : quadriceps / global ---
  { name: 'Barbell Squat', bodyPart: 'bas_du_corps' },
  { name: 'Goblet Squat', bodyPart: 'bas_du_corps' },
  { name: 'Bulgarian Split Squat', bodyPart: 'bas_du_corps' },
  { name: 'Sumo Squat', bodyPart: 'bas_du_corps' },
  { name: 'Pistol Squat', bodyPart: 'bas_du_corps' },
  { name: 'Front Squat', bodyPart: 'bas_du_corps' },
  { name: 'Hack Squat', bodyPart: 'bas_du_corps' },
  { name: 'LegPress', bodyPart: 'bas_du_corps' },
  { name: 'Single-Leg Press', bodyPart: 'bas_du_corps' },
  { name: 'LegPress High Feet', bodyPart: 'bas_du_corps' },
  { name: 'LegPress Low Feet', bodyPart: 'bas_du_corps' },
  { name: 'Dumbbell Lunge', bodyPart: 'bas_du_corps' },
  { name: 'Reverse Lunge', bodyPart: 'bas_du_corps' },
  { name: 'Walking Lunge', bodyPart: 'bas_du_corps' },
  { name: 'Leg Extension', bodyPart: 'bas_du_corps' },
  { name: 'Step-Up', bodyPart: 'bas_du_corps' },

  // --- Bas du corps : ischios / fessiers ---
  { name: 'Leg Curl Lying', bodyPart: 'bas_du_corps' },
  { name: 'Leg Curl Seated', bodyPart: 'bas_du_corps' },
  { name: 'Stiff-Leg Deadlift', bodyPart: 'bas_du_corps' },
  { name: 'Barbell Hip Thrust', bodyPart: 'bas_du_corps' },
  { name: 'Glute Bridge', bodyPart: 'bas_du_corps' },
  { name: 'Hip Abduction Machine', bodyPart: 'bas_du_corps' },
  { name: 'Hip Adduction Machine', bodyPart: 'bas_du_corps' },
  { name: 'Cable Adduction', bodyPart: 'bas_du_corps' },

  // --- Bas du corps : mollets ---
  { name: 'Standing Calf Raise', bodyPart: 'bas_du_corps' },
  { name: 'Seated Calf Raise', bodyPart: 'bas_du_corps' },
  { name: 'LegPress Calf Raise', bodyPart: 'bas_du_corps' },

  // --- Full body ---
  { name: 'Burpees', bodyPart: 'full_body' },
  { name: 'Kettlebell Swing', bodyPart: 'full_body' },
  { name: 'Clean and Press', bodyPart: 'full_body' },
  { name: 'Thruster', bodyPart: 'full_body' },
  { name: 'Wall Ball', bodyPart: 'full_body' },
  { name: 'Dumbbell Snatch', bodyPart: 'full_body' },
  { name: 'Battle Rope', bodyPart: 'full_body' },
  { name: 'Mountain Climbers', bodyPart: 'full_body' },
  { name: 'Rowing Machine', bodyPart: 'full_body' },
  { name: 'Assault Bike', bodyPart: 'full_body' },
  { name: 'Devil Press', bodyPart: 'full_body' },
  { name: 'Man Maker', bodyPart: 'full_body' },
  { name: 'Turkish Get-Up', bodyPart: 'full_body' },
  { name: 'Sled Push', bodyPart: 'full_body' },
  { name: 'Sled Pull', bodyPart: 'full_body' },
  { name: "Farmer's Walk", bodyPart: 'full_body' },
  { name: 'Box Jump', bodyPart: 'full_body' },
  { name: 'Jump Rope', bodyPart: 'full_body' },
  { name: 'Renegade Row', bodyPart: 'full_body' },
  { name: 'Bear Crawl', bodyPart: 'full_body' },
  { name: 'Wall Walk', bodyPart: 'full_body' },
  { name: 'Tire Flip', bodyPart: 'full_body' },
];

export function findBodyPartForExercise(exerciseName: string): BodyPart | null {
  const entry = EXERCISE_CATALOG.find((e) => e.name === exerciseName);
  return entry ? entry.bodyPart : null;
}

export const CARDIO_EXERCISES: string[] = [
  'Course à pied',
  'Vélo',
  'Vélo elliptique',
  'Rameur',
  'Natation',
  'Corde à sauter',
  'Marche rapide',
  'Randonnée',
  'Escalier / StairMaster',
  'Boxe / Cardio-boxe',
];