import { useState } from 'react';
import { EXERCISE_CATALOG, findBodyPartForExercise, type BodyPart } from '../models/exercise';

interface ExerciseSelectProps {
  exerciseName: string;
  onExerciseNameChange: (name: string) => void;
  bodyPart: BodyPart | '';
  onBodyPartChange: (bodyPart: BodyPart) => void;
}

const CUSTOM_OPTION = '__custom__';

const FILTER_OPTIONS: { label: string; value: BodyPart | 'all' }[] = [
  { label: 'Tous', value: 'all' },
  { label: 'Haut du corps', value: 'haut_du_corps' },
  { label: 'Bas du corps', value: 'bas_du_corps' },
  { label: 'Full body', value: 'full_body' },
];

export function ExerciseSelect({
  exerciseName,
  onExerciseNameChange,
  bodyPart,
  onBodyPartChange,
}: ExerciseSelectProps) {
  const [isCustom, setIsCustom] = useState(false);
  const [filter, setFilter] = useState<BodyPart | 'all'>('all');

  const filteredCatalog =
    filter === 'all'
      ? EXERCISE_CATALOG
      : EXERCISE_CATALOG.filter((entry) => entry.bodyPart === filter);

  function handleSelectChange(value: string) {
    if (value === CUSTOM_OPTION) {
      setIsCustom(true);
      onExerciseNameChange('');
      return;
    }

    setIsCustom(false);
    onExerciseNameChange(value);

    const catalogBodyPart = findBodyPartForExercise(value);
    if (catalogBodyPart) {
      onBodyPartChange(catalogBodyPart);
    }
  }

  return (
    <div>
      <div className="exercise-filter-buttons">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            aria-pressed={filter === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>

      <label>
        Exercice
        <select
          value={isCustom ? CUSTOM_OPTION : exerciseName}
          onChange={(e) => handleSelectChange(e.target.value)}
        >
          <option value="">Choisir un exercice</option>
          {filteredCatalog.map((entry) => (
            <option key={entry.name} value={entry.name}>
              {entry.name}
            </option>
          ))}
          <option value={CUSTOM_OPTION}>Autre (personnalisé)</option>
        </select>
      </label>

      {isCustom && (
        <>
          <label>
            Nom de l'exercice
            <input
              type="text"
              value={exerciseName}
              onChange={(e) => onExerciseNameChange(e.target.value)}
              required
            />
          </label>

          <fieldset>
            <legend>Partie du corps</legend>
            <label>
              <input
                type="radio"
                name="bodyPart"
                value="haut_du_corps"
                checked={bodyPart === 'haut_du_corps'}
                onChange={() => onBodyPartChange('haut_du_corps')}
              />
              Haut du corps
            </label>
            <label>
              <input
                type="radio"
                name="bodyPart"
                value="bas_du_corps"
                checked={bodyPart === 'bas_du_corps'}
                onChange={() => onBodyPartChange('bas_du_corps')}
              />
              Bas du corps
            </label>
            <label>
              <input
                type="radio"
                name="bodyPart"
                value="full_body"
                checked={bodyPart === 'full_body'}
                onChange={() => onBodyPartChange('full_body')}
              />
              Full body
            </label>
          </fieldset>
        </>
      )}
    </div>
  );
}