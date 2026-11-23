import type { TravelWorkbookResult } from '../type';

export interface IWorkbookSourceMetadata {
  source: 'google-sheets-public-export';
  spreadsheetId: string;
  fetchedAt: string;
  contentType: string | null;
  contentLength: number;
  etag: string | null;
  lastModified: string | null;
  sha256: string;
}

export type WorkbookSourceErrorCode =
  | 'WORKBOOK_SOURCE_TIMEOUT'
  | 'WORKBOOK_SOURCE_NETWORK_ERROR'
  | 'WORKBOOK_SOURCE_ACCESS_DENIED'
  | 'WORKBOOK_SOURCE_NOT_FOUND'
  | 'WORKBOOK_SOURCE_RATE_LIMITED'
  | 'WORKBOOK_SOURCE_UPSTREAM_ERROR'
  | 'WORKBOOK_SOURCE_REDIRECT_NOT_ALLOWED'
  | 'WORKBOOK_SOURCE_INVALID_CONTENT_TYPE'
  | 'WORKBOOK_SOURCE_EMPTY_FILE'
  | 'WORKBOOK_SOURCE_FILE_TOO_LARGE'
  | 'WORKBOOK_SOURCE_INVALID_XLSX_SIGNATURE';

export interface IWorkbookSourceFailure {
  ok: false;
  error: {
    code: WorkbookSourceErrorCode;
    message: string;
    status?: number;
  };
}

export type WorkbookDownloadResult =
  | { ok: true; bytes: Uint8Array; metadata: IWorkbookSourceMetadata }
  | IWorkbookSourceFailure;

export type LatestTravelDatasetResult =
  | (Extract<TravelWorkbookResult, { ok: true }> & { source: IWorkbookSourceMetadata })
  | IWorkbookSourceFailure
  | (Extract<TravelWorkbookResult, { ok: false }> & {
      error: { code: 'WORKBOOK_DATA_BUILD_FAILED'; message: string };
      source: IWorkbookSourceMetadata;
    });
