import { loadTravelDataset } from '../Travel/loadTravelDataset';

// Phase 02 uses the lowercase hexadecimal SHA-256 of the listing's source key.
const PLACE_ID = /^[a-f0-9]{64}$/u;

export const resolvePlace = async (id: string) => {
  const result = await loadTravelDataset();
  if (!result.ok) return { kind: 'source-error' } as const;

  const listing = PLACE_ID.test(id) ? result.dataset.listings.find((item) => item.id === id) : undefined;
  return listing ? ({ kind: 'found', listing } as const) : ({ kind: 'not-found' } as const);
};
