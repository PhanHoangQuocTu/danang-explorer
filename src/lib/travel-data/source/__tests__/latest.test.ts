// @vitest-environment node
import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildTravelDataset } from '../../workbook';
import { fetchLatestTravelDataset } from '../latest';

vi.mock('../../workbook', { spy: true });

const parser = vi.mocked(buildTravelDataset);
const fixture = readFileSync(
  new URL('../../__tests__/fixtures/Da_Nang_Tong_Hop_Dia_Diem_An_Choi_Du_Lich.xlsx', import.meta.url)
);
const exportUrl = 'https://docs.google.com/spreadsheets/d/1b5ozJ_3cu1cp9JUNdX7fTggV2EQGI4Th/export?format=xlsx';

const mockExport = (body: Uint8Array<ArrayBuffer>, status = 200) => {
  const response = new Response(body, { status });
  Object.defineProperty(response, 'url', { value: exportUrl });
  const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(response);
  vi.stubGlobal('fetch', fetch);
  return fetch;
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('fetchLatestTravelDataset', () => {
  it('downloads and parses once, preserving the actual Phase 02 result and diagnostics', async () => {
    const fetch = mockExport(Uint8Array.from(fixture));

    const result = await fetchLatestTravelDataset();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(parser).toHaveBeenCalledExactlyOnceWith(fixture);
    expect(result).toMatchObject({
      ok: true,
      diagnostics: {
        acceptedRows: 432,
        information: expect.arrayContaining([expect.objectContaining({ code: 'AREA_DIFFERENCE' })]),
      },
      source: { contentLength: 196057, sha256: '5a5c8fa88c67949f099f87fb20c73fbe4ed9962f53ab6ea146563330cef0453b' },
    });
    const built = parser.mock.results[0].value;
    if (!result.ok || !built.ok) throw new Error('Expected successful data build');
    expect(result.dataset).toBe(built.dataset);
    expect(result.diagnostics).toBe(built.diagnostics);
    expect(result.diagnostics.warnings.length).toBeGreaterThan(0);
    expect(result).not.toHaveProperty('bytes');
  });

  it('preserves structural errors and diagnostics after a valid ZIP signature', async () => {
    mockExport(Uint8Array.of(0x50, 0x4b, 0x03, 0x04, 0));
    const result = await fetchLatestTravelDataset();
    expect(parser).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      ok: false,
      error: { code: 'WORKBOOK_DATA_BUILD_FAILED' },
      errors: [{ code: 'INVALID_WORKBOOK' }],
      diagnostics: { acceptedRows: 0 },
      source: { contentLength: 5 },
    });
    expect(result).not.toHaveProperty('dataset');
    expect(result).not.toHaveProperty('bytes');
  });

  it('returns a download failure without invoking the parser', async () => {
    mockExport(new Uint8Array(), 403);
    await expect(fetchLatestTravelDataset()).resolves.toMatchObject({
      ok: false,
      error: { code: 'WORKBOOK_SOURCE_ACCESS_DENIED', status: 403 },
    });
    expect(parser).not.toHaveBeenCalled();
  });
});
