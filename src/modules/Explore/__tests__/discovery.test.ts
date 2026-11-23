import { describe, expect, it } from 'vitest';

import { listing } from '../../Travel/__tests__/fixture';
import {
  clearExploreState,
  discoverListings,
  getExploreOptions,
  parseExploreState,
  serializeExploreState,
} from '../discovery';

const browse = (records = [listing('a')], query = '') =>
  discoverListings(records, parseExploreState(new URLSearchParams(query), getExploreOptions(records)), 'vi', {
    'food-dining': 'Food and dining',
  });

describe('Explore discovery', () => {
  it.each(['QUAN DO', 'duong++bach+dang', 'DAC+SAN', 'food+and+dining'])('matches %s across source fields', (query) => {
    const record = listing('a');
    expect(browse([record], `q=${query}`).listings).toEqual([record]);
    expect(record.name).toBe('Quán Đỗ');
    expect(browse([record], 'q=internal+notes').listings).toEqual([]);
  });

  it('uses AND across dimensions and OR within a dimension', () => {
    const records = [
      listing('a'),
      listing('b', { areaId: 'son-tra' }),
      listing('c', { rating: null }),
      listing('d', { areaId: 'thanh-khe', sourceArea: 'Hải Châu' }),
      listing('e', { visitProfile: null }),
      listing('f', { status: 'WARNING' }),
      listing('g', { sourceCategory: 'Món khác' }),
    ];
    const query = new URLSearchParams({
      category: 'food-dining',
      sourceCategory: 'Đặc sản',
      rating: '4',
      status: 'ACTIVE',
      suitableFor: 'Gia đình',
      recommendedTime: 'Buổi tối',
    });
    query.append('area', 'hai-chau');
    query.append('area', 'son-tra');
    expect(browse(records, query.toString()).listings.map(({ id }) => id)).toEqual(['a', 'b']);
  });

  it('includes all statuses and keeps ties stable, with unrated listings last', () => {
    const records = [
      listing('a', { status: 'UNKNOWN', rating: null, name: 'Quán A' }),
      listing('b', { status: 'WARNING' }),
      listing('c', { status: 'CLOSED_BANNED' }),
      listing('d', { status: 'UNVERIFIED', rating: 5, name: 'Quán C' }),
    ];
    expect(browse(records).listings).toEqual(records);
    expect(browse(records, 'sort=rating-desc').listings.map(({ id }) => id)).toEqual(['d', 'b', 'c', 'a']);
    expect(browse(records, 'sort=name-asc').listings.map(({ id }) => id)).toEqual(['a', 'd', 'b', 'c']);
  });

  it.each([0, 1, 24, 25, 49])('clamps page and limits results for %i listings', (count) => {
    const records = Array.from({ length: count }, (_, index) => listing(String(index)));
    const result = browse(records, 'page=999');
    const pageCount = Math.ceil(count / 24);
    expect(result).toMatchObject({ total: count, pageCount, page: Math.max(1, pageCount) });
    expect(result.listings).toEqual(records.slice(Math.max(0, pageCount - 1) * 24));
    expect(browse(records).listings).toHaveLength(Math.min(count, 24));
  });

  it('validates, round-trips and clears URL state while keeping view and unrelated parameters', () => {
    const options = getExploreOptions([listing('a')]);
    const raw = new URLSearchParams(
      'q=++Quan+++Do+&area=invalid&area=hai-chau&area=hai-chau&rating=5&view=table&page=0&ref=guide'
    );
    raw.set('suitableFor', 'Gia đình');
    const state = parseExploreState(raw, options);
    expect(state).toMatchObject({ q: 'Quan Do', area: ['hai-chau'], rating: null, view: 'table', page: 1 });
    const canonical = serializeExploreState(state, raw);
    expect(canonical.get('ref')).toBe('guide');
    expect(canonical.has('page')).toBe(false);
    expect(parseExploreState(canonical, options)).toEqual(state);
    expect(serializeExploreState(clearExploreState(state), raw).toString()).toBe('ref=guide&view=table');
    expect(browse([listing('a')], 'page=1e3&view=unknown&status=INVALID').page).toBe(1);
  });
});
