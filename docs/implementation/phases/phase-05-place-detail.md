# Phase 05 --- Place Detail

## Codex Detailed Implementation Specification

**Project:** Da Nang Travel Discovery\
**Repository:**
https://github.com/PhanHoangQuocTu/nextjs-frontend-boilerplate\
**Target phase:** Phase 05 of 08\
**Scope:** Implement the localized Place Detail route/page and connect
existing Explore listing entry points to the correct detail record.\
**Design direction:** Editorial\
**Locales:** Vietnamese (`vi`, default) and English (`en`)\
**Status:** Core data rules and both Option A decisions are confirmed.
Route placement and component composition must be reconciled with the
actual repository before implementation.

------------------------------------------------------------------------

# 0. Instructions for Codex

Treat this document as the authoritative Phase 05 scope, subject to the
repository's current `AGENTS.md`, `CLAUDE.md`, approved Phase 01--04
documents, and actual implementation reports.

Implement **Place Detail only**. Do not expand this phase into Areas,
Trip Ideas/itinerary detail, Insights/Analytics, map exploration,
booking, or the full synchronization workflow.

Before changing any file:

1.  Inspect the active branch, latest commit, `git status`, and working
    tree. Preserve all user changes.
2.  Read the complete root `AGENTS.md`, `CLAUDE.md`, and every
    applicable nested instruction file.
3.  Read Phase 01 repository audit and architecture mapping.
4.  Read Phase 02 Data Foundation specification and actual execution
    report. Inspect the real normalized listing type, deterministic ID
    generation, parser, dataset builder, diagnostics, and tests.
5.  Read Phase 03 Google Drive Connector specification and actual
    execution report. Inspect the actual server-only source connector
    and source-to-dataset function.
6.  Read Phase 04 Home & Explore specification and actual execution
    report. Inspect actual Home/Explore routes, listing
    cards/rows/table, URL state, shared server-side data loader,
    localization, and tests.
7.  **Verify implementation readiness from source code.** A
    specification or generated prompt is not proof that a phase was
    implemented. Do not assume Phase 02, 03, or 04 code exists merely
    because its documents exist.
8.  Verify actual route conventions, locale routing, metadata helpers,
    design system, component patterns, and test conventions from the
    checked-out repository.
9.  Produce a repository-aware implementation plan before editing.
    Identify exact existing files/components to reuse and the smallest
    required changes.
10. Separate confirmed product decisions from implementation proposals.
    Do not convert an earlier assistant suggestion into an approved
    business rule.
11. Do not install, add, upgrade, remove, or change any dependency or
    lockfile without explicit user approval.
12. Do not commit, push, amend, rebase, rewrite Git history, or discard
    user changes.
13. Do not claim a command, test, build, browser check, accessibility
    check, or visual verification passed unless it was actually run and
    its output inspected.

## 0.1 Phase dependency gate

Phase 05 depends on:

-   Phase 01 --- Codebase Rules & Architecture Mapping.
-   Phase 02 --- Data Foundation & Workbook Mapping.
-   Phase 03 --- Google Drive Connector / source-to-dataset pipeline.
-   Phase 04 --- Home & Explore, especially its shared server-side
    dataset loader and listing components.

If a prerequisite is missing or incomplete:

-   Do not fabricate production data.
-   Do not duplicate the parser, workbook mapper, Google Drive
    connector, or data-loading pipeline.
-   Do not create a second incompatible `TravelListing` type.
-   Complete only work that can be safely grounded in actual repository
    contracts.
-   Mark affected acceptance criteria BLOCKED and report exact evidence.
-   Do not claim Phase 05 fully complete while the detail route cannot
    consume the real normalized dataset.

------------------------------------------------------------------------

# 1. Roles and Quality Bar

Work as a coordinated senior product engineering team:

-   **Senior Next.js Engineer:** implement the localized App Router
    detail route and correct server/client boundaries.
-   **Senior Frontend Engineer:** build a reusable, responsive Place
    Detail page using existing modules and UI primitives.
-   **Senior Product Designer:** preserve the Editorial direction and
    create a readable, content-first information hierarchy.
-   **Senior TypeScript Engineer:** consume the existing normalized data
    contract without duplicate types or unsafe casts.
-   **Senior Data Engineer:** preserve workbook source values and use
    canonical identity, area, and status rules.
-   **Senior i18n Engineer:** localize UI-only text in Vietnamese and
    English while leaving workbook content untranslated.
-   **Senior SEO Engineer:** implement metadata and canonical URL
    behavior consistent with existing locale routing.
-   **Senior Accessibility Reviewer:** ensure semantic structure,
    keyboard support, accessible links, focus behavior, and responsive
    usability.
-   **Senior QA Engineer:** test identity resolution, duplicate
    listings, raw notes, optional fields, Maps links, locale behavior,
    not-found/error states, and Explore navigation.
-   **Technical Lead:** keep implementation minimal, reuse Phase 02--04
    code, and avoid unapproved scope.

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
  **05**   **Place Detail**
  06       Areas & Trip Ideas
  07       Insights & Analytics
  08       Integration, QA & Deployment

Phase 05 owns the individual listing detail experience. Phase 06 owns
dedicated Area and Trip Ideas experiences. Phase 07 owns analytics. Keep
these boundaries intact.

------------------------------------------------------------------------

# 3. Confirmed Product Context and Business Decisions

## 3.1 Product and operating model

Da Nang Travel Discovery is a bilingual travel discovery website for
tourism, sightseeing, nature, food, cafes, entertainment, accommodation,
and nearby destinations around Da Nang.

The product runs as one Next.js application: - Next.js frontend and its
built-in server-side capabilities. - No separate backend service. - No
database. - Vercel is the intended deployment platform. - The public
Google Sheets workbook is the source of listing data. - An external
tracking process updates the workbook approximately once per day using
overwrite behavior. - The website consumes the latest available
normalized dataset through the existing Phase 02/03/04 pipeline.

Phase 05 must not create a new persistence or synchronization
architecture.

## 3.2 Localization

Confirmed: - UI locales: Vietnamese (`vi`) and English (`en`). - Default
locale: Vietnamese (`vi`). - Localization is UI-only. - Workbook source
content is not translated. - Listing names, addresses, source
categories, canonical area names, price text, opening-hours text,
highlights, notes, and visit-profile values remain exactly as supplied
by the normalized source. - Locale switching uses the existing
`next-intl` routing and navigation conventions. - Add UI translation
keys to both locales, following the existing message namespace
structure.

Never machine-translate source workbook content when the user selects
English.

## 3.3 Visual direction

Confirmed: **Editorial**.

The accepted direction is a modern travel editorial combined with clean
information presentation: - Warm, restrained visual palette consistent
with existing design tokens. - Strong typographic hierarchy. -
Serif-style display headings only where the existing design system
supports them. - Clean sans-serif body text. - Intentional whitespace. -
Minimal borders and restrained status accents. - Clear grouping of
practical information. - Responsive, content-first composition.

Use the actual repository's typography, tokens, and UI primitives. Do
not introduce a new font, UI kit, theme system, or CSS framework without
approval.

## 3.4 Duplicate listing identity --- Option A (confirmed)

The user selected **Option A: preserve listings from different source
sheets as separate records and separate detail pages**.

The normalized identity is based on:

`sourceSheet + normalizedName`

Requirements: - Do not merge two listings from different source sheets
just because their names match. - Use the actual deterministic `id`
generated by Phase 02. - Do not regenerate IDs in the UI or detail
route. - Do not identify a listing by its display name alone. - Do not
use `sourceIndex` or physical Excel row number as route identity. - Do
not generate random IDs or timestamps. - Same-name records from
different source sheets must resolve to their own detail records. - The
same source sheet + normalized name must continue to resolve
deterministically according to Phase 02. - If a source rename or move
changes the deterministic ID, the old route may no longer resolve. This
limitation is accepted by the Phase 02 identity design; do not create an
alias database or migration layer.

The inspected workbook snapshot includes these same-name groups, which
must remain separate: - `Tiên Sa Show` --- Sheet 1 and Sheet 7. -
`VinWonders Nam Hội An` --- Sheet 1 and Sheet 7. - `Phố đi bộ Bạch Đằng`
--- Sheet 6 and Sheet 10. - `Queen Palace Karaoke` --- Sheet 7 and Sheet
10.

These examples are regression cases, not hardcoded production content.

## 3.5 Notes & Tips --- Option A (confirmed)

The user explicitly accepted **Option A: Raw Data Display** for Notes &
Tips.

The Place Detail page must: - Display `notesText` verbatim. - Preserve
original wording, punctuation, symbols, line breaks, and paragraph
order. - Not edit, rewrite, summarize, classify, truncate, translate,
sanitize, or reinterpret editorial meaning. - Use Vietnamese section
title **"Ghi chú & lưu ý"**. - Use English section title **"Notes &
Important Information"**. - Hide this section only when the normalized
source value is empty/null. - Do not hide it because it is long,
contains warnings, or has unusual wording. - Do not collapse it behind
an interaction by default. - Do not add arbitrary "Read more"
truncation. - Do not use `dangerouslySetInnerHTML`; render source
content as escaped plain text.

When present, the exact source text must be visible in both locales.

## 3.6 Confirmed normalized data contract

Use the actual Phase 02 domain type and implementation. The semantic
listing fields include:

-   `id`
-   `sourceKey`
-   `sourceSheet`
-   `sourceIndex`
-   `name`
-   `mainCategory`
-   `sourceCategory`
-   `address`
-   `sourceArea`
-   `areaId`
-   `areaName`
-   `status`
-   `statusRaw`
-   `ratingRaw`
-   `rating`
-   `priceText`
-   `openingHoursText`
-   `highlightsText`
-   `notesText`
-   `mapsUrl`
-   `visitProfileRaw`
-   `visitProfile.suitableFor`
-   `visitProfile.recommendedTime`
-   `visitProfile.suggestedDuration`
-   `visitProfile.distanceFromCenterText`

Do not duplicate this interface if the repository already exports the
real domain type. Adapt the actual type only where necessary and
preserve semantics.

### Canonical area

-   Use `areaId` and `areaName` from the normalized Phase 02 record.
-   `LOC_THEO_KHU_VUC` is the canonical area source.
-   Do not use raw `sourceArea` as the visible canonical area label.
-   Do not split multi-area `sourceArea` strings.
-   Keep `sourceArea` for traceability only; do not show it as if it
    were canonical.
-   If `areaId` is `unknown` or `areaName` is null, omit the canonical
    area value rather than inventing one.

### Status

Use normalized status only:

  Normalized status   Vietnamese UI label   English UI label
  ------------------- --------------------- ------------------
  `ACTIVE`            Đang hoạt động        Active
  `UNVERIFIED`        Chưa xác minh         Unverified
  `WARNING`           Tạm dừng / Cảnh báo   Paused / Warning
  `CLOSED_BANNED`     Đã đóng / Cấm         Closed / Banned
  `UNKNOWN`           Chưa rõ               Unknown

-   Do not infer status from notes, rating, price, name, or opening
    hours.
-   Do not silently hide listings with non-active statuses.
-   Display status as a clear, localized badge or label.
-   Do not invent additional warnings or operational advice.

### Rating

-   Use normalized numeric `rating` only.
-   Valid rating is finite and between 0 and 5.
-   Null/invalid rating remains null.
-   Never render null as `0`, `0.0`, or a zero-star rating.
-   Do not invent review counts, review links, or social proof.
-   If rating is null, omit the rating component rather than inventing a
    placeholder score.

### Price

-   Display `priceText` exactly as supplied.
-   Do not parse it into a numeric value.
-   Do not calculate average price or a price range.
-   Do not add a numeric price badge, price slider, or currency
    conversion.
-   Do not assume the value is per person if the source text says
    otherwise.
-   Omit the field when null/empty.

### Opening hours

-   Display `openingHoursText` exactly as supplied.
-   Do not parse it into a schedule or infer whether the place is open
    now.
-   Do not create a live opening-status indicator.
-   Do not reinterpret time ranges.
-   Omit the field when null/empty.

### Highlights

-   Display `highlightsText` as source-authentic content.
-   Do not rewrite, summarize, translate, or infer menu/attraction
    details.
-   Preserve meaningful line breaks and text structure.
-   Omit the section when null/empty.

### Google Maps

-   Use only the Phase 02 validated `mapsUrl` extracted from the actual
    workbook cell hyperlink.
-   Never synthesize a Maps URL from listing name, address, or
    coordinates.
-   If `mapsUrl` is null/invalid, omit the Maps CTA.
-   Open the original URL safely in a new tab/window according to
    repository conventions.
-   Use safe `rel` attributes where applicable.
-   Do not embed a map, add geocoding, infer coordinates, or add map
    tiles in this phase.

### Visit profile

The four structured values are: 1. `suitableFor` 2. `recommendedTime` 3.
`suggestedDuration` 4. `distanceFromCenterText`

Rules: - Display values exactly as supplied. - Do not translate these
source values in English UI. - Do not convert duration or distance into
numeric data. - Do not calculate route distance or travel time. - Do not
infer missing values from other listing fields. - If structured
`visitProfile` exists, show available fields using localized labels. -
If structured parsing failed but `visitProfileRaw` is non-empty,
preserve and display the raw source string in the visit-profile section
rather than discarding it or guessing the four fields. - Hide the
visit-profile section only when both structured profile and raw source
value are absent/empty.

------------------------------------------------------------------------

# 4. Phase 05 Scope

## 4.1 In scope

1.  Add the localized Place Detail route using existing App Router
    conventions.
2.  Resolve the requested listing using its actual Phase 02 `id`.
3.  Render a complete, responsive detail page from the normalized
    listing.
4.  Implement localized page metadata.
5.  Implement proper not-found behavior for a valid dataset where the
    requested ID does not exist.
6.  Distinguish data-source failure from a missing listing.
7.  Connect listing names/cards in Explore Grid, List, and Table to
    their correct detail routes.
8.  Preserve separate routes for same-name listings from different
    source sheets.
9.  Add UI translation keys for all new labels and states.
10. Add tests for route resolution, duplicate identities, source text
    preservation, optional fields, Maps links, locale, and navigation.
11. Verify responsive and accessibility behavior.

## 4.2 Out of scope

-   Dedicated Areas pages or area detail routes (Phase 06).
-   Trip Ideas or itinerary pages (Phase 06).
-   Insights and Analytics (Phase 07).
-   Map embeds, map tiles, geocoding, coordinates, and directions
    calculations.
-   Related-place recommendations unless a separate approved
    deterministic rule exists. No such rule is currently approved; omit
    the section.
-   Image enrichment, scraping, stock photos, or generated listing
    images.
-   Booking, reservation, availability, or ticket purchasing.
-   Phone numbers, email addresses, social links, or contact enrichment.
-   Reviews, review counts, comments, favorites, ratings submission, or
    user-generated content.
-   Numeric price parsing, comparison, or conversion.
-   Live opening-hours checks.
-   User accounts, authentication, or personalization.
-   Manual Update button, sync API, cooldown, or rate limiting.
-   Persistent cache, database, or a new backend service.
-   New dependencies without explicit approval.
-   Unrelated refactors.

------------------------------------------------------------------------

# 5. Route and Listing Identity

## 5.1 Candidate route

The previously discussed route shape is:

`/places/[id]`

Treat this as the proposed route, not an already verified repository
fact. Before implementing: - Inspect Phase 01 route conventions and
actual Phase 04 route structure. - Respect locale segment/prefix
behavior managed by `next-intl`. - Use the repository's locale-aware
`Link`, navigation, and routing helpers. - If existing route
architecture requires a different placement or route group, adapt the
physical file path while preserving the public `/places/[id]` intent
where possible. - Record the final route path in the implementation plan
and report.

Do not create a second routing convention.

## 5.2 Route identity

-   The route parameter must resolve against the actual normalized
    `listing.id`.
-   Do not look up a listing by `name`.
-   Do not look up a listing by `sourceIndex`.
-   Do not use `sourceSheet` alone.
-   Do not create a name slug as the primary identity.
-   Do not regenerate or normalize the ID in the route.
-   Use safe URL encoding/decoding consistent with Next.js routing and
    the actual ID format.
-   Add round-trip tests for IDs containing Vietnamese characters,
    spaces, punctuation, or separator characters if the Phase 02 ID
    implementation can produce them.
-   Do not expose internal source metadata in the public URL unless the
    actual ID format requires it.

## 5.3 Duplicate-name behavior

For same-name listings from different source sheets: - Each listing has
its own actual `id`. - Each listing links to its own detail route. -
Each detail route resolves exactly one matching record. - Do not
redirect one same-name record to another. - Do not show a merged detail
page. - Do not group or deduplicate these records. - The source sheet
may be used internally to verify the match but should not be shown to
visitors by default.

## 5.4 Unknown ID behavior

When the dataset has loaded successfully but no listing matches the
requested ID: - Return the repository's correct localized not-found
behavior (`notFound()` or established equivalent). - Do not show a blank
detail page. - Do not fall back to a same-name listing. - Do not
silently redirect to Explore. - Provide a localized not-found page with
a safe navigation path back to Explore/Home, using existing conventions.

When the dataset cannot be loaded: - Do not interpret source failure as
an unknown ID. - Show the established localized data-source error
boundary/state. - Do not return a false 404.

------------------------------------------------------------------------

# 6. Place Detail Page Information Architecture

Use a shared detail-page template. Render only fields that actually
exist. The following is the recommended content hierarchy based on
confirmed workbook fields and earlier product planning; adapt spacing
and component composition to the existing design system.

## 6.1 Breadcrumb / navigation context

Provide a concise localized breadcrumb: - Home - Explore - Current
listing name

Requirements: - Use locale-aware internal links. - Breadcrumbs must be
semantic navigation with an accessible label. - Current listing item
should be marked as the current page. - Do not invent an Area detail
route. - Do not link canonical area text to an unimplemented Phase 06
route. - A simple Explore link may navigate to the canonical Explore
route. - Browser back navigation should naturally return users to the
prior filtered Explore URL when they arrived from Explore. - Do not add
a complex `returnTo` mechanism unless an existing repository pattern
already supports it safely.

## 6.2 Place heading / editorial header

Display: - Listing `name` as the primary page heading. - Localized main
category label from the existing category mapping. - Normalized status
badge. - Canonical `areaName` when present.

Requirements: - Keep listing name verbatim. - Do not translate or
rewrite the name. - Do not add a slogan or marketing claim to the
listing. - Do not display `sourceArea` as canonical area. - Do not
display source sheet or internal source key to visitors by default. -
Ensure long names wrap without horizontal overflow.

## 6.3 Overview / key facts

Use a compact facts area to surface only available values: - Numeric
rating, if not null. - Raw price text, if present. - Canonical area, if
present. - Main category label. - Status.

Requirements: - Do not invent rating review counts. - Do not render null
rating as zero. - Do not convert price text into numbers. - Do not
repeat facts excessively across the page. - Use semantic labels and
accessible text, not color/icons alone.

## 6.4 Location and address

When `address` is non-empty: - Show the original address verbatim. - Use
a localized section/field label. - Preserve line breaks if present. - Do
not geocode or normalize the address into a different location. - Do not
infer district/coordinates from address text.

If `areaName` exists, show canonical area separately and clearly
distinguish it from raw address.

If address is null/empty, omit the address value. Do not invent a
fallback.

## 6.5 Google Maps action

When `mapsUrl` is valid and present: - Render a prominent but restrained
localized CTA, e.g. "Mở Google Maps" / "Open in Google Maps". - Link to
the exact validated URL. - Open safely in a new tab according to
repository conventions. - Use an accessible name that identifies the
action. - Do not modify query parameters or construct a new URL.

When `mapsUrl` is null: - Omit the CTA completely. - Do not render a
disabled fake Maps button. - Do not generate a URL from address or
listing name.

No embedded map is part of this phase.

## 6.6 Price information

When `priceText` is non-empty: - Show source text exactly. - Label with
localized UI text such as "Tầm giá" / "Price range". - Do not add
currency conversion or numeric interpretation. - Do not assume the value
is per person if source text says otherwise. - Do not compare it to
other listings. - Omit when empty.

## 6.7 Opening hours

When `openingHoursText` is non-empty: - Show source text exactly. - Use
localized field label such as "Giờ mở cửa" / "Opening hours". - Do not
parse a weekly schedule. - Do not calculate current open/closed state. -
Do not create a live status chip. - Omit when empty.

## 6.8 Highlights / menu / suggested content

When `highlightsText` is non-empty: - Show source text verbatim. - Use
localized section title based on existing translation conventions
(e.g. "Điểm nổi bật" / "Highlights"). - Preserve meaningful line
breaks. - Do not summarize, translate, classify, or convert source text
into unsupported structured data. - Do not infer that every listing has
a menu. - Omit when empty.

## 6.9 Notes & Important Information --- Option A

This section is mandatory when `notesText` is present.

Localized section title: - Vietnamese: **Ghi chú & lưu ý** - English:
**Notes & Important Information**

Rules: - Render `notesText` verbatim. - Preserve punctuation, symbols,
capitalization, line breaks, paragraph order, and original wording. - Do
not edit, summarize, translate, truncate, classify, sanitize, or
reinterpret the content. - Do not hide warnings or unusual text. - Do
not collapse the section by default. - Do not use a "Read more"
truncation. - Do not render source as HTML. - Use safe plain-text
rendering and appropriate whitespace handling. - Hide only when
normalized source value is null/empty. Do not hide because content is
long.

Add a regression test that compares rendered text with the exact source
string, including punctuation and line breaks where the test environment
permits.

## 6.10 Visit profile / experience information

Use the Phase 02 structured `visitProfile` when available.

Suggested localized field labels: - `suitableFor`: "Phù hợp với" /
"Suitable for" - `recommendedTime`: "Thời điểm phù hợp" / "Best time to
visit" - `suggestedDuration`: "Thời lượng gợi ý" / "Suggested
duration" - `distanceFromCenterText`: "Cách trung tâm" / "Distance from
center"

Rules: - Preserve all values verbatim. - Do not translate source values
in English UI. - Do not turn distance text into numeric kilometers. - Do
not calculate travel time. - Do not infer suitability from listing
type. - Do not infer recommended time from opening hours. - If
structured profile exists, show only non-empty fields. - If structured
profile is null but `visitProfileRaw` is present, show raw value as
plain text in this section. - Hide the section only when all structured
values and the raw source value are empty/null.

## 6.11 Related places

Related-place recommendations were previously discussed only as an
assistant suggestion. The user has not approved a recommendation rule.

Therefore: - Do not implement a Related Places / You May Also Like
section in Phase 05. - Do not select places by rating, category, area,
or source order and present them as recommendations. - Do not silently
exclude non-active records from a recommendation set. - Do not create an
arbitrary related-listing algorithm. - Leave this feature for a future
explicitly approved specification if required.

------------------------------------------------------------------------

# 7. Responsive Layout and Editorial Presentation

## 7.1 Desktop

-   Use a balanced editorial detail layout.
-   Main content area may contain title, highlights, notes, and visit
    profile.
-   Practical-information area may contain status, rating, price,
    opening hours, address, and Maps action where existing design system
    supports a sidebar.
-   Title and primary information remain visually dominant.
-   Avoid generic admin-dashboard appearance.
-   Avoid unnecessary cards nested inside cards.
-   Use whitespace and typography instead of decoration.
-   Exact column widths and placement must follow actual boilerplate
    layout and breakpoints.

## 7.2 Tablet

-   Reduce columns or stack practical facts below the main header.
-   Preserve readable line lengths.
-   Keep Maps CTA easy to find.
-   Avoid clipped badges or labels.

## 7.3 Mobile

-   Use a single-column content flow.
-   Keep listing name and status near the top.
-   Make Maps CTA easy to tap when available.
-   Stack key facts without excessive card nesting.
-   Preserve Notes & Important Information in full; do not truncate it
    to save space.
-   Preserve line breaks and source text.
-   Avoid horizontal page overflow.
-   Do not make a sidebar sticky on small screens unless an existing
    shared pattern clearly supports it and it does not obstruct content.

## 7.4 No listing images

The Phase 02 normalized workbook contract does not provide listing image
URLs.

Therefore: - Do not add image URLs manually. - Do not scrape or search
the web for photos. - Do not use generic stock photos as if they
represent a real listing. - Do not generate AI images for real places. -
Do not create a new image enrichment service. - Use typography, spacing,
separators, and existing icon primitives for visual hierarchy.

------------------------------------------------------------------------

# 8. Data Loading and Server/Client Architecture

## 8.1 Data source of truth

The source-of-truth pipeline is:

`Public Google Sheets XLSX → Phase 03 server connector → Phase 02 parser/mapping/normalization → normalized dataset → Phase 04 shared server-side loader → Place Detail`

Use actual implemented functions and types. Do not recreate any part of
this pipeline.

## 8.2 Server-side resolution

Prefer a Server Component page that: 1. Reads and validates the route
ID. 2. Calls the existing shared server-side dataset loader used by
Home/Explore. 3. Receives the normalized dataset and source diagnostics.
4. Resolves the exact listing by `id`. 5. Calls `notFound()` only after
successful data loading and a genuine no-match result. 6. Renders the
detail page using the normalized listing.

Requirements: - Keep Google Sheets fetch and XLSX parsing server-only. -
Do not fetch workbook from the browser. - Do not send XLSX bytes or
parser objects to Client Components. - Do not fetch the full dataset
through a same-origin API route from a Server Component unless actual
repository architecture requires it. - Do not add a new public API
endpoint solely for this page. - Do not add a second data loader with
slightly different behavior. - Reuse the same source freshness and
failure behavior as Phase 04.

## 8.3 Error versus not found

  -----------------------------------------------------------------------
  Condition                           Required behavior
  ----------------------------------- -----------------------------------
  Dataset successfully loaded; ID     Render detail page
  exists                              

  Dataset successfully loaded; ID     Localized not-found
  does not exist                      

  Google Sheets fetch failed          Localized data-source error

  XLSX parse/validation failed        Localized data-source error

  Normalized dataset is structurally  Use established error behavior; do
  invalid                             not render partial/fake detail

  Optional listing field is null      Omit that field/section gracefully
  -----------------------------------------------------------------------

Never turn a connector or parser failure into a 404.

## 8.4 Caching and freshness

-   Reuse Phase 04's implemented server-side loader and current cache
    behavior.
-   Do not add a global mutable dataset cache.
-   Do not add a database, Redis, KV store, filesystem persistence, or
    cross-instance lock.
-   Do not add manual sync or cooldown in Phase 05.
-   Do not override cache settings locally on the detail route without a
    documented reason.
-   Do not create different freshness semantics for Home, Explore, and
    Place Detail.
-   Record performance concerns for the later Integration/QA phase
    rather than introducing a new caching system.

## 8.5 Client Components

-   Prefer Server Components throughout the detail page.
-   Use Client Components only when an actual interaction requires them
    and an existing repository pattern supports it.
-   Static content, source values, metadata, and external Maps link do
    not require client-side state.
-   Do not add Zustand or TanStack Query merely to render one listing.

------------------------------------------------------------------------

# 9. Integration with Phase 04 Home & Explore

## 9.1 Explore Grid cards

-   Make listing name or an explicit "View details" action link to that
    listing's own Place Detail route.
-   Use `listing.id`, not the name.
-   Avoid nested interactive links/buttons.
-   Keep Maps CTA separate from internal detail link.
-   Keep card status, rating, category, and area behavior unchanged.
-   Do not make the entire card an inaccessible click target.

## 9.2 Explore List view

-   Link listing name to its detail route.
-   Preserve existing row interactions and filter state.
-   Keep Maps action separate.

## 9.3 Explore Table view

-   Make name cell a locale-aware link to the detail route.
-   Preserve table semantics and keyboard navigation.
-   Keep external Maps action separate from internal route.

## 9.4 Navigation state

-   Clicking a detail link from Explore should leave the original
    Explore URL in browser history so Back returns to the previous
    search/filter/page state.
-   Do not reset or mutate Explore query state when opening a detail
    page.
-   A breadcrumb Explore link may lead to canonical Explore route if no
    existing return-state mechanism exists.
-   Do not implement a custom `returnTo` parameter or client history
    abstraction unless an established repository pattern already
    supports it safely.

## 9.5 Home

-   Do not invent featured listings or ranking rules.
-   If Phase 04 already contains a real listing link backed by a
    supported dataset source, update it to use the correct detail route.
-   Otherwise, do not add new listing previews to Home in Phase 05.
-   Preserve category and area discovery behavior.

------------------------------------------------------------------------

# 10. Localization and Content Integrity

## 10.1 UI strings

Add translation keys for: - Breadcrumb labels. - Detail page
title/metadata labels. - Main category labels if not already shared. -
Status labels. - Overview/facts labels. - Address/location. - Price. -
Opening hours. - Highlights. - Notes & Important Information. - Visit
profile labels. - Maps CTA. - Back to Explore / Home navigation. -
Not-found title/description/action. - Data-source error
title/description/retry action if an established retry mechanism exists.

Use existing message namespaces and avoid duplicate translation keys.

## 10.2 Source content

These values remain source-authentic in both `vi` and `en`: - `name` -
`sourceCategory` - `address` - `areaName` - `priceText` -
`openingHoursText` - `highlightsText` - `notesText` - all visit-profile
values

Only UI labels around them change by locale.

Do not translate: - Listing name. - Address. - Source category. -
Canonical area name. - Price text. - Opening-hours text. - Highlights. -
Notes. - Visit-profile values.

Do not modify source strings before rendering except safe display
behavior such as CSS whitespace handling. Never mutate the normalized
record.

------------------------------------------------------------------------

# 11. SEO and Metadata

Follow actual repository metadata and `next-intl` conventions.

Requirements: - Generate localized title and description for each Place
Detail route. - Use listing name verbatim in the title. - Use localized
main-category label and canonical area only when present. - Do not put
source sheet, source key, or internal diagnostics into metadata. - Do
not invent claims such as "best", "top-rated", "verified", "open now",
or "recommended". - Do not use `notesText` as a truncated SEO
description. - Use a concise, neutral localized description. - Set
canonical URL according to existing locale/SEO strategy. - Ensure locale
alternates are correct if the repository supports them. - Do not create
sitemap behavior for every detail listing unless the existing SEO plan
explicitly requires it and current dataset architecture can support it
safely. - Do not make arbitrary query parameters part of canonical URL.

If the repository has a metadata helper, use it rather than introducing
a new metadata framework.

------------------------------------------------------------------------

# 12. Security and Reliability

-   Treat every workbook string as untrusted plain text.
-   Use React's normal escaping.
-   Never use `dangerouslySetInnerHTML` for workbook values.
-   Use only validated `mapsUrl` from Phase 02.
-   Do not accept arbitrary external URLs from query parameters.
-   Do not leak stack traces, parser internals, source fetch URLs, or
    server diagnostics to the client.
-   Do not expose internal source keys or raw parser objects.
-   Validate route params and encode links safely.
-   Do not perform user-controlled file reads or filesystem access.
-   Do not add credentials, API keys, OAuth, or service accounts.
-   Do not add external requests from the client.
-   Do not infer that a listing is safe, open, verified, or recommended
    beyond normalized source fields.

------------------------------------------------------------------------

# 13. Testing Strategy

Follow repository Vitest, Testing Library, and integration-test
conventions. Do not add dependencies without approval.

## 13.1 Identity and route-resolution tests

-   Exact ID resolves exactly one normalized listing.
-   Unknown ID returns not-found after successful dataset loading.
-   Same-name listings from different source sheets resolve to different
    IDs and detail pages.
-   Name-only lookup is never used.
-   `sourceIndex` and physical row number are not used as identity.
-   ID URL encoding/decoding round-trips for supported characters.
-   A renamed/moved source record does not silently resolve to another
    same-name record.

## 13.2 Field rendering tests

-   Listing name is rendered verbatim.
-   Main category label is localized but source category remains
    unchanged.
-   Canonical `areaName` is used; `sourceArea` is not shown as
    canonical.
-   Null area is omitted.
-   All five normalized statuses map to correct localized labels.
-   Null rating is omitted and never displayed as zero.
-   Numeric rating is displayed only when valid.
-   Price text is unchanged.
-   Opening-hours text is unchanged.
-   Highlights text is unchanged.
-   Address text is unchanged.
-   Optional null/empty fields are omitted gracefully.
-   No fake review count, image, phone number, booking CTA, or opening
    state appears.

## 13.3 Notes & Tips Option A tests

-   Vietnamese section title is exactly "Ghi chú & lưu ý".
-   English section title is exactly "Notes & Important Information".
-   Source `notesText` is rendered verbatim in both locales.
-   Punctuation, symbols, line breaks, and paragraph order are
    preserved.
-   Long notes are not truncated.
-   Notes are not collapsed by default.
-   Notes are not translated in English UI.
-   Section is hidden when normalized source value is null/empty.
-   Section remains visible for any non-empty source string, including
    warning-like or unusual content.
-   Workbook text is rendered as escaped plain text, not interpreted
    HTML.

## 13.4 Visit profile tests

-   Structured values use the four Phase 02 fields.
-   UI labels are localized.
-   Source values remain Vietnamese/verbatim in English locale.
-   Missing individual values are omitted.
-   Raw `visitProfileRaw` is shown if structured profile is null but raw
    text exists.
-   No numeric distance, duration, or travel time is inferred.

## 13.5 Google Maps tests

-   Valid non-null `mapsUrl` renders external Maps CTA.
-   CTA href exactly equals validated source URL.
-   Safe external-link attributes are present according to repository
    conventions.
-   Null/invalid `mapsUrl` renders no CTA.
-   No URL is generated from name or address.

## 13.6 Integration tests

-   Localized route resolves correct listing from shared server data
    loader.
-   Data-source failure is not converted into not-found.
-   Unknown ID with valid dataset uses not-found.
-   Explore Grid links use correct ID.
-   Explore List links use correct ID.
-   Explore Table links use correct ID.
-   Same-name duplicates link to separate detail routes.
-   Back navigation returns to prior Explore URL/state where browser
    integration tests support it.
-   Metadata uses current listing and locale.
-   `vi` and `en` UI labels exist and source content remains unchanged.

Automated tests must not call Google Sheets or external network. Mock
the shared server data boundary.

## 13.7 Accessibility and responsive tests

-   One primary `h1` per page.
-   Semantic breadcrumb navigation.
-   Logical heading hierarchy.
-   Internal/external links have meaningful accessible names.
-   Status is not conveyed by color alone.
-   Keyboard focus is visible.
-   Maps CTA is keyboard accessible.
-   Long names, addresses, and notes wrap safely.
-   Mobile layout has no horizontal page overflow.
-   Notes remain fully visible on mobile.

## 13.8 Browser / visual verification

If browser tooling is available: - Test a listing with all optional
fields populated. - Test a listing with null rating and missing Maps
URL. - Test a listing with long Notes & Important Information. - Test a
same-name duplicate from a different source sheet. - Test an unknown
ID. - Test source-fetch/parser failure. - Verify Vietnamese and English
UI. - Verify desktop, tablet, and mobile widths. - Inspect console and
network errors.

If browser access is unavailable, report NOT RUN. Do not claim visual
verification.

------------------------------------------------------------------------

# 14. Implementation Workflow and Task Breakdown

Maintain a checklist and update it during implementation.

## Task 05.1 --- Repository and prerequisite audit

-   Inspect branch, working tree, instructions, and current route
    architecture.
-   Read Phase 01--04 documents and actual execution reports.
-   Verify Phase 02 normalized data contract and deterministic ID.
-   Verify Phase 03 source connector and shared data loader.
-   Verify Phase 04 Home/Explore implementation and listing entry
    points.
-   Record missing prerequisites before coding.

## Task 05.2 --- Product decision reconciliation

-   Preserve Editorial direction.
-   Preserve duplicate identity Option A.
-   Preserve Notes & Tips Option A.
-   Confirm proposed `/places/[id]` route against actual routing
    conventions.
-   Confirm translation namespace and metadata helpers.
-   Do not implement related-place recommendations.

## Task 05.3 --- Data access and route resolution

-   Reuse Phase 04 shared server-side dataset loader.
-   Resolve by exact `listing.id`.
-   Keep source fetch and parser server-only.
-   Distinguish source failure from unknown ID.
-   Implement established localized not-found behavior.
-   Do not add a new API route or cache layer.

## Task 05.4 --- Place Detail composition

-   Build detail page module following existing `src/modules` patterns.
-   Add breadcrumb and editorial header.
-   Add status and available overview facts.
-   Add address and Maps CTA when valid.
-   Add price and opening-hours text when present.
-   Add highlights when present.
-   Add Notes & Important Information with raw-text Option A behavior.
-   Add structured/raw visit profile behavior.
-   Omit related-place section.

## Task 05.5 --- Explore integration

-   Link Grid listing names/cards to detail.
-   Link List listing names to detail.
-   Link Table name cells to detail.
-   Use stable listing ID.
-   Preserve separate same-name routes.
-   Keep Maps CTA as a separate external action.
-   Preserve Explore URL/history state.

## Task 05.6 --- Localization and metadata

-   Add `vi` and `en` UI strings.
-   Verify UI-only localization.
-   Add dynamic localized metadata.
-   Use existing canonical URL and locale alternate helpers.

## Task 05.7 --- Responsive and accessibility QA

-   Verify desktop/tablet/mobile.
-   Verify full notes rendering.
-   Verify semantic structure and keyboard behavior.
-   Verify no fabricated content or broken optional-field layout.

## Task 05.8 --- Tests and quality checks

-   Add route/identity tests.
-   Add source-content rendering tests.
-   Add Maps/optional-field tests.
-   Add locale/metadata tests.
-   Add Explore-link integration tests.
-   Run lint, format, type-check, test, and build.

## Task 05.9 --- Final review and report

-   Review exact scope.
-   Confirm no dependency changes.
-   Report implementation and limitations.
-   Complete acceptance checklist.
-   State readiness for Phase 06 without starting it.

------------------------------------------------------------------------

# 15. Explicit Non-goals

Do not implement in Phase 05: - Areas index/detail pages. - Trip Ideas
or itinerary detail pages. - Insights or analytics charts. -
Related-place recommendations or "You may also like". - Embedded map,
map tiles, geocoding, directions, or coordinates. - Listing photos,
image scraping, stock imagery, or AI-generated place imagery. - Booking,
reservations, ticketing, or availability. - Phone, email, social media,
or contact enrichment. - User accounts, authentication, favorites, or
reviews. - Rating submission or review counts. - Numeric price parsing
or comparison. - Opening-now calculation or live hours verification. -
Source text translation, rewriting, truncation, or editorial
classification. - Merging duplicate records. - Manual sync/update,
cooldown, rate limiting, or persistent caching. - Database, Redis, KV,
or separate backend. - New dependencies without explicit approval. -
Unrelated refactors or cleanup. - Phase 06, 07, or 08 work.

------------------------------------------------------------------------

# 16. Acceptance Criteria --- DETAIL-01 to DETAIL-38

Use `PASS`, `PARTIAL`, `BLOCKED`, or `NOT APPLICABLE` with evidence. Do
not mark PASS based on assumptions.

  -----------------------------------------------------------------------
  ID                                  Acceptance criterion
  ----------------------------------- -----------------------------------
  DETAIL-01                           Phase 02 normalized data contract
                                      and actual ID implementation have
                                      been inspected.

  DETAIL-02                           Phase 03 source-to-dataset pipeline
                                      and Phase 04 shared loader have
                                      been verified in code.

  DETAIL-03                           Place Detail uses existing
                                      normalized `TravelListing` type; no
                                      duplicate incompatible model is
                                      introduced.

  DETAIL-04                           Detail route follows actual App
                                      Router and locale routing
                                      conventions.

  DETAIL-05                           Candidate `/places/[id]` route is
                                      reconciled with actual route
                                      architecture and documented.

  DETAIL-06                           Listing resolution uses exact
                                      normalized `id`, never name-only
                                      matching.

  DETAIL-07                           Same-name records from different
                                      source sheets resolve to separate
                                      detail pages.

  DETAIL-08                           No random ID, row number, or
                                      `sourceIndex` is used as route
                                      identity.

  DETAIL-09                           Source/parser failure is distinct
                                      from a genuine not-found listing.

  DETAIL-10                           Unknown listing ID with valid
                                      dataset uses localized not-found
                                      behavior.

  DETAIL-11                           Place Detail fetches/parses data
                                      only through shared server-side
                                      pipeline.

  DETAIL-12                           XLSX bytes and parser objects never
                                      enter the client bundle.

  DETAIL-13                           Page follows confirmed Editorial
                                      direction and existing design
                                      tokens.

  DETAIL-14                           Listing name is rendered verbatim
                                      as primary heading.

  DETAIL-15                           Main category label is localized
                                      while source category remains
                                      unchanged.

  DETAIL-16                           Canonical area uses
                                      `areaName`/`areaId`, not raw
                                      `sourceArea`.

  DETAIL-17                           Normalized status is displayed with
                                      correct localized labels.

  DETAIL-18                           Null rating is omitted and never
                                      rendered as zero.

  DETAIL-19                           No review count or rating claim is
                                      fabricated.

  DETAIL-20                           Price text is rendered verbatim
                                      without numeric conversion.

  DETAIL-21                           Opening-hours text is rendered
                                      verbatim without live open/closed
                                      inference.

  DETAIL-22                           Address is rendered verbatim when
                                      present; missing address is
                                      omitted.

  DETAIL-23                           Highlights text is source-authentic
                                      and not translated or rewritten.

  DETAIL-24                           Notes section title is "Ghi chú &
                                      lưu ý" in Vietnamese.

  DETAIL-25                           Notes section title is "Notes &
                                      Important Information" in English.

  DETAIL-26                           `notesText` is rendered verbatim,
                                      including punctuation and line
                                      breaks; no
                                      truncation/collapse/translation
                                      occurs.

  DETAIL-27                           Notes section is hidden only when
                                      its normalized source value is
                                      null/empty.

  DETAIL-28                           Structured visit profile uses the
                                      four Phase 02 fields and preserves
                                      source values.

  DETAIL-29                           Raw `visitProfileRaw` is
                                      preserved/displayed when structured
                                      parsing is unavailable but raw data
                                      exists.

  DETAIL-30                           Maps CTA uses only exact validated
                                      `mapsUrl` and is omitted when
                                      absent.

  DETAIL-31                           No map embed, geocoding,
                                      coordinates, or synthesized Maps
                                      URL is introduced.

  DETAIL-32                           Explore Grid, List, and Table link
                                      each listing to its exact detail
                                      ID.

  DETAIL-33                           Explore filter/search/page state
                                      remains intact in browser history
                                      when navigating to and back from
                                      detail.

  DETAIL-34                           Related-place recommendations are
                                      omitted because no rule has been
                                      approved.

  DETAIL-35                           `vi` and `en` UI translations are
                                      complete; workbook source content
                                      remains untranslated.

  DETAIL-36                           Dynamic metadata follows existing
                                      locale/canonical conventions
                                      without fabricated claims.

  DETAIL-37                           Automated tests cover identity,
                                      duplicate records, raw text,
                                      optional fields, Maps, locale,
                                      errors, and navigation.

  DETAIL-38                           Responsive/accessibility checks
                                      pass; no unapproved dependency,
                                      database, sync system, or
                                      out-of-scope feature is added.
  -----------------------------------------------------------------------

Phase 05 cannot be marked fully complete if prerequisite data
integration is unverified, the detail route uses fabricated data,
same-name listings are merged, Notes & Tips are
changed/truncated/translated, or required quality checks have not been
run.

------------------------------------------------------------------------

# 17. Required Verification

Follow the checked-out repository's `AGENTS.md`. At minimum, run and
inspect:

``` bash
pnpm lint
pnpm format:check
pnpm type-check
pnpm test
pnpm build
```

If repository scripts differ, use exact required commands documented by
the repository and explain the difference.

If browser tooling is available, perform visual/interaction checks at
desktop, tablet, and mobile sizes. Report NOT RUN if unavailable.

Do not suppress warnings, loosen TypeScript, disable lint rules, or
alter Biome configuration to obtain a green result.

------------------------------------------------------------------------

# 18. Final Report Format

At completion, report:

1.  **Phase status:** completed, partially completed, or blocked.
2.  **Repository snapshot:** branch, commit SHA, working-tree status.
3.  **Prerequisite readiness:** Phase 01, 02, 03, and 04 implementation
    status.
4.  **Product decisions:** confirmed Option A identity behavior, Notes &
    Tips Option A, route decision, and unresolved proposals.
5.  **Architecture:** actual route path, module path, data loader, and
    server/client responsibilities.
6.  **Data resolution:** exact ID lookup and duplicate handling.
7.  **Page sections:** what is rendered and which optional fields are
    omitted.
8.  **Source integrity:** proof that notes, highlights, price, opening
    hours, address, and visit-profile values remain unchanged.
9.  **Explore integration:** Grid/List/Table link behavior and history
    state.
10. **Localization:** `vi`/`en` parity and confirmation that source
    values remain untranslated.
11. **SEO:** metadata and canonical behavior.
12. **Accessibility/responsive review:** actual checks performed.
13. **Files created/modified:** exact paths and purpose.
14. **Dependencies:** confirm whether any dependency/lockfile changed;
    no unapproved changes allowed.
15. **Tests and quality checks:** exact commands and actual outcomes.
16. **Acceptance checklist:** DETAIL-01--DETAIL-38 with evidence.
17. **Known limitations:** source identity changes, absent images,
    absent Maps links, missing optional data, or blocked prerequisites.
18. **Phase 06 readiness:** list remaining dependencies for Areas & Trip
    Ideas without starting it.

**End of Phase 05 Detailed Implementation Specification.**
