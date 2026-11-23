import { buildTravelDataset } from '../workbook';
import { downloadLatestTravelWorkbook } from './google-sheets';
import type { LatestTravelDatasetResult } from './type';

/** Fetch and validate one workbook for server-side consumers. */
export const fetchLatestTravelDataset = async (): Promise<LatestTravelDatasetResult> => {
  const download = await downloadLatestTravelWorkbook();
  if (!download.ok) return download;

  const result = buildTravelDataset(download.bytes);
  if (result.ok) return { ...result, source: download.metadata };

  return {
    ...result,
    error: { code: 'WORKBOOK_DATA_BUILD_FAILED', message: 'Downloaded workbook failed data validation.' },
    source: download.metadata,
  };
};
