import { useState } from 'react';
import { CARDIO_EXERCISES } from '../models/exercise';

interface CardioExerciseSelectProps {
  exerciseName: string;
  onExerciseNameChange: (name: string) => void;
}

const CUSTOM_OPTION = '__custom__';

export function CardioExerciseSelect({
  exerciseName,
  onExerciseNameChange,
}: CardioExerciseSelectProps) {
  const [isCustom, setIsCustom] = useState(false);

  function handleSelectChange(value: string) {
    if (value === CUSTOM_OPTION) {
      setIsCustom(true);
      onExerciseNameChange('');
      return;
    }

    setIsCustom(false);
    onExerciseNameChange(value);
  }

  return (
    <div>
      <label>
        Exercice
        <select
          value={isCustom ? CUSTOM_OPTION : exerciseName}
          onChange={(e) => handleSelectChange(e.target.value)}
        >
          <option value="">Choisir un exercice</option>
          {CARDIO_EXERCISES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
          <option value={CUSTOM_OPTION}>Autre (personnalisé)</option>
        </select>
      </label>

      {isCustom && (
        <label>
          Nom de l'exercice
          <input
            type="text"
            value={exerciseName}
            onChange={(e) => onExerciseNameChange(e.target.value)}
            required
          />
        </label>
      )}
    </div>
  );
}