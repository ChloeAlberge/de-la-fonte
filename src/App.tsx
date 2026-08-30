import { useState } from "react";
import { SeriesForm } from "./components/SeriesForm";
import { CardioForm } from "./components/CardioForm";
import { ActiveSessionBar } from "./components/ActiveSessionBar";
import { SeriesList } from "./components/SeriesList";
import { ExerciseFilter } from "./components/ExerciseFilter";
import { Modal } from "./components/Modal";
import { PixelLifter } from "./components/PixelLifter";
import { getAllSeries } from "./storage/seriesStorage";
import { getUniqueExerciseNames, filterByExercise, filterByDate } from "./stats/seriesStats";
import { FrequencyView } from "./components/FrequencyView";
import { StatsSummary } from "./components/StatsSummary";
import { ProgressChart } from "./components/ProgressChart";
import { ProfileSection } from "./components/ProfileSection";
import "./App.css";

function App() {
  const [allSeries, setAllSeries] = useState(() => getAllSeries());
  const [entryType, setEntryType] = useState<"strength" | "cardio">("strength");
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function refreshSeries() {
    setAllSeries(getAllSeries());
  }

  function handleSeriesAdded() {
    refreshSeries();
    setIsModalOpen(false);
  }

  const exerciseNames = getUniqueExerciseNames(allSeries);

  const hasActiveFilter = selectedExercise !== null || selectedDate !== null;

  let displayedSeries = allSeries;
  if (selectedExercise) {
    displayedSeries = filterByExercise(displayedSeries, selectedExercise);
  }
  if (selectedDate) {
    displayedSeries = filterByDate(displayedSeries, selectedDate);
  }

  return (
    <>
      <header className="app-header">
        <h1>
          De la Fonte <PixelLifter />
        </h1>
      </header>
      <ActiveSessionBar onSessionChange={refreshSeries} />

      <div className="panel">
        <button onClick={() => setIsModalOpen(true)}>+ Ajouter un exercice</button>
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2>Nouvelle entrée</h2>
          <div className="modal-type-toggle">
            <button onClick={() => setEntryType("strength")}>Musculation</button>
            <button onClick={() => setEntryType("cardio")}>Cardio</button>
          </div>

          {entryType === "strength" ? (
            <SeriesForm onSeriesAdded={handleSeriesAdded} />
          ) : (
            <CardioForm onSeriesAdded={handleSeriesAdded} />
          )}
        </Modal>
      )}

      <ProfileSection series={allSeries} />

      <div className="panel">
        <ExerciseFilter
          exerciseNames={exerciseNames}
          selected={selectedExercise}
          onChange={setSelectedExercise}
        />

        <label>
          Filtrer par date
          <input
            type="date"
            value={selectedDate ?? ''}
            onChange={(e) => setSelectedDate(e.target.value === '' ? null : e.target.value)}
          />
        </label>

        {(selectedExercise || selectedDate) && (
          <button onClick={() => { setSelectedExercise(null); setSelectedDate(null); }}>
            Réinitialiser les filtres
          </button>
        )}
      </div>

      <ProgressChart series={allSeries} exerciseName={selectedExercise} />

      <div className="panel">
        {hasActiveFilter ? (
          <SeriesList series={displayedSeries} onSeriesChanged={refreshSeries} />
        ) : (
          <p>Sélectionnez un filtre (exercice ou date) pour afficher l'historique.</p>
        )}
      </div>

      <FrequencyView series={allSeries} />
      <StatsSummary series={allSeries} />
    </>
  );
}

export default App;