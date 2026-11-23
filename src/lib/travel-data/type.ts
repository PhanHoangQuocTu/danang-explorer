import type { AREA_IDS, DETAIL_SHEETS, EDITORIAL_RANGES, STATUSES } from './const';

export type DetailSheet = (typeof DETAIL_SHEETS)[number]['name'];
export type MainCategory = (typeof DETAIL_SHEETS)[number]['category'];
export type AreaId = (typeof AREA_IDS)[keyof typeof AREA_IDS] | 'unknown';
export type ListingStatus = (typeof STATUSES)[keyof typeof STATUSES] | 'UNKNOWN';

export interface IVisitProfile {
  suitableFor: string;
  recommendedTime: string;
  suggestedDuration: string;
  distanceFromCenterText: string;
}

export interface ITravelListing {
  id: string;
  sourceKey: string;
  sourceSheet: DetailSheet;
  sourceIndex: number | null;
  name: string;
  mainCategory: MainCategory;
  sourceCategory: string | null;
  address: string | null;
  sourceArea: string | null;
  areaId: AreaId;
  areaName: string | null;
  status: ListingStatus;
  statusRaw: string | null;
  ratingRaw: string | number | null;
  rating: number | null;
  priceText: string | null;
  openingHoursText: string | null;
  highlightsText: string | null;
  notesText: string | null;
  mapsUrl: string | null;
  visitProfileRaw: string | null;
  visitProfile: IVisitProfile | null;
}

export interface IAreaMetadata {
  areaId: AreaId;
  areaName: string;
  description: string | null;
  reportedCount: number | null;
}

export interface IEditorialEntry {
  title: string;
  content: string;
}

export interface ITravelDataset {
  listings: ITravelListing[];
  areas: IAreaMetadata[];
  areaCounts: Partial<Record<AreaId, number>>;
  editorial: Record<keyof typeof EDITORIAL_RANGES, IEditorialEntry[]>;
}

export type TravelErrorCode =
  | 'INVALID_WORKBOOK'
  | 'WORKBOOK_LIMIT'
  | 'MISSING_SHEET'
  | 'INVALID_HEADER'
  | 'DUPLICATE_LOC_KEY'
  | 'DUPLICATE_DETAIL_KEY'
  | 'EMPTY_DATASET';

export interface ITravelError {
  code: TravelErrorCode;
  message: string;
  sheet?: string;
  row?: number;
}

export type TravelWarningCode =
  | 'MISSING_OPTIONAL_FIELD'
  | 'INVALID_LOC_ROW'
  | 'MISSING_LOC'
  | 'UNKNOWN_AREA'
  | 'UNKNOWN_STATUS'
  | 'MISSING_MAPS_LINK'
  | 'INVALID_MAPS_LINK'
  | 'INVALID_VISIT_PROFILE'
  | 'INCOMPLETE_EDITORIAL';

export interface ITravelWarning {
  code: TravelWarningCode;
  sheet: string;
  row: number;
  field?: string;
}

export interface IAreaDifference {
  code: 'AREA_DIFFERENCE';
  sheet: DetailSheet;
  row: number;
  sourceKey: string;
  sourceArea: string | null;
  areaName: string;
}

export interface ITravelDiagnostics {
  worksheetCount: number;
  hiddenWorksheets: number;
  formulaCells: number;
  locRows: number;
  locKeys: number;
  locMatches: number;
  parsedRows: number;
  acceptedRows: number;
  skippedRows: number;
  warningRecords: number;
  perSheet: Partial<Record<DetailSheet, number>>;
  warnings: ITravelWarning[];
  information: IAreaDifference[];
}

export type TravelWorkbookResult =
  | { ok: true; dataset: ITravelDataset; diagnostics: ITravelDiagnostics }
  | { ok: false; errors: ITravelError[]; diagnostics: ITravelDiagnostics };

export interface IWorkbookCell {
  value: string | number | boolean | null;
  hyperlink?: string;
}

export interface IWorkbookSheet {
  rowCount: number;
  cell: (row: number, column: number) => IWorkbookCell | undefined;
}

export interface IWorkbookInput {
  sheets: ReadonlyMap<string, IWorkbookSheet>;
  hiddenWorksheets: number;
  formulaCells: number;
}
