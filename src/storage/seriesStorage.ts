import type { Series, NewSeries } from "../models/series";

const STORAGE_KEY = "de-la-fonte:series";

export function getAllSeries(): Series[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as Series[];
}

export function addSeries(data: NewSeries): Series {
  const newSeries: Series = {
    ...data,
    id: crypto.randomUUID(),
  };

  const all = getAllSeries();
  all.push(newSeries);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));

  return newSeries;
}

export function updateSeries(id: string, data: Partial<NewSeries>): Series {
  const all = getAllSeries();
  const index = all.findIndex((s) => s.id === id);

  if (index === -1) {
    throw new Error(`Series with id ${id} not found`);
  }

  // Assertion assumée : on part du principe que `data` ne mélange jamais
  // des champs d'un autre `kind` que celui de la série existante.
  const updated = { ...all[index], ...data } as Series;

  all[index] = updated;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));

  return updated;
}

export function deleteSeries(id: string): void {
  const all = getAllSeries();
  const filtered = all.filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
