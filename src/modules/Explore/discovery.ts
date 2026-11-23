import type { ITravelListing, ListingStatus, MainCategory } from '@/lib/travel-data/type';

import { getCanonicalAreas, LISTING_STATUSES, MAIN_CATEGORIES } from '../Travel/catalog';

export const PAGE_SIZE = 24;
export const QUERY_LIMIT = 200;
export const VIEWS = ['grid', 'list', 'table'] as const;
export const SORTS = ['source', 'name-asc', 'rating-desc'] as const;
export const RATINGS = ['1', '2', '3', '4'] as const;
const KEYS = [
  'q',
  'category',
  'sourceCategory',
  'area',
  'rating',
  'status',
  'suitableFor',
  'recommendedTime',
  'view',
  'sort',
  'page',
] as const;
const MULTI_KEYS = ['category', 'sourceCategory', 'area', 'suitableFor', 'recommendedTime'] as const;
type CanonicalArea = ReturnType<typeof getCanonicalAreas>[number]['id'];

export interface ExploreState {
  q: string;
  category: MainCategory[];
  sourceCategory: string[];
  area: CanonicalArea[];
  rating: (typeof RATINGS)[number] | null;
  status: ListingStatus | null;
  suitableFor: string[];
  recommendedTime: string[];
  view: (typeof VIEWS)[number];
  sort: (typeof SORTS)[number];
  page: number;
}

const cleanQuery = (query: string) =>
  Array.from(query.trim().replace(/\s+/gu, ' ')).slice(0, QUERY_LIMIT).join('').trimEnd();

export const normalizeSearch = (value: string) =>
  value.normalize('NFD').toLowerCase().replace(/\p{M}/gu, '').replace(/đ/gu, 'd').trim().replace(/\s+/gu, ' ');

const uniqueValues = (values: Iterable<string | null | undefined>) => [
  ...new Set(Array.from(values).filter((value): value is string => Boolean(value?.trim()))),
];

export const getExploreOptions = (listings: readonly ITravelListing[]) => ({
  sourceCategory: uniqueValues(listings.map(({ sourceCategory }) => sourceCategory)),
  suitableFor: uniqueValues(listings.map(({ visitProfile }) => visitProfile?.suitableFor)),
  recommendedTime: uniqueValues(listings.map(({ visitProfile }) => visitProfile?.recommendedTime)),
});

const option = <T extends string>(raw: string | null, allowed: readonly T[]) => allowed.find((value) => value === raw);

const selections = <T extends string>(raw: string[], allowed: readonly T[]) => {
  const selected = new Set(raw);
  return allowed.filter((value) => selected.has(value));
};

export const parseExploreState = (
  params: URLSearchParams,
  options: ReturnType<typeof getExploreOptions>
): ExploreState => {
  const rawPage = params.get('page') ?? '';
  const page = /^[1-9]\d*$/u.test(rawPage) ? Number(rawPage) : 1;
  return {
    q: cleanQuery(params.get('q') ?? ''),
    category: selections(params.getAll('category'), MAIN_CATEGORIES),
    sourceCategory: selections(params.getAll('sourceCategory'), options.sourceCategory),
    area: selections(
      params.getAll('area'),
      getCanonicalAreas([]).map(({ id }) => id)
    ),
    rating: option(params.get('rating'), RATINGS) ?? null,
    status: option(params.get('status'), LISTING_STATUSES) ?? null,
    suitableFor: selections(params.getAll('suitableFor'), options.suitableFor),
    recommendedTime: selections(params.getAll('recommendedTime'), options.recommendedTime),
    view: option(params.get('view'), VIEWS) ?? 'grid',
    sort: option(params.get('sort'), SORTS) ?? 'source',
    page: Number.isSafeInteger(page) ? page : 1,
  };
};

export const getUnrelatedParams = (previous: URLSearchParams) => {
  const params = new URLSearchParams(previous);
  for (const key of KEYS) params.delete(key);
  return params;
};

export const serializeExploreState = (state: ExploreState, previous = new URLSearchParams()) => {
  const params = getUnrelatedParams(previous);
  if (state.q) params.set('q', state.q);
  for (const key of MULTI_KEYS) {
    for (const value of state[key]) params.append(key, value);
  }
  if (state.rating) params.set('rating', state.rating);
  if (state.status) params.set('status', state.status);
  if (state.view !== 'grid') params.set('view', state.view);
  if (state.sort !== 'source') params.set('sort', state.sort);
  if (state.page > 1) params.set('page', String(state.page));
  return params;
};

export const clearExploreState = ({ view }: ExploreState): ExploreState =>
  parseExploreState(new URLSearchParams({ view }), getExploreOptions([]));

const includes = <T extends string>(selection: readonly T[], value: string | null | undefined) =>
  selection.length === 0 || selection.some((selected) => selected === value);

export const discoverListings = (
  listings: readonly ITravelListing[],
  state: ExploreState,
  locale: string,
  categoryLabels: Partial<Record<MainCategory, string>>
) => {
  const query = normalizeSearch(state.q);
  const minimum = state.rating === null ? null : Number(state.rating);
  const results = listings.filter(
    (listing) =>
      includes(state.category, listing.mainCategory) &&
      includes(state.sourceCategory, listing.sourceCategory) &&
      includes(state.area, listing.areaId) &&
      includes(state.suitableFor, listing.visitProfile?.suitableFor) &&
      includes(state.recommendedTime, listing.visitProfile?.recommendedTime) &&
      (state.status === null || state.status === listing.status) &&
      (minimum === null || (listing.rating !== null && listing.rating >= minimum)) &&
      (!query ||
        [
          listing.name,
          listing.address,
          listing.sourceCategory,
          listing.mainCategory,
          categoryLabels[listing.mainCategory],
        ].some((value) => value != null && normalizeSearch(value).includes(query)))
  );

  if (state.sort === 'name-asc') {
    const collator = new Intl.Collator(locale);
    results.sort((left, right) => collator.compare(left.name, right.name));
  }
  if (state.sort === 'rating-desc') {
    results.sort((left, right) => (right.rating ?? -1) - (left.rating ?? -1));
  }

  const total = results.length;
  const pageCount = Math.ceil(total / PAGE_SIZE);
  const page = Math.min(state.page, Math.max(1, pageCount));
  const start = (page - 1) * PAGE_SIZE;
  return { total, pageCount, page, listings: results.slice(start, start + PAGE_SIZE) };
};
