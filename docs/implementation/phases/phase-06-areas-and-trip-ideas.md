# Phase 06 --- Areas & Trip Ideas

## Codex Detailed Implementation Specification

**Project:** Da Nang Travel Discovery\
**Repository:**
https://github.com/PhanHoangQuocTu/nextjs-frontend-boilerplate\
**Target phase:** Phase 06 of 08\
**Scope:** Implement the Areas discovery experience and the Trip Ideas
editorial hub using the existing normalized workbook data.\
**Design direction:** Editorial\
**Locales:** Vietnamese (`vi`, default) and English (`en`)\
**Status:** Core source-data rules and content groupings are confirmed.
Public route placement and visual composition are candidate
implementation decisions to reconcile with the actual repository.

------------------------------------------------------------------------

# 0. Instructions for Codex

Treat this document as the authoritative Phase 06 scope, subject to the
repository's current `AGENTS.md`, `CLAUDE.md`, approved Phase 01--05
specifications, and actual implementation reports.

Implement **Areas and Trip Ideas only**. Do not expand this phase into
Insights/Analytics, booking, map exploration, an AI trip planner, or the
full synchronization workflow.

Before changing any file:

1.  Inspect the active branch, latest commit, `git status`, and working
    tree. Preserve all user changes.
2.  Read the complete root `AGENTS.md`, `CLAUDE.md`, and every
    applicable nested instruction file.
3.  Read the Phase 01 repository audit and architecture mapping.
4.  Read Phase 02 Data Foundation specification and actual execution
    report. Inspect the real normalized types for area metadata,
    listings, and editorial sections. Verify the parser and dataset
    builder expose these values.
5.  Read Phase 03 Google Drive Connector specification and actual
    execution report. Inspect the real server-only source connector and
    source-to-dataset function.
6.  Read Phase 04 Home & Explore specification and actual execution
    report. Inspect actual Home/Explore routes, canonical area
    links/filtering, shared server-side data loader, localization, and
    tests.
7.  Read Phase 05 Place Detail specification and actual execution
    report. Verify whether the actual Place Detail route exists and
    identify its exact route builder/navigation helper before adding any
    links to it.
8.  **Verify implementation readiness from source code.** A
    specification or generated prompt is not proof that a phase was
    implemented. Do not assume Phase 02--05 code exists merely because
    its documents exist.
9.  Verify route conventions, locale routing, metadata helpers, design
    tokens, UI primitives, Storybook patterns, data-loading boundaries,
    and test conventions from the checked-out repository.
10. Produce a concise repository-aware implementation plan before
    editing. Identify exact files/components to reuse and the smallest
    required changes.
11. Separate confirmed decisions from proposals. Do not convert an
    earlier assistant suggestion into an approved business rule.
12. Do not install, add, upgrade, remove, or change any dependency or
    lockfile without explicit user approval.
13. Do not commit, push, amend, rebase, rewrite Git history, or discard
    user changes.
14. Do not claim a command, test, build, browser check, accessibility
    check, or visual verification passed unless it was actually run and
    its output inspected.

## 0.1 Phase dependency gate

Phase 06 depends on:

-   Phase 01 --- Codebase Rules & Architecture Mapping.
-   Phase 02 --- Data Foundation, especially `LOC_THEO_KHU_VUC` area
    metadata and `TOP_PICKS_LICH_TRINH` editorial parsing.
-   Phase 03 --- Google Drive Connector and the shared source-to-dataset
    pipeline.
-   Phase 04 --- Home & Explore, especially the shared server-side
    dataset loader and canonical area filter.
-   Phase 05 --- Place Detail only for internal links from area listings
    or editorial entries to individual listing pages.

If a prerequisite is missing or incomplete:

-   Do not fabricate production data.
-   Do not duplicate the parser, workbook mapper, Google Drive
    connector, or data-loading pipeline.
-   Do not create a second incompatible `TravelListing`, area metadata,
    or editorial data type.
-   Do not recreate a Place Detail page inside an Area module.
-   Implement only sections that can be safely grounded in actual
    repository contracts.
-   If the Phase 05 route is missing, do not create a fake Place Detail
    URL. Keep the relevant source text/listing presentation usable and
    mark detail-link integration BLOCKED.
-   If Phase 02 does not expose area metadata or editorial content, do
    not reparse the workbook in a page or client component. Mark the
    affected surface BLOCKED and report the missing data contract.
-   Mark affected acceptance criteria BLOCKED with exact evidence.
-   Do not claim Phase 06 fully complete while the pages cannot consume
    the real normalized dataset.

------------------------------------------------------------------------

# 1. Roles and Quality Bar

Work as a coordinated senior product engineering team:

-   **Senior Next.js Engineer:** implement localized App Router pages
    and correct server/client boundaries.
-   **Senior Frontend Engineer:** build responsive Areas and Trip Ideas
    modules using existing components.
-   **Senior Product Designer:** preserve the Editorial visual direction
    and create clear information hierarchy.
-   **Senior TypeScript Engineer:** reuse actual Phase 02
    area/editorial/listing types; avoid duplicate models and unsafe
    casts.
-   **Senior Data Engineer:** use canonical area identity and computed
    counts; preserve source text.
-   **Senior i18n Engineer:** localize UI-only text in Vietnamese and
    English while leaving workbook content unchanged.
-   **Senior SEO Engineer:** implement metadata and canonical URL
    behavior through existing helpers.
-   **Senior Accessibility Reviewer:** ensure semantic structure,
    keyboard navigation, accessible labels, and responsive usability.
-   **Senior QA Engineer:** test all eight areas, computed counts,
    listing membership, editorial row groupings, raw-text preservation,
    exact links, locales, and data-source errors.
-   **Technical Lead:** keep the implementation minimal, reuse Phase
    02--05 contracts, and avoid unapproved scope.

Do not replace the design system, add a separate backend, introduce a
database, or add a new state-management layer.

------------------------------------------------------------------------

# 2. Agreed Eight-Phase Roadmap

  Phase    Scope
  -------- ------------------------------------
  01       Codebase Audit
  02       Data Foundation
  03       Google Drive Connector & Data Sync
  04       Home & Explore
  05       Place Detail
  **06**   **Areas & Trip Ideas**
  07       Insights & Analytics
  08       Integration, QA & Deployment

Phase 06 owns the dedicated Areas and Trip Ideas discovery experiences.
Phase 07 owns analytics. Keep these boundaries intact.

------------------------------------------------------------------------

# 3. Confirmed Product Context and Decisions

## 3.1 Product and operating model

Da Nang Travel Discovery is a bilingual travel discovery website for
tourism, sightseeing, nature, food, cafes, entertainment, accommodation,
and nearby destinations around Da Nang.

The product runs as one Next.js application: - Next.js frontend and
built-in server-side capabilities. - No separate backend service. - No
database. - Vercel is the intended deployment platform. - The public
Google Sheets workbook is the source of listing and editorial data. - An
external tracking process overwrites the workbook approximately once per
day. - The website consumes the latest available normalized dataset
through the existing Phase 02/03/04 pipeline.

Phase 06 must not create a new persistence or synchronization
architecture.

## 3.2 Localization

Confirmed: - UI locales: Vietnamese (`vi`) and English (`en`). - Default
locale: Vietnamese (`vi`). - Localization is UI-only. - Workbook source
content is not translated. - Area names, area descriptions, listing
names, listing fields, editorial titles, and editorial body text remain
exactly as supplied by the normalized source. - Locale switching uses
existing `next-intl` routing and navigation conventions. - Add UI
translation keys to both locales, following the existing message
namespace structure.

English UI must not machine-translate Vietnamese workbook content.

## 3.3 Visual direction

Confirmed: **Editorial**.

Use the existing design system and create: - Strong typographic
hierarchy. - Clear separation between area discovery and
itinerary/editorial content. - Warm, restrained palette consistent with
existing tokens. - Intentional whitespace and readable line lengths. -
Minimal borders and restrained status accents. - Responsive layouts that
work on desktop, tablet, and mobile. - Source-authentic text as the main
content rather than decorative stock imagery.

Do not introduce a new font, UI kit, theme system, or CSS framework
without approval.

## 3.4 Map behavior --- Simple (confirmed constraint)

The product-wide map direction is **Simple**. For Phase 06, the approved
map-related behavior is limited to existing, validated Google Maps links
on listing records.

Requirements: - Reuse each listing's validated `mapsUrl` from Phase
02. - Open the original link safely according to repository
conventions. - Do not synthesize a Maps URL from a name or address. - Do
not introduce map markers, geocoding, coordinates, route drawing, map
tiles, or an interactive in-app map. - Do not add a mapping/geospatial
dependency. - Do not imply that an area card represents a geographic
polygon or exact map boundary.

If an existing UI uses the term "Map", do not turn it into an
interactive map surface without a separate explicit approval. A Google
Maps link is an external navigation action, not a geocoded map feature.

## 3.5 Canonical areas --- confirmed

`LOC_THEO_KHU_VUC` is the authoritative source for canonical area
assignment.

Use the eight canonical IDs and exact Vietnamese names:

    Source order Area ID          Exact area name
  -------------- ---------------- -----------------
               1 `son-tra`        Sơn Trà
               2 `hai-chau`       Hải Châu
               3 `thanh-khe`      Thanh Khê
               4 `lien-chieu`     Liên Chiểu
               5 `ngu-hanh-son`   Ngũ Hành Sơn
               6 `cam-le`         Cẩm Lệ
               7 `hoa-vang`       Hòa Vang
               8 `near-da-nang`   Gần Đà Nẵng

Rules: - Use `areaId` and `areaName` from the normalized listing and
area metadata. - Preserve the exact Vietnamese `areaName`. - Do not
derive IDs through lossy Vietnamese accent stripping at runtime. - Use
the existing explicit mapping from Phase 02. - Do not use raw
detail-sheet `sourceArea` as canonical area. - Do not split a multi-area
`sourceArea` string. - Do not fuzzy-match area names. - Do not invent a
ninth area. - Listings with `areaId: unknown` do not belong to any of
the eight canonical Area detail pages. Preserve them in Explore
according to existing behavior.

The order above follows the source area metadata order. Do not reorder
areas by listing count, rating, popularity, or assistant preference.

## 3.6 Area metadata and count rules --- confirmed

Phase 02 maps the eight summary rows (LOC rows 4--11) into area metadata
containing: - `areaId` - exact `areaName` - source description/summary
text - reported source count, if retained for diagnostics

Rules: - Display the source description/summary verbatim. - Do not
rewrite, summarize, translate, or infer facts from it. - Do not treat
the workbook's reported area count as runtime truth. - Compute the
displayed listing count from the current normalized listings using exact
`areaId` equality. - Do not hardcode snapshot counts in production. - Do
not count `sourceArea` matches. - Do not count a listing in multiple
areas. - Do not include `areaId: unknown` in any canonical area's
count. - Use the same dataset snapshot for area metadata and computed
counts to avoid inconsistent totals.

The inspected workbook snapshot has these reported counts (diagnostic
baseline only): Sơn Trà 112, Hải Châu 154, Thanh Khê 29, Liên Chiểu 14,
Ngũ Hành Sơn 56, Cẩm Lệ 4, Hòa Vang 26, and Gần Đà Nẵng 37. **Never
hardcode these numbers as runtime counts.**

## 3.7 Listing presentation in Areas

For an Area detail page: - Show all normalized listings whose `areaId`
exactly matches the route area ID. - Preserve the listing records
separately, including same-name records from different source sheets. -
Do not merge duplicates. - Do not silently exclude `UNVERIFIED`,
`WARNING`, `CLOSED_BANNED`, or `UNKNOWN` statuses if the area ID is
canonical. Display the normalized status using the shared localized
badge/label. - Use existing listing cards/rows and existing
Explore/Place Detail components where possible. - Use `listing.id` for
any internal Place Detail link. - Use the exact validated `mapsUrl` for
any external Maps CTA. - Omit optional null fields gracefully. - Do not
create a new "top places" ranking, sort by rating, or label records
"best" unless an approved source/rule already exists. - If no explicit
area-specific sort is approved, preserve the existing normalized/source
order or reuse the default order from the shared Explore listing
selector. Document the actual choice. - Provide a locale-aware way to
browse all listings in Explore with the canonical area filter applied,
reusing Phase 04's existing URL/filter behavior.

## 3.8 Editorial content source --- confirmed

All public Trip Ideas content comes from the normalized Phase 02 parser
for `TOP_PICKS_LICH_TRINH`.

The exact source groupings are:

  Section                 Workbook rows   Expected entries
  --------------------- --------------- ------------------
  Quick Trip Ideas                 2--6                  5
  Top Picks groups                8--18                 11
  Three-day itinerary            20--22                  3
  Travel tips                    23--24                  2

Rules: - Each entry retains its exact source title and complete content
string. - Preserve wording, punctuation, symbols, line breaks, and
ordering. - Do not rewrite, summarize, sanitize, translate, or truncate
editorial prose. - Do not parse rating or price snippets into numeric
data. - Do not generate missing places, itinerary steps, costs, times,
or travel durations. - Do not use `TRANG BIA` as a source of public Trip
Ideas. - Do not expose workbook usage instructions in rows 26--31 as
public Trip Ideas. - The section heading rows are structural labels, not
extra editorial entries. - Use the actual Phase 02 editorial type and
parsed result. Do not reparse the XLSX in a page or Client Component.

### Quick Trip Ideas

Display the five source entries from rows 2--6. These are editorial
suggestions such as one-day, couple, family, Gen Z group, and
lower-budget ideas in the inspected snapshot. Do not create additional
audience segments or rewrite the source descriptions.

### Top Picks groups

Display the eleven source groups from rows 8--18.

The workbook content may contain ratings, prices, caveats, and multiple
place names in one text string. Treat the complete string as
source-authentic editorial text: - Do not recalculate the rankings. - Do
not parse a rating into a live listing rating. - Do not turn prices into
normalized price fields. - Do not silently remove uncertain/unverified
wording. - Do not imply that source editorial text is a live
guarantee. - Do not change the source order.

### Three-day itinerary

Display the three entries from rows 20--22 as Day 1, Day 2, and Day 3
according to their source titles.

Rules: - Preserve the complete source content for each day. - Day 3
contains source-authored alternatives; display them as written. - Do not
turn those alternatives into generated route options or a route
selector. - Do not calculate distance, travel time, route order, or
total cost. - Do not create map routes or navigation directions. - Do
not create extra itinerary days.

### Travel tips

Display the two source entries from rows 23--24: - Preserve the exact
title and complete text. - Do not update the prices or transport advice
from web sources. - Do not convert the values into calculated budget
tiers. - Do not translate source text in English UI.

## 3.9 Editorial-to-listing links --- exact and unambiguous only

The user-approved rule is exact/unambiguous matching only.

Requirements: - Prefer an explicit `listingId`/supported relationship
already exposed by the actual Phase 02 data contract. - If the actual
normalized data does not expose a reliable editorial-to-listing
reference, display the editorial text without a CTA. - If an existing
exact-match helper is used, it must resolve to exactly one normalized
listing ID. Duplicate same-name listings must not be linked by name
alone. - Never use fuzzy matching, partial-name matching,
transliteration, substring guesses, or AI extraction. - Do not create a
link to an Area page merely because an area name appears in prose. - Do
not create a link to a Place Detail route that has not been verified in
the actual repository. - Do not mutate or split the source text just to
create a link. - A missing or ambiguous relationship is not an error:
render the original editorial text without a fabricated link.

## 3.10 No AI trip planner --- confirmed exclusion

Do not implement: - AI-generated itinerary suggestions. - Personalized
itinerary generation. - User preference questionnaires. - Automatic
route optimization. - Automatic place selection. - Budget calculators. -
Day-by-day scheduling tools. - Weather-aware itinerary changes. -
Real-time traffic or availability. - Chat-based trip planning. - User
accounts, saved trips, or favorites.

Phase 06 is a source-authentic editorial discovery experience, not a
trip-planning engine.

------------------------------------------------------------------------

# 4. Phase 06 Scope

## 4.1 In scope

### Areas

1.  Localized Areas index page.
2.  Eight canonical area cards using actual area metadata.
3.  Runtime listing counts computed from normalized listing records.
4.  Localized Area detail pages for the eight canonical `areaId` values.
5.  Verbatim source description/summary on Area detail pages.
6.  Listing collection filtered by exact canonical `areaId`.
7.  Shared status, rating, price, and Maps presentation only where
    existing components support it.
8.  Internal Place Detail links only when the real Phase 05 route
    exists.
9.  Explore link with canonical area filter applied, reusing Phase 04
    behavior.
10. Localized not-found and data-source error behavior.

### Trip Ideas

1.  Localized Trip Ideas editorial hub.
2.  Five Quick Trip Ideas entries.
3.  Eleven Top Picks groups.
4.  Three-day itinerary with exactly three source day entries.
5.  Two Travel Tips entries.
6.  Exact source title/body rendering.
7.  Exact and unambiguous listing links only when supported by the
    actual data contract.
8.  Localized metadata.
9.  Responsive editorial presentation and accessibility.

### Shared

1.  Reuse the shared server-side normalized dataset loader.
2.  Reuse Phase 02 area/editorial types.
3.  Reuse Phase 04 listing selectors and Phase 05 detail route helpers
    where present.
4.  Add `vi` and `en` UI translation keys.
5.  Add automated tests and perform required quality checks.

## 4.2 Out of scope

-   Insights and Analytics (Phase 07).
-   Full Integration, QA & Deployment (Phase 08).
-   AI or automatic trip planner.
-   User personalization, accounts, saved trips, or favorites.
-   Route optimization, directions, geocoding, coordinates, or distance
    calculations.
-   In-app interactive maps, map tiles, pins, markers, polygons, or
    clustering.
-   New mapping/geospatial dependencies.
-   External data enrichment or web research for place details.
-   Live weather, traffic, opening hours, prices, or availability.
-   Booking, reservations, ticket purchasing, or payments.
-   Listing photos, image scraping, stock imagery, or AI-generated place
    imagery.
-   New editorial content not present in the workbook.
-   New recommendations or ranking algorithms.
-   Fuzzy/heuristic editorial-to-listing matching.
-   Rewriting, translating, truncating, or summarizing workbook content.
-   Rebuilding the Google Sheets connector or parser.
-   Database, Redis, KV, or separate backend.
-   Manual sync/update, cooldown, rate limiting, or persistent cache
    changes.
-   New dependencies without explicit approval.
-   Unrelated refactors or cleanup.

------------------------------------------------------------------------

# 5. Route and Module Mapping

## 5.1 Candidate public routes

The following route paths are **implementation candidates**, not claims
about existing repository routes:

  -----------------------------------------------------------------------
  Surface                 Candidate route         Purpose
  ----------------------- ----------------------- -----------------------
  Areas index             `/areas`                Discover the eight
                                                  canonical areas

  Area detail             `/areas/[areaId]`       Show source area
                                                  description and
                                                  matching listings

  Trip Ideas              `/trip-ideas`           Show Quick Ideas, Top
                                                  Picks, three-day
                                                  itinerary, and Travel
                                                  Tips
  -----------------------------------------------------------------------

Before implementing: - Inspect Phase 01 route mapping and the actual
Phase 04/05 route tree. - Respect the existing `src/app/[locale]` and
`next-intl` conventions. - Use locale-aware `Link`, `useRouter`, and
navigation helpers from the repository. - Adapt the physical file
path/module placement if the repository uses a different route group. -
Record the final public route paths in the implementation plan and final
report. - Do not create a second routing convention.

## 5.2 No per-entry Trip Idea route by default

The approved source contract defines editorial entries by section,
title, and full content string. It does not establish a stable public ID
or an approved per-entry detail route.

Therefore: - Implement one complete `/trip-ideas` editorial hub by
default. - Display the full itinerary content on that page. - Do not
invent `/trip-ideas/[slug]` IDs from titles or row positions. - Do not
create separate dynamic pages for each Quick Idea or Top Picks group
unless the checked-out repository contains an already approved stable
editorial identity/route contract. - If a separate detail route appears
necessary, document it as a proposal and leave it out of implementation
pending approval.

## 5.3 Area route identity

-   Resolve area detail pages using the exact canonical `areaId`.
-   Accept only the eight IDs listed in Section 3.5.
-   Do not derive area IDs from display names at runtime.
-   Do not accept arbitrary unknown IDs as canonical areas.
-   Do not resolve an area by fuzzy name matching.
-   Use the exact metadata record and exact `listing.areaId` equality.
-   If the dataset loads successfully but the area ID is not one of the
    eight canonical IDs, use the localized not-found behavior.
-   If the dataset cannot load, show the established data-source error
    state; do not return a false 404.

------------------------------------------------------------------------

# 6. Areas Information Architecture

## 6.1 Areas index

Purpose: - Help visitors understand the eight canonical areas. - Let
visitors open an area and browse its matching normalized listings. -
Provide an alternative to starting from a category or free-text search.

Recommended page hierarchy:

1.  Breadcrumb or page context consistent with the site.
2.  Localized page title and concise UI description.
3.  Eight canonical area cards in source order.
4.  Each card displays:
    -   Exact `areaName`.
    -   Computed runtime listing count.
    -   Source description/summary only if the layout can display it
        without rewriting/truncating it.
    -   A clear link to the matching Area detail route.
5.  Optional simple footer navigation to Explore if an existing pattern
    supports it.

Rules: - Do not add a map or geocoding to the Areas index. - Do not add
area images. - Do not invent a geographic shape, map pin, or area
boundary. - Do not show the stale/reported source count as the actual
count. - Do not sort by count, rating, or popularity. - Do not hide
areas with low counts. - All eight canonical areas should remain visible
even when a computed count is zero. - If an area metadata record is
missing from a valid dataset, treat it as a data-integrity issue. Do not
silently invent a replacement description or record. - If a source
description is null, omit the description rather than fabricate one.

## 6.2 Area detail page

Purpose: - Explain the selected canonical area using source metadata. -
Show the listings assigned to that area. - Help visitors continue to
Explore or open an individual listing.

Recommended page hierarchy:

1.  Breadcrumb: Home → Areas → current area.
2.  Exact canonical `areaName` as `h1`.
3.  Source description/summary verbatim.
4.  Computed runtime listing count.
5.  Listing collection for exact `areaId`.
6.  A locale-aware "Browse all in Explore" link that applies the
    canonical area filter using Phase 04's existing behavior.

Listing collection rules: - Include all records with exact
`listing.areaId === routeAreaId`. - Preserve source order or use the
existing approved Explore selector order. - Do not add a new sort by
rating or inferred popularity. - Keep same-name listings from different
source sheets separate. - Display normalized status using existing
localized status labels. - Display rating only if valid and present. -
Display price text verbatim if present. - Display Maps CTA only when
validated `mapsUrl` is present. - Use exact `listing.id` for Place
Detail links if Phase 05's real route exists. - Do not show source
sheet, source key, raw source area, or internal diagnostics to
visitors. - Do not fabricate missing address, opening hours, highlights,
images, or review counts. - Do not add a "Top places in this area"
ranking.

If no listings belong to an area: - Keep the Area page valid. - Show a
localized empty state. - Offer the canonical Explore area-filter link. -
Do not hide the area.

## 6.3 Area description and source content

-   Render the exact source description/summary from Phase 02 area
    metadata.
-   Do not rewrite, summarize, translate, sanitize, or re-order the
    source prose.
-   Do not parse named-place/rating snippets into separate
    recommendations.
-   Do not transform embedded star/price snippets into UI badges.
-   Do not infer travel time, distance, or safety.
-   Preserve punctuation, symbols, and source wording.
-   Use safe plain-text rendering; never use `dangerouslySetInnerHTML`.

## 6.4 Maps actions

Where listing cards show a Maps action: - Use only validated
`listing.mapsUrl`. - Link to the exact original target. - Open safely in
a new tab according to repository conventions. - Omit the CTA when URL
is null/invalid. - Never synthesize a Maps URL. - No embedded map, pin,
marker, geocoding, or route drawing is allowed.

------------------------------------------------------------------------

# 7. Trip Ideas Information Architecture

## 7.1 Trip Ideas hub

Purpose: - Present the workbook's curated travel ideas and three-day
itinerary in a readable editorial experience. - Preserve the workbook as
the only source of public editorial content. - Help visitors scan the
different types of ideas without generating new recommendations.

Recommended page hierarchy:

1.  Breadcrumb or page context consistent with the site.
2.  Localized page title and concise UI description.
3.  Quick Trip Ideas.
4.  Top Picks groups.
5.  Three-day itinerary.
6.  Travel Tips.

Use the source section ordering exactly. Do not reorder by assistant
preference or inferred popularity.

## 7.2 Quick Trip Ideas

Render exactly the five entries parsed from workbook rows 2--6.

Each entry: - Shows its exact source title. - Shows its complete source
content string. - May use a restrained editorial card or list layout. -
Must not truncate the content. - Must not translate the title or body in
English UI. - Must not create new audience segments, day plans, or
budget descriptions. - Must not add an unsupported "plan this trip" CTA.

## 7.3 Top Picks groups

Render exactly the eleven groups parsed from rows 8--18.

Each group: - Shows exact source title. - Shows complete source body
text. - Preserves original ordering. - Does not recalculate or re-rank
listings. - Does not parse ratings/prices into structured listing
facts. - Does not imply review count, verification, availability, or
current price. - Does not remove source caveats or uncertainty text. -
Does not create an independent listing from an editorial entry.

The group heading and body remain separate source fields if the
normalized data contract exposes them separately.

## 7.4 Three-day itinerary

Render exactly the three entries parsed from rows 20--22.

Recommended presentation: - A simple Day 1 / Day 2 / Day 3 editorial
timeline or three vertically stacked day sections. - Use exact source
title as each day's heading. - Show the entire source body below it. -
Preserve arrows, punctuation, time references, costs, and caveats
exactly. - Day 3's source alternatives remain part of the same raw body
text. - Do not generate a route, map, distance, travel time, schedule,
or calculated total. - Do not turn source alternatives into a dynamic
option selector. - Do not add more days.

## 7.5 Travel Tips

Render exactly the two entries parsed from rows 23--24.

Each entry: - Shows exact source title and full content. - Remains in
source order. - Does not update or verify source prices/advice. - Does
not convert text into calculators, chips, or computed budget tiers. -
Does not translate source content.

## 7.6 Source freshness and editorial caveats

The workbook is overwritten by an external process. Use the same
normalized dataset freshness and error behavior as Home/Explore/Place
Detail.

Do not: - Fetch a second workbook copy for Trip Ideas. - Add a
page-specific cache. - claim source prices or schedules are
live-verified. - rewrite source content to make it appear current. -
supplement the content with web research. - infer the editorial update
date from `TRANG BIA`.

If the existing normalized dataset exposes a trustworthy
`fetchedAt`/source timestamp, use the established shared UI pattern only
if one exists. Do not create a new freshness timestamp or infer it from
workbook prose.

------------------------------------------------------------------------

# 8. Data Loading and Server/Client Architecture

## 8.1 Data source of truth

Use the actual existing pipeline:

`Public Google Sheets XLSX → Phase 03 server connector → Phase 02 parser/mapping/normalization → normalized dataset → shared Phase 04 server-side loader → Areas / Trip Ideas`

Do not recreate any part of this pipeline.

## 8.2 Server-side loading

Prefer Server Component pages that: 1. Resolve locale using repository
conventions. 2. Call the existing shared server-side dataset loader. 3.
Receive the normalized listings, area metadata, editorial content, and
diagnostics. 4. Resolve the exact canonical area or editorial sections.
5. Render server-side content.

Requirements: - Keep Google Sheets fetch, XLSX bytes, and parser objects
server-only. - Do not fetch workbook from the browser. - Do not send
parser objects or XLSX binary to Client Components. - Do not fetch the
full dataset through a same-origin API route from a Server Component
unless actual architecture requires it. - Do not add a second data
loader with different freshness/error behavior. - Do not add a public
API endpoint solely for Areas or Trip Ideas.

## 8.3 Error versus not found

  -----------------------------------------------------------------------
  Condition                           Required behavior
  ----------------------------------- -----------------------------------
  Dataset loaded; canonical area      Render Area page
  exists

  Dataset loaded; area ID is not one  Localized not-found
  of eight canonical IDs

  Dataset loaded; area has zero       Render area and localized empty
  listings                            state

  Dataset loaded; editorial sections  Render Trip Ideas hub
  are present

  Dataset loaded; required editorial  Established data-integrity/error
  contract is missing                 behavior; do not invent content

  Google Sheets fetch failed          Established localized data-source
                                      error

  XLSX parse/validation failed        Established localized data-source
                                      error

  Optional area description is null   Omit description

  Optional listing field is null      Omit field/section gracefully
  -----------------------------------------------------------------------

Never turn a connector or parser failure into a 404.

## 8.4 Caching and freshness

-   Reuse Phase 04's shared loader and its current cache behavior.
-   Do not add global mutable dataset caches.
-   Do not add a database, Redis, KV store, filesystem persistence, or
    cross-instance lock.
-   Do not add manual sync or cooldown in Phase 06.
-   Do not override cache settings locally without a documented reason.
-   Home, Explore, Place Detail, Areas, and Trip Ideas must not have
    conflicting freshness semantics.

## 8.5 Client Components

Prefer Server Components for: - Area index and detail pages. - Area
metadata and listing rendering. - Trip Ideas sections and editorial
text. - Metadata generation.

Use Client Components only for actual user interaction that cannot be
handled by navigation links or existing primitives. Do not add
client-side state management for static editorial content.

------------------------------------------------------------------------

# 9. Integration with Phase 04 and Phase 05

## 9.1 Home → Areas

If Home already has eight canonical area cards: - Preserve its existing
layout and discovery behavior. - Link each card to the matching Area
detail route when that route is implemented. - Do not duplicate area
metadata or compute counts in the Home component. - Do not change the
existing Explore filter behavior.

If the Phase 04 Home area section is not implemented, do not expand
Phase 06 into an unrelated Home redesign. Only add a minimal navigation
entry if the existing site navigation convention requires it and it is
in scope.

## 9.2 Explore → Areas

-   Existing canonical area filters must continue to use `areaId`.
-   Area detail's Explore CTA must reuse the same filter URL
    builder/state convention.
-   Do not create a new query parameter format.
-   Do not use `sourceArea`.

## 9.3 Area listings → Place Detail

-   Use exact normalized `listing.id`.
-   Use the verified Phase 05 route helper if it exists.
-   Keep external Maps action separate from internal detail navigation.
-   Do not link by listing name alone.
-   If Phase 05 is absent, do not invent a destination route. Keep
    listing names as text and mark integration BLOCKED.

## 9.4 Trip Ideas → Place Detail

-   Prefer explicit exact listing IDs/relationships already present in
    the normalized editorial contract.
-   If the data contract has no explicit relation, only use a verified
    exact-match mechanism that resolves exactly one record.
-   If same-name duplicates make the match ambiguous, render the
    editorial content without a listing link.
-   Do not parse arbitrary prose with fuzzy matching, substring guesses,
    transliteration, or AI.
-   Do not fabricate links to listings or areas.

## 9.5 Navigation

-   Use locale-aware internal navigation.
-   Preserve browser history naturally.
-   Do not create a custom `returnTo` parameter or a client-side
    navigation abstraction unless an established pattern already exists.
-   Breadcrumbs should use real supported routes only.

------------------------------------------------------------------------

# 10. Localization and Content Integrity

## 10.1 UI strings

Add localized UI strings for: - Areas page title and description. - Area
detail breadcrumb labels. - Area listing count label. - Explore
area-filter CTA. - Area empty state. - Area not-found state. - Trip
Ideas page title and description. - Quick Trip Ideas section title. -
Top Picks section title. - Three-day itinerary section title. - Day
labels if not already part of source titles. - Travel Tips section
title. - Navigation and error states. - Any status labels rendered on
listing cards, reusing existing shared translations.

Follow the existing message namespace and registry conventions. Add keys
to both `vi` and `en`; do not leave one locale incomplete.

## 10.2 Source content

These values remain source-authentic in both locales: - `areaName` -
area description/summary text - editorial entry titles - editorial entry
content strings - listing names and all existing listing source fields

Only UI labels surrounding them change by locale.

Never: - translate source content into English, - rewrite or summarize
the source, - change punctuation or symbols, - parse and rebuild source
text into new prose, - replace source text with external research, -
mutate normalized records to create a localized version.

Use React's normal escaped text rendering and CSS whitespace handling.
Do not use `dangerouslySetInnerHTML`.

------------------------------------------------------------------------

# 11. SEO and Metadata

Follow actual repository metadata and `next-intl` conventions.

Requirements: - Areas index receives localized title and description. -
Each Area detail page receives localized metadata using exact canonical
area name and source description only where appropriate. - Trip Ideas
receives localized title and neutral description. - Do not invent claims
such as "best", "top-rated", "hidden gems", "guaranteed", or "perfect
itinerary". - Do not use full editorial bodies as metadata
descriptions. - Use the existing `buildMetadata` helper and
`INDEXABLE_ROUTES` convention if present. - Add supported public routes
to sitemap/indexable route configuration only according to existing
repository SEO policy. - Respect locale alternates and canonical URL
behavior. - Do not make arbitrary query parameters part of canonical
URLs. - Do not invent per-entry sitemap pages when no per-entry route
exists.

------------------------------------------------------------------------

# 12. Security and Reliability

-   Treat workbook strings as untrusted plain text.
-   Use React's normal escaping.
-   Never use `dangerouslySetInnerHTML`.
-   Use only validated `mapsUrl` values.
-   Do not accept arbitrary external URLs from query parameters.
-   Do not leak stack traces, parser internals, source fetch URLs, or
    server diagnostics to the client.
-   Do not expose internal source keys or raw parser objects.
-   Do not perform user-controlled file reads or filesystem access.
-   Do not add credentials, API keys, OAuth, or service accounts.
-   Do not add external requests from the client.
-   Do not infer safety, open status, availability, popularity, or
    verification beyond normalized source data.

------------------------------------------------------------------------

# 13. Testing Strategy

Follow repository Vitest, Testing Library, and integration-test
conventions. Do not add dependencies without approval.

## 13.1 Area metadata tests

-   Exactly eight canonical area IDs are recognized.
-   Exact Vietnamese area names match the Phase 02 metadata.
-   Source order is preserved.
-   No ninth canonical area is invented.
-   `unknown` is not rendered as a canonical Area.
-   Area descriptions are preserved verbatim.
-   Null descriptions are omitted.
-   Reported source counts are not used as runtime counts.

## 13.2 Area count tests

-   Runtime count is computed from normalized listings using exact
    `areaId`.
-   Each listing is counted in at most one canonical area.
-   `sourceArea` is never used for counting.
-   Unknown-area listings are excluded from the eight canonical area
    counts.
-   Counts are not hardcoded to snapshot values.
-   All eight area cards render even when a computed count is zero.
-   Same-name duplicate listings remain separate records.

## 13.3 Area detail tests

-   Valid canonical `areaId` resolves the matching metadata.
-   Invalid/unknown `areaId` with a valid dataset uses localized
    not-found.
-   Source loading failure is not converted to not-found.
-   Listing membership uses exact `listing.areaId`.
-   All normalized statuses remain visible with correct status labels.
-   Listing names and source values remain unchanged.
-   Place Detail links use exact `listing.id` only when the route
    exists.
-   Maps CTA uses the exact validated `mapsUrl`.
-   Null Maps URL produces no CTA.
-   Explore CTA preserves canonical area filter semantics.
-   Zero-listing area renders a localized empty state.

## 13.4 Editorial content tests

-   Quick Trip Ideas contains the five expected source entries.
-   Top Picks contains the eleven expected source groups.
-   Three-day itinerary contains exactly three day entries.
-   Travel Tips contains exactly two entries.
-   Workbook instructions and cover-sheet prose are not rendered as
    public Trip Ideas.
-   Each title and body is rendered verbatim.
-   Source order is preserved.
-   Long content is not truncated or collapsed by default.
-   Ratings/prices embedded in source text are not parsed into numeric
    UI facts.
-   No generated editorial content is added.
-   No source text is translated in English locale.

## 13.5 Exact-link tests

-   An explicit supported listing ID is used unchanged.
-   Any exact-match helper resolves exactly one listing.
-   Duplicate same-name listings do not receive an ambiguous link.
-   Fuzzy/partial/substring/AI matching is not used.
-   If no supported relationship exists, content remains readable
    without a CTA.
-   No unverified Place Detail route is created.

## 13.6 Integration tests

-   Areas and Trip Ideas consume the same shared server-side dataset
    loader as Home/Explore/Place Detail.
-   Data-source failure uses the established error behavior.
-   Locale-aware routes work in both `vi` and `en`.
-   Metadata uses the correct area/editorial page context.
-   Home area cards link to Area detail only if that integration is part
    of the existing supported navigation.
-   Explore area filter remains compatible.
-   Area listing links work with the actual Phase 05 route if present.
-   Trip Ideas links obey exact/unambiguous matching.
-   Automated tests do not call Google Sheets or external networks.

## 13.7 Accessibility and responsive tests

-   One primary `h1` per page.
-   Breadcrumbs are semantic navigation with accessible labels.
-   Area cards and links have meaningful accessible names.
-   Listing status is not conveyed by color alone.
-   Keyboard focus is visible.
-   Long area descriptions and editorial content wrap safely.
-   Trip Ideas full content remains readable on mobile.
-   No horizontal page overflow at mobile widths.
-   Do not rely on hover-only controls.

## 13.8 Browser / visual verification

If browser tooling is available: - Verify Areas index with all eight
areas. - Verify one Area detail with many listings. - Verify one Area
detail with a small/zero listing count if available in the actual
dataset. - Verify all Trip Ideas sections and the three-day itinerary. -
Verify long source text. - Verify `vi` and `en` UI. - Verify desktop,
tablet, and mobile. - Inspect console and network errors.

If browser access is unavailable, report NOT RUN. Do not claim visual
verification.

------------------------------------------------------------------------

# 14. Implementation Workflow and Task Breakdown

Maintain a checklist and update it during implementation.

## Task 06.1 --- Repository and prerequisite audit

-   Inspect branch, working tree, instructions, and route architecture.
-   Read Phase 01--05 specifications and actual execution reports.
-   Verify Phase 02 area metadata and editorial data in source code.
-   Verify Phase 03 connector and shared data loader.
-   Verify Phase 04 Home/Explore canonical area filter.
-   Verify Phase 05 Place Detail route.
-   Record missing prerequisites before coding.

## Task 06.2 --- Product decision reconciliation

-   Preserve Editorial direction.
-   Preserve eight canonical areas and source order.
-   Preserve computed runtime counts.
-   Preserve Simple map behavior: validated Google Maps links only; no
    in-app map, markers, or geocoding.
-   Preserve Trip Ideas groupings and source text.
-   Preserve exact/unambiguous listing links only.
-   Preserve no-AI-planner exclusion.
-   Confirm route placement against actual `next-intl` architecture.
-   Do not create per-entry Trip Idea routes without an approved stable
    identity contract.

## Task 06.3 --- Data access

-   Reuse shared server-side dataset loader.
-   Reuse Phase 02 types for listings, area metadata, and editorial
    sections.
-   Keep source fetch/parser server-only.
-   Compute area counts from normalized listings.
-   Do not reparse workbook or add a cache.

## Task 06.4 --- Areas index

-   Build Areas module using actual `src/modules` conventions.
-   Render eight canonical area cards in source order.
-   Show exact area names.
-   Show computed counts.
-   Show source description only where it can be presented without
    rewriting.
-   Link each card to its canonical Area detail route.

## Task 06.5 --- Area detail

-   Resolve exact canonical area ID.
-   Render breadcrumb, heading, and source description.
-   Render computed count.
-   Render exact-area listing collection.
-   Reuse listing card/row components.
-   Link to Place Detail only if the verified route exists.
-   Add exact validated Maps links where available.
-   Add Explore filter CTA.
-   Add zero-listing and not-found states.

## Task 06.6 --- Trip Ideas

-   Build one Trip Ideas editorial hub.
-   Render five Quick Trip Ideas entries.
-   Render eleven Top Picks groups.
-   Render three itinerary days.
-   Render two Travel Tips entries.
-   Preserve full source title/body text.
-   Add exact/unambiguous listing links only if the actual data contract
    supports them.
-   Do not add a planner, optimizer, or per-entry route without
    approval.

## Task 06.7 --- Localization and metadata

-   Add `vi` and `en` UI strings.
-   Verify source content remains untranslated.
-   Add localized metadata using existing SEO helpers.
-   Update indexable route configuration only according to existing
    conventions.

## Task 06.8 --- Responsive and accessibility QA

-   Verify desktop/tablet/mobile.
-   Verify full editorial text.
-   Verify semantic structure, keyboard behavior, and focus.
-   Verify no fake map, imagery, or recommendations.

## Task 06.9 --- Tests and quality checks

-   Add area metadata/count/membership tests.
-   Add editorial group/raw-text tests.
-   Add exact-link tests.
-   Add locale/metadata/error tests.
-   Run lint, format, type-check, test, build, and Storybook build when
    component/story changes require it.

## Task 06.10 --- Final review and report

-   Review exact scope.
-   Confirm no dependency changes.
-   Report implementation and limitations.
-   Complete acceptance checklist.
-   State readiness for Phase 07 without starting it.

------------------------------------------------------------------------

# 15. Explicit Non-goals

Do not implement in Phase 06: - Insights or analytics charts. - AI trip
planning or personalized itineraries. - Automatic itinerary generation,
route optimization, or route scheduling. - Maps, markers, geocoding,
coordinates, map tiles, polygons, or directions. - Live weather,
traffic, opening hours, prices, availability, or booking. -
Reservations, ticketing, or payments. - Listing photos, image scraping,
stock imagery, or AI-generated place imagery. - New content not present
in the workbook. - Related-place recommendation algorithms. - New
ranking/sorting rules based on ratings or inferred popularity. - Fuzzy,
heuristic, substring, transliteration, or AI editorial matching. -
Translation, rewriting, truncation, or summarization of source text. -
Per-entry Trip Idea detail routes without approved stable identity. -
Rebuilding parser, connector, or normalized data contracts. - Database,
Redis, KV, or separate backend. - Manual sync/update, cooldown, rate
limiting, or persistent cache. - New dependencies without explicit
approval. - Unrelated refactors or cleanup. - Phase 07 or Phase 08 work.

------------------------------------------------------------------------

# 16. Acceptance Criteria --- AREA-01 to TRIP-24

Use `PASS`, `PARTIAL`, `BLOCKED`, or `NOT APPLICABLE` with evidence. Do
not mark PASS based on assumptions.

## Areas

  -----------------------------------------------------------------------
  ID                                  Acceptance criterion
  ----------------------------------- -----------------------------------
  AREA-01                             Phase 02 actual area metadata type
                                      and parser are verified in code.

  AREA-02                             Areas use `LOC_THEO_KHU_VUC` as the
                                      canonical source.

  AREA-03                             Exactly eight canonical area IDs
                                      and exact names are supported.

  AREA-04                             Area source order is preserved.

  AREA-05                             Area descriptions are rendered
                                      verbatim and are not translated or
                                      rewritten.

  AREA-06                             Runtime listing counts are computed
                                      from normalized records using exact
                                      `areaId`.

  AREA-07                             Workbook reported counts are not
                                      used as runtime counts.

  AREA-08                             `sourceArea` is never used as
                                      canonical assignment or count
                                      source.

  AREA-09                             `unknown` is not presented as a
                                      ninth canonical area.

  AREA-10                             Areas index renders all eight
                                      cards, including zero-count areas.

  AREA-11                             Area detail resolves by exact
                                      canonical `areaId`.

  AREA-12                             Area detail lists only records with
                                      exact matching `areaId`.

  AREA-13                             Same-name listings from different
                                      source sheets remain separate.

  AREA-14                             All normalized statuses remain
                                      visible and localized.

  AREA-15                             Optional listing fields are omitted
                                      gracefully; no fake data is
                                      rendered.

  AREA-16                             Maps CTA uses only the exact
                                      validated `mapsUrl`.

  AREA-17                             Explore CTA reuses canonical Phase
                                      04 area filter behavior.

  AREA-18                             Place Detail links use exact
                                      listing IDs and only a verified
                                      Phase 05 route.
  -----------------------------------------------------------------------

## Trip Ideas

  -----------------------------------------------------------------------
  ID                                  Acceptance criterion
  ----------------------------------- -----------------------------------
  TRIP-01                             Phase 02 actual editorial type and
                                      parsed data are verified in code.

  TRIP-02                             Trip Ideas consumes the shared
                                      normalized dataset; no workbook
                                      parsing occurs in UI.

  TRIP-03                             Exactly five Quick Trip Ideas
                                      entries are rendered.

  TRIP-04                             Exactly eleven Top Picks groups are
                                      rendered.

  TRIP-05                             Exactly three itinerary day entries
                                      are rendered.

  TRIP-06                             Exactly two Travel Tips entries are
                                      rendered.

  TRIP-07                             Workbook instructions and
                                      cover-sheet prose are excluded from
                                      public Trip Ideas.

  TRIP-08                             Every editorial title and body is
                                      rendered verbatim.

  TRIP-09                             Source order is preserved in every
                                      section.

  TRIP-10                             Editorial source text remains
                                      Vietnamese in both UI locales.

  TRIP-11                             Embedded rating/price strings are
                                      not parsed into numeric facts.

  TRIP-12                             Day 3 alternatives remain source
                                      text and are not transformed into
                                      generated route options.

  TRIP-13                             No editorial entries or itinerary
                                      content are fabricated.

  TRIP-14                             Listing links are created only from
                                      explicit/exact, unambiguous
                                      relationships.

  TRIP-15                             Duplicate or ambiguous listing
                                      identities do not receive a guessed
                                      link.

  TRIP-16                             No AI planner, route optimizer,
                                      budget calculator, or personalized
                                      trip generator is added.

  TRIP-17                             No per-entry detail route is
                                      invented without an approved stable
                                      identity contract.
  -----------------------------------------------------------------------

## Shared integration and quality

  -----------------------------------------------------------------------
  ID                                  Acceptance criterion
  ----------------------------------- -----------------------------------
  SHARED-01                           Areas and Trip Ideas reuse the
                                      shared server-side data loader and
                                      freshness behavior.

  SHARED-02                           Data-source failure is distinct
                                      from unknown Area ID/not-found.

  SHARED-03                           `vi` and `en` UI strings are
                                      complete and registered through
                                      repository conventions.

  SHARED-04                           Localized metadata follows existing
                                      SEO/canonical conventions.

  SHARED-05                           Pages are responsive, semantic,
                                      accessible, and have no horizontal
                                      overflow.

  SHARED-06                           Tests cover area
                                      metadata/counts/membership,
                                      editorial content, links, locales,
                                      errors, and navigation.

  SHARED-07                           No unapproved dependency, database,
                                      map system, sync feature, or
                                      out-of-scope feature is added.
  -----------------------------------------------------------------------

Phase 06 cannot be marked fully complete if area counts are hardcoded,
area assignment uses `sourceArea`, editorial content is
translated/rewritten, ambiguous listing links are fabricated, or the
pages cannot consume the actual normalized dataset.

------------------------------------------------------------------------

# 17. Required Verification

Follow the checked-out repository's `AGENTS.md`. For the current
boilerplate baseline, the documented checks are:

``` bash
pnpm lint
pnpm format:check
pnpm type-check
pnpm test
pnpm build
```

The repository instructions also require:

``` bash
pnpm build-storybook
```

when a component or Storybook story is changed. Every new component must
have a colocated Storybook story, following the actual repository
convention.

If repository scripts differ from the above, use the exact current
scripts and explain the difference.

If browser tooling is available, perform visual/interaction checks at
desktop, tablet, and mobile sizes. Report NOT RUN if unavailable.

Do not suppress warnings, loosen TypeScript, disable lint rules, or
alter Biome configuration to obtain a green result. The repository's
stated definition of done requires zero errors and zero warnings.

------------------------------------------------------------------------

# 18. Final Report Format

At completion, report:

1.  **Phase status:** completed, partially completed, or blocked.
2.  **Repository snapshot:** branch, commit SHA, working-tree status.
3.  **Prerequisite readiness:** Phase 01--05 implementation status based
    on actual code.
4.  **Product decisions:** canonical area source, Simple map boundary,
    Trip Ideas groupings, raw-content rule, exact-link rule, and
    no-AI-planner exclusion.
5.  **Architecture:** actual route paths, module paths, shared data
    loader, and server/client responsibilities.
6.  **Areas:** eight cards, source order, exact metadata, computed
    counts, area membership, Explore link.
7.  **Trip Ideas:** actual rendered entry counts and sections.
8.  **Source integrity:** evidence that area descriptions, editorial
    titles, and editorial bodies remain unchanged in both locales.
9.  **Link behavior:** Maps links, Place Detail links, exact matching,
    and ambiguous-match handling.
10. **Localization:** `vi`/`en` UI parity and confirmation that workbook
    content remains untranslated.
11. **SEO:** metadata, canonical URLs, locale alternates,
    sitemap/indexable routes.
12. **Accessibility/responsive review:** actual checks performed.
13. **Files created/modified:** exact paths and purpose.
14. **Dependencies:** confirm whether any dependency/lockfile changed;
    no unapproved changes allowed.
15. **Tests and quality checks:** exact commands and actual outcomes.
16. **Acceptance checklist:** AREA-01--AREA-18, TRIP-01--TRIP-17,
    SHARED-01--SHARED-07 with evidence.
17. **Known limitations:** missing prerequisites, missing area/editorial
    data, unavailable Place Detail route, absent images, or unsupported
    links.
18. **Phase 07 readiness:** remaining dependencies for Insights &
    Analytics without starting it.

**End of Phase 06 Detailed Implementation Specification.**
