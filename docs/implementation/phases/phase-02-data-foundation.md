# Phase 02 — Data Foundation & Workbook Mapping
## Codex Detailed Implementation Specification

**Project:** Da Nang Travel Discovery  
**Repository:** https://github.com/PhanHoangQuocTu/nextjs-frontend-boilerplate  
**Target phase:** Phase 02 of 08  
**Document type:** Authoritative implementation specification  
**Status:** Business rules confirmed; dependency approval is a mandatory gate  
**Scope:** Workbook parsing, mapping, normalization, validation, and regression tests only

---

# 0. Instructions for Codex

Treat this document as the authoritative scope for Phase 02. Implement only what is explicitly included here. Do not expand into Google Drive synchronization, API endpoints, UI pages, dashboards, Explore, Place Detail, or deployment work.

Before changing any file:

1. Inspect the current repository, active branch, working tree, and uncommitted changes.
2. Read the complete root `AGENTS.md` and `CLAUDE.md`, then inspect any nested instruction files that apply to the directories you will touch.
3. Inspect `package.json`, the package manager lockfile, TypeScript configuration, Biome configuration, Vitest configuration, and the current source/test structure.
4. Read the existing examples that are relevant to the task. In particular, follow the repository's naming, import, type, testing, and module conventions rather than inventing a parallel architecture.
5. Produce a concise repository-aware implementation plan with task dependencies before editing.
6. Identify all dependencies needed for XLSX parsing. The current repository audit found no `xlsx` or `exceljs` entry in `package.json`; verify this against the current working tree and lockfile.
7. **Do not install, add, upgrade, remove, or change any dependency or lockfile without explicit user approval.** If a new XLSX parser is required, prepare a dependency proposal and stop at the approval gate described in Section 5. You may proceed with independent, dependency-free design or mapping work only if it does not require pretending that XLSX parsing is implemented.
8. Do not commit, push, amend, rebase, or rewrite Git history. Do not discard user changes.
9. Do not claim that a test, build, browser check, or verification passed unless you actually ran it and inspected its output.
10. If source data, repository state, or a requirement is unavailable or ambiguous, report the gap. Do not silently guess.

The implementation must remain compatible with the repository's current stack and its `AGENTS.md` rules.

---

# 1. Roles and Quality Bar

Work as a coordinated senior engineering team:

- **Senior Next.js Engineer:** preserve the existing App Router architecture and server/client boundaries.
- **Senior TypeScript Engineer:** produce strict, explicit types and avoid unsafe casts.
- **Senior Data Engineer:** design deterministic parsing, mapping, normalization, and validation for the workbook.
- **Senior QA Engineer:** create meaningful unit, integration, negative, and regression tests.
- **Senior Security Reviewer:** keep workbook parsing server-only, validate external links and avoid exposing unnecessary raw workbook content.
- **Technical Lead:** keep scope small, avoid unnecessary abstractions, and report decisions and trade-offs.

The result must be maintainable and proportionate to a single public XLSX source. Do not introduce databases, queues, workers, microservices, repository-pattern layers, dependency-injection containers, event buses, or generic data-provider frameworks.

---

# 2. Product and Architecture Context

The product is **Da Nang Travel Discovery**, a public travel discovery website for tourism, sightseeing, food, cafes, entertainment, and accommodation in Da Nang and nearby destinations.

The product reads one public Excel workbook hosted on Google Drive. The workbook is overwritten by an external tracking process approximately once per day. Later phases will implement initial data loading and manual synchronization. This phase does not implement that synchronization.

Architecture decisions already made:

- Next.js Server + Client architecture.
- No separate backend service.
- No database.
- Deployment target: Vercel.
- Workbook is public (`Anyone` sharing).
- Workbook parsing and normalization must happen on the server.
- Client-facing features will later receive normalized JSON, not XLSX binary.
- The website supports Vietnamese and English UI.
- Default locale is Vietnamese (`vi`); English is the alternative locale.
- Workbook data itself is not translated. UI-only localization is required.
- Source notes and tips are displayed as raw workbook content; do not rewrite or translate them.
- Existing boilerplate patterns and `AGENTS.md` are authoritative.

The current repository is a Next.js 16 App Router boilerplate using React 19, TypeScript 7 strict mode, Tailwind CSS v4, next-intl, TanStack Query, Axios, Zustand, Zod, Recharts, Vitest, Testing Library, Storybook, and Biome. Verify current package versions from the checked-out repository rather than relying on this summary.

Relevant repository rules confirmed in `AGENTS.md` include:

- Package manager: pnpm 12; Node.js 22.
- App Router pages stay thin; page-level UI belongs in `src/modules`.
- `src/api` follows the existing domain pattern: `keys.ts`, `requests.ts`, `queries.ts`, `mutations.ts`, `type.ts`, `index.ts`.
- Shared types, enums, and constants follow `type.ts`, `enum.ts`, and `const.ts` conventions.
- Prefer Server Components; add `'use client'` only when required.
- Use Biome, not ESLint or Prettier.
- Tests belong in `__tests__/` next to the code.
- Use existing Zod and other installed dependencies where appropriate.
- Do not add dependencies without checking for an equivalent and obtaining approval.
- Do not add user-visible UI strings in this phase; no translation namespace should be required.
- Do not modify the example Health or Posts feature to host Travel business logic.

For this phase, build a focused, server-side Travel Data Foundation that can later be called by Phase 03's Drive connector. Do not implement Phase 03.

---

# 3. Source Workbook — Authoritative Input

## 3.1 Workbook identity

The user-provided public Google Sheets workbook:

https://docs.google.com/spreadsheets/d/1b5ozJ_3cu1cp9JUNdX7fTggV2EQGI4Th/edit?usp=sharing&ouid=107497916965545826710&rtpof=true&sd=true

The uploaded XLSX snapshot inspected for this specification is:

`Da_Nang_Tong_Hop_Dia_Diem_An_Choi_Du_Lich.xlsx`

Snapshot size: **196,057 bytes**.

If the workbook is needed in the Codex workspace:

1. First search the repository and current workspace for an existing copy.
2. If no copy exists, try to retrieve the public workbook read-only from the user-provided URL, if network access is available and permitted.
3. If it cannot be retrieved, stop and ask the user to place the XLSX in the agreed test-fixture location. Do not substitute a different workbook or invent test data.
4. Do not build a Google Drive connector in this phase.

Recommended regression fixture location, subject to existing repository conventions:

`src/lib/travel-data/__tests__/fixtures/Da_Nang_Tong_Hop_Dia_Diem_An_Choi_Du_Lich.xlsx`

The fixture is test-only. It must not be placed under `public/`, imported into client code, or included in the production client bundle.

## 3.2 Workbook structure

The inspected workbook contains **14 visible worksheets**, no hidden worksheets, and no formula cells.

### Three supporting sheets

1. `TRANG BIA`
2. `LOC_THEO_KHU_VUC`
3. `TOP_PICKS_LICH_TRINH`

### Eleven detail sheets

1. `1_Du_Lich_Tham_Quan`
2. `2_Bien_Thien_Nhien`
3. `3_An_Dac_San`
4. `4_Hai_San_Nha_Hang`
5. `5_Cafe_Checkin`
6. `6_Cho_An_Vat_Dem`
7. `7_Vui_Choi_Giai_Tri`
8. `8_An_Vat_Sinh_Vien`
9. `9_Khach_San_Homestay`
10. `10_GenZ_Game_Giai_Tri`
11. `11_Hoa_Bac_Lang_Ngam_Canh`

All 11 detail sheets use the same 12-column header layout in row 1:

| Column | Workbook header | Mapping |
|---|---|---|
| A | STT | `sourceIndex` |
| B | Tên địa điểm / quán | `name` |
| C | Phân loại | `sourceCategory` |
| D | Địa chỉ | `address` |
| E | Khu vực | `sourceArea` |
| F | Đánh giá ★ | `ratingRaw` and normalized `rating` |
| G | Tầm giá (VNĐ/người) | `priceText` |
| H | Giờ mở cửa | `openingHoursText` |
| I | Món nổi bật / Menu gợi ý | `highlightsText` |
| J | Ghi chú & Tip | `notesText` |
| K | Google Maps (bấm để mở) | hyperlink target → `mapsUrl` |
| L | Phù hợp với / Đi khi nào / Bao lâu / Cách trung tâm | raw and parsed `visitProfile` |

The physical `max_row` is not the listing count. Some sheets contain trailing blank rows or formatting. A detail listing is a row with a non-empty, non-whitespace value in column B. Ignore rows without a valid name. Do not count rows based on `max_row`, STT maximum, or cover-sheet descriptions.

### Actual detail listing counts in the inspected snapshot

| Detail sheet | Valid named listings |
|---|---:|
| `1_Du_Lich_Tham_Quan` | 57 |
| `2_Bien_Thien_Nhien` | 30 |
| `3_An_Dac_San` | 57 |
| `4_Hai_San_Nha_Hang` | 38 |
| `5_Cafe_Checkin` | 57 |
| `6_Cho_An_Vat_Dem` | 25 |
| `7_Vui_Choi_Giai_Tri` | 32 |
| `8_An_Vat_Sinh_Vien` | 40 |
| `9_Khach_San_Homestay` | 51 |
| `10_GenZ_Game_Giai_Tri` | 30 |
| `11_Hoa_Bac_Lang_Ngam_Canh` | 15 |
| **Total** | **432** |

## 3.3 Important stale/inconsistent workbook summaries

Do not use descriptive totals as the actual data source.

The inspected workbook contains known inconsistent summary values:

- `LOC_THEO_KHU_VUC` row 1 says “Toàn bộ 440 địa điểm”, while its actual listing table has 432 records.
- `TRANG BIA` includes per-sheet descriptions that do not match the current valid named rows:
  - Sheet 6 description says 27; actual named rows: 25.
  - Sheet 7 description says 33; actual named rows: 32.
  - Sheet 8 description says 41; actual named rows: 40.
  - Sheet 11 description says 19; actual named rows: 15.
- The cover sheet contains historical/editorial prose and update dates. Do not use it as a source of truth for listing totals, area assignment, status, or `fetchedAt`.

The actual normalized count must be derived from valid detail rows after parsing and validation.

---

# 4. Business Rules — Confirmed Decisions

These are fixed requirements. Do not ask Codex to choose alternatives.

## 4.1 Main category mapping

The product has five main categories. These are UI/business taxonomy values derived from the source sheet, not inferred from the listing name or text.

| Main category ID | Source detail sheets | Snapshot count |
|---|---|---:|
| `sightseeing-nature` | Sheets 1, 2, 11 | 102 |
| `food-dining` | Sheets 3, 4, 6, 8 | 160 |
| `cafe-checkin` | Sheet 5 | 57 |
| `entertainment` | Sheets 7, 10 | 62 |
| `accommodation` | Sheet 9 | 51 |
| **Total** | **All 11 detail sheets** | **432** |

Use stable category IDs in normalized data. Keep the original column C value as `sourceCategory`. Do not translate or rewrite source category text in this phase.

## 4.2 Area source of truth — Decision A (confirmed)

**`LOC_THEO_KHU_VUC` is the authoritative source for canonical area assignment.**

For each detail listing:

- `sourceArea` is copied unchanged from detail-sheet column E.
- `areaId` is derived from the matching LOC record's column B.
- `areaName` is copied unchanged from the matching LOC record's column B.
- All future area filters, area cards, area statistics, and area analytics must use canonical `areaId` / `areaName`, not `sourceArea`.
- Keep `sourceArea` for traceability and to preserve the original workbook value.
- Do not overwrite or mutate the original detail-sheet area value.
- Do not split a multi-area `sourceArea` string and assign the listing to multiple areas.
- Do not fuzzy-match names or sheet names.

There are exactly five known area differences in the inspected snapshot:

| Listing | Detail sheet `sourceArea` | Canonical LOC area |
|---|---|---|
| Cầu Rồng | Hải Châu / Sơn Trà | Hải Châu |
| Cầu Thuận Phước | Hải Châu / Sơn Trà | Hải Châu |
| Cầu Trần Thị Lý | Hải Châu / Sơn Trà | Hải Châu |
| Chèo SUP / Kayak sông Hàn - biển | Sơn Trà / Hải Châu | Sơn Trà |
| Rạp phim CGV / Lotte Cinema | Sơn Trà / Hải Châu | Sơn Trà |

These are known, intentional source/canonical differences under Decision A. Report them as an informational data-quality diagnostic; do not fail validation merely because `sourceArea !== areaName`.

The eight canonical areas are:

| Area ID | Exact source name |
|---|---|
| `son-tra` | Sơn Trà |
| `hai-chau` | Hải Châu |
| `thanh-khe` | Thanh Khê |
| `lien-chieu` | Liên Chiểu |
| `ngu-hanh-son` | Ngũ Hành Sơn |
| `cam-le` | Cẩm Lệ |
| `hoa-vang` | Hòa Vang |
| `near-da-nang` | Gần Đà Nẵng |

Use an explicit mapping table. Do not derive IDs through lossy Vietnamese accent stripping at runtime. Preserve the exact Vietnamese `areaName` from LOC. If an area value is not recognized, preserve its raw value for diagnostics, map `areaId` to `unknown`, and emit a validation warning.

Snapshot area counts, derived from the LOC table:

| Area | Count |
|---|---:|
| Hải Châu | 154 |
| Sơn Trà | 112 |
| Ngũ Hành Sơn | 56 |
| Gần Đà Nẵng | 37 |
| Thanh Khê | 29 |
| Hòa Vang | 26 |
| Liên Chiểu | 14 |
| Cẩm Lệ | 4 |
| **Total** | **432** |

Do not hardcode these counts in production. Calculate counts from normalized listings. The area summary rows 4–11 may be mapped to descriptive metadata, but their reported counts are diagnostic only.

## 4.3 Status mapping

`LOC_THEO_KHU_VUC` is also the authoritative status source.

The LOC table header is row 14. Data begins at row 15. Its columns are:

| LOC column | Meaning |
|---|---|
| A | STT |
| B | Khu vực |
| C | Tên địa điểm / quán |
| D | Sheet gốc |
| E | Phân loại |
| F | Đánh giá ★ |
| G | Tầm giá |
| H | Địa chỉ |
| I | Trạng thái |

Join detail records to LOC records using the exact composite key:

`sourceSheet + normalizedName`

Use the detail sheet's exact sheet name and listing name. Normalize names consistently using Unicode NFC, trim leading/trailing whitespace, collapse consecutive whitespace to one space, and lowercase. Keep Vietnamese diacritics and punctuation. Do not remove accents, perform fuzzy matching, or match on name alone.

Map exact source status strings:

| Exact LOC status | Normalized status |
|---|---|
| `Đang hoạt động` | `ACTIVE` |
| `KHÔNG XÁC MINH ĐƯỢC` | `UNVERIFIED` |
| `TẠM DỪNG/CẢNH BÁO` | `WARNING` |
| `ĐÃ ĐÓNG/CẤM` | `CLOSED_BANNED` |
| Missing or unrecognized | `UNKNOWN` |

Snapshot status counts:

| Status | Count |
|---|---:|
| `ACTIVE` | 387 |
| `UNVERIFIED` | 24 |
| `WARNING` | 12 |
| `CLOSED_BANNED` | 9 |
| **Total** | **432** |

If a detail record has no exact LOC match, keep the listing if its required detail fields are valid, set status to `UNKNOWN`, set area to `unknown`, and emit a warning. Never use fuzzy fallback matching.

Do not infer status from notes, rating, price, or name.

## 4.4 Duplicate handling and stable identity

The user has selected duplicate-handling Option A: **do not merge listings across different source sheets solely because their names match.**

The inspected snapshot has four duplicated name groups:

- `Tiên Sa Show`: Sheet 1 and Sheet 7.
- `VinWonders Nam Hội An`: Sheet 1 and Sheet 7.
- `Phố đi bộ Bạch Đằng`: Sheet 6 and Sheet 10.
- `Queen Palace Karaoke`: Sheet 7 and Sheet 10.

These represent eight records, not four. Preserve every record.

Generate deterministic identity from:

`sourceSheet + normalizedName`

Requirements:

- The same source sheet + normalized name must produce the same ID regardless of row order.
- Identical names in different sheets must produce different IDs.
- Do not use STT or physical row number as the primary identity.
- Do not add random IDs or timestamps.
- Detect duplicate composite keys within the same source sheet and treat them as a structural data-integrity error.
- Keep a source key for traceability. If the ID is used in a URL, encode it safely at the routing boundary.
- A rename or move to another source sheet may change the ID; this limitation is accepted because the workbook has no immutable business identifier.

## 4.5 Rating

Snapshot values:

- 395 numeric ratings.
- 37 non-numeric values: 32 `—`, 3 `ĐÃ ĐÓNG`, and 2 `CẤM`.

Rules:

- Preserve the original cell value in `ratingRaw` as `string | number | null`.
- Parse only finite numeric values or strings that contain a plain numeric rating.
- Accept decimal point notation.
- Do not parse arbitrary prose or infer a rating.
- A valid normalized rating must be in the range 0–5.
- Invalid, absent, or non-numeric rating becomes `rating: null`, never `0`.
- Do not invent review counts; the workbook does not provide a reliable structured review-count field.

## 4.6 Price, opening hours, highlights, and notes

- `priceText`: preserve column G as source text.
- `openingHoursText`: preserve column H as source text.
- `highlightsText`: preserve column I as source text.
- `notesText`: preserve column J as source text.
- Do not convert price strings to numbers.
- Do not calculate average prices, price ranges, or numeric price filters.
- Do not normalize opening hours into a schedule in this phase.
- Do not rewrite, summarize, translate, or sanitize editorial meaning in Notes & Tips.
- Treat blank optional text as `null` or the repository's established optional-field convention.

The workbook contains different pricing units and conditional descriptions (per person, per portion, per night, per hour, free, unverified, and other notes). A generic numeric price model would be misleading.

## 4.7 Google Maps hyperlinks

The inspected snapshot has:

- 424 actual hyperlink targets in column K.
- 8 listings without a hyperlink.
- All 424 inspected targets are valid HTTP(S) URLs hosted on `www.google.com`.

Important parser requirement: do not rely only on a flattened `sheet_to_json` representation if it discards cell hyperlink metadata. Read the underlying cell hyperlink target through the selected XLSX library's cell model.

Rules:

- `mapsUrl` comes from the actual hyperlink target, not the display label `Mở Google Maps`.
- Validate that the URL uses `http:` or `https:` and has a hostname.
- Prefer allowing known Google Maps domains/short-link hosts; if a URL is not an allowed Maps host, preserve a diagnostic and do not expose it as a trusted Maps CTA.
- Missing or invalid Maps URL becomes `null`; keep the listing.
- Never construct a Maps URL from the listing name or address.
- No geocoding or coordinate inference in this phase.

## 4.8 Column L — visit profile

Column L is one source string with exactly four pipe-delimited parts in all 432 records in the inspected snapshot. The delimiter is the vertical bar character `|`; whitespace around each part should be trimmed.

Mapping:

1. `suitableFor`
2. `recommendedTime`
3. `suggestedDuration`
4. `distanceFromCenterText`

Keep the full original value as `visitProfileRaw`.

If the string splits into exactly four non-empty parts, map the four fields. If it does not, preserve the raw string, set the structured profile to `null` or partial only if the implementation has a clear, tested convention, and emit a row-level warning. Do not guess missing segments or convert distance text into a numeric distance.

---

# 5. Dependency Approval Gate — Mandatory

The current audited `package.json` contains Next.js, TypeScript, Zod, TanStack Query, Axios, and other existing dependencies, but does **not** list `xlsx` or `exceljs`.

No XLSX parser is currently approved.

Codex must:

1. Re-check `package.json` and the active lockfile.
2. Search the existing repository for any installed or already-used XLSX/Excel parser.
3. Evaluate a minimal set of suitable options (for example, SheetJS `xlsx` and ExcelJS) for:
   - Node.js 22 and Next.js 16 compatibility.
   - Reading `.xlsx` buffers in a server-only runtime.
   - Preserving raw cell values and extracting cell hyperlink targets.
   - Package size and runtime overhead.
   - Maintenance status, license, and relevant security considerations.
   - Compatibility with the current pnpm 12 policy.
4. Recommend one option with a concise rationale and exact proposed version.
5. Explain whether the selected library supports the required hyperlink extraction without lossy conversion.
6. Present the dependency proposal to the user.

**Do not run `pnpm add`, `pnpm install` for the purpose of adding the new parser, modify `package.json`, or modify the lockfile until the user explicitly approves the proposed dependency.**

You may complete read-only repository analysis and dependency-independent planning. You may implement pure mapping/types/validation code only if it can be meaningfully tested without pretending that the XLSX parser is complete. Clearly mark parser-dependent work as blocked. Do not declare Phase 02 complete while the parser dependency gate remains unresolved.

Do not add any environment variable, API key, Google OAuth, Service Account, or Drive API integration in Phase 02.

---

# 6. Normalized Data Contract

Use the repository's type conventions. The following is the required semantic contract; adapt exact type/interface naming to the boilerplate.

## 6.1 Travel listing

Each normalized listing must contain the equivalent of:

```ts
type ListingStatus =
  | 'ACTIVE'
  | 'UNVERIFIED'
  | 'WARNING'
  | 'CLOSED_BANNED'
  | 'UNKNOWN';

type MainCategory =
  | 'sightseeing-nature'
  | 'food-dining'
  | 'cafe-checkin'
  | 'entertainment'
  | 'accommodation';

type AreaId =
  | 'son-tra'
  | 'hai-chau'
  | 'thanh-khe'
  | 'lien-chieu'
  | 'ngu-hanh-son'
  | 'cam-le'
  | 'hoa-vang'
  | 'near-da-nang'
  | 'unknown';

interface TravelListing {
  id: string;
  sourceKey: string;
  sourceSheet: string;
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
  visitProfile: {
    suitableFor: string;
    recommendedTime: string;
    suggestedDuration: string;
    distanceFromCenterText: string;
  } | null;
}
```

This is a semantic guide, not permission to introduce duplicate shared types or ignore existing naming conventions. Use `null` consistently for absent source data; do not mix `undefined`, empty string, and `null` arbitrarily.

`sourceIndex` is the value in Excel column A, not the physical row number. A physical row number may be retained in internal diagnostics, but it should not become the public identity.

## 6.2 Area metadata

Map the eight LOC summary rows (rows 4–11) into a small metadata collection containing:

- `areaId`
- exact `areaName`
- source description/summary text
- reported source count, if useful for diagnostics

The reported source count must not be used as the runtime count. Runtime counts are computed from normalized listings.

## 6.3 Editorial content

Map `TOP_PICKS_LICH_TRINH` into structured sections while preserving source text verbatim:

- Quick Trip Ideas: rows 2–6 (five entries).
- Top Picks groups: rows 8–18 (eleven entries).
- Three-day itinerary: rows 20–22 (three entries).
- Travel tips: rows 23–24 (two entries).

Each entry should retain its source title and full content string. Do not parse rating/price snippets into numeric data, rewrite the prose, generate missing places, or translate the text.

Rows 26–31 are instructions for using the Excel workbook; they are not public trip-idea content and should not become listing records.

Do not create listing records from editorial content. Any future linking from editorial text to a listing must use an exact, unambiguous identity match and belongs to a later feature phase.

## 6.4 Cover sheet

`TRANG BIA` is supporting documentation, not a source of truth. It may be inspected for diagnostics, but:

- Do not create listing records from it.
- Do not use its prose totals as the normalized count.
- Do not use its update date as `fetchedAt`.
- Do not override category, area, status, or detail-sheet values from it.
- Do not expose all cover-sheet operational prose as a new product feature in this phase.

---

# 7. Mapping and Processing Design

Build a small, testable pipeline. Keep parser-specific code separate from pure mapping and validation logic.

Conceptual pipeline:

1. Receive XLSX bytes as a server-side input.
2. Parse workbook and expose a typed representation of sheet names, rows, cell values, and hyperlink targets.
3. Validate required sheet presence and expected headers/layout.
4. Read the 11 detail sheets and create raw listing records.
5. Read LOC area metadata and listing index.
6. Build an exact LOC lookup using `sourceSheet + normalizedName`.
7. Map main category based on the detail sheet name.
8. Normalize area from LOC (Decision A).
9. Normalize status from LOC.
10. Normalize rating.
11. Parse column L into four fields.
12. Extract and validate Maps hyperlink.
13. Map editorial content.
14. Build the normalized dataset and diagnostics.
15. Run structural and row-level validation.
16. Return a typed result; do not mutate shared state or cache in this phase.

Recommended conceptual separation:

- Workbook parser: XLSX library-specific logic only.
- Sheet configuration: exact sheet names, headers, row ranges, and category mapping.
- Listing mapper: detail sheet rows → raw listing records.
- LOC mapper: area metadata and exact listing index.
- Editorial mapper: supporting editorial rows.
- Normalizers: rating, area, status, visit profile, ID.
- Validators: structural and row-level checks.
- Dataset builder: compose final normalized dataset and diagnostics.

Map these responsibilities into the smallest sensible folder structure that fits the repository. Do not create a separate file for every trivial function if that makes the code harder to navigate.

Server boundary:

- Workbook parsing must be server-only.
- Do not import parser code into Client Components, client hooks, shared UI components, or browser-facing modules.
- Use a server-only guard if the repository/Next.js setup supports it and it does not introduce a new dependency.
- Keep pure mapping/normalization functions independently testable.
- Do not expose XLSX bytes or parser objects to the client.
- Do not fetch Google Drive in this phase.

---

# 8. Validation Specification

Separate structural failures from row-level warnings.

## 8.1 Structural validation — reject the new workbook

The following should fail the workbook build:

- XLSX bytes cannot be parsed.
- A required worksheet is missing.
- A detail sheet has an incompatible/missing required header.
- LOC table headers or required columns cannot be located.
- A required source sheet cannot be mapped to a main category.
- A duplicate composite key exists within the same source sheet.
- Core mapping cannot be completed safely.
- No valid listings remain after parsing.

Use actionable error codes/messages. Do not leak stack traces or raw parser internals in public-facing responses; this phase may return typed internal diagnostics.

## 8.2 Row-level validation — preserve valid records

| Condition | Required behavior |
|---|---|
| Blank name | Skip row |
| Missing optional address/category/text | Preserve listing with null and warning where appropriate |
| Non-numeric rating | `rating = null`, preserve `ratingRaw` |
| Missing/invalid Maps URL | `mapsUrl = null`, preserve listing |
| LOC match missing | `areaId = unknown`, `status = UNKNOWN`, warning |
| Unknown LOC area | Preserve raw area, use `unknown`, warning |
| Unknown LOC status | Preserve raw status, use `UNKNOWN`, warning |
| Visit profile not exactly four parts | Preserve raw text, structured profile null, warning |
| Blank trailing row | Ignore |
| Source area differs from canonical LOC area | Informational diagnostic, not failure |
| Editorial item has no listing match | Preserve editorial text; no fabricated link |

Do not automatically repair source content.

## 8.3 Diagnostics contract

Return enough structured diagnostics for Phase 03 to decide whether a newly fetched workbook can safely replace the current dataset.

At minimum, diagnostics should distinguish:

- Fatal structural errors.
- Row-level warnings.
- Informational discrepancies.
- Counts of parsed, accepted, skipped, and warning records.
- Per-sheet listing counts.
- Missing LOC matches.
- Unknown areas/statuses.
- Invalid/missing Maps links.
- Invalid visit profiles.
- Source-area vs canonical-area differences.

Do not introduce an elaborate observability framework. A small typed diagnostics object is sufficient.

---

# 9. Regression Baseline — Inspected Workbook Snapshot

Use the actual workbook as an offline regression fixture. Do not call Google Drive or any network API from unit/integration tests.

Expected snapshot assertions:

| ID | Assertion | Expected |
|---|---|---:|
| WB-01 | Total worksheets | 14 |
| WB-02 | Detail sheets | 11 |
| WB-03 | Supporting sheets | 3 |
| WB-04 | Valid detail listings | 432 |
| WB-05 | LOC listing rows | 432 |
| WB-06 | Unique LOC composite keys | 432 |
| WB-07 | Detail → LOC exact matches | 432 |
| WB-08 | Main categories | 5 |
| WB-09 | Canonical areas | 8 |
| WB-10 | Numeric ratings | 395 |
| WB-11 | Null/non-numeric ratings | 37 |
| WB-12 | Valid Maps hyperlink targets | 424 |
| WB-13 | Missing Maps links | 8 |
| WB-14 | Valid four-part visit profiles | 432 |
| WB-15 | Duplicate-name groups across sheets | 4 |
| WB-16 | Known source/canonical area differences | 5 |
| WB-17 | Formula cells | 0 |
| WB-18 | Hidden worksheets | 0 |

Per-sheet listing counts must match Section 3.2.

Category counts must match Section 4.1.

Area counts must match Section 4.2.

Status counts must match Section 4.3.

Duplicate groups must match Section 4.4.

Do not hardcode these values in production transformation logic. They belong only in fixture regression tests.

If the live public workbook has changed since the inspected snapshot, report the difference and distinguish:
- current fixture results,
- current public workbook results,
- intentional workbook changes,
- unexpected schema/data drift.

Do not silently update expected assertions to make a failing test pass. Explain the change and obtain confirmation if it changes an approved business rule.

---

# 10. Test Plan

Follow the repository's Vitest + Testing Library setup. This phase is primarily data logic; do not add UI components or Storybook stories.

## 10.1 Unit tests

Test at least:

- Unicode NFC normalization.
- Trimming and whitespace collapsing.
- Case normalization while retaining Vietnamese accents.
- Composite key generation.
- Stable ID generation independent of row order.
- Same-name records in different sheets remain distinct.
- Duplicate composite key in the same sheet is detected.
- Main category mapping for all 11 sheets.
- Status mapping for all known values and unknown fallback.
- Area mapping from LOC values.
- Five known source/canonical area differences do not fail.
- Rating parsing for numbers, numeric strings, em dash, status strings, blanks, invalid strings, and out-of-range values.
- Visit profile parsing with four parts, missing parts, extra parts, and blank segments.
- Maps URL validation for allowed HTTP(S) Maps URLs, invalid schemes, malformed URLs, and missing hyperlink.
- Blank row handling.
- Editorial row mapping and raw-text preservation.

## 10.2 Integration tests

Using the real XLSX fixture:

- Parse all 14 sheets.
- Read actual hyperlink targets, not only cell display text.
- Map 11 detail sheets.
- Map LOC index and metadata.
- Join all 432 detail records to LOC using exact composite keys.
- Map all editorial sections.
- Build a normalized dataset.
- Verify category, area, status, rating, Maps, visit-profile, and duplicate baselines.
- Verify that cover-sheet summary inconsistencies do not change the actual dataset count.

## 10.3 Negative tests

Include controlled malformed-workbook fixtures or mocked parser outputs for:

- Missing required detail sheet.
- Missing LOC sheet.
- Missing required header.
- Duplicate LOC composite key.
- Duplicate detail composite key within one sheet.
- No valid detail rows.
- Invalid workbook bytes.
- Unknown area.
- Unknown status.
- Missing LOC mapping.
- Malformed visit profile.
- Invalid or unsafe hyperlink target.

Tests must be deterministic and must not access the public Google Sheets URL.

---

# 11. Implementation Workflow and Task Breakdown

Codex must maintain a task checklist and update it as work progresses.

## Task 02.1 — Repository and fixture verification

- Inspect current branch and working tree.
- Read applicable repository instructions.
- Verify package manager, dependencies, lockfile, and test setup.
- Locate or retrieve the exact workbook fixture.
- Confirm the fixture's sheet names and baseline.
- Report any mismatch before implementation.

## Task 02.2 — Dependency decision

- Search for existing XLSX parser capability.
- Compare suitable options.
- Present exact package/version recommendation.
- Stop for explicit approval before installation.
- Do not claim parser completion while blocked.

## Task 02.3 — Domain contracts and constants

After dependency approval if required:

- Define normalized types.
- Define source sheet constants.
- Define five category mappings.
- Define eight canonical area IDs and exact source labels.
- Define status mappings.
- Define workbook schema/header configuration.
- Keep all constants in the repository's established convention.

## Task 02.4 — Parser

- Parse XLSX bytes on the server.
- Preserve raw cell types.
- Read hyperlink targets from column K.
- Expose sheet rows in a typed form.
- Detect missing sheets and malformed workbook structures.
- Do not use a lossy conversion that drops hyperlinks.

## Task 02.5 — Supporting sheet mappers

- Parse LOC area metadata rows 4–11.
- Parse LOC header row 14 and records from row 15 onward.
- Parse Top Picks/editorial rows by the ranges in Section 6.3.
- Do not use cover-sheet prose as data truth.

## Task 02.6 — Detail mapper and normalization

- Map all 11 detail sheets.
- Generate deterministic composite identity.
- Map categories.
- Map canonical area from LOC (Decision A).
- Map status from LOC.
- Normalize rating.
- Preserve raw price, opening hours, highlights, and notes.
- Extract Maps hyperlinks.
- Parse visit profile.

## Task 02.7 — Validation and diagnostics

- Implement structural validation.
- Implement row-level warnings.
- Implement informational discrepancy reporting.
- Return a typed result suitable for Phase 03.
- Ensure a failed build cannot be mistaken for a successful empty dataset.

## Task 02.8 — Regression and negative tests

- Add the real workbook fixture if available and appropriate.
- Add unit and integration tests.
- Add malformed-input tests.
- Verify all baseline assertions.

## Task 02.9 — Review and phase report

- Review scope and architecture.
- Run all required checks.
- Report files changed, dependency decisions, test results, unresolved items, and any blocked tasks.
- Do not commit or push.

---

# 12. Explicit Non-goals

Do not implement any of the following in Phase 02:

- Google Drive download/export connector.
- Google Drive API, OAuth, Service Account, or API key.
- Automatic initial fetch.
- Manual Update button.
- Sync API Route Handler.
- Cache or cache invalidation.
- Cooldown or rate limiting.
- TanStack Query integration.
- Zustand store.
- Dashboard or Home UI.
- Explore UI, search, filters, sorting, pagination, or Grid/Table views.
- Place Detail page.
- Areas page or map.
- Trip Ideas page UI.
- Insights charts.
- SEO routes or sitemap changes.
- Authentication or user management.
- Database or persistent storage.
- Translation namespace changes.
- Automatic translation of workbook data.
- Image lookup or geocoding.
- Booking, contact, or phone-number enrichment.

These belong to later phases or are outside the approved product scope.

---

# 13. Security, Reliability, and Performance Requirements

- Keep parser and workbook bytes server-side.
- Do not expose environment variables or secrets.
- Do not add environment variables in this phase.
- Treat workbook cells and hyperlinks as untrusted input.
- Reject unsafe URL protocols.
- Do not evaluate formulas, macros, embedded scripts, or external workbook connections.
- Apply reasonable file-size and parsing safeguards at the parser boundary; do not invent arbitrary low limits that reject the known 196 KB workbook.
- Avoid unbounded loops or repeated scans where a map/index is sufficient.
- Build the LOC lookup once, then join listings in linear time.
- Do not parse the workbook repeatedly for each listing.
- Do not store raw XLSX bytes in client state.
- Do not add caching in Phase 02.
- Keep parser-specific objects out of the normalized domain contract.

---

# 14. Acceptance Criteria

Phase 02 is complete only when all applicable criteria pass:

- [ ] The implementation follows the checked-out repository's `AGENTS.md` and existing conventions.
- [ ] No unrelated boilerplate feature was modified.
- [ ] No unapproved dependency was installed or added.
- [ ] The parser runs only on the server.
- [ ] All 14 required worksheets are recognized.
- [ ] All 11 detail sheets are mapped using their actual headers.
- [ ] The 3 supporting sheets are mapped according to this specification.
- [ ] Listing count is derived from valid named rows, not `max_row` or cover-sheet summaries.
- [ ] Main category mapping is correct.
- [ ] Area Decision A is implemented exactly: LOC is canonical; detail column E is preserved as `sourceArea`.
- [ ] The five known area differences are retained as informational diagnostics.
- [ ] Status mapping is exact and unknown fallback is safe.
- [ ] Duplicate names across different sheets remain separate listings.
- [ ] IDs are deterministic and independent of row order.
- [ ] Rating normalization does not turn invalid values into zero.
- [ ] Price and other descriptive text remain raw.
- [ ] Actual Maps hyperlink targets are extracted and validated.
- [ ] Column L is parsed into four fields using `|`, with raw text preserved.
- [ ] Editorial text is preserved and not turned into fabricated listings.
- [ ] Structural failures are distinguishable from row-level warnings.
- [ ] The normalized dataset and diagnostics have explicit TypeScript types.
- [ ] Regression tests pass against the actual workbook fixture.
- [ ] Negative tests cover malformed input and mapping failures.
- [ ] Tests do not call Google Drive or any external network.
- [ ] No UI, API, Drive sync, or unrelated feature was added.
- [ ] All required quality checks have been run and their actual results reported.

---

# 15. Definition of Done and Required Verification

Follow the current `AGENTS.md` Definition of Done.

Run and inspect the actual output of:

```bash
pnpm lint
pnpm format:check
pnpm type-check
pnpm test
```

Run `pnpm build` if routes, config, metadata, or environment configuration changed. Phase 02 should normally not need those changes; if it does, explain why.

Run `pnpm build-storybook` only if a component/story was changed. This phase should not add UI components.

The repository's standard must remain zero errors and zero warnings. Do not suppress warnings merely to get a green command. Do not modify Biome rules to accommodate new code.

If a command cannot run because dependencies are not installed or network access is blocked, report that exact limitation. Do not fabricate a pass result.

---

# 16. Final Report Format

At completion, report:

1. **Phase status:** completed, partially completed, or blocked.
2. **Implementation summary:** what was built.
3. **Architecture mapping:** where each responsibility lives.
4. **Files created/modified:** exact paths and purpose.
5. **Dependency decision:** existing dependency reused, or proposed dependency awaiting approval.
6. **Workbook fixture:** exact source and whether it was available.
7. **Regression results:** actual counts compared with the expected snapshot.
8. **Tests:** commands run and pass/fail counts.
9. **Lint / format / type-check / build:** actual outcomes.
10. **Known limitations:** anything not implemented or not verified.
11. **Acceptance checklist:** pass/fail/blocked per criterion.
12. **Next phase readiness:** state whether Phase 03 can begin and list prerequisites.

Do not say “Phase 02 completed” if the XLSX parser dependency is still awaiting approval, the actual workbook fixture was unavailable, or critical acceptance criteria remain unverified.

**End of Phase 02 Detailed Specification.**
