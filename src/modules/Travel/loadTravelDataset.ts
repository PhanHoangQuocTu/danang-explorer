import { connection } from 'next/server';
import { cache } from 'react';

import { fetchLatestTravelDataset } from '@/lib/travel-data/source/latest';

// Next should wait for a request before reading the workbook, including during a build.
export const loadTravelDataset = cache(async () => {
  await connection();
  return fetchLatestTravelDataset();
});
