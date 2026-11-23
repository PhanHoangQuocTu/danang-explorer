import { AREA_IDS, DETAIL_SHEETS, STATUSES } from '@/lib/travel-data/const';
import type { AreaId, IAreaMetadata, ITravelListing, MainCategory } from '@/lib/travel-data/type';

export const MAIN_CATEGORIES = [...new Set(DETAIL_SHEETS.map(({ category }) => category))];
export const LISTING_STATUSES = [...Object.values(STATUSES), 'UNKNOWN'] as const;

export const getCanonicalAreaName = ({ areaId, areaName }: Pick<ITravelListing, 'areaId' | 'areaName'>) =>
  areaId === 'unknown' ? null : areaName;

export const getCanonicalAreas = (areas: readonly IAreaMetadata[]) =>
  Object.entries(AREA_IDS).map(([name, id]) => ({
    id,
    name: areas.find(({ areaId }) => areaId === id)?.areaName ?? name,
  }));

export const getListingCounts = (listings: readonly ITravelListing[]) => {
  const categories = new Map<MainCategory, number>();
  const areas = new Map<AreaId, number>();
  for (const { mainCategory, areaId } of listings) {
    categories.set(mainCategory, (categories.get(mainCategory) ?? 0) + 1);
    areas.set(areaId, (areas.get(areaId) ?? 0) + 1);
  }
  return { categories, areas };
};
