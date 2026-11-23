# Phase 07 --- Public Travel Insights & Analytics

## Codex Detailed Implementation Specification

**Project:** Da Nang Travel Discovery\
**Repository:**
https://github.com/PhanHoangQuocTu/nextjs-frontend-boilerplate\
**Target phase:** Phase 07 of 08\
**Audience:** Public visitors / travelers\
**Selected direction:** Option A --- Public Travel Insights\
**Design direction:** Editorial\
**Locales:** Vietnamese (`vi`, default) and English (`en`)\
**Data source:** Existing normalized dataset from the public Google
Drive XLSX workbook\
**Deployment:** Vercel\
**Status:** Public audience and core analytics scope are confirmed. The
exact repository integration points and prerequisite implementation
status must be verified from the checked-out code before implementation.

------------------------------------------------------------------------

# 0. Instructions for Codex

Treat this document as the authoritative Phase 07 scope, subject to the
current repository `AGENTS.md`, `CLAUDE.md`, approved Phase 01--06
specifications, actual implementation reports, and the checked-out
source code.

Implement **Public Travel Insights only**. This is a public-facing,
descriptive view of the normalized Da Nang travel-place dataset. It is
not an internal administration dashboard, an operational monitoring
screen, a user-behavior analytics product, or a recommendation engine.

## 0.1 Mandatory workflow

Before changing any file:

1.  Inspect the active branch, latest commit, `git status`, and complete
    working tree. Preserve all user changes.
2.  Read the complete root `AGENTS.md`, `CLAUDE.md`, and every
    applicable nested instruction file.
3.  Inspect the current `package.json`, lockfile, scripts, TypeScript
    configuration, Biome configuration, Vitest configuration, Storybook
    setup, and route structure.
4.  Read the approved Phase 01--06 specifications and all available
    execution reports.
5.  Verify the actual implementation of Phase 02--06 from source code. A
    specification, prompt, generated document, or previous assistant
    statement is not proof that a phase was implemented.
6.  Verify the real normalized listing type, category enum, area
    metadata, status enum, rating semantics, and source-to-dataset
    loader.
7.  Verify the actual Home/Explore, Place Detail, Areas, and Trip Ideas
    routes and their shared data-loading conventions.
8.  Verify the real locale routing, translation namespace registration,
    metadata helpers, sitemap conventions, design tokens, chart
    primitives, and test patterns.
9.  Produce a repository-aware implementation plan with exact file
    paths, dependencies, server/client boundaries, risks, and
    acceptance-criterion mapping.
10. **Stop after presenting the implementation plan and wait for
    explicit user approval before editing code.** Do not treat this
    document or the short execution prompt as approval to skip the
    plan-review gate.
11. Separate confirmed decisions, implementation recommendations, and
    unresolved questions. Do not silently turn a recommendation into a
    new business rule.
12. Do not install, add, upgrade, remove, or change any dependency or
    lockfile without explicit user approval.
13. Do not commit, push, amend, rebase, rewrite Git history, or discard
    user changes.
14. Do not claim a command, test, build, browser check, accessibility
    check, or visual verification passed unless it was actually run and
    its output inspected.

## 0.2 Dependency and prerequisite gate

Phase 07 depends on:

-   **Phase 01:** repository architecture, codebase rules,
    route/i18n/SEO/test conventions.
-   **Phase 02:** working normalized `TravelListing` contract, stable
    category IDs, canonical area IDs/names, status enum, numeric
    rating/null semantics, and deterministic mapping.
-   **Phase 03:** working server-only public XLSX connector and
    source-to-dataset composition function.
-   **Phase 04:** shared server-side dataset loader and verified Explore
    URL filter contract.
-   **Phase 05:** actual Place Detail route and route helper, only if
    top-rated entries link to detail pages.
-   **Phase 06:** actual Areas/Trip Ideas pages are not a data
    dependency for calculating Insights, but navigation integration must
    use real routes only if Phase 06 is implemented.

If a prerequisite is missing or incomplete:

-   Do not fabricate production listings or chart data.
-   Do not reparse the workbook in a page or Client Component.
-   Do not duplicate the XLSX parser, Google Drive connector, mapper,
    validator, or shared data loader.
-   Do not create a second incompatible `TravelListing` type.
-   Do not build a fake detail route or fake Areas/Explore link.
-   Implement only independent, type-safe selector/presentation work
    that is genuinely supported by the existing code.
-   Mark blocked acceptance criteria with exact evidence and the missing
    prerequisite.
-   Do not declare Phase 07 complete while its page cannot consume the
    real normalized dataset.

------------------------------------------------------------------------

# 1. Roles and Quality Bar

Work as a coordinated senior product engineering team:

-   **Senior Product Analyst:** protect the selected public-insights
    audience and keep the page useful to travelers rather than
    administrators.
-   **Senior Data Analyst:** define every metric precisely, validate
    totals, prevent misleading interpretations, and distinguish source
    facts from derived summaries.
-   **Senior Data Engineer:** build deterministic selectors from the
    normalized dataset and preserve source identity, category, area,
    status, and rating semantics.
-   **Senior Next.js Engineer:** integrate the page into the existing
    App Router and use the shared server-side data loader.
-   **Senior Frontend Engineer:** build a responsive, accessible,
    editorial analytics experience using existing UI primitives.
-   **Senior Data Visualization Engineer:** reuse the installed Recharts
    version and existing chart primitives; choose chart forms that make
    comparisons easy.
-   **Senior Product Designer:** preserve the Editorial visual direction
    and avoid an admin-template appearance.
-   **Senior TypeScript Engineer:** use strict types, explicit metric
    contracts, and pure testable selectors; avoid `any` and unsafe
    casts.
-   **Senior i18n Engineer:** localize UI-only text in `vi` and `en`; do
    not translate workbook values.
-   **Senior SEO Engineer:** add localized metadata and public indexable
    route behavior using existing helpers.
-   **Senior Accessibility Reviewer:** provide chart alternatives,
    keyboard access, semantic labels, and responsive behavior.
-   **Senior QA Engineer:** test metric invariants, source-data edge
    cases, locale parity, navigation, loading/error/empty states, and
    chart rendering.
-   **Technical Lead:** keep the implementation small and reuse Phases
    01--06 without unrelated refactors.

Do not replace the design system, add a new charting library, add a new
state-management layer, create a separate backend, or introduce a
database.

------------------------------------------------------------------------

# 2. Confirmed Product Context and Decisions

## 2.1 Product and architecture

The product is **Da Nang Travel Discovery**, a bilingual public
travel-discovery website for sightseeing, nature, food, cafes,
entertainment, accommodation, and nearby destinations around Da Nang.

Preserve these decisions:

-   One Next.js application handles server and client processing.
-   No separate backend service.
-   No database.
-   Vercel is the intended deployment platform.
-   The Google Drive workbook is public (`Anyone` access).
-   The workbook is overwritten by an external tracking process
    approximately once per day; its completion time is unknown.
-   The website consumes the latest available normalized workbook
    dataset through the existing Phase 02/03/04 pipeline.
-   Workbook fetching, XLSX parsing, mapping, and normalization remain
    server-only.
-   Client Components receive only serializable, minimal data needed for
    their UI.
-   UI languages are Vietnamese and English (`vi` and `en`).
-   Vietnamese (`vi`) is the approved product default.
-   Localization is UI-only. Workbook values remain exactly as supplied.
-   Overall visual direction is **Editorial**.
-   The Explore default view remains Grid.
-   The Explore default status selection remains All.
-   The map direction remains Simple; Phase 07 does not add an in-app
    map.
-   Preserve separate listing records from different source sheets even
    when their names match.
-   Use canonical `areaId` / `areaName`, never raw `sourceArea`, for
    area analytics.
-   Keep the solution proportionate to one public workbook and one
    Next.js application.

## 2.2 Selected audience --- Option A

The user selected **A --- Public Travel Insights**.

The page is for public visitors who want to understand the range and
distribution of places in Da Nang. It should answer questions such as:

-   How many places are currently represented in the dataset?
-   Which main categories have the most listings?
-   How are listings distributed across the canonical areas?
-   What is the status distribution of the listed places?
-   How many listings have a numeric rating, and how are those ratings
    distributed?
-   Which listings have the highest recorded ratings?

It must not become an internal operator dashboard.

## 2.3 Previously agreed P1 analytics scope

The approved core scope carried forward from product planning is:

1.  Total listings.
2.  Main-category distribution.
3.  Canonical-area distribution.
4.  Listing-status distribution.
5.  Numeric-rating distribution.
6.  Top-rated listings.

Do not add average system-wide rating or average price.

## 2.4 Editorial direction

Use:

-   Strong typographic hierarchy.
-   Warm, restrained colors from existing theme tokens.
-   Clear content grouping.
-   Intentional whitespace.
-   Minimal borders.
-   Simple charts with readable labels.
-   Short explanatory copy.
-   Responsive layouts.
-   No dashboard-template clutter.
-   No decorative stock imagery or invented listing images.

Charts are supporting evidence, not decoration. The user should
understand each chart without needing to interact with it.

------------------------------------------------------------------------

# 3. Repository Baseline and Existing Capabilities

The public GitHub `main` branch was inspected during Phase 07 planning.
The observed baseline commit was:

`49d111f12cf8a1356f1d085cd47b7793f77ba9ef`

The observed repository is a Next.js 16 frontend boilerplate with no Da
Nang product modules in that baseline. Re-check the actual working
branch before implementation; do not assume it is unchanged.

The inspected `package.json` includes:

-   Next.js `^16.4.2`
-   React `19.3.1`
-   TypeScript `^7.0.2`
-   `next-intl` `^4.14.9`
-   Recharts `^3.10.1`
-   Vitest `^5.0.5`
-   Testing Library
-   Storybook `^10.6.2`
-   Biome `^2.5.15`

The repository already contains:

-   `src/components/ui/chart.tsx`
-   `src/components/ui/chart.stories.tsx`
-   Recharts-based `ChartContainer`, `ChartTooltip`, `ChartLegend`, and
    related wrappers.
-   Existing `src/constants/routes.ts` and `INDEXABLE_ROUTES`.
-   Existing `src/lib/seo.ts` and `buildMetadata`.
-   Existing `next-intl` routing and typed message registry.
-   Existing Storybook and Vitest conventions.

**Do not add another chart dependency.** Reuse the existing chart
component and Recharts version. Verify the checked-out working tree
because it may differ from the observed `main` snapshot.

Important repository observations from the inspected `main` baseline:

-   `AGENTS.md` says the repository is a boilerplate with no product
    features; `src/modules/Health` and `src/api/posts` are examples, not
    places to put travel logic.
-   New page-level modules belong in `src/modules`.
-   `src/app` pages should remain thin.
-   Prefer Server Components; use Client Components only when actual
    interaction or Recharts requires them.
-   Every new component requires a colocated Storybook story under the
    repository rules.
-   Every user-visible translation key must be present in both
    `src/messages/en` and `src/messages/vi`, registered through
    `src/messages/index.ts`.
-   Use `useTranslationsServer` for Server Components and
    `useTranslations` from `@/hooks` in Client Components.
-   Use locale-aware navigation from `@/i18n/navigation`.
-   Every public indexable page must be added to `INDEXABLE_ROUTES`.
-   Use `buildMetadata` from `src/lib/seo.ts`; do not hand-write partial
    Open Graph or alternates objects.
-   Use Biome, not ESLint or Prettier.

**Known locale baseline discrepancy:** the inspected `main` version had
`DEFAULT_LOCALE = 'en'` in `src/i18n/routing.ts`, while the approved
product default is `vi`. Verify whether an earlier implementation phase
has already corrected this. Do not silently change global locale routing
as an unrelated Phase 07 edit. If the mismatch remains, report it as a
product-wide prerequisite/gap and propose the smallest correction
separately for approval.

------------------------------------------------------------------------

# 4. Phase 07 Scope and Deliverables

Phase 07 owns one public product surface:

-   **Insights Index / Public Travel Insights page**

Candidate route:

-   `/insights`, localized through the existing `next-intl` routing
    behavior.

Candidate module:

-   `src/modules/Insights/` or the closest existing module convention
    found in the checked-out repository.

The exact path must be reconciled with the actual route structure. Do
not create a second route convention.

## 4.1 Page purpose

Provide a clear public overview of the normalized travel-place dataset.
This is descriptive analytics, not user tracking and not operational
monitoring.

## 4.2 Page sections

1.  Editorial page header and short explanation.
2.  Overview KPI strip.
3.  Main-category distribution.
4.  Canonical-area distribution.
5.  Listing-status distribution.
6.  Numeric-rating distribution and rating-coverage summary.
7.  Highest recorded ratings / top-rated listings.
8.  Short data-methodology note explaining what the numbers represent
    and what they do not represent.

The final implementation should remain compact. Do not create a separate
page for every chart.

------------------------------------------------------------------------

# 5. Analytics Data Contract and Metric Definitions

All metrics must be calculated from the **current normalized listing
dataset** at runtime. Snapshot counts below are regression-test
baselines only. They must never be hardcoded into production selectors,
UI components, chart configuration, or page copy.

## 5.1 Required normalized fields

Use the actual existing normalized type. The semantic fields needed by
Phase 07 are:

-   `id`
-   `name`
-   `mainCategory`
-   `areaId`
-   `areaName`
-   `status`
-   `rating`
-   `sourceSheet` only if needed for deterministic tie-breaking or
    diagnostics
-   `mapsUrl` only if a verified external Maps action is displayed

Do not create a second `TravelListing` type. Do not read raw workbook
cells in the Insights page.

## 5.2 Metric definitions

  ---------------------------------------------------------------------------------
  Metric                  Calculation                       Inclusion rules
  ----------------------- --------------------------------- -----------------------
  Total listings          `listings.length`                 All valid normalized
                                                            listing records, all
                                                            statuses, duplicates
                                                            preserved

  Active listings         Count where `status === ACTIVE`   Use normalized status
                                                            only

  Areas represented       Count distinct canonical `areaId` Exclude `unknown` from
                          values with at least one listing  this KPI; show unknown
                                                            separately in area
                                                            distribution if present

  Listings with rating    Count where `rating` is a valid   `null` is not zero
                          finite number from 0 through 5

  Rating coverage         `ratedCount / totalCount * 100`   If total is zero, show
                                                            an em dash /
                                                            unavailable state;
                                                            never render `NaN` or
                                                            `Infinity`

  Main-category           Count records by the five         Include all records;
  distribution            `mainCategory` IDs                show zero-count
                                                            categories where
                                                            appropriate

  Area distribution       Count records by canonical        Use canonical LOC
                          `areaId`                          mapping; never use
                                                            `sourceArea`

  Status distribution     Count records by normalized       Include every known
                          status enum                       status; do not hide
                                                            non-active records

  Rating distribution     Bucket valid numeric ratings only Null/non-numeric
                                                            ratings are excluded
                                                            from bins and counted
                                                            separately

  Top-rated listings      Sort eligible records by numeric  Exclude null ratings;
                          `rating` descending               preserve duplicate
                                                            records; show status
                                                            clearly
  ---------------------------------------------------------------------------------

## 5.3 Main categories

Use the five existing stable category IDs from Phase 02:

-   `sightseeing-nature`
-   `food-dining`
-   `cafe-checkin`
-   `entertainment`
-   `accommodation`

Use existing localized labels if already available. Otherwise add
UI-only translations for both locales. Do not infer a category from
listing names or notes.

Inspected workbook snapshot regression counts:

  Category                 Expected fixture count
  ---------------------- ------------------------
  `sightseeing-nature`                        102
  `food-dining`                               160
  `cafe-checkin`                               57
  `entertainment`                              62
  `accommodation`                              51
  **Total**                               **432**

## 5.4 Canonical areas

Use the eight canonical area IDs and exact source names from
`LOC_THEO_KHU_VUC`:

  Area ID          Exact area name
  ---------------- -----------------
  `son-tra`        Sơn Trà
  `hai-chau`       Hải Châu
  `thanh-khe`      Thanh Khê
  `lien-chieu`     Liên Chiểu
  `ngu-hanh-son`   Ngũ Hành Sơn
  `cam-le`         Cẩm Lệ
  `hoa-vang`       Hòa Vang
  `near-da-nang`   Gần Đà Nẵng

Rules:

-   `LOC_THEO_KHU_VUC` remains the canonical area source.
-   Count using `areaId` / `areaName`.
-   Do not split `sourceArea`.
-   Do not assign one listing to multiple areas because its raw source
    string mentions multiple areas.
-   Do not fuzzy-match area names.
-   Do not derive area IDs by accent stripping.
-   Preserve the canonical source order for labels where practical.
-   For chart comparison, descending count order is acceptable if ties
    are deterministic and the exact canonical identity remains intact.
-   If records have `areaId === 'unknown'`, include one separate
    localized "Unknown / Not assigned" row only when its count is
    greater than zero. Do not pretend it is a ninth canonical area.

Inspected workbook snapshot regression counts:

  Canonical area     Expected fixture count
  ---------------- ------------------------
  Hải Châu                              154
  Sơn Trà                               112
  Ngũ Hành Sơn                           56
  Gần Đà Nẵng                            37
  Thanh Khê                              29
  Hòa Vang                               26
  Liên Chiểu                             14
  Cẩm Lệ                                  4
  **Total**                         **432**

## 5.5 Listing statuses

Use the normalized Phase 02 status enum:

-   `ACTIVE`
-   `UNVERIFIED`
-   `WARNING`
-   `CLOSED_BANNED`
-   `UNKNOWN`

Use the existing bilingual status labels if available. Otherwise add
localized UI labels in both locales.

Rules:

-   Use normalized `status`; do not infer it from notes, price, rating,
    or name.
-   Include all statuses in the distribution.
-   Do not hide `UNVERIFIED`, `WARNING`, `CLOSED_BANNED`, or `UNKNOWN`.
-   Zero-count enum values may be displayed as zero so the status
    taxonomy remains understandable.
-   Never label all listings as verified or currently open.
-   Use text labels in addition to color; color alone must not
    communicate status.

Inspected workbook snapshot regression counts:

  Normalized status     Expected fixture count
  ------------------- ------------------------
  `ACTIVE`                                 387
  `UNVERIFIED`                              24
  `WARNING`                                 12
  `CLOSED_BANNED`                            9
  `UNKNOWN`                                  0
  **Total**                            **432**

## 5.6 Rating distribution

Use only normalized `rating`.

Rules:

-   Valid rating is finite and within 0--5.
-   `rating === null` means no usable numeric rating.
-   Never coerce null, blank, dash, `ĐÃ ĐÓNG`, or `CẤM` to zero.
-   Do not parse arbitrary text in the Insights module.
-   Do not invent review counts.
-   Do not calculate or display an average rating across the full
    dataset.
-   Do not imply that a rating is a verified review score or an
    objective quality guarantee.

Recommended fixed display buckets:

  UI bucket   Numeric interval
  ----------- ----------------------
  `0.0–2.9`   `0 <= rating < 3`
  `3.0–3.9`   `3 <= rating < 4`
  `4.0–4.4`   `4 <= rating < 4.5`
  `4.5–5.0`   `4.5 <= rating <= 5`

The four intervals are mutually exclusive and cover the valid 0--5
range. The chart denominator is the count of valid numeric ratings only.
Show the no-rating count separately, not as a zero-star bucket.

Inspected workbook snapshot regression baseline:

-   Total listings: 432.
-   Numeric ratings: 395.
-   Null/non-numeric ratings: 37.
-   Rating buckets: 0, 6, 294, and 95 respectively.

These figures are fixture assertions only. Live data may change after
the daily workbook overwrite.

## 5.7 Top-rated listings

This P1 section is a display of the **highest numeric ratings recorded
in the current workbook data**, not an endorsement or recommendation
guarantee.

Rules:

-   Exclude records with `rating === null`.
-   Sort by numeric rating descending.
-   Preserve separate records from different source sheets even when
    names match.
-   Do not merge or deduplicate by `name`.
-   Use stable deterministic tie ordering based on the normalized
    dataset's existing source order; use `id` only as a final
    deterministic fallback if needed.
-   Show the numeric rating and the listing's normalized status.
-   Do not show invented review counts.
-   Do not call these "best places", "verified places", "most popular
    places", or "recommended places".
-   Do not infer open-now status.
-   Link to Place Detail only when the real Phase 05 route and route
    helper are verified. Use exact `listing.id`, never name-based
    routing.
-   If a detail route is unavailable, render a readable non-linked
    row/card. A validated original `mapsUrl` may be a separate external
    action only if that behavior matches existing UI conventions.

Recommended presentation limit: show up to 10 records. This is a UI
density recommendation, not a new business ranking algorithm. Do not
invent a weighted score or tie-break based on popularity, review count,
or category. If the user-visible list is capped, retain deterministic
ordering and do not display misleading rank numbers.

Show a short note that ratings are source-provided values and listing
status remains visible.

------------------------------------------------------------------------

# 6. Explicit Metric Invariants

Create pure selectors and test the following invariants:

1.  Category counts sum to total listings.
2.  Status counts sum to total listings.
3.  Area counts sum to total listings when the unknown bucket is
    included.
4.  `ratedCount + noRatingCount === totalCount`.
5.  Rating bucket counts sum to `ratedCount`.
6.  No rating bucket includes a null, non-finite, or out-of-range
    rating.
7.  `activeCount <= totalCount`.
8.  `areasRepresented <= 8`.
9.  Duplicate names from different source sheets count as separate
    records.
10. Empty datasets return zero counts and safe unavailable percentage
    states.
11. No selector mutates the source listing array or listing objects.
12. All selectors are deterministic for the same normalized input.
13. No production metric depends on the workbook cover-sheet prose or
    reported summary counts.
14. No analytics selector reads `priceText`, `openingHoursText`,
    `notesText`, or raw `sourceArea` to infer a numeric fact.

If the actual normalized dataset exposes diagnostics, do not expose
internal diagnostics publicly as an analytics metric. Diagnostics may be
used in tests or server logs according to existing conventions.

------------------------------------------------------------------------

# 7. Page UI/UX Specification

## 7.1 Overall layout

Use one editorial page, not a multi-tab admin dashboard.

Recommended hierarchy:

1.  Page header / introduction.
2.  Compact KPI strip.
3.  Two-column chart area on desktop.
4.  Top-rated listings section.
5.  Small methodology/source note.

On tablet and mobile, collapse to a single readable column. Avoid
horizontal overflow.

## 7.2 Header

Vietnamese content direction:

-   Eyebrow: `DỮ LIỆU ĐÀ NẴNG`
-   H1: `Bức tranh du lịch Đà Nẵng`
-   Supporting copy: explain that the page summarizes places currently
    represented in the public travel dataset.

English UI should localize these UI strings, but workbook data must
remain untranslated.

Do not write unsupported claims such as "complete list", "all places in
Da Nang", "official statistics", "live popularity", or "verified
recommendations".

## 7.3 KPI strip

Recommended four summary cards:

1.  **Total listings** --- all normalized records.
2.  **Active listings** --- records with `status === ACTIVE`.
3.  **Areas represented** --- distinct canonical areas with at least one
    listing.
4.  **Rating coverage** --- rated count / total count, with count and
    percentage.

The KPI values must be calculated from the current normalized dataset.
If the dataset is empty, display zero or an unavailable state
consistently; never render `NaN`.

Avoid cards for static taxonomy totals if they add no meaningful
information. The category and area charts already communicate the
taxonomy.

## 7.4 Main-category chart

-   Use a horizontal bar chart.
-   Display all five configured main categories.
-   Show localized category labels and exact counts.
-   Prefer descending count order; use stable category order for ties.
-   Keep labels readable on mobile.
-   Provide an accessible textual equivalent or data list.
-   If the actual Explore route supports the corresponding category
    query parameter, the category label or bar may link/navigate to
    Explore with that filter. Verify the exact URL contract before
    adding this interaction.

## 7.5 Area chart

-   Use a horizontal bar chart because canonical area names vary in
    length.
-   Show all eight canonical areas, including zero-count areas if the
    page is describing the complete canonical taxonomy.
-   Add an unknown/unassigned row only when normalized records exist
    with `areaId === 'unknown'`.
-   Use canonical area IDs for navigation and grouping.
-   If the actual Explore route supports canonical area query state,
    allow a chart label or adjacent text link to open Explore filtered
    to that area.
-   Do not add a map, coordinates, geocoding, route lines, or map tiles.

## 7.6 Status chart

-   Show the five normalized status values.
-   A compact horizontal bar chart or simple donut chart may be used.
    Prefer the form that is easiest to read with the existing chart
    primitive and design tokens.
-   Every segment/bar must have a visible localized label and count.
-   Do not rely on color alone.
-   Include non-active statuses; do not suppress them.
-   A status chart is a description of workbook records, not live
    business verification.

## 7.7 Rating chart

-   Use the four fixed rating buckets from Section 5.6.
-   Show exact listing counts per bucket.
-   Display the number of listings without a numeric rating separately.
-   Make it clear that the bucket chart denominator is rated listings
    only.
-   Do not display an average rating.
-   Do not imply review counts or statistical confidence.

## 7.8 Top-rated section

-   Render up to 10 records using the exact selection and sorting rules
    in Section 5.7.
-   Keep the presentation compact and editorial: name, main category,
    canonical area when present, rating, and visible status.
-   Do not create an arbitrary featured image. The workbook has no
    listing-image field in the normalized contract.
-   Use existing text/icon treatment if a card needs a visual anchor.
-   Use exact detail links only when Phase 05 route integration is
    verified.
-   Display an appropriate empty state if no valid numeric ratings
    exist.

## 7.9 Methodology / source note

Add a small, unobtrusive note that explains:

-   Figures are calculated from the current normalized workbook dataset.
-   Category, area, and status totals are counts of listing records, not
    counts of unique real-world businesses.
-   Same-name records from different source sheets remain separate
    records.
-   Ratings are included only when the workbook contains a valid numeric
    value.
-   No average rating, price analytics, visitor count, or popularity
    data is calculated.

Do not expose internal sheet diagnostics, parser errors, connector
implementation details, or secrets.

------------------------------------------------------------------------

# 8. Visualization and Chart Implementation Rules

Use the repository's existing `src/components/ui/chart.tsx` and
installed Recharts version.

-   Do not add a chart library.
-   Do not replace the shared chart wrapper.
-   Inspect its actual API and Storybook story before use.
-   Reuse existing theme/chart CSS variables; do not hardcode a new
    color palette.
-   Use `ResponsiveContainer` through the existing `ChartContainer`.
-   Provide chart titles, descriptions, axis labels, tooltips, and
    visible values as appropriate.
-   Avoid 3D, animation-heavy charts, gradients, decorative gauges, and
    excessive legends.
-   Prefer horizontal bars for category and area comparisons.
-   Use a simple status visualization.
-   Use a simple rating histogram.
-   Avoid pie charts with too many small segments.
-   Ensure labels do not clip on mobile.
-   Ensure charts do not depend on hover alone; tooltips supplement
    visible labels and values.
-   Provide an accessible text/list/table equivalent for each chart,
    either adjacent or through a suitable semantic disclosure pattern
    that does not hide the only source of information.
-   Do not add a new chart configuration framework or generic
    visualization abstraction for a single page.

Recharts requires a Client Component boundary. Keep that boundary
narrow:

-   Compute metrics and aggregate arrays on the server.
-   Pass only small serializable chart DTOs to client chart components.
-   Do not pass the full workbook, XLSX bytes, parser objects, connector
    objects, diagnostics, or the full listing dataset to chart
    components.
-   Do not move the whole Insights page into `'use client'`.

------------------------------------------------------------------------

# 9. Navigation and Interactions

Keep Phase 07 interactions simple.

## 9.1 Navigation

-   Add a public navigation entry only if the existing global navigation
    structure and product information architecture support it.
-   Use the repository's locale-aware `Link` and navigation helpers.
-   Do not hand-build locale prefixes.
-   Do not create fake links to Areas, Explore, or Place Detail if those
    routes are absent.
-   If the Home page or global header already has a product navigation
    pattern, follow it.

## 9.2 Chart-to-Explore navigation

This is a recommended enhancement, not a required business rule.

If the real Phase 04 Explore page supports the relevant URL filters:

-   Main category → exact `category` filter.
-   Canonical area → exact `area` filter.
-   Status → exact `status` filter only if supported by the actual
    parser/serializer.

Do not invent query parameter names or route state. If the route
contract cannot be verified, keep charts informational and omit
chart-click navigation.

## 9.3 No filters or date controls

Do not add date-range filters, trend periods, custom report builders,
chart export, CSV download, or dashboard personalization. The source
contains the latest workbook snapshot, not a historical time series.

------------------------------------------------------------------------

# 10. Data Loading and Server/Client Architecture

## 10.1 Shared data source

Use the actual shared server-side dataset loader established by the
earlier phases.

Expected conceptual flow:

``` text
Public Google Drive XLSX
        |
        v
Phase 03 server-only connector
        |
        v
Phase 02 parser + mapper + validator
        |
        v
Normalized TravelListing[]
        |
        v
Existing Phase 04 shared server-side data loader
        |
        +-----------------------------+
        |                             |
        v                             v
Phase 07 server selectors       Minimal serializable DTOs
        |                             |
        v                             v
KPI + category/area/status/     Narrow Recharts Client
rating aggregates              Components
        |
        v
Server-rendered editorial page
```

This is a conceptual diagram. Verify actual names and paths in source
code before implementation.

## 10.2 Fetch once per page request

-   Load the normalized dataset once for the Insights page request.
-   Do not call the connector once per chart.
-   Do not independently fetch Google Sheets from Client Components.
-   Do not add a new API Route Handler solely to supply the page.
-   Do not add TanStack Query solely for static server-computed
    analytics.
-   Do not place the complete dataset in Zustand.
-   Do not add a global mutable cache, persistent cache, database, KV,
    Redis, queue, or worker.
-   Preserve Phase 03's source-fetch behavior and Phase 04's current
    latest-data behavior.
-   Do not introduce a new caching policy in Phase 07.

## 10.3 Pure selectors

Create a small analytics selector module in the existing travel
domain/module conventions.

Suggested conceptual functions (adapt names to the actual codebase):

-   `getInsightsOverview(listings)`
-   `getCategoryDistribution(listings)`
-   `getAreaDistribution(listings, areaMetadata)`
-   `getStatusDistribution(listings)`
-   `getRatingDistribution(listings)`
-   `getTopRatedListings(listings, limit)`

Requirements:

-   Pure functions.
-   Strict input/output types.
-   No network, filesystem, environment, or UI imports.
-   No source mutation.
-   Deterministic output.
-   Reuse existing enums and types.
-   Avoid an elaborate generic analytics engine.

## 10.4 Suggested view-model contracts

Use only the minimum types needed. Example semantic shapes:

``` ts
type DistributionItem = {
  id: string;
  label: string;
  count: number;
};

type RatingBucket = {
  id: string;
  labelKey: string;
  minInclusive: number;
  maxExclusive: number | null;
  count: number;
};

type InsightsOverview = {
  totalListings: number;
  activeListings: number;
  areasRepresented: number;
  ratedListings: number;
  unratedListings: number;
  ratingCoveragePercent: number | null;
};

type TopRatedListing = {
  id: string;
  name: string;
  mainCategory: MainCategory;
  areaId: AreaId;
  areaName: string | null;
  status: ListingStatus;
  rating: number;
};
```

These are semantic examples, not instructions to duplicate an existing
contract. Adapt to actual project type conventions. Do not serialize
`sourceKey`, parser details, diagnostics, or fields not needed by the
UI.

------------------------------------------------------------------------

# 11. Localization and Content Integrity

Supported UI locales:

-   Vietnamese (`vi`) --- approved default.
-   English (`en`).

Requirements:

-   Localize all page headings, descriptions, chart titles, chart
    labels, KPI labels, methodology text, status labels, rating bucket
    labels, empty/error states, tooltips, and navigation labels.
-   Add matching keys to both locale files.
-   Register any new namespace through `src/messages/index.ts`.
-   Follow the repository's typed message parity rules.
-   Use `useTranslationsServer` in Server Components and
    `useTranslations` from `@/hooks` in Client Components.
-   Use locale-aware navigation helpers from `@/i18n/navigation`.
-   Do not import `next-intl` translation hooks directly when
    `AGENTS.md` forbids it.
-   Do not machine-translate or rewrite workbook values.
-   Listing names and source content remain exactly as supplied by the
    workbook.
-   Category/status UI labels may be translated because they are UI
    taxonomy labels; raw `sourceCategory` values must remain
    source-authentic if displayed.
-   Canonical area names remain source-authentic Vietnamese in both
    locales unless the existing product contract already defines an
    explicit display label mapping. Do not silently translate the source
    field itself.

Verify locale parity with the repository's tests and type-check.

------------------------------------------------------------------------

# 12. SEO and Public Route

The selected audience is public. The Insights page should be publicly
accessible and indexable.

Candidate route:

-   `/insights` using existing localized routing.

Requirements:

-   Export `generateMetadata` through the established App Router
    pattern.
-   Use `buildMetadata({ locale, path, title, description })` from
    `src/lib/seo.ts`.
-   Add the route to `INDEXABLE_ROUTES` in `src/constants/routes.ts` if
    that is still the repository's active sitemap convention.
-   Use neutral, accurate metadata in both languages.
-   Do not use claims such as "official", "complete", "most popular", or
    "best".
-   Do not put source sheet names, IDs, internal diagnostics, or parser
    details in metadata.
-   Do not hand-write partial Open Graph or alternate-language metadata.
-   Do not add arbitrary query parameters to canonical URLs.
-   Do not make the route private or `noIndex` merely because it
    displays aggregates; it is the selected public product feature.
-   Verify the final canonical and locale alternate behavior from the
    actual routing implementation.

If the page cannot load the real dataset due to a blocked prerequisite,
preserve the correct route-level error behavior; do not render
fabricated analytics.

------------------------------------------------------------------------

# 13. Reliability, Error, and Empty States

Distinguish these states:

1.  **Successful dataset with records:** render all metrics.
2.  **Successful empty normalized dataset:** render zero/empty states
    with methodology copy; do not call it a source error.
3.  **Source fetch failure:** use the established localized data-source
    error behavior.
4.  **Workbook parse/validation failure:** use the established error
    behavior; do not silently display zero counts.
5.  **Missing optional fields:** omit or represent them according to the
    metric contract; do not coerce null to zero.
6.  **No numeric ratings:** show a localized empty rating state and zero
    rating coverage safely.
7.  **No top-rated entries:** show an appropriate empty state; do not
    fabricate examples.
8.  **Unknown area records:** include a separate unknown bucket if
    present; do not discard records from totals.

Do not add a new retry framework, monitoring framework, or elaborate
diagnostics UI.

------------------------------------------------------------------------

# 14. Security, Privacy, and Performance

-   The workbook is public, but secrets, API keys, credentials, and
    user-related private information remain private.
-   Keep connector, XLSX bytes, parser, and mapper server-only.
-   Do not expose source credentials or internal error details.
-   Do not add user tracking, personal profiling, account data, or
    private dashboards.
-   Do not log full workbook rows or sensitive environment values.
-   Do not accept user-provided URLs, IDs, or chart expressions.
-   Treat workbook text as untrusted plain text.
-   Use React's normal escaping; do not use `dangerouslySetInnerHTML`
    for workbook content.
-   Pass only compact aggregate DTOs to chart Client Components.
-   Avoid recomputing each metric independently with repeated full-array
    scans when one small selector pass can compute all summaries
    cleanly.
-   Do not introduce global mutable state.
-   Do not add a database or persistence layer.
-   Do not change the Phase 03 connector or sync behavior.
-   Do not create new environment variables or secrets.

------------------------------------------------------------------------

# 15. Explicit Non-goals

Do not implement any of the following in Phase 07:

-   Internal admin or content-management dashboard.
-   Authentication, user accounts, roles, or permissions.
-   User behavior analytics, page-view tracking, click tracking, or
    personal data collection.
-   Visitor counts, tourist counts, footfall, traffic, or demand.
-   Trending, popularity, social engagement, or recommendation
    algorithms.
-   Revenue, booking, reservation, ticket sales, or conversion
    analytics.
-   Average system-wide rating.
-   Average price, minimum/maximum price, price comparison, or numeric
    price analytics.
-   Numeric parsing of `priceText`.
-   Review counts or review sentiment.
-   Rating submission or user-generated reviews.
-   Time-series charts, growth rates, daily/weekly/monthly trends, or
    historical comparisons.
-   A date-range selector or custom analytics filters.
-   AI-generated insights or natural-language data analysis.
-   Map, geocoding, coordinates, route planning, heatmaps, or map
    dependencies.
-   Image scraping, stock imagery, or generated listing images.
-   CSV/PDF export or report builder.
-   Manual Update button, sync endpoint, cooldown, rate limiter, or
    cache redesign.
-   A new API endpoint solely for chart data.
-   A new database, Redis, KV, queue, worker, or separate backend.
-   New dependencies or lockfile changes without explicit user approval.
-   Replacing the existing design system or chart primitives.
-   Unrelated refactoring of Health, Posts, or boilerplate modules.
-   Phase 08 full integration, final release, or deployment execution.

------------------------------------------------------------------------

# 16. Test and Verification Strategy

Use the repository's existing Vitest + Testing Library setup. Automated
tests must use deterministic local fixtures and must not call Google
Sheets or external networks.

## 16.1 Unit tests --- analytics selectors

Test at least:

-   Total count includes all normalized records and all statuses.
-   Duplicate names from different source sheets remain separate
    records.
-   Category counts for all five categories.
-   Area counts use canonical `areaId`, not `sourceArea`.
-   Unknown area records are counted separately when present.
-   All five statuses are represented, including zero-count statuses.
-   Numeric ratings from 0 through 5 are included.
-   Null ratings are not treated as zero.
-   Non-finite and out-of-range values are excluded defensively if the
    selector receives them.
-   Rating buckets have correct inclusive/exclusive boundaries.
-   Rating buckets sum to rated count.
-   Rated + unrated equals total count.
-   Rating coverage calculation and zero-total behavior.
-   Top-rated sort order is descending.
-   Top-rated tie ordering is deterministic.
-   Top-rated list preserves same-name records from different sheets.
-   Top-rated list excludes null ratings.
-   Empty dataset behavior.
-   Selectors do not mutate the input array or records.
-   No division by zero, `NaN`, or `Infinity`.

## 16.2 Workbook fixture regression tests

Use the approved Phase 02 XLSX fixture only through the existing
parser/data-builder test path. Do not create a second parser.

Expected fixture baselines:

  Assertion                    Expected
  -------------------------- ----------
  Valid named listings              432
  Numeric ratings                   395
  Null/non-numeric ratings           37
  `sightseeing-nature`              102
  `food-dining`                     160
  `cafe-checkin`                     57
  `entertainment`                    62
  `accommodation`                    51
  Hải Châu                          154
  Sơn Trà                           112
  Ngũ Hành Sơn                       56
  Gần Đà Nẵng                        37
  Thanh Khê                          29
  Hòa Vang                           26
  Liên Chiểu                         14
  Cẩm Lệ                              4
  `ACTIVE`                          387
  `UNVERIFIED`                       24
  `WARNING`                          12
  `CLOSED_BANNED`                     9
  Rating `0.0–2.9`                    0
  Rating `3.0–3.9`                    6
  Rating `4.0–4.4`                  294
  Rating `4.5–5.0`                   95

These are regression assertions for the inspected workbook snapshot, not
production constants. If the fixture or parser contract differs in the
actual repository, report the difference and reconcile it rather than
silently changing expected values.

## 16.3 Component and integration tests

Test:

-   Each chart receives the correct aggregate DTO.
-   Chart labels and values are present in accessible text.
-   Empty chart states render correctly.
-   Top-rated cards show the exact source name, rating, category, area,
    and status when present.
-   Null optional fields do not create placeholder facts.
-   Place Detail links use exact IDs and only verified route helpers.
-   Chart-to-Explore navigation is added only if the existing URL
    contract supports it.
-   Both locales render equivalent UI structure and all translation
    keys.
-   Source workbook values remain untranslated.
-   Source error and empty-data states remain distinct.
-   Public page metadata and sitemap registration are correct.

Automated tests must not depend on live network access.

## 16.4 Accessibility and responsive checks

Verify:

-   One primary `h1`.
-   Semantic headings and sections.
-   Chart title and description association.
-   Text equivalents for every chart.
-   Keyboard access for any chart-linked navigation.
-   Visible focus states.
-   Status is not communicated by color alone.
-   Adequate contrast.
-   Tooltip information is not the only way to discover values.
-   No hover-only interaction.
-   No horizontal page overflow at mobile widths.
-   Chart labels and long Vietnamese text remain readable.
-   Desktop, tablet, and mobile layouts.

## 16.5 Required quality commands

Follow the checked-out repository's `AGENTS.md`. The observed baseline
requires:

``` bash
pnpm lint
pnpm format:check
pnpm type-check
pnpm test
pnpm build
```

If a component or Storybook story changes, also run:

``` bash
pnpm build-storybook
```

If scripts differ in the checked-out branch, use the actual scripts and
report the difference.

The repository's definition of done requires zero errors and zero
warnings. Do not suppress warnings, weaken TypeScript, disable lint
rules, or change Biome configuration to obtain a green result.

If browser tooling is available, verify the page in a real browser at
desktop, tablet, and mobile sizes. Inspect the browser console and
network requests. Report `NOT RUN` if browser verification is
unavailable.

------------------------------------------------------------------------

# 17. Implementation Workflow and Task Breakdown

Maintain a checklist and update it during implementation.

## Task 07.1 --- Repository and prerequisite audit

-   Inspect branch, commit, working tree, instructions, and route
    structure.
-   Read Phase 01--06 specifications and actual execution reports.
-   Verify actual Phase 02 normalized data types and
    rating/status/category/area fields.
-   Verify Phase 03 source-to-dataset function.
-   Verify Phase 04 shared server-side loader and Explore URL filter
    contract.
-   Verify Phase 05 detail route if top-rated items will link to it.
-   Verify Phase 06 routes only if navigation integration needs them.
-   Verify Recharts and `ChartContainer` in the current working tree.
-   Record gaps before editing.

## Task 07.2 --- Metric contract and selector plan

-   Map each approved metric to exact normalized fields.
-   Define exact output types.
-   Confirm category, area, status, and rating invariants.
-   Confirm rating bucket boundaries.
-   Confirm deterministic top-rated ordering.
-   Confirm unknown-area treatment.
-   Confirm no excluded analytics are introduced.
-   Present the metric mapping in the implementation plan.

## Task 07.3 --- Analytics selectors

-   Add a small pure selector module in the existing travel domain
    conventions.
-   Reuse actual normalized types and enums.
-   Calculate all counts dynamically.
-   Preserve duplicate listing identity.
-   Avoid price and source-text inference.
-   Add selector unit tests.

## Task 07.4 --- Public Insights route and server composition

-   Add the localized public route using existing App Router
    conventions.
-   Reuse the shared server-side data loader.
-   Load the dataset once per request.
-   Compute aggregate DTOs on the server.
-   Keep source connector and parser imports server-only.
-   Implement loading/error/empty behavior using existing patterns.

## Task 07.5 --- Editorial page and KPI strip

-   Build the page header.
-   Build compact KPI cards.
-   Add methodology note.
-   Use existing design tokens and UI primitives.
-   Add localized strings to both locales.

## Task 07.6 --- Charts

-   Reuse existing `ChartContainer` and Recharts.
-   Add category, area, status, and rating visualizations.
-   Keep chart Client Components narrow.
-   Pass only aggregate DTOs.
-   Add accessible text equivalents.
-   Add Storybook stories for every new component as required by
    `AGENTS.md`.

## Task 07.7 --- Top-rated listings

-   Implement deterministic rating-descending selector.
-   Preserve duplicate records.
-   Display normalized status.
-   Show up to the approved/recommended presentation limit.
-   Link only to verified Place Detail routes by exact ID.
-   Add tests for ties, null ratings, duplicates, and route behavior.

## Task 07.8 --- SEO, localization, navigation

-   Add localized metadata using `buildMetadata`.
-   Add `/insights` to `INDEXABLE_ROUTES` if consistent with the actual
    route convention.
-   Register translation namespace and ensure locale parity.
-   Add navigation entry only if the existing product navigation
    supports it.
-   Add chart-to-Explore links only if the existing URL filter contract
    supports them.
-   Do not silently change global locale defaults.

## Task 07.9 --- QA and quality gates

-   Run selector, component, and integration tests.
-   Verify metric invariants against the fixture.
-   Verify `vi` and `en`.
-   Verify accessibility and responsive behavior.
-   Run all required quality commands.
-   Verify no dependency or lockfile changes.
-   Inspect browser console and network behavior if browser tooling is
    available.

## Task 07.10 --- Final review and report

-   Review scope against the explicit non-goals.
-   Review data provenance and metric definitions.
-   Confirm no average rating or price analytics.
-   Confirm no user tracking or admin features.
-   Report exact files, test commands, results, and limitations.
-   Mark every acceptance criterion with evidence.
-   State readiness for Phase 08 without starting Phase 08.

------------------------------------------------------------------------

# 18. Acceptance Criteria --- INS-01 to INS-42

Use `PASS`, `PARTIAL`, `BLOCKED`, or `NOT APPLICABLE` with exact
evidence. Never mark an item PASS based on assumptions.

  -----------------------------------------------------------------------
  ID                                  Acceptance criterion
  ----------------------------------- -----------------------------------
  INS-01                              Active branch, commit, working
                                      tree, and repository instructions
                                      were inspected before editing.

  INS-02                              Phase 02--06 implementation
                                      readiness was verified from actual
                                      source code and reports.

  INS-03                              The actual normalized
                                      `TravelListing` type is reused; no
                                      duplicate domain type is
                                      introduced.

  INS-04                              The actual Phase 03/04 shared
                                      server-side data loader is reused.

  INS-05                              The Insights page loads the
                                      normalized dataset once per
                                      request.

  INS-06                              XLSX fetch, parsing, and
                                      normalization remain server-only.

  INS-07                              No separate backend, database,
                                      cache store, queue, worker, or new
                                      API endpoint is introduced.

  INS-08                              No new dependency or lockfile
                                      change is made without explicit
                                      approval.

  INS-09                              A public localized Insights route
                                      is implemented using actual App
                                      Router conventions.

  INS-10                              Public metadata and
                                      sitemap/indexable route behavior
                                      follow repository SEO helpers.

  INS-11                              Total listing count is dynamically
                                      derived from normalized records.

  INS-12                              Active listing count uses only
                                      `status === ACTIVE`.

  INS-13                              Areas represented are derived from
                                      distinct canonical area IDs,
                                      excluding `unknown` from the
                                      canonical KPI.

  INS-14                              Rating count and coverage use only
                                      valid numeric normalized ratings.

  INS-15                              Zero-total rating coverage does not
                                      render `NaN` or `Infinity`.

  INS-16                              All five main categories are
                                      represented in category
                                      distribution.

  INS-17                              Category counts sum to total
                                      listings.

  INS-18                              All eight canonical areas are
                                      represented in area distribution.

  INS-19                              Area distribution uses `areaId` /
                                      `areaName`, never `sourceArea`.

  INS-20                              Unknown-area records are shown
                                      separately when present and are not
                                      silently discarded.

  INS-21                              All five normalized statuses are
                                      represented in status distribution.

  INS-22                              Status counts sum to total
                                      listings.

  INS-23                              Non-active statuses are not hidden
                                      from public distribution.

  INS-24                              Rating distribution uses the
                                      defined non-overlapping numeric
                                      buckets.

  INS-25                              Null/non-numeric ratings are
                                      excluded from rating bins and
                                      counted separately.

  INS-26                              Rating bucket counts sum to rated
                                      listing count.

  INS-27                              No system-wide average rating is
                                      calculated or displayed.

  INS-28                              No price parsing, average price,
                                      price range, or price analytics are
                                      implemented.

  INS-29                              Top-rated listings exclude null
                                      ratings and sort numeric ratings
                                      descending.

  INS-30                              Same-name records from different
                                      source sheets remain distinct in
                                      top-rated results.

  INS-31                              Top-rated items show their
                                      normalized status and do not claim
                                      to be verified or currently open.

  INS-32                              No review count, popularity score,
                                      visitor count, or recommendation
                                      score is fabricated.

  INS-33                              Top-rated links use exact listing
                                      IDs and only verified Phase 05
                                      routes.

  INS-34                              Existing Recharts and chart
                                      primitives are reused; no new chart
                                      dependency is added.

  INS-35                              Chart Client Components receive
                                      only minimal serializable aggregate
                                      DTOs.

  INS-36                              Every chart has an accessible
                                      textual equivalent and is not
                                      hover-dependent.

  INS-37                              Editorial design direction and
                                      responsive desktop/tablet/mobile
                                      layouts are preserved.

  INS-38                              `vi` and `en` UI translation keys
                                      have exact parity; workbook values
                                      remain untranslated.

  INS-39                              Source fetch/parse errors are
                                      distinct from a successful empty
                                      dataset.

  INS-40                              Automated tests cover metric
                                      invariants, edge cases, and fixture
                                      regression counts.

  INS-41                              Required lint, format, type-check,
                                      test, build, and applicable
                                      Storybook checks were run and their
                                      actual outputs inspected.

  INS-42                              Final report lists actual files,
                                      verification evidence, unresolved
                                      issues, and Phase 08 readiness
                                      without implementing Phase 08.
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 19. Final Report Format

At completion, report:

1.  **Phase status:** completed, partially completed, or blocked.
2.  **Repository snapshot:** branch, commit SHA, working-tree status.
3.  **Prerequisite readiness:** actual Phase 01--06 implementation
    state.
4.  **Route:** exact localized route and module path.
5.  **Data integration:** exact shared loader and server/client
    boundaries.
6.  **Metric definitions:** exact formulas and source fields.
7.  **Metric results:** fixture regression outcomes and live dataset
    behavior, clearly separated.
8.  **Charts:** chart types, data contracts, accessibility alternatives.
9.  **Top-rated listings:** sort, tie behavior, status display,
    detail-link behavior.
10. **Localization:** `vi`/`en` parity and source-text preservation.
11. **SEO:** metadata, canonical URL, locale alternates, sitemap.
12. **Accessibility/responsive review:** actual checks performed.
13. **Files created/modified:** exact paths and purpose.
14. **Dependencies:** confirm no unapproved dependency/lockfile changes.
15. **Tests and quality checks:** exact commands and actual outcomes.
16. **Acceptance checklist:** INS-01--INS-42 with evidence.
17. **Known limitations:** missing prerequisites, data gaps, missing
    routes, or unavailable browser checks.
18. **Scope confirmation:** explicitly confirm that no average rating,
    price analytics, visitor metrics, trends, user tracking, admin
    features, database, or separate backend were added.
19. **Phase 08 readiness:** remaining integration, full QA, and
    deployment tasks without starting them.

**End of Phase 07 Detailed Implementation Specification.**
