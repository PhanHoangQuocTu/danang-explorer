import { AREA_IDS, EDITORIAL_RANGES } from '@/lib/travel-data/const';
import type { ITravelDataset } from '@/lib/travel-data/type';

import { listing } from './fixture';

export const areaDescription = '  Cảnh quan <b>ven biển</b> & đồi.\n\n  Dòng thứ hai.  ';
export const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=S%C6%A1n%20Tr%C3%A0';

export const phaseSixFixture: ITravelDataset = {
  areas: Object.entries(AREA_IDS).map(([areaName, areaId]) => ({
    areaId,
    areaName,
    description: areaId === 'son-tra' ? areaDescription : null,
    reportedCount: 999,
  })),
  areaCounts: { 'son-tra': 99 },
  listings: [
    listing('1'.repeat(64), { areaId: 'son-tra', areaName: 'Sơn Trà', sourceArea: 'Hải Châu', mapsUrl }),
    listing('2'.repeat(64), {
      areaId: 'son-tra',
      areaName: 'Sơn Trà',
      sourceSheet: '4_Hai_San_Nha_Hang',
      status: 'WARNING',
      rating: null,
    }),
    listing('3'.repeat(64), { areaId: 'son-tra', areaName: 'Sơn Trà', name: 'Bãi biển', status: 'CLOSED_BANNED' }),
    listing('4'.repeat(64), { areaId: 'son-tra', areaName: 'Sơn Trà', name: 'Cầu đá', status: 'UNKNOWN' }),
    listing('5'.repeat(64), { areaId: 'son-tra', areaName: 'Sơn Trà', name: 'Chợ nhỏ', status: 'UNVERIFIED' }),
    listing('6'.repeat(64), { areaId: 'unknown', areaName: null, name: 'Ngoài danh mục' }),
    listing('7'.repeat(64), { name: 'Địa điểm Hải Châu' }),
  ],
  editorial: {
    quickTripIdeas: entries('quickTripIdeas'),
    topPicks: entries('topPicks'),
    itinerary: entries('itinerary'),
    travelTips: entries('travelTips'),
  },
};

function entries(section: keyof ITravelDataset['editorial']) {
  const [first, last] = EDITORIAL_RANGES[section];
  return Array.from({ length: last - first + 1 }, (_, index) => ({
    title: index === 0 ? 'Quán Đỗ' : `  Tiêu đề ${first + index}  `,
    content: `  Dòng ${first + index} <b>4.5★</b> & 50.000đ\n\n${'Phương án B. '.repeat(100)}  `,
  }));
}
