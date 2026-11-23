// @vitest-environment node
import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { downloadLatestTravelWorkbook } from '../google-sheets';

const exportUrl = 'https://docs.google.com/spreadsheets/d/1b5ozJ_3cu1cp9JUNdX7fTggV2EQGI4Th/export?format=xlsx';
const downloadUrl = 'https://doc-10-a4-sheets.googleusercontent.com/export/token?signature=private';
const xlsxMime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const zip = Uint8Array.of(0x50, 0x4b, 0x03, 0x04, 1);
const limit = 8 * 1024 * 1024;

const response = (body: BodyInit | null, init: ResponseInit = {}, url = exportUrl): Response => {
  const result = new Response(body, init);
  Object.defineProperty(result, 'url', { value: url });
  return result;
};

const mockFetch = () => {
  const fetch = vi.fn<typeof globalThis.fetch>();
  vi.stubGlobal('fetch', fetch);
  return fetch;
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('public export download', () => {
  it('builds the fixed URL and returns actual bytes and metadata', async () => {
    const fetch = mockFetch().mockResolvedValue(
      response(zip, {
        headers: {
          'Content-Type': xlsxMime,
          'Content-Length': '4',
          ETag: '"opaque"',
          'Last-Modified': 'Mon, 23 Nov 2026 01:00:00 GMT',
        },
      })
    );
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-23T10:00:00.000Z'));
    await expect(downloadLatestTravelWorkbook()).resolves.toEqual({
      ok: true,
      bytes: Buffer.from(zip),
      metadata: {
        source: 'google-sheets-public-export',
        spreadsheetId: '1b5ozJ_3cu1cp9JUNdX7fTggV2EQGI4Th',
        fetchedAt: '2026-11-23T10:00:00.000Z',
        contentType: xlsxMime,
        contentLength: 5,
        etag: '"opaque"',
        lastModified: 'Mon, 23 Nov 2026 01:00:00 GMT',
        sha256: createHash('sha256').update(zip).digest('hex'),
      },
    });
    expect(fetch).toHaveBeenCalledExactlyOnceWith(
      new URL(exportUrl),
      expect.objectContaining({
        cache: 'no-store',
        credentials: 'omit',
        redirect: 'manual',
        signal: expect.any(AbortSignal),
      })
    );
    expect(vi.getTimerCount()).toBe(0);
  });

  it('follows the observed export host with the same deadline and accepts generic binary ZIP', async () => {
    const fetch = mockFetch()
      .mockResolvedValueOnce(response(null, { status: 307, headers: { Location: downloadUrl } }))
      .mockResolvedValueOnce(
        response(zip, { headers: { 'Content-Type': 'application/octet-stream; x=1' } }, downloadUrl)
      );
    await expect(downloadLatestTravelWorkbook()).resolves.toMatchObject({
      ok: true,
      bytes: Buffer.from(zip),
      metadata: { contentLength: 5, contentType: 'application/octet-stream', etag: null, lastModified: null },
    });
    expect(fetch.mock.calls.map(([url]) => String(url))).toEqual([exportUrl, downloadUrl]);
    expect(fetch.mock.calls[0][1]?.signal).toBe(fetch.mock.calls[1][1]?.signal);
  });

  it('accepts a ZIP stream with no content type or size header', async () => {
    mockFetch().mockResolvedValue(response(zip));
    await expect(downloadLatestTravelWorkbook()).resolves.toMatchObject({
      ok: true,
      metadata: { contentType: null, contentLength: 5 },
    });
  });
});

describe('invalid exports', () => {
  it.each([
    [401, 'ACCESS_DENIED'],
    [403, 'ACCESS_DENIED'],
    [404, 'NOT_FOUND'],
    [429, 'RATE_LIMITED'],
    [500, 'UPSTREAM_ERROR'],
    [206, 'UPSTREAM_ERROR'],
  ])('classifies status %i without returning upstream content', async (status, code) => {
    mockFetch().mockResolvedValue(response('private error page', { status }));
    const result = await downloadLatestTravelWorkbook();
    expect(result).toMatchObject({ ok: false, error: { code: `WORKBOOK_SOURCE_${code}`, status } });
    expect(JSON.stringify(result)).not.toContain('private error page');
  });

  it.each(['text/html; charset=utf-8', 'text/plain', 'application/json', 'application/pdf'])(
    'rejects %s even when status is 200',
    async (contentType) => {
      mockFetch().mockResolvedValue(response('<html>Sign in</html>', { headers: { 'Content-Type': contentType } }));
      await expect(downloadLatestTravelWorkbook()).resolves.toMatchObject({
        ok: false,
        error: { code: 'WORKBOOK_SOURCE_INVALID_CONTENT_TYPE' },
      });
    }
  );

  it('rejects mislabeled HTML and empty responses', async () => {
    mockFetch()
      .mockResolvedValueOnce(
        response('<html>Sign in</html>', { headers: { 'Content-Type': 'application/octet-stream' } })
      )
      .mockResolvedValueOnce(response(new Uint8Array()));
    await expect(downloadLatestTravelWorkbook()).resolves.toMatchObject({
      ok: false,
      error: { code: 'WORKBOOK_SOURCE_INVALID_XLSX_SIGNATURE' },
    });
    await expect(downloadLatestTravelWorkbook()).resolves.toMatchObject({
      ok: false,
      error: { code: 'WORKBOOK_SOURCE_EMPTY_FILE' },
    });
  });

  it.each([
    'https://evil.example/export/x',
    'https://doc-10-a4-sheets.googleusercontent.com.evil.example/export/x',
    'http://doc-10-a4-sheets.googleusercontent.com/export/x',
    'https://user@doc-10-a4-sheets.googleusercontent.com/export/x',
    'https://doc-10-a4-sheets.googleusercontent.com:8443/export/x',
    'https://doc-10-a4-sheets.googleusercontent.com/unrelated',
    'https://docs.google.com/spreadsheets/d/other/export?format=xlsx',
  ])('rejects unapproved redirect %s before issuing a request', async (location) => {
    const fetch = mockFetch().mockResolvedValue(response(null, { status: 307, headers: { Location: location } }));
    await expect(downloadLatestTravelWorkbook()).resolves.toMatchObject({
      ok: false,
      error: { code: 'WORKBOOK_SOURCE_REDIRECT_NOT_ALLOWED' },
    });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('rejects a response reporting an unexpected final URL', async () => {
    mockFetch().mockResolvedValue(response(zip, {}, 'https://evil.example/export/x'));
    await expect(downloadLatestTravelWorkbook()).resolves.toMatchObject({
      ok: false,
      error: { code: 'WORKBOOK_SOURCE_REDIRECT_NOT_ALLOWED' },
    });
  });

  it('bounds allowed redirect loops', async () => {
    const fetch = mockFetch().mockImplementation(async (url) =>
      response(null, { status: 307, headers: { Location: downloadUrl } }, String(url))
    );
    await expect(downloadLatestTravelWorkbook()).resolves.toMatchObject({
      ok: false,
      error: { code: 'WORKBOOK_SOURCE_REDIRECT_NOT_ALLOWED' },
    });
    expect(fetch).toHaveBeenCalledTimes(4);
  });

  it('cancels an oversized declared body without consuming it', async () => {
    const cancel = vi.fn();
    mockFetch().mockResolvedValue(
      response(new ReadableStream({ cancel }), { headers: { 'Content-Length': String(limit + 1) } })
    );
    await expect(downloadLatestTravelWorkbook()).resolves.toMatchObject({
      ok: false,
      error: { code: 'WORKBOOK_SOURCE_FILE_TOO_LARGE' },
    });
    expect(cancel).toHaveBeenCalledTimes(1);
  });

  it.each([undefined, '1'])('cancels stream at the byte limit with Content-Length %s', async (length) => {
    const cancel = vi.fn();
    const body = new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array(limit));
        controller.enqueue(Uint8Array.of(1));
      },
      cancel,
    });
    mockFetch().mockResolvedValue(response(body, { headers: length ? { 'Content-Length': length } : {} }));
    await expect(downloadLatestTravelWorkbook()).resolves.toMatchObject({
      ok: false,
      error: { code: 'WORKBOOK_SOURCE_FILE_TOO_LARGE' },
    });
    expect(cancel).toHaveBeenCalledTimes(1);
  });

  it('maps request and stream failures to a safe error', async () => {
    mockFetch()
      .mockRejectedValueOnce(new Error('secret signed URL'))
      .mockResolvedValueOnce(
        response(
          new ReadableStream({
            start(controller) {
              controller.error(new Error('private stream error'));
            },
          })
        )
      );
    for (let attempt = 0; attempt < 2; attempt++) {
      const result = await downloadLatestTravelWorkbook();
      expect(result).toMatchObject({ ok: false, error: { code: 'WORKBOOK_SOURCE_NETWORK_ERROR' } });
      expect(JSON.stringify(result)).not.toMatch(/secret|private/);
    }
  });

  it.each(['headers', 'stream'])('times out while waiting for %s', async (stage) => {
    vi.useFakeTimers();
    mockFetch().mockImplementation((_url, options) => {
      const signal = options?.signal;
      if (stage === 'headers') {
        return new Promise((_resolve, reject) => signal?.addEventListener('abort', () => reject(signal.reason)));
      }
      const body = new ReadableStream({
        start(controller) {
          signal?.addEventListener('abort', () => controller.error(signal.reason));
        },
      });
      return Promise.resolve(response(body));
    });
    const pending = downloadLatestTravelWorkbook();
    await vi.advanceTimersByTimeAsync(30_000);
    await expect(pending).resolves.toMatchObject({ ok: false, error: { code: 'WORKBOOK_SOURCE_TIMEOUT' } });
    expect(vi.getTimerCount()).toBe(0);
  });
});
