import type { IVisitProfile } from './type';

const PLAIN_DECIMAL = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;

export const normalizeListingName = (name: string): string =>
  name.normalize('NFC').trim().replace(/\s+/g, ' ').toLowerCase();

export const buildListingSourceKey = (sourceSheet: string, name: string): string =>
  JSON.stringify([sourceSheet, normalizeListingName(name)]);

export const normalizeRating = (raw: string | number | null): number | null => {
  const text = typeof raw === 'string' ? raw.trim() : null;
  const rating = text !== null && PLAIN_DECIMAL.test(text) ? Number(text) : raw;

  return typeof rating === 'number' && Number.isFinite(rating) && rating >= 0 && rating <= 5 ? rating : null;
};

export const parseVisitProfile = (raw: string | null): IVisitProfile | null => {
  if (raw === null) return null;

  const parts = raw.split('|').map((part) => part.trim());
  const [suitableFor, recommendedTime, suggestedDuration, distanceFromCenterText] = parts;

  if (parts.length !== 4 || !suitableFor || !recommendedTime || !suggestedDuration || !distanceFromCenterText) {
    return null;
  }

  return { suitableFor, recommendedTime, suggestedDuration, distanceFromCenterText };
};
