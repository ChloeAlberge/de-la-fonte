import { useState } from "react";
import { SeriesForm } from "./components/SeriesForm";
import { CardioForm } from "./components/CardioForm";
import { ActiveSessionBar } from "./components/ActiveSessionBar";
import { SeriesList } from "./components/SeriesList";
import { ExerciseFilter } from "./components/ExerciseFilter";
import { getAllSeries } from "./storage/seriesStorage";
import { getUniqueExerciseNames, filterByExercise } from "./stats/seriesStats";
import { FrequencyView } from "./components/FrequencyView";
import { StatsSummary } from "./components/StatsSummary";
import { ProgressChart } from "./components/ProgressChart";
import "./App.css";

function App() {
  const [allSeries, setAllSeries] = useState(() => getAllSeries());
  const [entryType, setEntryType] = useState<"strength" | "cardio">("strength");
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  function refreshSeries() {
    setAllSeries(getAllSeries());
  }

  const exerciseNames = getUniqueExerciseNames(allSeries);
  const displayedSeries = selectedExercise
    ? filterByExercise(allSeries, selectedExercise)
    : allSeries;

  return (
    <>
      <header className="app-header">
        <h1>De la Fonte</h1>
      </header>
      <ActiveSessionBar onSessionChange={refreshSeries} />

      <div>
        <button onClick={() => setEntryType("strength")}>Musculation</button>
        <button onClick={() => setEntryType("cardio")}>Cardio</button>
      </div>

      {entryType === "strength" ? (
        <SeriesForm onSeriesAdded={refreshSeries} />
      ) : (
        <CardioForm onSeriesAdded={refreshSeries} />
      )}

      <ExerciseFilter
        exerciseNames={exerciseNames}
        selected={selectedExercise}
        onChange={setSelectedExercise}
      />

      <ProgressChart series={allSeries} exerciseName={selectedExercise} />

      <SeriesList series={displayedSeries} onSeriesChanged={refreshSeries} />
      <FrequencyView series={allSeries} />
      <StatsSummary series={allSeries} />
    </>
  );
}

export default App;
