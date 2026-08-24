interface ExerciseFilterProps {
  exerciseNames: string[];
  selected: string | null;
  onChange: (exerciseName: string | null) => void;
}

export function ExerciseFilter({ exerciseNames, selected, onChange }: ExerciseFilterProps) {
  return (
    <>
      <h2>Filtrer par exercice</h2>
      <select
        value={selected ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? null : e.target.value)}
      >
        <option value="">Tous les exercices</option>
        {exerciseNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </>
  );
}