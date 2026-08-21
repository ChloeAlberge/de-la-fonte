import { describe, it, expect, beforeEach } from 'vitest';
import { getProfile, setDisplayName } from './profileStorage';

describe('profileStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renvoie un displayName vide par défaut', () => {
    expect(getProfile()).toEqual({ displayName: '' });
  });

  it('enregistre et relit le nom d’affichage', () => {
    setDisplayName('Chloé');

    expect(getProfile()).toEqual({ displayName: 'Chloé' });
  });

  it('écrase l’ancien nom lors d’une nouvelle mise à jour', () => {
    setDisplayName('Chloé');
    setDisplayName('C');

    expect(getProfile()).toEqual({ displayName: 'C' });
  });
});
