import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';
import {
  DOWNLOAD_TIMEOUT_MS,
  MAX_DOWNLOAD_BYTES,
  MAX_EXPORT_REDIRECTS,
  TRAVEL_SPREADSHEET_ID,
  XLSX_MIME_TYPE,
} from './const';
import type { IWorkbookSourceFailure, WorkbookDownloadResult, WorkbookSourceErrorCode } from './type';

if (typeof window !== 'undefined') throw new Error('Travel workbook downloads must run on the server.');

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);
const EXPORT_HOST = /^doc-[a-z0-9]+-[a-z0-9]+-sheets\.googleusercontent\.com$/;
const ERROR_MESSAGES: Record<WorkbookSourceErrorCode, string> = {
  WORKBOOK_SOURCE_TIMEOUT: 'Google Sheets export exceeded the download deadline.',
  WORKBOOK_SOURCE_NETWORK_ERROR: 'Google Sheets export could not be downloaded.',
  WORKBOOK_SOURCE_ACCESS_DENIED: 'Google Sheets refused anonymous access to the workbook.',
  WORKBOOK_SOURCE_NOT_FOUND: 'Google Sheets could not find the workbook.',
  WORKBOOK_SOURCE_RATE_LIMITED: 'Google Sheets limited export requests.',
  WORKBOOK_SOURCE_UPSTREAM_ERROR: 'Google Sheets returned an unexpected export status.',
  WORKBOOK_SOURCE_REDIRECT_NOT_ALLOWED: 'Google Sheets export redirect was invalid or exceeded the allowed limit.',
  WORKBOOK_SOURCE_INVALID_CONTENT_TYPE: 'Google Sheets did not return an XLSX-compatible content type.',
  WORKBOOK_SOURCE_EMPTY_FILE: 'Google Sheets returned an empty workbook.',
  WORKBOOK_SOURCE_FILE_TOO_LARGE: 'Google Sheets export exceeded the workbook size limit.',
  WORKBOOK_SOURCE_INVALID_XLSX_SIGNATURE: 'Google Sheets export lacked a ZIP signature.',
};

const buildExportUrl = (spreadsheetId: string): URL => {
  if (!/^[a-zA-Z0-9_-]+$/.test(spreadsheetId)) throw new Error('Invalid configured spreadsheet ID.');
  return new URL(`https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=xlsx`);
};

const failure = (code: WorkbookSourceErrorCode, status?: number): IWorkbookSourceFailure => ({
  ok: false,
  error: { code, message: ERROR_MESSAGES[code], ...(status === undefined ? {} : { status }) },
});

const statusFailure = (status: number): IWorkbookSourceFailure => {
  if (status === 401 || status === 403) return failure('WORKBOOK_SOURCE_ACCESS_DENIED', status);
  if (status === 404) return failure('WORKBOOK_SOURCE_NOT_FOUND', status);
  if (status === 429) return failure('WORKBOOK_SOURCE_RATE_LIMITED', status);
  return failure('WORKBOOK_SOURCE_UPSTREAM_ERROR', status);
};

const parseUrl = (value: string | null, base?: URL): URL | null => {
  if (!value) return null;
  try {
    return new URL(value, base);
  } catch {
    return null;
  }
};

const isAllowedExportUrl = (url: URL | null, initial: URL): url is URL =>
  url !== null &&
  (url.href === initial.href ||
    (url.protocol === 'https:' &&
      !url.port &&
      !url.username &&
      !url.password &&
      !url.hash &&
      EXPORT_HOST.test(url.hostname) &&
      url.pathname.startsWith('/export/') &&
      url.pathname.length > '/export/'.length));

const cancelResponse = (response: Response) => {
  void response.body?.cancel().catch(() => undefined);
};

const fetchExport = async (initial: URL, signal: AbortSignal): Promise<Response | IWorkbookSourceFailure> => {
  let url = initial;

  for (let redirects = 0; redirects <= MAX_EXPORT_REDIRECTS; redirects++) {
    const response = await fetch(url, {
      cache: 'no-store',
      credentials: 'omit',
      redirect: 'manual',
      referrerPolicy: 'no-referrer',
      headers: { Accept: `${XLSX_MIME_TYPE}, application/octet-stream` },
      signal,
    });

    if (!REDIRECT_STATUSES.has(response.status)) return response;

    // Validate each hop before contacting it. Google uses doc-*-*-sheets hosts for signed exports.
    const next = parseUrl(response.headers.get('location'), url);
    cancelResponse(response);
    if (redirects === MAX_EXPORT_REDIRECTS || !isAllowedExportUrl(next, initial)) {
      return failure('WORKBOOK_SOURCE_REDIRECT_NOT_ALLOWED', response.status);
    }
    url = next;
  }
  return failure('WORKBOOK_SOURCE_REDIRECT_NOT_ALLOWED');
};

const hasZipSignature = (bytes: Buffer): boolean => {
  if (bytes.length < 4) return false;
  const signature = bytes.readUInt32LE(0);
  return signature === 0x04034b50 || signature === 0x06054b50 || signature === 0x08074b50;
};

const readResponseBody = async (body: ReadableStream<Uint8Array>): Promise<Buffer | IWorkbookSourceFailure> => {
  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) return Buffer.concat(chunks, length);
      length += value.byteLength;
      if (length > MAX_DOWNLOAD_BYTES) {
        void reader.cancel().catch(() => undefined);
        return failure('WORKBOOK_SOURCE_FILE_TOO_LARGE');
      }
      if (value.byteLength > 0) chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
};

const validateResponse = (
  response: Response,
  initial: URL
): IWorkbookSourceFailure | { body: ReadableStream<Uint8Array>; contentType: string | null } => {
  const { status, headers } = response;
  if (status !== 200) return statusFailure(status);
  if (!isAllowedExportUrl(parseUrl(response.url), initial))
    return failure('WORKBOOK_SOURCE_REDIRECT_NOT_ALLOWED', status);

  const mime = headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase();
  if (mime !== undefined && mime !== XLSX_MIME_TYPE && mime !== 'application/octet-stream') {
    return failure('WORKBOOK_SOURCE_INVALID_CONTENT_TYPE', status);
  }

  const length = headers.get('content-length');
  if (length !== null && /^\d+$/.test(length) && Number(length) > MAX_DOWNLOAD_BYTES) {
    return failure('WORKBOOK_SOURCE_FILE_TOO_LARGE', status);
  }
  if (response.body === null) return failure('WORKBOOK_SOURCE_EMPTY_FILE', status);
  return { body: response.body, contentType: mime ?? null };
};

/** Download the current public export for server-side processing. */
export const downloadLatestTravelWorkbook = async (): Promise<WorkbookDownloadResult> => {
  const initial = buildExportUrl(TRAVEL_SPREADSHEET_ID);
  const controller = new AbortController();
  const deadline = setTimeout(() => controller.abort(), DOWNLOAD_TIMEOUT_MS);

  try {
    const response = await fetchExport(initial, controller.signal);
    controller.signal.throwIfAborted();
    if (!(response instanceof Response)) return response;

    const validated = validateResponse(response, initial);
    if ('ok' in validated) {
      cancelResponse(response);
      return validated;
    }

    const bytes = await readResponseBody(validated.body);
    controller.signal.throwIfAborted();
    if (!Buffer.isBuffer(bytes)) return bytes;
    if (!bytes.length) return failure('WORKBOOK_SOURCE_EMPTY_FILE', response.status);
    if (!hasZipSignature(bytes)) return failure('WORKBOOK_SOURCE_INVALID_XLSX_SIGNATURE', response.status);

    return {
      ok: true,
      bytes,
      metadata: {
        source: 'google-sheets-public-export',
        spreadsheetId: TRAVEL_SPREADSHEET_ID,
        fetchedAt: new Date().toISOString(),
        contentType: validated.contentType,
        contentLength: bytes.length,
        etag: response.headers.get('etag'),
        lastModified: response.headers.get('last-modified'),
        sha256: createHash('sha256').update(bytes).digest('hex'),
      },
    };
  } catch {
    return failure(controller.signal.aborted ? 'WORKBOOK_SOURCE_TIMEOUT' : 'WORKBOOK_SOURCE_NETWORK_ERROR');
  } finally {
    clearTimeout(deadline);
  }
};
