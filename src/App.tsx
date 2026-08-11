import { useState } from 'react';
import { SeriesForm } from './components/SeriesForm';
import { getAllSeries } from './storage/seriesStorage';
import './App.css';

function App() {
  const [seriesCount, setSeriesCount] = useState(() => getAllSeries().length);

  function refreshCount() {
    setSeriesCount(getAllSeries().length);
  }

  return (
    <>
      <h1>De la Fonte</h1>
      <SeriesForm onSeriesAdded={refreshCount} />
      <p>{seriesCount} série(s) enregistrée(s) — (affichage temporaire, US2 fera le vrai historique)</p>
    </>
  );
}

export default App;