import type { AreaId, IAreaMetadata, ITravelListing, ListingStatus, MainCategory } from '@/lib/travel-data/type';

import { getCanonicalAreaName, getCanonicalAreas, LISTING_STATUSES, MAIN_CATEGORIES } from '../Travel/catalog';

const RATING_BUCKETS = [
  { id: 'underThree', maxExclusive: 3 },
  { id: 'underFour', maxExclusive: 4 },
  { id: 'underFourFive', maxExclusive: 4.5 },
] as const;
const TOP_RATED_LIMIT = 10;

type RatingBucketId = (typeof RATING_BUCKETS)[number]['id'] | 'fourFiveToFive';
type TopRatedListing = Pick<ITravelListing, 'id' | 'name' | 'mainCategory' | 'areaName' | 'status'> & {
  rating: number;
};

const increment = <Key>(counts: Map<Key, number>, key: Key) => counts.set(key, (counts.get(key) ?? 0) + 1);

export const getInsightsMetrics = (listings: readonly ITravelListing[], areaMetadata: readonly IAreaMetadata[]) => {
  const categoryCounts = new Map<MainCategory, number>();
  const areaCounts = new Map<AreaId, number>();
  const statusCounts = new Map<ListingStatus, number>();
  const ratingCounts = new Map<RatingBucketId, number>();
  const ratedListings: TopRatedListing[] = [];

  for (const listing of listings) {
    const { id, name, mainCategory, areaId, status, rating } = listing;
    increment(categoryCounts, mainCategory);
    increment(areaCounts, areaId);
    increment(statusCounts, status);

    if (typeof rating !== 'number' || !Number.isFinite(rating) || rating < 0 || rating > 5) continue;
    const bucket = RATING_BUCKETS.find(({ maxExclusive }) => rating < maxExclusive)?.id ?? 'fourFiveToFive';
    increment(ratingCounts, bucket);
    ratedListings.push({ id, name, mainCategory, areaName: getCanonicalAreaName(listing), status, rating });
  }

  const areas: { id: AreaId; name: string | null; count: number }[] = getCanonicalAreas(areaMetadata).map(
    ({ id, name }) => ({
      id,
      name,
      count: areaCounts.get(id) ?? 0,
    })
  );
  const areasRepresented = areas.filter(({ count }) => count > 0).length;
  const unknownAreaCount = areaCounts.get('unknown') ?? 0;
  if (unknownAreaCount > 0) areas.push({ id: 'unknown', name: null, count: unknownAreaCount });

  const total = listings.length;
  const rated = ratedListings.length;
  return {
    overview: {
      total,
      active: statusCounts.get('ACTIVE') ?? 0,
      areasRepresented,
      rated,
      noRating: total - rated,
      coverage: total === 0 ? null : (rated / total) * 100,
    },
    categories: MAIN_CATEGORIES.map((id) => ({ id, count: categoryCounts.get(id) ?? 0 })).sort(
      (a, b) => b.count - a.count
    ),
    areas,
    statuses: LISTING_STATUSES.map((id) => ({ id, count: statusCounts.get(id) ?? 0 })),
    ratings: [...RATING_BUCKETS.map(({ id }) => id), 'fourFiveToFive' as const].map((id) => ({
      id,
      count: ratingCounts.get(id) ?? 0,
    })),
    // Stable sort preserves the normalized source order for equal ratings.
    topRated: ratedListings.sort((a, b) => b.rating - a.rating).slice(0, TOP_RATED_LIMIT),
  };
};

export type InsightsMetrics = ReturnType<typeof getInsightsMetrics>;
