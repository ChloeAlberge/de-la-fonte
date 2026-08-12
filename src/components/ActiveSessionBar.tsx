import { useState } from 'react';
import { getActiveSession, startSession, endSession } from '../storage/sessionStorage';

interface ActiveSessionBarProps {
  onSessionChange: () => void;
}

export function ActiveSessionBar({ onSessionChange }: ActiveSessionBarProps) {
  const [activeSession, setActiveSession] = useState(() => getActiveSession());

  function handleStart() {
    const session = startSession();
    setActiveSession(session);
    onSessionChange();
  }

  function handleEnd() {
    if (!activeSession) return;

    endSession(activeSession.id);
    setActiveSession(null);
    onSessionChange();
  }

  if (!activeSession) {
    return (
      <div>
        <button onClick={handleStart}>Démarrer une séance</button>
      </div>
    );
  }

  return (
    <div>
      <p>Séance en cours — démarrée à {new Date(activeSession.startedAt).toLocaleTimeString()}</p>
      <button onClick={handleEnd}>Terminer la séance</button>
    </div>
  );
}