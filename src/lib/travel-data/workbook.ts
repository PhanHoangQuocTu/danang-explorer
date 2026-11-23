import { type CellObject, read, utils, type WorkSheet } from 'xlsx';
import { inspectWorkbookArchive, WorkbookLimitError } from './archive';
import { createTravelDiagnostics, mapTravelWorkbook } from './map';
import type { IWorkbookCell, IWorkbookInput, IWorkbookSheet, TravelWorkbookResult } from './type';

if (typeof window !== 'undefined') throw new Error('Travel workbooks must be processed on the server.');

const MAX_WORKSHEETS = 32;
const MAX_ROWS_PER_SHEET = 10_000;
const MAX_COLUMNS_PER_SHEET = 64;

const adaptCell = (cell: CellObject | undefined): IWorkbookCell | undefined => {
  if (!cell || cell.t === 'e' || cell.f !== undefined || cell.F !== undefined) return undefined;
  const value: unknown = cell.v;
  const hyperlink = cell.l?.Target;
  const isNumber = typeof value === 'number' && Number.isFinite(value);
  return {
    value: typeof value === 'string' || isNumber || typeof value === 'boolean' ? value : null,
    hyperlink: typeof hyperlink === 'string' ? hyperlink : undefined,
  };
};

const adaptSheet = (sheet: WorkSheet): IWorkbookSheet => {
  const range = sheet['!ref'] ? utils.decode_range(sheet['!ref']) : null;
  if (range && (range.e.r >= MAX_ROWS_PER_SHEET || range.e.c >= MAX_COLUMNS_PER_SHEET)) {
    throw new WorkbookLimitError();
  }
  return {
    rowCount: range ? range.e.r + 1 : 0,
    cell: (row, column) => adaptCell(sheet[utils.encode_cell({ r: row - 1, c: column - 1 })]),
  };
};

const parseWorkbook = (bytes: Uint8Array): IWorkbookInput => {
  const data = inspectWorkbookArchive(bytes);
  const workbook = read(data, { type: 'buffer', cellFormula: true, cellHTML: false, cellText: false });
  if (workbook.SheetNames.length > MAX_WORKSHEETS) throw new WorkbookLimitError();

  const sheets = new Map<string, IWorkbookSheet>();
  let formulaCells = 0;
  for (const name of workbook.SheetNames) {
    const sheet = workbook.Sheets[name];
    if (!sheet || sheets.has(name)) throw new Error('Invalid worksheet index.');
    sheets.set(name, adaptSheet(sheet));
    for (const address of Object.keys(sheet)) {
      if (!address.startsWith('!') && sheet[address].f !== undefined) formulaCells++;
    }
  }

  return {
    sheets,
    hiddenWorksheets: workbook.Workbook?.Sheets?.filter(({ Hidden }) => Boolean(Hidden)).length ?? 0,
    formulaCells,
  };
};

/** Build the Phase 02 dataset from caller-provided XLSX bytes. No fetching or persistent state. */
export const buildTravelDataset = (bytes: Uint8Array): TravelWorkbookResult => {
  let input: IWorkbookInput;
  try {
    input = parseWorkbook(bytes);
  } catch (error) {
    const limit = error instanceof WorkbookLimitError;
    return {
      ok: false,
      errors: [
        limit
          ? { code: 'WORKBOOK_LIMIT', message: 'Workbook exceeds supported file, archive or worksheet limits.' }
          : { code: 'INVALID_WORKBOOK', message: 'Workbook could not be opened as a valid XLSX file.' },
      ],
      diagnostics: createTravelDiagnostics(),
    };
  }

  return mapTravelWorkbook(input);
};
