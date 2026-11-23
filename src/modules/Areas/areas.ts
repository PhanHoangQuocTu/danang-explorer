import { AREA_IDS } from '@/lib/travel-data/const';
import type { IAreaMetadata } from '@/lib/travel-data/type';

import { loadTravelDataset } from '../Travel/loadTravelDataset';

const canonicalIds = new Set<string>(Object.values(AREA_IDS));

export const hasCanonicalAreaMetadata = (areas: readonly IAreaMetadata[]) =>
  areas.length === canonicalIds.size &&
  areas.every(({ areaId }) => canonicalIds.has(areaId)) &&
  new Set(areas.map(({ areaId }) => areaId)).size === canonicalIds.size;

export const resolveArea = async (areaId: string) => {
  const result = await loadTravelDataset();
  if (!result.ok) return { kind: 'source-error' } as const;
  if (!canonicalIds.has(areaId)) return { kind: 'not-found' } as const;

  const area = result.dataset.areas.find((record) => record.areaId === areaId);
  if (!area || !hasCanonicalAreaMetadata(result.dataset.areas)) return { kind: 'source-error' } as const;

  return {
    kind: 'found',
    area,
    listings: result.dataset.listings.filter((listing) => listing.areaId === areaId),
  } as const;
};
