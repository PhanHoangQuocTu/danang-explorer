import { createHash } from 'node:crypto';
import {
  AREA_IDS,
  COVER_SHEET,
  DETAIL_SHEETS,
  EDITORIAL_RANGES,
  EDITORIAL_SHEET,
  LOC_HEADER_ROW,
  LOC_HEADERS,
  LOC_SHEET,
  STATUSES,
} from './const';
import { buildListingSourceKey, normalizeRating, parseVisitProfile } from './normalize';
import type {
  IAreaMetadata,
  IEditorialEntry,
  ITravelDataset,
  ITravelDiagnostics,
  ITravelError,
  ITravelListing,
  ITravelWarning,
  IWorkbookCell,
  IWorkbookInput,
  IWorkbookSheet,
  TravelWorkbookResult,
} from './type';

const REQUIRED_SHEETS = [COVER_SHEET, LOC_SHEET, EDITORIAL_SHEET, ...DETAIL_SHEETS.map(({ name }) => name)];
const MAP_SHORTLINK_HOSTS = new Set(['maps.app.goo.gl', 'goo.gl']);
const GOOGLE_MAPS_HOSTS = new Set(['www.google.com', 'google.com', 'maps.google.com']);
const areaIds = new Map(Object.entries(AREA_IDS));
const statuses = new Map(Object.entries(STATUSES));

const text = (cell: IWorkbookCell | undefined) => {
  const value = cell?.value;
  if (typeof value === 'string') return value.trim() ? value : null;
  return typeof value === 'number' ? String(value) : null;
};

const integer = (cell: IWorkbookCell | undefined): number | null => {
  const value = text(cell);
  if (value === null || !/^\d+$/.test(value.trim())) return null;
  const number = Number(value);
  return Number.isSafeInteger(number) ? number : null;
};

const rowCells = (sheet: IWorkbookSheet, row: number, width: number) =>
  Array.from({ length: width }, (_, index) => sheet.cell(row, index + 1));

const columnText = (sheet: IWorkbookSheet, row: number, column: number) => text(sheet.cell(row, column));

const getAreaId = (name: string | null) => areaIds.get(name ?? '') ?? 'unknown';

const getStatus = (status: string | null) => statuses.get(status ?? '') ?? 'UNKNOWN';

const validateMapsTarget = (target: string | undefined): string | null => {
  if (!target || target.includes('\\')) return null;
  for (const character of target) {
    const code = character.charCodeAt(0);
    if (code <= 32 || code === 127) return null;
  }
  try {
    const url = new URL(target);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.port) return null;
    const isMapsPath = url.pathname === '/maps' || url.pathname.startsWith('/maps/');
    const isGoogleMaps = GOOGLE_MAPS_HOSTS.has(url.hostname) && isMapsPath;
    const isShortLink =
      MAP_SHORTLINK_HOSTS.has(url.hostname) &&
      (url.hostname === 'goo.gl' ? url.pathname.startsWith('/maps/') : url.pathname.length > 1);
    return isGoogleMaps || isShortLink ? target : null;
  } catch {
    return null;
  }
};

export const createTravelDiagnostics = (): ITravelDiagnostics => ({
  worksheetCount: 0,
  hiddenWorksheets: 0,
  formulaCells: 0,
  locRows: 0,
  locKeys: 0,
  locMatches: 0,
  parsedRows: 0,
  acceptedRows: 0,
  skippedRows: 0,
  warningRecords: 0,
  perSheet: {},
  warnings: [],
  information: [],
});

interface ILocRecord {
  areaName: string | null;
  statusRaw: string | null;
}

const hasLocDataRows = (sheet: IWorkbookSheet) => {
  for (let row = LOC_HEADER_ROW + 1; row <= sheet.rowCount; row++) {
    if (rowCells(sheet, row, LOC_HEADERS.length).some((cell) => cell?.hyperlink || text(cell) !== null)) return true;
  }
  return false;
};

const readLocIndex = (sheet: IWorkbookSheet, diagnostics: ITravelDiagnostics, errors: ITravelError[]) => {
  const index = new Map<string, ILocRecord>();

  for (let row = LOC_HEADER_ROW + 1; row <= sheet.rowCount; row++) {
    const name = columnText(sheet, row, 3);
    const source = columnText(sheet, row, 4);
    if (name === null) continue;
    diagnostics.locRows++;
    if (source === null) {
      diagnostics.warnings.push({ code: 'INVALID_LOC_ROW', sheet: LOC_SHEET, row, field: 'sourceSheet' });
      continue;
    }
    const key = buildListingSourceKey(source, name);
    if (index.has(key)) {
      errors.push({
        code: 'DUPLICATE_LOC_KEY',
        message: 'Duplicate listing key in the LOC table.',
        sheet: LOC_SHEET,
        row,
      });
      continue;
    }
    index.set(key, { areaName: columnText(sheet, row, 2), statusRaw: columnText(sheet, row, 9) });
  }

  diagnostics.locKeys = index.size;
  return index;
};

const readAreaMetadata = (sheet: IWorkbookSheet): IAreaMetadata[] => {
  const areas: IAreaMetadata[] = [];
  for (let row = 4; row <= 11; row++) {
    const areaName = columnText(sheet, row, 1);
    if (areaName === null) continue;
    areas.push({
      areaId: getAreaId(areaName),
      areaName,
      description: columnText(sheet, row, 3),
      reportedCount: integer(sheet.cell(row, 2)),
    });
  }
  return areas;
};

const readEditorialEntries = (
  sheet: IWorkbookSheet,
  [first, last]: readonly [number, number],
  diagnostics: ITravelDiagnostics
): IEditorialEntry[] => {
  const entries: IEditorialEntry[] = [];
  for (let row = first; row <= last; row++) {
    const title = columnText(sheet, row, 1);
    const content = columnText(sheet, row, 2);
    if (title !== null && content !== null) entries.push({ title, content });
    else diagnostics.warnings.push({ code: 'INCOMPLETE_EDITORIAL', sheet: EDITORIAL_SHEET, row });
  }
  return entries;
};

const readEditorial = (sheet: IWorkbookSheet, diagnostics: ITravelDiagnostics): ITravelDataset['editorial'] => ({
  quickTripIdeas: readEditorialEntries(sheet, EDITORIAL_RANGES.quickTripIdeas, diagnostics),
  topPicks: readEditorialEntries(sheet, EDITORIAL_RANGES.topPicks, diagnostics),
  itinerary: readEditorialEntries(sheet, EDITORIAL_RANGES.itinerary, diagnostics),
  travelTips: readEditorialEntries(sheet, EDITORIAL_RANGES.travelTips, diagnostics),
});

type DetailConfig = (typeof DETAIL_SHEETS)[number];

const mapListing = (
  config: DetailConfig,
  cells: (IWorkbookCell | undefined)[],
  name: string,
  sourceKey: string,
  row: number,
  loc: ILocRecord | undefined,
  diagnostics: ITravelDiagnostics
): ITravelListing => {
  const warn = (code: ITravelWarning['code'], field?: string) =>
    diagnostics.warnings.push({ code, sheet: config.name, row, field });
  const warningCount = diagnostics.warnings.length;

  const [index, , category, address, area, rating, price, hours, highlights, notes, maps, visit] = cells;
  const sourceArea = text(area);
  const areaName = loc?.areaName ?? null;
  const areaId = getAreaId(areaName);
  const statusRaw = loc?.statusRaw ?? null;
  const status = getStatus(statusRaw);

  if (loc === undefined) warn('MISSING_LOC');
  else {
    diagnostics.locMatches++;
    if (areaId === 'unknown') warn('UNKNOWN_AREA', 'areaName');
    if (status === 'UNKNOWN') warn('UNKNOWN_STATUS', 'statusRaw');
  }
  if (areaName !== null && sourceArea !== areaName) {
    diagnostics.information.push({ code: 'AREA_DIFFERENCE', sheet: config.name, row, sourceKey, sourceArea, areaName });
  }

  const ratingRaw = typeof rating?.value === 'string' || typeof rating?.value === 'number' ? rating.value : null;
  const mapsUrl = validateMapsTarget(maps?.hyperlink);
  const visitProfileRaw = text(visit);
  const visitProfile = parseVisitProfile(visitProfileRaw);

  if (mapsUrl === null) warn(maps?.hyperlink ? 'INVALID_MAPS_LINK' : 'MISSING_MAPS_LINK', 'mapsUrl');
  if (visitProfile === null) warn('INVALID_VISIT_PROFILE', 'visitProfileRaw');
  const sourceCategory = text(category);
  const addressText = text(address);
  if (sourceCategory === null) warn('MISSING_OPTIONAL_FIELD', 'sourceCategory');
  if (addressText === null) warn('MISSING_OPTIONAL_FIELD', 'address');
  if (diagnostics.warnings.length > warningCount) diagnostics.warningRecords++;

  return {
    id: createHash('sha256').update(sourceKey, 'utf8').digest('hex'),
    sourceKey,
    sourceSheet: config.name,
    sourceIndex: integer(index),
    name,
    mainCategory: config.category,
    sourceCategory,
    address: addressText,
    sourceArea,
    areaId,
    areaName,
    status,
    statusRaw,
    ratingRaw,
    rating: normalizeRating(ratingRaw),
    priceText: text(price),
    openingHoursText: text(hours),
    highlightsText: text(highlights),
    notesText: text(notes),
    mapsUrl,
    visitProfileRaw,
    visitProfile,
  };
};

const validateHeaders = (sheet: IWorkbookSheet | undefined, row: number, headers: readonly string[]) =>
  sheet !== undefined && headers.every((label, index) => sheet.cell(row, index + 1)?.value === label);

export const mapTravelWorkbook = (input: IWorkbookInput): TravelWorkbookResult => {
  const diagnostics = createTravelDiagnostics();
  diagnostics.worksheetCount = input.sheets.size;
  diagnostics.hiddenWorksheets = input.hiddenWorksheets;
  diagnostics.formulaCells = input.formulaCells;

  const errors: ITravelError[] = [];
  for (const name of REQUIRED_SHEETS) {
    if (!input.sheets.has(name))
      errors.push({ code: 'MISSING_SHEET', message: 'Required worksheet is missing.', sheet: name });
  }
  const loc = input.sheets.get(LOC_SHEET);
  const editorial = input.sheets.get(EDITORIAL_SHEET);
  if (errors.length || !loc || !editorial) return { ok: false, errors, diagnostics };

  if (!validateHeaders(loc, LOC_HEADER_ROW, LOC_HEADERS)) {
    errors.push({
      code: 'INVALID_HEADER',
      message: 'LOC table headers must match the expected columns.',
      sheet: LOC_SHEET,
      row: LOC_HEADER_ROW,
    });
  }
  for (const config of DETAIL_SHEETS) {
    if (!validateHeaders(input.sheets.get(config.name), 1, config.headers)) {
      errors.push({
        code: 'INVALID_HEADER',
        message: 'Detail headers must match the expected columns.',
        sheet: config.name,
        row: 1,
      });
    }
  }
  if (errors.length) return { ok: false, errors, diagnostics };

  const locIndex = readLocIndex(loc, diagnostics, errors);
  if (errors.length) return { ok: false, errors, diagnostics };

  const listings: ITravelListing[] = [];
  const sourceKeys = new Set<string>();
  const areaCounts: ITravelDataset['areaCounts'] = {};

  for (const config of DETAIL_SHEETS) {
    const sheet = input.sheets.get(config.name);
    if (!sheet) continue;
    let count = 0;
    for (let row = 2; row <= sheet.rowCount; row++) {
      const cells = rowCells(sheet, row, config.headers.length);
      if (!cells.some((cell) => cell?.hyperlink || text(cell) !== null)) continue;
      diagnostics.parsedRows++;
      const name = text(cells[1]);
      if (name === null) {
        diagnostics.skippedRows++;
        continue;
      }

      const sourceKey = buildListingSourceKey(config.name, name);
      if (sourceKeys.has(sourceKey)) {
        errors.push({
          code: 'DUPLICATE_DETAIL_KEY',
          message: 'Duplicate listing key within the detail worksheet.',
          sheet: config.name,
          row,
        });
        continue;
      }
      sourceKeys.add(sourceKey);
      const listing = mapListing(config, cells, name, sourceKey, row, locIndex.get(sourceKey), diagnostics);
      listings.push(listing);
      areaCounts[listing.areaId] = (areaCounts[listing.areaId] ?? 0) + 1;
      count++;
    }
    diagnostics.perSheet[config.name] = count;
  }

  diagnostics.acceptedRows = listings.length;
  if (listings.length === 0 && (diagnostics.parsedRows > 0 || hasLocDataRows(loc))) {
    errors.push({ code: 'EMPTY_DATASET', message: 'Workbook has data rows but no valid named listings.' });
  }
  if (errors.length) return { ok: false, errors, diagnostics };

  return {
    ok: true,
    dataset: { listings, areas: readAreaMetadata(loc), areaCounts, editorial: readEditorial(editorial, diagnostics) },
    diagnostics,
  };
};
