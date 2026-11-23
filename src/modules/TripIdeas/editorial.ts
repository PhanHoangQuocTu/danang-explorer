import { EDITORIAL_RANGES } from '@/lib/travel-data/const';
import type { ITravelDataset } from '@/lib/travel-data/type';

export const editorialSections = ['quickTripIdeas', 'topPicks', 'itinerary', 'travelTips'] as const;

export const hasCompleteEditorial = (editorial: ITravelDataset['editorial']) =>
  editorialSections.every((section) => {
    const [first, last] = EDITORIAL_RANGES[section];
    return editorial[section].length === last - first + 1;
  });
