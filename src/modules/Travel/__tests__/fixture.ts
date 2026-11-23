import type { ITravelDataset, ITravelListing } from '@/lib/travel-data/type';

export const listing = (id: string, overrides: Partial<ITravelListing> = {}): ITravelListing => ({
  id,
  sourceKey: id,
  sourceSheet: '3_An_Dac_San',
  sourceIndex: null,
  name: 'Quán Đỗ',
  mainCategory: 'food-dining',
  sourceCategory: 'Đặc sản',
  address: 'Đường Bạch Đằng',
  sourceArea: 'Sơn Trà',
  areaId: 'hai-chau',
  areaName: 'Hải Châu',
  status: 'ACTIVE',
  statusRaw: null,
  ratingRaw: null,
  rating: 4.5,
  priceText: null,
  openingHoursText: null,
  highlightsText: null,
  notesText: 'Internal notes',
  mapsUrl: null,
  visitProfileRaw: null,
  visitProfile: {
    suitableFor: 'Gia đình',
    recommendedTime: 'Buổi tối',
    suggestedDuration: 'Một giờ',
    distanceFromCenterText: 'Gần',
  },
  ...overrides,
});

export const travelFixture: ITravelDataset = {
  listings: [
    listing('a', { mapsUrl: 'https://maps.app.goo.gl/example' }),
    listing('b', { name: 'Bãi biển Mỹ Khê', mainCategory: 'sightseeing-nature', rating: null }),
  ],
  areas: [{ areaId: 'hai-chau', areaName: 'Hải Châu', description: null, reportedCount: 999 }],
  areaCounts: { 'hai-chau': 2 },
  editorial: {
    topPicks: [{ title: 'Ăn gì ở Đà Nẵng?', content: 'Thử món địa phương vào buổi tối.' }],
    quickTripIdeas: [],
    itinerary: [],
    travelTips: [],
  },
};
