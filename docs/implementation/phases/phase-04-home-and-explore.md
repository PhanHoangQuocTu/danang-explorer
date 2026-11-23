# Phase 04 — Home & Explore Experience
## Codex Detailed Implementation Specification

**Project:** Da Nang Travel Discovery  
**Repository:** https://github.com/PhanHoangQuocTu/nextjs-frontend-boilerplate  
**Target phase:** Phase 04 of 08  
**Document type:** Authoritative implementation specification  
**Scope:** Implement the Home/Dashboard landing experience and the Explore discovery experience using the normalized travel dataset from Phases 02–03.  
**Execution mode:** Repository-aware, App Router, server-first, bilingual UI, responsive.  
**Status:** Product direction and core Explore defaults are confirmed. Some detailed presentation/sorting choices remain proposals and must not be misrepresented as prior user decisions.

---

# 0. Instructions for Codex

Treat this document as the authoritative Phase 04 scope, subject to the repository's current `AGENTS.md`, `CLAUDE.md`, and the approved product decisions recorded in Phase 01 and Phase 02.

Implement only Home and Explore. Do not expand into Place Detail, Areas, itinerary detail, map exploration, analytics, or the full synchronization workflow.

Before changing any file:

1. Inspect the current branch, latest commit, `git status`, and working tree. Preserve user changes.
2. Read the complete root `AGENTS.md`, `CLAUDE.md`, and applicable nested instruction files.
3. Read the Phase 01 repository audit and architecture mapping.
4. Read the Phase 02 detailed specification and actual execution report; inspect the real domain types, normalized dataset, editorial data, diagnostics, and parser entry point.
5. Read the Phase 03 detailed specification and actual execution report; inspect the real Google Sheets connector and source-to-dataset function.
6. **Verify Phase 02 and Phase 03 implementation readiness before building production pages.** The previously prepared Phase 03 Markdown specification is not proof that the connector was implemented. Do not assume it exists.
7. Verify actual route, locale, design-system, component, data-fetching, and testing conventions from the checked-out repository.
8. Produce a concise repository-aware implementation plan with dependencies before editing.
9. Separate confirmed product decisions from proposals and unresolved details. Do not invent business behavior to fill gaps.
10. Do not install, add, upgrade, remove, or change any dependency or lockfile without explicit user approval.
11. Do not commit, push, amend, rebase, or rewrite Git history. Do not discard user changes.
12. Do not claim tests, builds, browser checks, accessibility checks, or visual verification passed unless they were actually run and their output inspected.

## Phase dependency gate

Phase 04 depends on:
- Phase 01: repository rules and architecture mapping.
- Phase 02: working server-only normalized data contract.
- Phase 03: working public workbook connector and source-to-dataset composition function.

If Phase 02 or Phase 03 is not implemented or cannot be verified:
- Do not create fake production data or pretend live data integration works.
- Do not duplicate the parser or connector.
- You may complete repository audit, design planning, and dependency-independent UI components only when their types and contracts are grounded in existing code.
- Stop before wiring production Home/Explore pages to a fabricated provider.
- Report exact missing prerequisites and mark affected acceptance criteria BLOCKED.
- Do not declare Phase 04 fully complete.

A local fixture may be used only in tests or Storybook. Never use a mock dataset as a silent production fallback.

---

# 1. Roles and Quality Bar

Work as a coordinated senior product engineering team:

- **Senior Next.js Engineer:** preserve App Router architecture, Server Component defaults, server/client boundaries, and Vercel compatibility.
- **Senior Frontend Engineer:** implement polished Home and Explore experiences using the existing design system.
- **Senior Product Designer:** follow the confirmed Editorial direction; keep layouts clear, responsive, and content-first.
- **Senior TypeScript Engineer:** use existing Phase 02 types and strict types; avoid duplicate domain models and unsafe casts.
- **Senior Data Engineer:** consume canonical normalized fields; do not reinterpret workbook data in UI code.
- **Senior i18n Engineer:** localize UI only in Vietnamese and English while preserving source workbook text.
- **Senior Accessibility Reviewer:** ensure keyboard support, semantics, labels, focus behavior, contrast, and responsive usability.
- **Senior QA Engineer:** test search, filters, URL state, sorting, view modes, pagination, localization, and loading/error/empty states.
- **Technical Lead:** reuse the boilerplate, avoid unnecessary abstractions, and keep scope limited.

Do not introduce a design system replacement, a new data framework, a database, a separate backend, or an elaborate state-management layer.

---

# 2. Confirmed Product Context and Decisions

## 2.1 Product

Da Nang Travel Discovery is a bilingual travel discovery website covering:
- Sightseeing and tourism.
- Nature and beaches.
- Food and dining.
- Cafes and check-in locations.
- Entertainment.
- Accommodation.
- Nearby destinations around Da Nang.

The website uses the existing Next.js boilerplate and remains one application. No separate backend and no database are part of the approved architecture.

## 2.2 Localization

Confirmed:
- UI languages: Vietnamese (`vi`) and English (`en`).
- Default locale: Vietnamese (`vi`).
- UI labels, navigation, helper text, validation, empty states, and accessibility labels must be localized.
- Workbook content itself is not translated.
- Preserve Vietnamese names, addresses, source categories, notes, tips, editorial content, price text, opening-hours text, and visit-profile values exactly as received.
- Do not machine-translate source fields when the UI locale is English.
- Do not add a third locale.

Use the repository's existing `next-intl` configuration and message conventions. Verify the current implementation and make only the product-required changes.

## 2.3 Visual direction

Confirmed overall direction: **Editorial**.

Use the existing styling system and design tokens. The experience should feel like a curated travel guide rather than a generic admin dashboard:
- Clear editorial hierarchy.
- Strong typography.
- Intentional whitespace.
- Readable content density.
- Restrained use of accent color.
- Consistent cards, badges, filters, tables, and responsive behavior.
- Avoid excessive gradients, decoration, and dashboard chrome.

Do not replace the boilerplate design system or add a new UI library.

## 2.4 Explore defaults

Confirmed:
- Default Explore presentation: **Grid View**.
- Default listing status filter: **All**.
- Page size: **24 listings per page**.
- Five main categories.
- Eleven source/detail-sheet categories.
- Eight canonical areas.
- Simple map direction is a product-wide decision, but map UI is not part of this phase.
- Listing duplicates across different source sheets remain separate.

## 2.5 Search and filter requirements

Confirmed search behavior:
- Search by listing name.
- Search by address.
- Search by category.
- Search is case-insensitive.
- Search is Vietnamese accent-insensitive.
- Filters combine with AND across different filter dimensions.
- Multiple selected values inside the same multi-select dimension use OR semantics.
- Provide a Clear All action.
- Preserve applied filters when switching between Grid and Table/List views.
- Basic filter state must be represented in the URL.

Confirmed filter dimensions:
- Main category (5).
- Source category (11 source categories / values derived from the workbook).
- Canonical area (8).
- Rating.
- Listing status.
- Suitable-for (`visitProfile.suitableFor`).
- Recommended time / best time (`visitProfile.recommendedTime`).

Status behavior:
- Default status selection is All.
- Do not hide `UNVERIFIED`, `WARNING`, `CLOSED_BANNED`, or `UNKNOWN` listings by default.
- Use the normalized Phase 02 status, not free-text inference from notes.

Canonical area behavior:
- Use `areaId` and `areaName` from the normalized Phase 02 result.
- Never filter by raw `sourceArea`.
- Do not split a multi-area source string into multiple areas.

Rating behavior:
- Use only the normalized numeric `rating`.
- Null or invalid ratings must remain null and must not be treated as zero.
- Do not invent review counts.

Price behavior:
- `priceText` is descriptive text with mixed units.
- Do not implement a numeric price slider, numeric min/max price filter, or price analytics.

Visit profile behavior:
- Use `visitProfile.suitableFor` and `visitProfile.recommendedTime`.
- Do not infer these values from notes, listing names, or other text.
- Preserve source values as Vietnamese even in English UI.

## 2.6 Data baseline

Phase 02's inspected workbook snapshot had 432 valid named listings. This is a regression fixture baseline only, not a hardcoded production count.

Production counts must be calculated from the currently loaded normalized dataset:
- Total listings.
- Listings by main category.
- Listings by canonical area.
- Listings by status, if displayed.

Never hardcode 432 or the snapshot's category/area counts in UI code.

---

# 3. Scope and Deliverables

Phase 04 implements two product surfaces.

## 3.1 Home / Dashboard

Purpose:
- Introduce the Da Nang travel discovery product.
- Give users a clear entry point into Explore.
- Provide quick access to the five main categories and eight canonical areas.
- Surface source-authentic editorial content from the normalized dataset.
- Show a small set of useful dataset summaries derived at runtime.

The Home page is an editorial landing page, not an operational admin dashboard.

### Proposed Home composition

The following is the implementation baseline discussed during product planning. Preserve the editorial direction and keep the composition proportionate. Do not invent unsupported data or claim that every sub-section was separately user-approved.

1. **Hero / introduction**
   - Short localized headline and supporting copy.
   - Prominent search input.
   - Search submits/navigates to Explore with the search term in the URL.
   - Optional quick category links for the five main categories.
   - Do not invent claims such as “best in Da Nang”, “verified”, or live availability.

2. **Dataset summary / KPI strip**
   - Total normalized listings.
   - Main category count (five configured categories).
   - Canonical area count (eight configured areas).
   - Optional active listing count derived from `status === ACTIVE`.
   - All counts must be calculated from actual normalized data/configuration.
   - Do not use the cover sheet's stale totals.

3. **Main category discovery**
   - Five category cards or links.
   - Each shows localized category label and count derived from normalized listings.
   - Clicking a category opens Explore with that category filter applied.

4. **Area discovery**
   - Eight canonical area links/cards.
   - Show canonical `areaName` and computed listing count.
   - Clicking an area opens Explore with the canonical area filter applied.
   - Do not add a map or geocoding.

5. **Editorial / Top Picks preview**
   - Use only the actual editorial data parsed from `TOP_PICKS_LICH_TRINH` by Phase 02.
   - Preserve editorial title and body verbatim.
   - Localize only surrounding UI labels.
   - Do not fabricate editorial entries or listing links.
   - If an editorial item cannot be linked to a listing through an exact, unambiguous supported relationship, show it as source-authentic text without a fabricated CTA.

6. **Optional featured listing preview**
   - Only render if the product data contract provides a deterministic, approved source for featured records.
   - Do not create a new `featured` flag in UI code.
   - Do not arbitrarily select “top” places based on rating unless the ranking rule is explicitly approved.
   - If no approved source exists, omit this section rather than fabricate featured content.

### Home interactions

- Hero search opens Explore with `q` populated.
- Category links apply the matching main-category filter.
- Area links apply the matching canonical area filter.
- Editorial preview links only to a real supported route or exact supported target.
- No Place Detail route is introduced in this phase.
- No manual Update button is added in this phase.
- No map is added in this phase.

## 3.2 Explore

Purpose:
- Allow users to discover, search, filter, sort, and browse normalized travel listings.
- Support Grid, List, and Table presentations without losing applied filter state.
- Provide predictable pagination and shareable basic search/filter URLs.

### Explore page structure

- Page title and concise localized description.
- Search input.
- Filter controls.
- Active filter chips or equivalent clear summary.
- Clear All action.
- Result count.
- Sort control (subject to the decision note in Section 8).
- View mode control: Grid / List / Table.
- Listing result area.
- Pagination.
- Empty state.
- Loading and error states.

Do not introduce unrelated dashboard widgets into Explore.

---

# 4. Listing Presentation

## 4.1 Normalized listing fields available to UI

Use the actual Phase 02 type. Its semantic fields include:
- `id`
- `name`
- `mainCategory`
- `sourceCategory`
- `address`
- `areaId`
- `areaName`
- `status`
- `rating`
- `priceText`
- `openingHoursText`
- `highlightsText`
- `notesText`
- `mapsUrl`
- `visitProfile.suitableFor`
- `visitProfile.recommendedTime`
- `visitProfile.suggestedDuration`
- `visitProfile.distanceFromCenterText`

Do not create a second UI-only domain model that loses important fields or changes their meaning. A small view-model adapter is acceptable if it is typed and preserves source values.

## 4.2 Grid View

Grid is the default view.

A listing card should prioritize:
- Listing name.
- Main category label.
- Canonical area name.
- Numeric rating only when present.
- Raw price text when present.
- Status badge.
- A concise source-authentic highlight when useful.
- Original Google Maps CTA only when `mapsUrl` is valid and present.

Optional fields must be omitted gracefully. Do not render fake ratings, review counts, prices, opening hours, or maps links.

The workbook does not provide listing images in the Phase 02 normalized contract. Do not invent image URLs, scrape images, add stock images, or create a new image-enrichment system in this phase. Use the existing design system's text/icon-based visual treatment where a card needs visual structure.

Do not link a listing card to a Place Detail page because that page is out of scope. A card may be non-navigational, or use only a real supported action such as its original Maps link.

## 4.3 List View

Provide a compact, scan-friendly row/card presentation using the same underlying normalized fields as Grid View.

- Preserve the same active filters and sort.
- Do not change result membership when switching views.
- Do not add data fields unavailable in the normalized contract.
- Ensure mobile layout remains readable.

## 4.4 Table View

Provide a semantic table for users who prefer dense comparison.

Suggested columns:
- Name.
- Main category.
- Source category, if it remains readable.
- Canonical area.
- Rating.
- Price text.
- Status.
- Maps action, when available.

Use responsive overflow or a deliberate mobile treatment. Do not hide essential accessibility semantics. Keep table labels localized while source values remain unchanged.

## 4.5 Status display

Map normalized statuses to localized UI labels:
- `ACTIVE`
- `UNVERIFIED`
- `WARNING`
- `CLOSED_BANNED`
- `UNKNOWN`

Do not rewrite the underlying status or infer it from source notes. Use a clear visual distinction without alarming decoration.

## 4.6 External Maps links

- Use only the Phase 02 validated `mapsUrl`.
- Never synthesize a Maps URL from a listing name or address.
- Open external links safely (`target`/`rel` as appropriate to repository conventions).
- If `mapsUrl` is null, omit the action.
- Do not add coordinates, geocoding, map tiles, or embedded maps.

---

# 5. Search, Filtering, Sorting, and Pagination

## 5.1 Search normalization

Implement a pure, independently tested search-normalization utility.

Requirements:
- Case-insensitive.
- Vietnamese accent-insensitive.
- Normalize Unicode consistently.
- Handle Vietnamese `đ` and `Đ` in a predictable accent-insensitive way.
- Preserve the original source strings; normalize only temporary comparison values.
- Trim and collapse whitespace in the query.
- Do not mutate normalized listing records.

Search fields:
- `name`
- `address`
- `sourceCategory`
- localized/main category identifier or label where appropriate

Do not search arbitrary editorial notes by default unless an approved product requirement says otherwise. Avoid surprising broad search over every source field.

## 5.2 Filter semantics

Filters across dimensions combine with AND.

Example:
- Category = food-dining
- Area = hai-chau
- Status = ACTIVE
- Suitable-for = families

A record must satisfy every active dimension.

Within one multi-select dimension, selected values combine with OR.

Example:
- Area is Sơn Trà OR Hải Châu.
- Category is food-dining OR cafe-checkin.

Filter dimensions:
1. Main category.
2. Source category.
3. Canonical area.
4. Rating threshold.
5. Status.
6. Suitable-for.
7. Recommended time / best time.

Default values:
- No search query.
- No category restriction.
- No source-category restriction.
- No area restriction.
- No rating threshold.
- Status = All.
- No suitable-for restriction.
- No recommended-time restriction.
- View = Grid.
- Page = 1.
- Page size = 24.

Do not silently apply `ACTIVE` as the default status.

## 5.3 Rating filter decision note

The existence of a rating filter is confirmed, but the exact interaction/threshold options were not captured as a final user decision.

Use the simplest existing design-system control and do not add a complex star-range slider. A minimum-rating threshold is the preferred implementation proposal, but Codex must:
- Check for a more exact approved product specification in the repository.
- If none exists, record the proposed threshold values in the implementation plan before coding.
- Do not silently invent additional rating semantics.
- Keep null ratings excluded when a minimum rating is active.

Suggested simple thresholds (proposal, not a historical user decision): 4+, 3+, 2+, 1+. If this decision materially blocks implementation, ask for approval rather than guessing.

## 5.4 Sorting decision note

Sorting by name and rating was discussed as a simple proposal, but the exact sort menu and default ordering were not separately confirmed in the retrieved product record.

Codex must:
- Check existing approved docs for exact sort behavior.
- Prefer a small set: source order/default, name ascending, rating descending.
- Use stable sorting and deterministic tie-breaking.
- Do not add price sorting because price is descriptive text.
- Do not add popularity, distance, relevance, or “recommended” ranking without a real approved data source.
- If the default order is not specified, preserve normalized source order rather than inventing a ranking.
- Record the selected behavior in the plan and final report.

## 5.5 Clear All

Clear All must:
- Remove search and all active filters.
- Reset page to 1.
- Restore status = All.
- Restore default sort/order.
- Preserve the current view mode unless the existing product behavior or URL-state design explicitly treats view as part of the cleared state.
- Keep the result URL canonical and free of empty/default parameters.

## 5.6 Pagination

Confirmed page size: **24 listings per page**.

Requirements:
- Compute total result count after search/filter/sort.
- Compute page count from filtered result count.
- Clamp invalid/out-of-range page values safely.
- If filters/search/sort change, reset page to 1.
- Switching Grid/List/Table must not reset filters.
- Switching view must not change result membership or page size.
- Pagination controls must be keyboard accessible.
- Empty results must not render invalid pagination.
- Do not hardcode total pages or listing counts.

## 5.7 URL state

Basic filters must be represented in the URL.

Use a small, typed parser/serializer for query parameters. Adapt parameter names to repository conventions; suggested canonical keys:

| Parameter | Meaning |
|---|---|
| `q` | Search query |
| `category` | One or more main category IDs |
| `sourceCategory` | One or more source category values/IDs |
| `area` | One or more canonical area IDs |
| `rating` | Minimum rating threshold |
| `status` | Status or `all` |
| `suitableFor` | One or more source visit-profile values |
| `recommendedTime` | One or more source visit-profile values |
| `sort` | Approved sort option |
| `view` | `grid`, `list`, or `table` |
| `page` | 1-based page number |

Requirements:
- Validate all query values against known types/options.
- Ignore or normalize invalid values safely.
- Avoid serializing defaults and empty values.
- Use repeated query parameters for multi-select values if consistent with the existing router patterns; otherwise document the chosen encoding.
- Preserve unrelated locale/navigation parameters.
- Make copied URLs reproduce the same search/filter/sort/view/page state.
- Avoid direct `window.location` manipulation if the repository has a locale-aware navigation helper.
- Do not place the whole dataset in the URL.
- Avoid excessive URL length; source text values may need stable option IDs or a documented encoding strategy.

## 5.8 Filter option sources

- Main categories: the five configured stable category IDs and localized labels.
- Source categories: derive unique non-empty values from normalized `sourceCategory`; preserve original values.
- Areas: the eight canonical areas from Phase 02 metadata; use `areaId`/`areaName`.
- Status: fixed normalized enum values plus All.
- Suitable-for and recommended-time: derive unique non-empty values from normalized visit-profile fields.
- Rating: derive from normalized numeric rating values and the approved threshold semantics.

Do not hardcode snapshot listing counts. Do not infer filter options from listing names or notes.

---

# 6. Data Loading and Server/Client Boundaries

## 6.1 Data source

Use the actual Phase 03 source-to-dataset composition function, which should:
1. Fetch the current public Google Sheets XLSX export on the server.
2. Pass the bytes to the Phase 02 parser.
3. Return the normalized dataset and diagnostics with source-fetch metadata.

Do not duplicate or bypass this pipeline.

## 6.2 Initial Home/Explore read

The product requirement is to show the latest available workbook data when users enter the site. Phase 03 defined the connector but intentionally did not wire it to product pages. Phase 04 owns the narrow first read required by Home and Explore.

Requirements:
- Load the dataset on the server.
- Do not fetch Google Sheets from the browser.
- Do not expose XLSX bytes, parser objects, or source credentials to the client.
- Use the Phase 03 no-store source behavior; do not introduce a stale Next.js Data Cache entry.
- Avoid downloading/parsing more than once within the same server request when Home/Explore composition can share the result.
- Do not introduce persistent cache, cross-instance state, manual refresh, or a sync lock in this phase.
- Do not assume the external daily overwrite has completed at a particular time.
- If the source is unavailable or the parser rejects the workbook, render a clear localized error state. Never replace it with fake data.

This means each new server request may retrieve the latest export. The performance/caching trade-off must be recorded for the later synchronization phase; do not solve it by adding a database or global cache here.

## 6.3 Last-known-good data

The broader product requirement is to avoid replacing a valid dataset with an invalid workbook. Phase 03/04 do not introduce persistent storage.

Therefore:
- A failed fetch/parse must never be presented as a successful empty dataset.
- If a valid dataset is already available within the current request, preserve it for that response.
- Do not invent a persistent last-known-good store.
- The later synchronization/cache phase owns durable or cross-request retention of the last valid dataset.

## 6.4 Server Components

Prefer Server Components for:
- Home page data composition.
- Explore result filtering and pagination when practical.
- Category/area counts.
- Editorial previews.
- Metadata and SEO.

Use Client Components only for interactions that require client state/navigation, such as:
- Search input interactions.
- Multi-select filter controls.
- View mode control.
- Pagination interaction if required by the chosen URL-navigation pattern.

Do not add `'use client'` to whole pages or large module trees unnecessarily.

## 6.5 TanStack Query and Zustand

- Inspect existing provider/query patterns first.
- Do not introduce TanStack Query solely to filter an already-loaded server result if URL/server rendering is simpler.
- Do not put the full normalized dataset into Zustand by default.
- Use the smallest state mechanism that follows repository conventions.
- URL is the source of truth for shareable search/filter state.

## 6.6 API and Route Handlers

- Prefer direct server-side use of the Phase 03 server function from Server Components if it fits the architecture.
- Do not create a public Route Handler merely to make Server Components call the same application server.
- Add an API endpoint only if the existing architecture or client interaction genuinely requires it and the reason is documented.
- Do not add manual-sync endpoints.

---

# 7. Responsive Design, Accessibility, and UX States

## 7.1 Responsive behavior

Support desktop, tablet, and mobile using the repository's actual Tailwind breakpoints and component conventions.

Expected behavior:
- Desktop: multi-column Grid, visible filter area, readable Table.
- Tablet: reduced Grid columns and adaptable filter layout.
- Mobile: one-column or compact Grid, collapsible/stacked filters, usable search, horizontally scrollable or deliberately adapted Table.
- No horizontal page overflow.
- No tiny controls or clipped text.
- Preserve essential listing fields at all sizes.

Do not invent custom breakpoints if existing tokens are sufficient.

## 7.2 Accessibility

At minimum:
- Semantic headings and landmarks.
- Proper form labels and accessible names.
- Keyboard-operable search, filters, view switcher, clear action, and pagination.
- Visible focus indicators.
- Correct table semantics and header associations.
- Do not rely on color alone for status.
- Accessible announcements for result count changes where appropriate.
- Buttons must be actual buttons; navigation must be links.
- Respect reduced-motion preferences if motion is used.
- Maintain sufficient contrast under existing themes.

## 7.3 Loading state

Use the existing Next.js loading conventions where appropriate:
- A page-level or section-level loading state.
- Skeletons only if the existing design system supports them.
- Avoid layout shift where practical.
- Do not display fabricated counts while loading.

## 7.4 Error state

- Localized Vietnamese and English message.
- Concise explanation that current data could not be loaded.
- Retry behavior only if it can safely re-run the server request through an existing pattern.
- Do not expose raw Google errors, stack traces, signed URLs, or parser internals.
- Do not display a misleading empty state for a source failure.

## 7.5 Empty state

Distinguish:
- Dataset is valid but contains zero records.
- Search/filter combination returns zero results.

For zero search results:
- Explain that no listings match the current criteria.
- Offer Clear All.
- Keep the active filter state visible.
- Do not invent alternative listings.

## 7.6 Locale behavior

- Route and navigation must respect the existing locale-aware routing.
- Default locale must be `vi`.
- English UI labels must not translate workbook source values.
- Locale switch must preserve the current Explore query/filter state where practical.
- Metadata/title/description should be localized.
- Add translation keys to both `vi` and `en` message files following the repository's namespace conventions.

---

# 8. Product Decisions to Verify Before Coding

The following are not fully specified in the confirmed product record. Codex must inspect the repository and existing approved docs before deciding.

| Topic | Confirmed | Implementation guidance |
|---|---|---|
| Explore default view | Grid | Implement Grid as default |
| Status default | All | Implement All |
| Page size | 24 | Implement 24 |
| Search fields | Name, address, category | Implement confirmed fields |
| Search normalization | Case/accent-insensitive | Implement and test |
| Filter dimensions | Category, source category, area, rating, status, suitable-for, best time | Implement using normalized fields |
| Filter combination | AND across dimensions | Implement |
| Multiple values in one dimension | OR | Implement |
| URL state | Basic filters | Implement typed URL state |
| Views | Grid default; Grid/List/Table discussed | Implement all three if no more specific approved scope conflicts |
| Rating thresholds | Rating filter confirmed; exact thresholds unresolved | Use minimal proposal and document/seek approval if needed |
| Sort menu | Name/rating discussed as proposal | Do not add broad ranking; use source order plus simple approved options |
| Home sections | Editorial Home with discovery entry points discussed | Use the proposed composition in Section 3.1 without inventing business data |
| Featured listing selection | No confirmed ranking rule | Omit unless a real approved source exists |
| Place Detail | Not in Phase 04 | Do not add |
| Map | Simple direction confirmed product-wide | No map UI in Phase 04 |

If an unresolved decision is genuinely blocking:
- Ask one concise question to the user before implementing that specific behavior, or
- Implement the unaffected parts and mark the affected feature BLOCKED.
Do not silently turn assistant suggestions into historical user decisions.

---

# 9. SEO and Navigation

- Follow existing localized metadata patterns.
- Home and Explore titles/descriptions must be localized.
- Use semantic canonical URLs consistent with the repository's locale strategy.
- Avoid indexing every arbitrary filter combination if the existing SEO policy does not support it.
- Do not create a sitemap expansion for listing details; Place Detail is out of scope.
- Use locale-aware internal links.
- Search and filter URLs should be shareable, but metadata should not claim every query variant is a distinct indexable landing page.

---

# 10. Testing Strategy

Follow the repository's Vitest, Testing Library, and component-test conventions. Use existing dependencies. Do not add a testing dependency without approval.

## 10.1 Pure utility tests

Test:
- Vietnamese accent-insensitive normalization.
- `đ` / `Đ` normalization.
- Case-insensitive search.
- Search across name, address, and category.
- Search does not mutate source strings.
- AND semantics across filter dimensions.
- OR semantics within multi-select dimensions.
- Canonical area filtering uses `areaId` / `areaName`, never `sourceArea`.
- Status All includes every normalized status.
- Rating null is excluded when a rating threshold is active.
- Suitable-for and recommended-time filtering use visit-profile fields only.
- Stable sorting and tie-breaking.
- Price text is not numerically sorted or filtered.
- Pagination with 0, 1, 24, 25, and multiple-page result counts.
- Invalid page values and out-of-range pages.
- Filter changes reset page to 1.
- Clear All resets filters and restores defaults.
- URL parser/serializer round-trip.
- Invalid query parameters are ignored or normalized safely.
- Locale switching preserves query state where supported.

## 10.2 Component tests

Test:
- Home hero search navigates to Explore with `q`.
- Category cards link with the correct main category filter.
- Area cards link with the correct canonical area ID.
- Home KPI/category/area counts derive from supplied dataset.
- Editorial preview preserves source text.
- Grid/List/Table show the same filtered result set.
- Switching views preserves active filters and pagination state.
- Cards omit absent optional fields rather than showing fake values.
- Maps action appears only for valid non-null `mapsUrl`.
- Clear All works.
- Empty results show a clear action.
- Loading and error states are distinct.
- Keyboard access and accessible names for major controls.

## 10.3 Integration tests

Where the repository test architecture supports it:
- Render Home with a normalized dataset.
- Render Explore with URL search parameters.
- Verify filtering, sorting, and pagination against the Phase 02 type.
- Verify category and area links serialize correct URL values.
- Verify `vi` and `en` UI labels.
- Verify workbook source strings remain unchanged in both locales.
- Verify no Phase 02 parser or Phase 03 connector is imported by client-side entry points.

Automated tests must not call Google or any external network. Mock the server data function at the boundary.

## 10.4 Browser / visual verification

If a browser tool is available:
- Check Home and Explore at desktop, tablet, and mobile widths.
- Verify locale switching.
- Verify URL persistence after reload.
- Verify filters, clear all, view switching, and pagination.
- Inspect console/network errors.
- Verify loading, empty, and error states.

If browser access is unavailable, report NOT RUN. Do not claim visual verification.

---

# 11. Implementation Workflow and Task Breakdown

Maintain a checklist and update it as work progresses.

## Task 04.1 — Repository and prerequisite audit

- Inspect branch, working tree, instructions, and current route/module architecture.
- Read Phase 01–03 artifacts and actual execution reports.
- Verify actual Phase 02 and Phase 03 code.
- Verify data contract and source-to-dataset function.
- Confirm locale routing and design system.
- Report blockers before feature implementation.

## Task 04.2 — Product decision reconciliation

- Confirm Home/Explore scope.
- Record confirmed defaults and filter/search semantics.
- Identify unresolved rating threshold and sorting behavior.
- Inspect whether existing product docs specify these details.
- Ask only if an unresolved item blocks a specific feature.
- Do not expand scope.

## Task 04.3 — Data access and page composition

- Add the narrow server-side Home/Explore data loader using the real Phase 03 composition function.
- Preserve Phase 02 diagnostics.
- Handle source/parser failure separately from empty data.
- Keep workbook bytes and parser objects server-only.
- Do not add manual sync, persistent cache, or cooldown.

## Task 04.4 — Domain-derived selectors

- Build typed, pure selectors for category counts, area counts, status counts, and editorial preview.
- Derive all counts from current normalized data.
- Use canonical area fields.
- Preserve editorial source text.

## Task 04.5 — Home page

- Implement editorial hero and search entry.
- Implement category discovery.
- Implement area discovery.
- Implement derived summary metrics.
- Implement source-authentic editorial preview where data exists.
- Omit unsupported featured ranking.
- Add localized metadata.

## Task 04.6 — Explore state and utilities

- Implement search normalization.
- Implement typed URL state parser/serializer.
- Implement filters and AND/OR semantics.
- Implement approved sorting behavior.
- Implement pagination with 24 records per page.
- Ensure page reset and Clear All semantics.

## Task 04.7 — Explore UI

- Implement search and filters.
- Implement Grid/List/Table views.
- Implement result count and active-filter summary.
- Implement pagination.
- Implement loading, error, and empty states.
- Preserve filters across view changes.

## Task 04.8 — Localization, accessibility, responsive QA

- Add matching `vi` and `en` UI strings.
- Verify source workbook text remains untranslated.
- Check keyboard, focus, semantic markup, and table accessibility.
- Verify desktop/tablet/mobile layouts.
- Follow existing Storybook requirements only if components are changed and the repo requires stories.

## Task 04.9 — Tests and quality checks

- Add pure utility tests.
- Add component/integration tests.
- Run lint, format check, type check, tests, and build.
- Run browser checks if available.
- Inspect client/server module boundaries.

## Task 04.10 — Final review and report

- Review scope and architecture.
- Confirm no dependency changes.
- Report exact files, decisions, tests, and limitations.
- Mark each acceptance criterion with evidence.
- State readiness for the next phase without inventing its name/scope.

---

# 12. Explicit Non-goals

Do not implement in Phase 04:

- Place Detail page.
- Areas detail page.
- Map, geocoding, coordinates, map tiles, or location inference.
- Trip Ideas / itinerary detail page.
- Insights / analytics charts.
- Booking, reservations, contact enrichment, or phone verification.
- Image scraping, image search, image generation, or image enrichment.
- Numeric price filters, price slider, average price, or price sorting.
- Review counts or fabricated ratings.
- Automatic translation of workbook content.
- Merging duplicate listings across source sheets.
- Rewriting or sanitizing editorial meaning.
- Manual Update button.
- Manual update API endpoint.
- Cooldown/rate limiting.
- Persistent cache, cross-instance locking, or database.
- Cron, queue, worker, or background job.
- Google OAuth, service account, API key, or Drive SDK.
- Separate backend service.
- New dependency without explicit approval.
- Replacing the existing design system.
- Refactoring unrelated Health/Posts demo modules.
- Unrelated SEO or routing changes.

---

# 13. Security, Reliability, and Performance Requirements

- Workbook download and parsing remain server-only.
- Never expose XLSX bytes, parser objects, internal source errors, signed URLs, or credentials to the client.
- Treat workbook strings as untrusted plain text; do not render as HTML.
- Use React's normal text escaping; do not use `dangerouslySetInnerHTML` for workbook content.
- Validate URL parameters before using them.
- Do not let URL state trigger arbitrary external requests.
- Use only Phase 02 validated Maps links.
- Do not assume the workbook has images or coordinates.
- Keep data transformations deterministic.
- Avoid repeatedly scanning the full dataset for every card where a single selector/index can compute the required counts.
- Do not introduce global mutable state or a process-wide dataset cache.
- Do not hide source/parser failures as zero results.
- Do not silently show a stale or fabricated dataset.
- Do not over-fetch the workbook more than necessary within a single server request.
- Record the per-request fetch/parse performance trade-off for the later synchronization phase.

---

# 14. Acceptance Criteria — HOME-01 to HOME-18 and EXPLORE-01 to EXPLORE-30

Use PASS, PARTIAL, BLOCKED, or NOT APPLICABLE with evidence.

## Home

| ID | Acceptance criterion |
|---|---|
| HOME-01 | Home follows the existing App Router and `src/modules` conventions. |
| HOME-02 | Home uses the real Phase 02/03 server-side data pipeline. |
| HOME-03 | Home does not use fake production data or duplicate parser/connector logic. |
| HOME-04 | Home presents a localized editorial introduction and working Explore search entry. |
| HOME-05 | Main category links use the five stable category IDs. |
| HOME-06 | Area links use the eight canonical area IDs/names from Phase 02. |
| HOME-07 | KPI/category/area counts are derived from the current normalized dataset. |
| HOME-08 | Editorial preview preserves original workbook text and does not fabricate listing links. |
| HOME-09 | Unsupported featured/ranking content is omitted. |
| HOME-10 | Home has localized metadata and responsive desktop/tablet/mobile layouts. |
| HOME-11 | Home has distinct loading and source-error behavior; no fake empty fallback. |
| HOME-12 | Home is keyboard accessible and uses semantic structure. |

## Explore

| ID | Acceptance criterion |
|---|---|
| EXPLORE-01 | Explore uses the actual normalized Phase 02 data contract. |
| EXPLORE-02 | Grid is the default view. |
| EXPLORE-03 | Status All is the default and includes all normalized statuses. |
| EXPLORE-04 | Page size is exactly 24. |
| EXPLORE-05 | Search supports name, address, and category. |
| EXPLORE-06 | Search is case-insensitive and Vietnamese accent-insensitive, including `đ`/`Đ`. |
| EXPLORE-07 | Main-category filtering uses the five stable IDs. |
| EXPLORE-08 | Source-category options derive from normalized source values. |
| EXPLORE-09 | Area filtering uses canonical `areaId`/`areaName`, not `sourceArea`. |
| EXPLORE-10 | Rating filter uses numeric `rating` and preserves null semantics. |
| EXPLORE-11 | Status filtering uses normalized status only. |
| EXPLORE-12 | Suitable-for uses `visitProfile.suitableFor`. |
| EXPLORE-13 | Recommended-time uses `visitProfile.recommendedTime`. |
| EXPLORE-14 | Different filter dimensions combine with AND. |
| EXPLORE-15 | Multiple values within one dimension combine with OR. |
| EXPLORE-16 | Clear All resets filters/search and page while restoring defaults. |
| EXPLORE-17 | Basic search/filter state is represented in a validated shareable URL. |
| EXPLORE-18 | Grid/List/Table switching preserves result membership and active filters. |
| EXPLORE-19 | Sorting is deterministic and does not use price, distance, or invented popularity. |
| EXPLORE-20 | Pagination is correct, accessible, and resets to page 1 when filters/search/sort change. |
| EXPLORE-21 | Result count is computed after search/filtering. |
| EXPLORE-22 | Listing cards/rows/tables do not fabricate optional values, images, or review counts. |
| EXPLORE-23 | Maps CTA uses only the validated original `mapsUrl`. |
| EXPLORE-24 | Empty results are distinct from source/data-loading failures. |
| EXPLORE-25 | Loading, empty, and error states are localized in Vietnamese and English. |
| EXPLORE-26 | Workbook source values remain unchanged in both locales. |
| EXPLORE-27 | Explore is responsive and has no page-level horizontal overflow. |
| EXPLORE-28 | Controls, table, status labels, and pagination meet accessibility requirements. |
| EXPLORE-29 | Automated tests cover search, filters, URL state, views, pagination, and locale behavior without external network. |
| EXPLORE-30 | No Place Detail, map, sync UI, persistent cache, database, or unapproved dependency was added. |

Phase 04 cannot be marked fully complete if Phase 02/03 integration is unverified, production pages use fabricated data, the core Explore requirements are missing, or required quality checks have not been run.

---

# 15. Required Verification

Follow the checked-out repository's `AGENTS.md`. At minimum, run and inspect:

```bash
pnpm lint
pnpm format:check
pnpm type-check
pnpm test
pnpm build
```

Run Storybook build only if the repository requires it for changed components/stories.

If browser tooling is available, perform visual and interaction checks at desktop, tablet, and mobile sizes. Report NOT RUN if unavailable.

Do not suppress warnings or alter Biome rules to obtain a green result. Do not claim a command passed without inspecting its actual output.

---

# 16. Final Report Format

At completion, report:

1. **Phase status:** completed, partially completed, or blocked.
2. **Repository snapshot:** branch, commit SHA, working-tree status.
3. **Prerequisite status:** Phase 01, Phase 02, and Phase 03 implementation readiness.
4. **Product decisions:** confirmed decisions, proposals used, and unresolved items.
5. **Architecture:** actual route/module paths and server/client responsibilities.
6. **Data integration:** actual Phase 03 function and Phase 02 types reused.
7. **Home implementation:** sections, interactions, data sources, and omissions.
8. **Explore implementation:** search, filters, URL state, views, sort, pagination.
9. **Localization:** `vi`/`en` parity and confirmation that source content remains untranslated.
10. **Accessibility/responsive review:** actual checks performed.
11. **Files created/modified:** exact paths and purpose.
12. **Dependencies:** confirm whether any dependency/lockfile changed; no unapproved changes allowed.
13. **Tests:** commands and pass/fail counts.
14. **Quality checks:** lint, format, type-check, test, build, browser check results.
15. **Acceptance checklist:** HOME-01–HOME-12 and EXPLORE-01–EXPLORE-30 with evidence.
16. **Known limitations:** source access, data freshness, sort/rating decisions, and any blocked work.
17. **Next-phase readiness:** list remaining concerns without inventing the next phase's approved scope.

**End of Phase 04 Detailed Specification.**
