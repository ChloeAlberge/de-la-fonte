import { useState } from 'react';
import { SeriesForm } from './components/SeriesForm';
import { CardioForm } from './components/CardioForm';
import { ActiveSessionBar } from './components/ActiveSessionBar';
import { SeriesList } from './components/SeriesList';
import { getAllSeries } from './storage/seriesStorage';
import './App.css';

function App() {
  const [allSeries, setAllSeries] = useState(() => getAllSeries());
  const [entryType, setEntryType] = useState<'strength' | 'cardio'>('strength');

  function refreshSeries() {
    setAllSeries(getAllSeries());
  }

  return (
    <>
      <h1>De la Fonte</h1>
      <ActiveSessionBar onSessionChange={refreshSeries} />

      <div>
        <button onClick={() => setEntryType('strength')}>Musculation</button>
        <button onClick={() => setEntryType('cardio')}>Cardio</button>
      </div>

      {entryType === 'strength' ? (
        <SeriesForm onSeriesAdded={refreshSeries} />
      ) : (
        <CardioForm onSeriesAdded={refreshSeries} />
      )}

      <SeriesList series={allSeries} />
    </>
  );
}

export default App;