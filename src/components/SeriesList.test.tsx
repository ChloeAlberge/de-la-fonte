import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SeriesList } from './SeriesList';
import type { Series } from '../models/series';

const legPress: Series = {
  id: '1',
  kind: 'strength',
  exerciseName: 'LegPress',
  equipmentType: 'machine',
  weightKg: 91,
  reps: 10,
  setsCount: 3,
  performedAt: '2026-08-12T10:36:38.000Z',
  sessionId: null,
};

describe('SeriesList', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('affiche un message si aucune série', () => {
    render(<SeriesList series={[]} onSeriesChanged={() => {}} />);

    expect(screen.getByText(/aucune série enregistrée/i)).toBeInTheDocument();
  });

  it('affiche les informations d’une série muscu', () => {
    render(<SeriesList series={[legPress]} onSeriesChanged={() => {}} />);

    expect(screen.getByText(/LegPress/)).toBeInTheDocument();
    expect(screen.getByText(/91kg/)).toBeInTheDocument();
  });

  it('supprime une série après confirmation', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const onSeriesChanged = vi.fn();

    render(<SeriesList series={[legPress]} onSeriesChanged={onSeriesChanged} />);

    await user.click(screen.getByText('Supprimer'));

    expect(onSeriesChanged).toHaveBeenCalledOnce();
  });

  it('ne supprime pas si la confirmation est annulée', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    const onSeriesChanged = vi.fn();

    render(<SeriesList series={[legPress]} onSeriesChanged={onSeriesChanged} />);

    await user.click(screen.getByText('Supprimer'));

    expect(onSeriesChanged).not.toHaveBeenCalled();
  });
});