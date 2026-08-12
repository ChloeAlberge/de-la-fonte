import { useState } from 'react';
import { SeriesForm } from './components/SeriesForm';
import { CardioForm } from './components/CardioForm';
import { ActiveSessionBar } from './components/ActiveSessionBar';
import { getAllSeries } from './storage/seriesStorage';
import './App.css';

function App() {
  const [seriesCount, setSeriesCount] = useState(() => getAllSeries().length);
  const [entryType, setEntryType] = useState<'strength' | 'cardio'>('strength');

  function refreshCount() {
    setSeriesCount(getAllSeries().length);
  }

  return (
    <>
      <h1>De la Fonte</h1>
      <ActiveSessionBar onSessionChange={refreshCount} />

      <div>
        <button onClick={() => setEntryType('strength')}>Musculation</button>
        <button onClick={() => setEntryType('cardio')}>Cardio</button>
      </div>

      {entryType === 'strength' ? (
        <SeriesForm onSeriesAdded={refreshCount} />
      ) : (
        <CardioForm onSeriesAdded={refreshCount} />
      )}

      <p>{seriesCount} série(s) enregistrée(s) — (affichage temporaire, US2 fera le vrai historique)</p>
    </>
  );
}

export default App;