import { describe, it, expect, beforeEach } from 'vitest';
import { getAllSessions, getActiveSession, startSession, endSession } from './sessionStorage';

describe('sessionStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renvoie un tableau vide et aucune séance active au départ', () => {
    expect(getAllSessions()).toEqual([]);
    expect(getActiveSession()).toBeNull();
  });

  it('démarre une séance et la marque comme active', () => {
    const session = startSession();

    expect(session.id).toBeTruthy();
    expect(session.endedAt).toBeNull();
    expect(getActiveSession()?.id).toBe(session.id);
  });

  it('refuse de démarrer une deuxième séance si une est déjà active', () => {
    startSession();

    expect(() => startSession()).toThrow();
  });

  it('termine une séance et elle n’est plus active', () => {
    const session = startSession();

    const ended = endSession(session.id);

    expect(ended.endedAt).not.toBeNull();
    expect(getActiveSession()).toBeNull();
  });

  it('lève une erreur si on termine un id inexistant', () => {
    expect(() => endSession('id-inexistant')).toThrow();
  });
});