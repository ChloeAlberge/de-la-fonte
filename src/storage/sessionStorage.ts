import type { Session } from '../models/session';

const SESSION_STORAGE_KEY = 'de-la-fonte:sessions';

export function getAllSessions(): Session[] {
  const raw = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as Session[];
}

export function getActiveSession(): Session | null {
  return getAllSessions().find((s) => s.endedAt === null) ?? null;
}

export function startSession(): Session {
  const active = getActiveSession();
  if (active) {
    throw new Error('Une séance est déjà en cours');
  }

  const newSession: Session = {
    id: crypto.randomUUID(),
    startedAt: new Date().toISOString(),
    endedAt: null,
  };

  const all = getAllSessions();
  all.push(newSession);
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(all));

  return newSession;
}

export function endSession(id: string): Session {
  const all = getAllSessions();
  const index = all.findIndex((s) => s.id === id);

  if (index === -1) {
    throw new Error(`Session with id ${id} not found`);
  }

  const updated: Session = { ...all[index], endedAt: new Date().toISOString() };
  all[index] = updated;
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(all));

  return updated;
}