// @vitest-environment node
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { type WorkBook, utils, write } from 'xlsx';
import { COVER_SHEET, DETAIL_SHEETS, EDITORIAL_SHEET, LOC_HEADERS, LOC_SHEET } from '../const';
import { buildTravelDataset } from '../workbook';

const fixture = readFileSync(new URL('./fixtures/Da_Nang_Tong_Hop_Dia_Diem_An_Choi_Du_Lich.xlsx', import.meta.url));
const detailName = DETAIL_SHEETS[0].name;
const row = [
  1,
  'Cầu Rồng',
  'Cầu',
  'Đà Nẵng',
  'Hải Châu / Sơn Trà',
  '4.6',
  ' Miễn phí ',
  'Cả ngày',
  'Ngắm cảnh',
  '  Giữ nguyên  ',
  'Mở Google Maps',
  'a | b | c | d',
];
const locRow = [1, 'Hải Châu', 'CẦU RỒNG', detailName, 'Cầu', 4.6, 'Miễn phí', 'Đà Nẵng', 'Đang hoạt động'];

const makeWorkbook = (details = [row], locations = [locRow]) => {
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, utils.aoa_to_sheet([['Cover summary: 440']]), COVER_SHEET);
  utils.book_append_sheet(
    workbook,
    utils.aoa_to_sheet([...Array.from({ length: 13 }, () => []), LOC_HEADERS, ...locations]),
    LOC_SHEET
  );
  utils.book_append_sheet(
    workbook,
    utils.aoa_to_sheet([[], ['  Nếu chỉ có 1 ngày  ', '  Giữ nguyên | nội dung  ']]),
    EDITORIAL_SHEET
  );
  for (const sheet of DETAIL_SHEETS) {
    utils.book_append_sheet(
      workbook,
      utils.aoa_to_sheet([[...sheet.headers], ...(sheet.name === detailName ? details : [])]),
      sheet.name
    );
  }
  return workbook;
};

const build = (workbook: WorkBook) =>
  buildTravelDataset(Buffer.from(write(workbook, { type: 'buffer', bookType: 'xlsx', compression: true })));

const countBy = <T>(items: T[], key: (item: T) => string) => {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(key(item), (counts.get(key(item)) ?? 0) + 1);
  return Object.fromEntries(counts);
};

describe('approved public workbook export', () => {
  it('matches the offline regression baseline using the actual XLSX cell model', () => {
    const result = buildTravelDataset(fixture);
    if (!result.ok) throw new Error(JSON.stringify(result.errors));
    const {
      dataset: { listings, areas, areaCounts, editorial },
      diagnostics,
    } = result;

    expect(fixture.byteLength).toBe(196057);
    expect(createHash('sha256').update(fixture).digest('hex')).toBe(
      '5a5c8fa88c67949f099f87fb20c73fbe4ed9962f53ab6ea146563330cef0453b'
    );
    expect(diagnostics).toMatchObject({
      worksheetCount: 14,
      hiddenWorksheets: 0,
      formulaCells: 0,
      locRows: 432,
      locKeys: 432,
      locMatches: 432,
      acceptedRows: 432,
    });
    expect(DETAIL_SHEETS.map(({ name }) => diagnostics.perSheet[name])).toEqual([
      57, 30, 57, 38, 57, 25, 32, 40, 51, 30, 15,
    ]);
    expect(diagnostics.worksheetCount - DETAIL_SHEETS.length).toBe(3);
    expect(listings).toHaveLength(432);
    expect(new Set(listings.map(({ id }) => id)).size).toBe(432);
    expect(countBy(listings, (item) => item.mainCategory)).toEqual({
      'sightseeing-nature': 102,
      'food-dining': 160,
      'cafe-checkin': 57,
      entertainment: 62,
      accommodation: 51,
    });
    expect(areaCounts).toEqual({
      'hai-chau': 154,
      'son-tra': 112,
      'ngu-hanh-son': 56,
      'near-da-nang': 37,
      'thanh-khe': 29,
      'hoa-vang': 26,
      'lien-chieu': 14,
      'cam-le': 4,
    });
    expect(countBy(listings, (item) => item.status)).toEqual({
      ACTIVE: 387,
      UNVERIFIED: 24,
      WARNING: 12,
      CLOSED_BANNED: 9,
    });
    expect(listings.filter(({ rating }) => rating !== null)).toHaveLength(395);
    expect(
      countBy(
        listings.filter(({ rating }) => rating === null),
        ({ ratingRaw }) => String(ratingRaw)
      )
    ).toEqual({ '—': 32, 'ĐÃ ĐÓNG': 3, CẤM: 2 });
    const withMaps = listings.filter(({ mapsUrl }) => mapsUrl !== null);
    expect(withMaps).toHaveLength(424);
    expect(withMaps.every(({ mapsUrl }) => mapsUrl !== null && new URL(mapsUrl).hostname === 'www.google.com')).toBe(
      true
    );
    expect(diagnostics.warnings.filter(({ code }) => code === 'MISSING_MAPS_LINK')).toHaveLength(8);
    expect(listings.every(({ visitProfile }) => visitProfile !== null)).toBe(true);
    const names = countBy(listings, ({ name }) => name.normalize('NFC').trim().replace(/\s+/g, ' ').toLowerCase());
    expect(Object.fromEntries(Object.entries(names).filter(([, count]) => count > 1))).toEqual({
      'tiên sa show': 2,
      'vinwonders nam hội an': 2,
      'cơm niêu nhà đỏ': 2,
      'phố đi bộ bạch đằng': 2,
      'queen palace karaoke': 2,
    });
    const namesByKey = new Map(listings.map(({ sourceKey, name }) => [sourceKey, name]));
    expect(
      diagnostics.information.map(({ sourceKey, sourceArea, areaName }) => [
        namesByKey.get(sourceKey),
        sourceArea,
        areaName,
      ])
    ).toEqual([
      ['Cầu Rồng', 'Hải Châu / Sơn Trà', 'Hải Châu'],
      ['Cầu Thuận Phước', 'Hải Châu / Sơn Trà', 'Hải Châu'],
      ['Cầu Trần Thị Lý', 'Hải Châu / Sơn Trà', 'Hải Châu'],
      ['Chèo SUP / Kayak sông Hàn - biển', 'Sơn Trà / Hải Châu', 'Sơn Trà'],
      ['Rạp phim CGV / Lotte Cinema', 'Sơn Trà / Hải Châu', 'Sơn Trà'],
    ]);
    expect(areas).toHaveLength(8);
    expect(areas.every(({ description }) => description !== null)).toBe(true);
    expect(Object.values(editorial).map((entries) => entries.length)).toEqual([5, 11, 3, 2]);
  });
});

describe('workbook failures', () => {
  it('rejects invalid bytes', () => {
    expect(buildTravelDataset(Buffer.from('not a workbook'))).toMatchObject({
      ok: false,
      errors: [{ code: 'INVALID_WORKBOOK' }],
    });
  });

  it('rejects oversized inputs before parsing', () => {
    expect(buildTravelDataset(Buffer.alloc(9 * 1024 * 1024))).toMatchObject({
      ok: false,
      errors: [{ code: 'WORKBOOK_LIMIT' }],
    });
  });

  it('rejects an archive whose directory declares excessive expansion', () => {
    const bytes = Buffer.from(fixture);
    // The approved fixture has no ZIP comment. Read its central directory offset.
    const centralDirectory = bytes.readUInt32LE(bytes.length - 22 + 16);
    bytes.writeUInt32LE(33 * 1024 * 1024, centralDirectory + 24);
    expect(buildTravelDataset(bytes)).toMatchObject({ ok: false, errors: [{ code: 'WORKBOOK_LIMIT' }] });
  });

  it('rejects an archive whose matching headers underreport the actual expansion', () => {
    const bytes = Buffer.from(fixture);
    const centralDirectory = bytes.readUInt32LE(bytes.length - 22 + 16);
    const localHeader = bytes.readUInt32LE(centralDirectory + 42);
    bytes.writeUInt32LE(1, centralDirectory + 24);
    bytes.writeUInt32LE(1, localHeader + 22);
    expect(buildTravelDataset(bytes)).toMatchObject({ ok: false, errors: [{ code: 'INVALID_WORKBOOK' }] });
  });

  it.each([detailName, LOC_SHEET])('rejects a missing %s sheet', (sheet) => {
    const workbook = makeWorkbook();
    workbook.SheetNames = workbook.SheetNames.filter((name) => name !== sheet);
    expect(build(workbook)).toMatchObject({ ok: false, errors: [{ code: 'MISSING_SHEET', sheet }] });
  });

  it.each([
    [detailName, 'B1'],
    [LOC_SHEET, 'C14'],
  ])('rejects a changed %s header', (sheet, address) => {
    const workbook = makeWorkbook();
    workbook.Sheets[sheet][address] = { t: 's', v: 'Unexpected header' };
    expect(build(workbook)).toMatchObject({ ok: false, errors: [{ code: 'INVALID_HEADER', sheet }] });
  });

  it('rejects duplicate detail and LOC keys after normalization', () => {
    expect(build(makeWorkbook([row, row]))).toMatchObject({
      ok: false,
      errors: [{ code: 'DUPLICATE_DETAIL_KEY', sheet: detailName }],
    });
    expect(build(makeWorkbook([row], [locRow, locRow]))).toMatchObject({
      ok: false,
      errors: [{ code: 'DUPLICATE_LOC_KEY', sheet: LOC_SHEET }],
    });
  });

  it('rejects a workbook with no named detail rows', () => {
    expect(build(makeWorkbook([[123, '   ']]))).toMatchObject({ ok: false, errors: [{ code: 'EMPTY_DATASET' }] });
  });
});

describe('row mapping', () => {
  it('accepts a non-blank numeric name and an HTTP Maps hyperlink', () => {
    const workbook = makeWorkbook([[1, 1900]]);
    utils.sheet_add_aoa(workbook.Sheets[detailName], [['Mở Google Maps']], { origin: 'K2' });
    const target = 'http://www.google.com/maps/search/?api=1&query=1900';
    workbook.Sheets[detailName].K2.l = { Target: target };
    const result = build(workbook);
    if (!result.ok) throw new Error(JSON.stringify(result.errors));
    expect(result.dataset.listings).toMatchObject([{ name: '1900', mapsUrl: target }]);
  });

  it('preserves raw text and editorial content while using LOC as canonical area', () => {
    const workbook = makeWorkbook([row, [2, '  '], [3, 'Khác']]);
    workbook.Sheets[detailName].K2.l = { Target: 'https://www.google.com/maps/search/?api=1&query=Cau+Rong' };
    utils.sheet_add_aoa(workbook.Sheets[LOC_SHEET], [['Hải Châu', 999, '  Mô tả  ']], { origin: 'A4' });
    const result = build(workbook);
    if (!result.ok) throw new Error(JSON.stringify(result.errors));
    expect(result.dataset.listings[0]).toMatchObject({
      sourceIndex: 1,
      name: 'Cầu Rồng',
      sourceArea: 'Hải Châu / Sơn Trà',
      areaId: 'hai-chau',
      areaName: 'Hải Châu',
      ratingRaw: '4.6',
      rating: 4.6,
      status: 'ACTIVE',
      priceText: ' Miễn phí ',
      notesText: '  Giữ nguyên  ',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Cau+Rong',
      visitProfileRaw: 'a | b | c | d',
    });
    expect(result.dataset.listings[1]).toMatchObject({
      name: 'Khác',
      areaId: 'unknown',
      status: 'UNKNOWN',
      mapsUrl: null,
    });
    expect(result.dataset.editorial.quickTripIdeas).toEqual([
      { title: '  Nếu chỉ có 1 ngày  ', content: '  Giữ nguyên | nội dung  ' },
    ]);
    expect(result.dataset.areas).toEqual([
      { areaName: 'Hải Châu', areaId: 'hai-chau', reportedCount: 999, description: '  Mô tả  ' },
    ]);
    expect(result.dataset.areaCounts).toEqual({ 'hai-chau': 1, unknown: 1 });
    expect(result.diagnostics).toMatchObject({ parsedRows: 3, acceptedRows: 2, skippedRows: 1, warningRecords: 1 });
    expect(result.diagnostics.warnings).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'MISSING_LOC' })])
    );
    expect(result.diagnostics.information).toHaveLength(1);
  });

  it('ignores cached formula results and Excel error codes in ratings', () => {
    const workbook = makeWorkbook([row, [2, 'Khác', 'Cầu', 'Đà Nẵng', 'Hải Châu', 0]]);
    workbook.Sheets[detailName].F2 = { t: 'n', v: 5, f: '2+3' };
    workbook.Sheets[detailName].F3 = { t: 'e', v: 0 };
    const result = build(workbook);
    if (!result.ok) throw new Error(JSON.stringify(result.errors));
    expect(result.diagnostics.formulaCells).toBe(1);
    expect(result.dataset.listings.map(({ rating, ratingRaw }) => [rating, ratingRaw])).toEqual([
      [null, null],
      [null, null],
    ]);
  });

  it('produces stable IDs across row moves and distinguishes same-name records in separate sheets', () => {
    const first = build(makeWorkbook());
    const workbook = makeWorkbook([
      [5, 'Khác'],
      [42, ...row.slice(1)],
    ]);
    const otherSheet = DETAIL_SHEETS[6];
    utils.sheet_add_aoa(workbook.Sheets[otherSheet.name], [row], { origin: 'A2' });
    const second = build(workbook);
    if (!first.ok || !second.ok) throw new Error('Expected both workbook builds to succeed');
    expect(second.dataset.listings[1].id).toBe(first.dataset.listings[0].id);
    expect(second.dataset.listings[2].id).not.toBe(first.dataset.listings[0].id);
    expect(second.dataset.listings[2].mainCategory).toBe(otherSheet.category);
  });

  it.each([
    'javascript:alert(1)',
    'not-a-url',
    'https://maps.google.com.example.org/',
    'https://www.google.com/url?q=bad',
  ])('warns on unsafe Maps target %s, unknown LOC values and malformed visit profile', (target) => {
    const workbook = makeWorkbook(
      [[...row.slice(0, 11), 'a | b | c']],
      [[...locRow.slice(0, 1), 'Khu lạ', ...locRow.slice(2, 8), 'Tình trạng lạ']]
    );
    workbook.Sheets[detailName].K2.l = { Target: target };
    const result = build(workbook);
    if (!result.ok) throw new Error(JSON.stringify(result.errors));
    expect(result.dataset.listings[0]).toMatchObject({
      areaId: 'unknown',
      areaName: 'Khu lạ',
      status: 'UNKNOWN',
      statusRaw: 'Tình trạng lạ',
      mapsUrl: null,
      visitProfile: null,
    });
    expect(result.diagnostics.warnings.map(({ code }) => code)).toEqual(
      expect.arrayContaining(['UNKNOWN_AREA', 'UNKNOWN_STATUS', 'INVALID_MAPS_LINK', 'INVALID_VISIT_PROFILE'])
    );
  });
});
