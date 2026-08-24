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
      <div className="session-indicator">
        <div className="session-status-row">
          <span className="session-dot" />
          <button onClick={handleStart}>Démarrer une séance</button>
        </div>
      </div>
    );
  }

  return (
    <div className="session-indicator">
      <div className="session-status-row">
        <span className="session-dot active" />
        <span className="session-status-text">
          Séance en cours depuis {new Date(activeSession.startedAt).toLocaleTimeString()}
        </span>
      </div>
      <button onClick={handleEnd}>Terminer la séance</button>
    </div>
  );
}