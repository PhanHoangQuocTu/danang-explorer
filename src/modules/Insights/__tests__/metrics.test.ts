import { describe, expect, it } from 'vitest';

import { LISTING_STATUSES, MAIN_CATEGORIES } from '@/modules/Travel/catalog';
import { listing, travelFixture } from '@/modules/Travel/__tests__/fixture';

import { getInsightsMetrics } from '../metrics';

describe('getInsightsMetrics', () => {
  it('counts normalized categories, canonical areas and every status, including zeros', () => {
    const records = [
      listing('1', { status: 'WARNING' }),
      listing('2', { sourceSheet: '4_Hai_San_Nha_Hang', status: 'UNVERIFIED' }),
      listing('3', { areaId: 'unknown', areaName: 'Raw area', status: 'CLOSED_BANNED' }),
      listing('4', { areaId: 'son-tra', status: 'UNKNOWN' }),
      listing('5'),
    ];
    const result = getInsightsMetrics(records, travelFixture.areas);
    expect(result.overview).toMatchObject({ total: 5, active: 1, areasRepresented: 2 });
    expect(result.categories.map(({ id }) => id)).toEqual([
      'food-dining',
      ...MAIN_CATEGORIES.filter((id) => id !== 'food-dining'),
    ]);
    expect(result.categories.find(({ id }) => id === 'food-dining')?.count).toBe(5);
    expect(result.areas).toEqual([
      { id: 'son-tra', name: 'Sơn Trà', count: 1 },
      { id: 'hai-chau', name: 'Hải Châu', count: 3 },
      { id: 'thanh-khe', name: 'Thanh Khê', count: 0 },
      { id: 'lien-chieu', name: 'Liên Chiểu', count: 0 },
      { id: 'ngu-hanh-son', name: 'Ngũ Hành Sơn', count: 0 },
      { id: 'cam-le', name: 'Cẩm Lệ', count: 0 },
      { id: 'hoa-vang', name: 'Hòa Vang', count: 0 },
      { id: 'near-da-nang', name: 'Gần Đà Nẵng', count: 0 },
      { id: 'unknown', name: null, count: 1 },
    ]);
    expect(result.statuses.map(({ id }) => id)).toEqual(LISTING_STATUSES);
    expect(result.statuses.map(({ count }) => count)).toEqual([1, 1, 1, 1, 1]);
    for (const distribution of [result.categories, result.areas, result.statuses]) {
      expect(distribution.reduce((total, { count }) => total + count, 0)).toBe(result.overview.total);
    }
  });

  it('includes endpoints and counts missing or invalid ratings separately', () => {
    const ratings = [0, 2.99, 3, 3.99, 4, 4.49, 4.5, 5, null, Number.NaN, Number.POSITIVE_INFINITY, -0.01, 5.01];
    const result = getInsightsMetrics(
      ratings.map((rating, i) => listing(String(i), { rating })),
      []
    );
    expect(result.ratings.map(({ count }) => count)).toEqual([2, 2, 2, 2]);
    expect(result.overview).toMatchObject({ total: 13, rated: 8, noRating: 5, coverage: (8 / 13) * 100 });
    expect(result.ratings.reduce((total, { count }) => total + count, 0)).toBe(result.overview.rated);
    expect(result.overview.rated + result.overview.noRating).toBe(result.overview.total);
    expect(result.topRated.at(-1)?.rating).toBe(0);
  });

  it('breaks ties by source order and caps the result without mutating input', () => {
    const records = Object.freeze([
      Object.freeze(listing('z', { rating: 4.9 })),
      Object.freeze(listing('b', { rating: 4.9, sourceSheet: '4_Hai_San_Nha_Hang' })),
      Object.freeze(listing('c', { rating: 5, status: 'CLOSED_BANNED' })),
      ...Array.from({ length: 10 }, (_, index) => Object.freeze(listing(String(index), { rating: 4.5 }))),
      Object.freeze(listing('unrated', { rating: null })),
    ]);
    const result = getInsightsMetrics(records, []);
    expect(getInsightsMetrics(records, [])).toEqual(result);
    expect(result.topRated.map(({ id }) => id)).toEqual(['c', 'z', 'b', '0', '1', '2', '3', '4', '5', '6']);
    expect(result.topRated[0].status).toBe('CLOSED_BANNED');
    expect(result.topRated[1].name).toBe(result.topRated[2].name);
    expect(records[0].id).toBe('z');
  });

  it('reports zero counts with unavailable empty coverage and zero unrated-only coverage', () => {
    const empty = getInsightsMetrics([], []);
    expect(empty.overview).toEqual({ total: 0, active: 0, areasRepresented: 0, rated: 0, noRating: 0, coverage: null });
    expect(empty.topRated).toEqual([]);
    expect(empty.areas).toHaveLength(8);
    expect(empty.statuses.map(({ count }) => count)).toEqual([0, 0, 0, 0, 0]);
    expect(getInsightsMetrics([listing('a', { rating: null })], []).overview.coverage).toBe(0);
  });
});
