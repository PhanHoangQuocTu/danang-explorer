import { describe, expect, it } from 'vitest';
import { buildListingSourceKey, normalizeListingName, normalizeRating, parseVisitProfile } from '../normalize';

describe('listing identity', () => {
  it('normalizes NFC, case and whitespace while retaining diacritics and punctuation', () => {
    expect(normalizeListingName('  CA\u0302\u0300U\t RỒNG - ĐÀ NẴNG\n')).toBe('cầu rồng - đà nẵng');
    expect(normalizeListingName('Cầu Rồng')).not.toBe(normalizeListingName('Cau Rong'));
  });

  it('keeps the exact sheet name in an unambiguous composite key', () => {
    expect(buildListingSourceKey('Sheet A', ' CẦU RỒNG ')).toBe(buildListingSourceKey('Sheet A', 'Cầu Rồng'));
    expect(buildListingSourceKey('Sheet A', 'Cầu Rồng')).not.toBe(buildListingSourceKey('sheet A', 'Cầu Rồng'));
    expect(buildListingSourceKey('A|B', 'C')).not.toBe(buildListingSourceKey('A', 'B|C'));
  });
});

describe('normalizeRating', () => {
  it.each([
    [0, 0],
    [5, 5],
    [4.25, 4.25],
    [' 4.5 ', 4.5],
    ['.5', 0.5],
  ])('parses %s as %s', (raw, expected) => {
    expect(normalizeRating(raw)).toBe(expected);
  });

  it.each([
    null,
    '',
    '  ',
    '—',
    'ĐÃ ĐÓNG',
    'CẤM',
    '4.5 stars',
    '4,5',
    '0x4',
    '4e0',
    -1,
    5.1,
    Number.NaN,
    Number.POSITIVE_INFINITY,
  ])('rejects %s without converting it to zero', (raw) => {
    expect(normalizeRating(raw)).toBeNull();
  });
});

describe('parseVisitProfile', () => {
  it('trims the four parts without changing source content within each part', () => {
    expect(parseVisitProfile(' Gia đình | Buổi sáng | 1–2 giờ | Gần  trung tâm ')).toEqual({
      suitableFor: 'Gia đình',
      recommendedTime: 'Buổi sáng',
      suggestedDuration: '1–2 giờ',
      distanceFromCenterText: 'Gần  trung tâm',
    });
  });

  it.each([null, 'a | b | c', 'a | b | c | d | e', 'a |  | c | d'])(
    'rejects incomplete or ambiguous profile %s',
    (raw) => {
      expect(parseVisitProfile(raw)).toBeNull();
    }
  );
});
