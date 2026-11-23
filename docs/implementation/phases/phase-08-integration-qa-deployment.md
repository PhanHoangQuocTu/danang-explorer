# Phase 08 — Integration, Data Refresh, QA & Vercel Deployment
## Codex Detailed Implementation Specification

**Project:** Da Nang Travel Discovery\
**Repository:** https://github.com/PhanHoangQuocTu/nextjs-frontend-boilerplate\
**Phase:** 08 of 08 — final phase\
**Document type:** Authoritative implementation and release-readiness specification\
**Focus:** End-to-end integration, initial/latest-data fetching, Manual Update UX, proportional anti-spam controls, comprehensive QA, Vercel release preparation.\
**Audience:** Public travel website.\
**Languages:** Vietnamese (`vi`, default) and English (`en`). Workbook content is not translated.\
**Design:** Editorial. **Platform:** Vercel. **Persistence:** No database or separate backend.\
**Status:** Product decisions are preserved; operational values still needing approval are marked as proposals.

---

# 0. Codex Operating Contract

You are the senior cross-functional delivery team for the final phase. Your goal is to integrate and verify **the implementation that exists**, not to silently rebuild the product or claim prior specifications are code.

Before making changes:

1. Inspect current branch, HEAD, latest commit, `git status`, untracked and uncommitted files. Preserve all user work.
2. Read root `AGENTS.md`, `CLAUDE.md`, applicable nested instructions, `package.json`, lockfile, Next.js config, deployment/CI files, environment schema, route tree and test setup.
3. Read all Phase 01–07 specifications and **actual implementation reports**. Inspect implementation code and tests for each phase.
4. Confirm source-to-dataset pipeline, normalized data contracts, Home/Explore, Place Detail, Areas, Trip Ideas, Public Insights, translation namespaces and SEO code.
5. Discover the available MCP tools, connected plugins and skills. Use relevant tools for real work; do not force irrelevant tools or claim unperformed actions.
6. Create a **Repository-Aware Implementation & Release Plan** with dependency graph, exact affected files, order of work, risks, QA matrix, Vercel environment checks and release gates.
7. **STOP and request explicit user approval of the plan before editing any code.**
8. Require separate explicit user approval for new/updated dependencies or lockfile, environment variables/secrets, external services, paid Vercel features, firewall configuration, commits/pushes and production deployment.
9. Never discard user changes, force push, rebase, amend, commit or rewrite Git history without authorization.
10. Never claim testing, browser verification, live source access or deployment passed unless actually performed and evidenced.
11. If prerequisite phases are absent, report exact blockers and propose implementation sequencing. **Do not fabricate production data, duplicate the parser/connector or call Phase 08 complete.**

## 0.1 Repository snapshot — not a claim about the working branch

The GitHub `main` tree was checked during this specification's preparation. Its HEAD was `49d111f12cf8a1356f1d085cd47b7793f77ba9ef`. It still showed a reusable boilerplate (`Health`, `Posts`) and no Da Nang product modules in the expected paths. `AGENTS.md` explicitly described the main tree as a boilerplate with no product features.

The current working branch may differ. **Codex must inspect the user's checked-out branch before deciding what exists.** Do not switch, merge or cherry-pick branches without approval.

The observed stack included Next.js 16, React 19, TypeScript 7 strict, Tailwind CSS 4, next-intl, Recharts, shadcn/ui, Vitest, Storybook, Biome, Node 22 and pnpm 12. Reconfirm current actual versions.

## 0.2 Approval gates

- **Gate A — Implementation:** read-only audit + plan approved before editing code.
- **Gate B — Dependency/Configuration:** explicit approval before dependency, lockfile, env or external-provider changes.
- **Gate C — Platform protection:** explicit approval before WAF rules, rate-limit charges, paid features or firewall mutations.
- **Gate D — Production:** separate explicit authorization before deployment/promotion to production.
- **Gate E — Acceptance:** demonstrate criteria, test evidence, release readiness and remaining limitations.

---

# 1. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| Senior Software Engineer / Tech Lead | Integrate existing code, keep boundaries small, avoid needless complexity |
| Senior Business Analyst | Preserve decisions, define release requirements and unresolved issues |
| Senior Next.js Engineer | App Router, server/client boundaries, refresh and runtime correctness |
| Senior Data Engineer | Workbook/LOC joins, stable IDs, validation, coherent normalized dataset |
| Senior QA Engineer | Unit/integration/E2E matrix, regression, negative tests, release evidence |
| Senior Frontend Engineer | Shared Update control, consistent states and responsive UX |
| Senior UI/UX and Accessibility Engineer | Editorial direction, keyboard focus, labels, screen reader and mobile |
| Senior Security Engineer | Public-source handling, trust boundaries, anti-abuse and URL validation |
| Senior DevOps / Vercel Engineer | Runtime, env, deployment checks, preview, rollback |
| Senior Data Analyst | Metric invariants and no invented analytics |
| i18n and SEO Specialist | `vi` default, `en` parity, metadata and sitemap |

These are responsibilities, not instructions to install an agent orchestration library.

---

# 2. Confirmed Product Decisions — Do Not Reopen Without Need

## 2.1 Application and workbook

- One Next.js application using its built-in server/client capabilities; **no separately deployed backend**.
- **No database**, Redis, KV, queue, persistent store or worker system.
- Target deployment: **Vercel**.
- Public Google Drive / Google Sheets workbook; anonymous read (`Anyone`) is allowed.
- Spreadsheet ID: `1b5ozJ_3cu1cp9JUNdX7fTggV2EQGI4Th`.
- Source URL: `https://docs.google.com/spreadsheets/d/1b5ozJ_3cu1cp9JUNdX7fTggV2EQGI4Th/edit?usp=sharing&ouid=107497916965545826710&rtpof=true&sd=true`.
- An external tracking process overwrites the workbook **approximately once daily**, completion time unknown.
- **Initial page load should use the latest available workbook export.**
- **All visitors may press Update** to fetch currently available data; no authentication required.
- Update must not trigger a Drive write or the external tracking process.
- A Manual Update guard should prevent repeated rapid clicks; do not misrepresent browser-only protection as a global server rate limit.
- **Silent updates:** show changed data naturally, without disruptive change-count modals or toasts.
- The workbook is public, but secrets/API keys/user-private information are not public.
- Raw XLSX download, parsing, mapping and normalization remain server-only.
- Prioritize simple architecture and reuse boilerplate; do not over-engineer.

## 2.2 UI and business rules

- UI languages: `vi` and `en`, **default `vi`**.
- Workbook values remain source-authentic (mostly Vietnamese); translate UI labels only.
- Editorial visual direction for all pages.
- Explore default view **Grid**; status default **All**; pagination **24 records per page**.
- Vietnamese-accent-insensitive and case-insensitive search; AND across filter dimensions, OR within multi-select dimension; filter URL state.
- Mapping: `LOC_THEO_KHU_VUC` is canonical for `areaId`, `areaName`, and status; never use raw `sourceArea` for analytics/filters/counts.
- Same-name records from different source sheets remain separate, with deterministic IDs.
- Listing status enum: `ACTIVE`, `UNVERIFIED`, `WARNING`, `CLOSED_BANNED`, `UNKNOWN`.
- Numeric rating 0–5 or null; null must not become 0.
- `priceText`, `openingHoursText`, highlights, Notes & Tips, editorial and visit-profile fields are source text, not inferred structured numeric facts.
- Notes & Tips Option A: render `notesText` verbatim with headings `Ghi chú & lưu ý` / `Notes & Important Information`, no translation, truncation, rewriting or collapse.
- Google Maps only from validated actual XLSX hyperlink target (`mapsUrl`). **Simple map** means no in-app map/geocoding/route drawing.
- Public Insights (Phase 07) is for visitors, not an admin dashboard; no average overall rating, average price, popularity, visitor or revenue statistics.

## 2.3 Phase responsibility matrix

| Phase | Scope | Phase 08 verification |
|---|---|---|
| 01 | Codebase audit and rules | Repository guidelines, architecture and patterns |
| 02 | XLSX parser, mapping and normalization | Actual code, fixture, integrity and tests |
| 03 | Public Google Drive connector | Server-only fetch, validation, source composition |
| 04 | Home & Explore | Search, filters, Grid/List/Table, URL state, shared loader |
| 05 | Place Detail | Exact ID, duplicate handling, raw notes, maps links |
| 06 | Areas & Trip Ideas | Eight areas, exact counts and source editorial sections |
| 07 | Public Travel Insights | KPI/chart invariants, source-derived top rated |
| **08** | **Integration, refresh, QA, deployment** | Final implementation and release readiness |

If Phase 02–07 is not implemented, do not silently reproduce it in Phase 08. Provide a gap matrix and block final release.

---

# 3. Phase 08 Deliverables and Non-goals

## 3.1 Deliverables

1. Verified integration of all actual product routes and shared data contracts.
2. Consistent latest-data retrieval on initial load, through existing server-side data path.
3. A shared Manual Update control available to all visitors, with browser in-flight and cooldown protection.
4. Honest, silent update feedback that never fabricates successful data validation.
5. A clear anti-spam limitation statement; optional Vercel WAF feasibility/approval path if stronger enforcement is required.
6. Verified behavior when workbook is unchanged, changed, partially overwritten, invalid, inaccessible or rate-limited.
7. Data consistency, localization, SEO, responsive/accessibility and security regression fixes.
8. Offline unit/integration regression tests, controlled live-source smoke tests, and browser journey checks.
9. Vercel environment, runtime and preview deployment readiness checks.
10. Final release report, issue register, runbook and rollback plan.
11. Production deployment **only after separate, explicit user authorization**.

## 3.2 Out of scope

- Rebuilding missing Phase 02–07 product modules without approval.
- New database, Redis, KV, persistent snapshot store, worker or cron.
- Separate backend service.
- Auth, accounts, roles, paid plans or private admin dashboard.
- Google OAuth/service account/API key solely to read this public workbook.
- AI travel planner, geocoding, route optimization, maps with pins/tiles, image scraping or fake photographs.
- Price analytics, review counts, user activity tracking, visitor analytics, trends or invented ratings.
- Automatic background polling or subscription to Drive updates.
- New UI framework or chart package.
- Production Vercel deployment, paid WAF activation, firewall or billing changes without approval.
- Unrelated refactors of Health/Posts examples or framework-wide redesign.

---

# 4. One Shared Data Pipeline

```text
External daily tracking -> overwrite Public Google XLSX (unknown completion time)
                                  |
                                  v
             Phase 03 server-only public export connector
             HTTP/redirect/content/size/ZIP validation
             explicit no-store, timeout and safe errors
                                  |
                                  v
            Phase 02 server-only parser + workbook mapping
            stable source keys, exact LOC joins, diagnostics
                                  |
                                  v
                     Shared normalized dataset
                         (Phase 04 loader)
                                  |
          +-------------+----------+----------+-------------+
          |             |                     |             |
          v             v                     v             v
      Home/Explore  Place Detail          Areas/Trips   Public Insights
          +-------------+----------+----------+-------------+
                                  ^
                                  |
                       Manual Update UI
             client guard -> router.refresh()
               -> fresh server-side request
```

This is a conceptual diagram, not proof that the modules exist at these paths.

## 4.1 Required pipeline invariants

- Every route uses the actual same normalized dataset loader and mapping semantics.
- No workbook parsing in browsers or chart components.
- No parallel data source per page.
- No stale cover-sheet totals treated as current counts.
- No splitting records across old and new workbook versions in one rendered response.
- Within a single server request, aggregate values and page records derive from one coherent normalized dataset instance.
- Prefer safe request-scoped memoization only if actual framework behavior and repository conventions support it; do not introduce a global mutable cache.
- No per-chart or per-card Google fetch.
- No silent fallback to fabricated production data.
- Preserve source diagnostics internally, not on public pages.

## 4.2 Source fetch validation

Verify existing Phase 03 behavior before changing it:

- Fixed spreadsheet ID and anonymous public export URL.
- No user-supplied arbitrary URL or ID.
- `fetch` uses explicit `cache: 'no-store'`.
- Timeouts, redirect destinations, status, response type and downloaded-size guard.
- Reject HTML/login/error responses, empty content, invalid XLSX/ZIP signatures.
- Verify expected sheets and headers through Phase 02.
- Reject malformed duplicate keys within one source sheet.
- Accept valid optional-field nulls and changes in legitimate row counts.
- Never replace valid data with a structurally invalid/partial workbook silently.
- Never conflate source fetch failure with valid empty data.

The inspected regression workbook had 14 worksheets, 11 detail sheets and 432 valid named listings. **These are fixture expectations, not production constants.**

## 4.3 Overwrite and last-known-good limitations

The external tracker may still be writing when the user requests data. Results might be old, temporarily inaccessible, partial, or newly valid.

- Do not assume a specific daily update completion time.
- Do not infer `fetchedAt` from `TRANG BIA` or other cover-sheet dates.
- Reject invalid incoming files; do not render half-parsed new data.
- Display the latest valid export returned by the server request, if one is obtained.
- If the current browser already has a valid page, preserve it during a refresh where the existing architecture permits; **do not guarantee** that it remains visible if a server render fails and an error boundary replaces it.
- **Last-known-good across requests, instances, or deployments is NOT guaranteed without an approved durable cache or store.** Do not pretend a module variable or ephemeral filesystem provides it.
- Do not create new durable storage without approval.

---
# 5. Initial Page Loading — Latest Available Data

## 5.1 Initial user journey

On first visit to any public travel route:

1. The server invokes the **existing** shared normalized dataset loader.
2. The loader calls the server-only public connector and parser; the source fetch has `no-store` semantics.
3. The server renders actual normalized content and any derived counts from one coherent snapshot.
4. If source retrieval or validation fails, render the established localized error boundary, not fake zero listings.
5. The visitor need not click Update merely to access the latest available source returned by Google.

**Definition of “latest”:** the current valid workbook export returned to the server during the request. This does not guarantee that the external daily tracker has finished writing, nor that every navigation always results in a new fetch if a separate client Router Cache is used.

## 5.2 Next.js caching verification

Phase 03's `cache: 'no-store'` applies to the **upstream fetch**. It does not, by itself, prove every client navigation bypasses App Router client cache/prefetch behavior.

Codex must inspect actual Next.js 16 routing/render behavior:

- Verify browser hard reload and initial HTTP request do not use a permanently baked production dataset.
- Verify manual `router.refresh()` triggers a new server render and the source loader actually runs.
- Verify where Route Cache, Router Cache, prefetch and request-scoped deduplication apply.
- Verify source fetch isn't inadvertently cached in an outer utility, `unstable_cache` or module singleton.
- Do not randomly disable all prefetching or force `window.location.reload()` without measured need.
- Preserve the previously accepted `no-store` upstream behavior unless an approved new freshness trade-off exists.
- Do not add polling, cron or a background refresh worker.

## 5.3 Source metadata and UI wording

- `fetchedAt` means **when the server fetched/exported the workbook**.
- Optional HTTP `Last-Modified` is upstream metadata, not the daily tracking completion time.
- Workbook cover-sheet prose is not an authoritative freshness timestamp.
- Only show a “Last checked”/“Đã kiểm tra lúc” timestamp when the existing connector truly provides it.
- If metadata is absent, omit the timestamp; never invent “Updated today”.
- Do not expose internal source URLs containing temporary redirect tokens, diagnostics, file hashes or raw parser exceptions to visitors.

---

# 6. Manual Update — Functional and UI/UX Specification

## 6.1 Confirmed business rules

- A visible action for **all** visitors; no login.
- **Read-only refresh**: no Drive edit, write, upload or tracker trigger.
- Prioritize the latest available server-side source.
- Avoid rapid repeated clicks and duplicate in-flight actions.
- Preserve active route and context.
- Silent changes: no disruptive modal or change-count toast.
- Accessible, bilingual, consistent Editorial style.
- No new database or separately deployed service.

## 6.2 Recommended Mode A: minimal, no new service

Recommended baseline: reuse the current locale-aware navigation and invoke **`router.refresh()`** from one small Client Component, with browser-scoped single-flight/cooldown control.

1. Visitor clicks `Cập nhật dữ liệu` / `Refresh data`.
2. The control immediately blocks another activation in that mounted component.
3. A refresh is requested using the existing App Router and shared server data path.
4. It preserves the current URL: `/explore` query, filters, sort, view, page; `/places/[id]`; `/areas/[areaId]`; `/trip-ideas`; `/insights`; active locale.
5. The new valid normalized dataset appears naturally after rerender; avoid noisy announcements of per-record changes.
6. The control applies the agreed browser cooldown and becomes usable after expiry.
7. No new client-side XLSX fetch, direct Google request or separate parser.
8. Do not introduce a POST endpoint merely to claim that a refresh occurred.

**Why this mode:** the server data loader already has fresh source-fetch behavior. A second `/api/sync` flow would add duplicated fetch/parsing or additional state without clear benefit.

## 6.3 Status states

| State | UI feedback | Expected behavior |
|---|---|---|
| Idle | “Cập nhật dữ liệu” / “Refresh data” | No request until click |
| Refresh requested | Disabled control, discreet pending indicator | One attempted refresh |
| Cooldown | Disabled, optional concise time remaining | No repeated browser button action |
| Updated page | No intrusive “N địa điểm đã đổi” alert | Render validated dataset |
| Unchanged source | No fabricated “new content” claim | Page remains normal |
| Source failure | Existing localized safe error state | No fake success / no fake empty dataset |

**Important:** `router.refresh()` does **not** automatically give the button a reliable success/error result for the actual XLSX download and parse. Do not display “Sync succeeded” simply because the method was called. Do not leave a spinner stuck forever awaiting an event that the router does not expose. Use an existing transition/status mechanism where valid; if the product requires authoritative success timestamps, propose the smallest server-confirmed response contract and request approval before adding a second network path.

## 6.4 Browser anti-spam guard

At minimum:

- One in-flight action per mounted control.
- Synchronous repeated-click guard, independent of render timing.
- Disable during pending transition where accurately supported.
- Browser-scoped cooldown across reloads/tabs **when browser storage and events can support it**, with a safe fallback when they cannot.
- Initialize `localStorage` only in the browser (never in Server Components or during SSR).
- Validate stored values (finite, plausible timestamp, never `NaN`/`Infinity`).
- Handle private mode / storage denied / cleared storage gracefully.
- Keep timer use small and clean up on unmount.
- Use aria-label/aria-disabled or native `disabled` plus appropriate accessible status.
- Respect reduced-motion preference; no toast spam.
- Do not automatically refresh on mount, page focus or interval.
- Do not assume browser-local guard applies to API clients, malicious callers, other browsers, or all serverless instances.

### Cooldown duration — proposal, not confirmed decision

The user confirmed a **need for anti-spam**, not an exact timeout.

Suggested default for plan review: **60 seconds per browser**. Codex must label it **proposed** and obtain user approval in the Implementation Plan before hardcoding this as the product rule. If a different interval has already been approved in actual project documentation, follow that evidence instead.

## 6.5 Server-authoritative guard and Vercel trade-off

A previous architecture decision requests authoritative server protection. With stateless horizontally scaled Vercel Functions:

- `globalThis`, module-level Maps, `let lastUpdated`, an in-memory mutex or ephemeral filesystem do **not** provide reliable global/shared cooldown.
- `localStorage` is UX-only; direct HTTP requests can bypass it.
- A client-cached cookie does not automatically guarantee global rate limiting.
- `router.refresh()` requests often target the same page route as normal navigation, so indiscriminate path-based WAF limits risk throttling legitimate page loads.

**Mode A (baseline):** browser guard and existing upstream fetch validation; publicly acknowledge that it is best-effort UX protection, not hard server-global anti-spam.

**Mode B (optional, explicit approval):** evaluate Vercel WAF Rate Limiting or an already-approved platform control. Before proposing a rule, verify:

1. Current Vercel account plan and feature availability.
2. Costs/pricing and user's approval.
3. Whether refresh traffic can be distinguished from normal page navigation.
4. Matching rule and request volume threshold.
5. Effect on preview, production and both locales.
6. False positives for users sharing an IP or behind NAT.
7. How to verify a rule without aggressive network load.
8. How to turn it off or roll back.

If the only robust path requires a dedicated same-origin POST endpoint, prepare a separate design describing its actual purpose, method, response, possible second source fetch and additional cost. **Do not implement it by default.** A dedicated endpoint does not itself create a cross-instance lock.

**Release honesty:** if strict globally enforced rate limiting is mandatory and Mode B was not approved/tested, mark the strict requirement PARTIAL or BLOCKED, not PASS. Do not introduce Redis/KV/database or a paid service without consent.

## 6.6 Navigation preservation

After Update, verify:

- Home remains Home.
- Explore retains text query, category/source-category/area/rating/status/suitable-for/recommended-time filters, sorting, Grid/List/Table view, and page number where still valid.
- If results decrease and current page is now out of range, clamp safely according to Phase 04 rules.
- Place Detail remains on the same exact stable listing ID. If the listing vanished due to a legitimate source rename/move, use established not-found behavior.
- Area Detail remains on its canonical area ID.
- Trip Ideas editorial follows the current source.
- Insights counts and charts derive from one current normalized dataset.
- Locale never flips unexpectedly, and browser history remains meaningful.
- A source-fetch failure is not disguised as an empty result.

---

# 7. End-to-End Product Integration Matrix

The route names below are **candidate public routes from earlier specifications**. Codex must verify actual implementation before using or linking to them.

| Surface | Candidate route | Mandatory integration checks |
|---|---|---|
| Home | `/` | Editorial hero, search, 5 categories, 8 area links, source-authentic previews |
| Explore | `/explore` | Search/filter/URL, Grid/List/Table, 24/page, status All, Update |
| Place Detail | `/places/[id]` | Exact ID, separate duplicates, raw Notes, `mapsUrl`, error vs 404 |
| Areas Index | `/areas` | Eight canonical areas and computed counts |
| Area Detail | `/areas/[areaId]` | Exact `areaId` membership, link to Explore, optional detail link |
| Trip Ideas | `/trip-ideas` | Five Quick Ideas, eleven Top Picks, three days, two tips; raw source |
| Public Insights | `/insights` | KPI/category/area/status/rating invariants; top-rated status |

## 7.1 Home and Explore regression

- Home search submits a shareable Explore query.
- Five category IDs are stable.
- Eight area IDs are canonical.
- Explore Grid is default; status All is default.
- Pagination 24 records per page.
- Search is case-insensitive and Vietnamese-accent-insensitive including `đ`/`Đ`.
- Different filter dimensions combine with AND; multiple selections within one dimension combine with OR.
- No numeric price filter/sorting.
- Null rating is not zero.
- Clear All resets approved defaults and page number.
- URL state survives share, reload, Back and view switching.
- Source category/visit-profile values stay source-authentic.
- Refresh preserves URL and re-evaluates pagination.

## 7.2 Place Detail regression

- Resolve listing by exact normalized `id`, never name alone.
- Same name in different sheets remains distinct.
- `notesText` remains full, verbatim, not collapsed/translated.
- Source price, opening hours, highlights and visit-profile values unchanged.
- Status maps from normalized enum, not prose.
- Google Maps CTA uses the exact validated hyperlink, or is omitted.
- Invalid source is not mistaken for an unknown ID.
- Back navigation returns to filtered Explore state where browser routing supports it.

## 7.3 Areas and Trip Ideas regression

- Only eight canonical areas; `unknown` is not a ninth canonical area.
- Counts computed dynamically from `listing.areaId`, never LOC reported counts or `sourceArea`.
- `TOP_PICKS_LICH_TRINH` content is source-authentic: 5 Quick Ideas, 11 Top Picks, 3 itinerary day entries and 2 Travel Tips in inspected fixture.
- No machine translation, rewording, inferred places, invented route times or generated itineraries.
- Editorial links only when explicit/exact and unambiguous; duplicate names must not be guessed.

## 7.4 Public Insights regression

- Total listing count = normalized record length.
- Category counts, area counts with unknown bucket, and status counts reconcile to total.
- Numeric ratings only; null/non-numeric separately counted.
- Rating buckets mutually exclusive, collectively cover valid 0–5 ratings.
- No average system-wide rating, price analytics, visitor count, fabricated popularity or review count.
- Top Rated keeps exact identities, displays normalized status and never silently claims places are verified/open.
- **Open decision:** the final inclusion rule for `ACTIVE` vs **All** statuses in Top Rated was explicitly asked but not answered in the most recent Phase 07 turn. Codex must reconcile against any later approval or flag it in the plan; do not treat the unanswered question as consent.

## 7.5 Navigation and links

- Header/footer/breadcrumb navigation only to real implemented routes.
- All internal links use `@/i18n/navigation` conventions.
- No guessed Place Detail IDs or source-text-derived URLs.
- Valid external Maps links use safe `target`/`rel` attributes.
- Unknown route/ID/area returns localized not-found, not data error.
- Server-to-client boundary is safe across route transitions.

---

# 8. Internationalization, SEO and Editorial Design

## 8.1 Localization

- Default product locale is `vi`, alternative `en`.
- Inspect `src/i18n/routing.ts`. GitHub `main` snapshot used `DEFAULT_LOCALE = 'en'`, which conflicts with the approved product default.
- If an earlier phase fixed this, retain its implementation; otherwise propose the smallest reviewed cross-cutting fix in Phase 08.
- Respect `src/messages/index.ts` namespace registration and typed message parity.
- Use `useTranslationsServer` and repository-approved `useTranslations` wrappers; do not bypass `AGENTS.md` translation rules.
- Preserve source workbook text (names, addresses, categories, areas, prices, hours, notes and editorial) verbatim in both locales.
- Translate UI labels and error states only.
- Locale switch retains current route/query where practical; ensure no hydration warnings.

## 8.2 SEO

- All public routes use the existing `buildMetadata` helper and locale-aware canonical URLs.
- Indexable routes are added to `INDEXABLE_ROUTES` according to repository rules.
- Robots/sitemap do not expose unimplemented routes or private operational endpoints.
- Preview/nonproduction remains noindex according to existing environment rules.
- Query filter variants do not create false independent canonical landing pages.
- No metadata claims “official”, “verified”, “open now”, “best”, “most popular” without source support.
- Never handwrite incomplete Open Graph/alternates metadata that overrides shared helpers.

## 8.3 Editorial and responsive QA

- Consistent typography, whitespace, status labels, cards, buttons and loading/error states.
- Desktop/tablet/mobile supported; no page-level horizontal overflow.
- No stock photos masquerading as actual listings; no unapproved map systems.
- Long Vietnamese notes render completely.
- Accessible breadcrumbs, semantic tables, legends and chart data alternatives.
- Keyboard focus and contrast sufficient in supported themes.
- Update feedback is silent but still accessible.

---
# 9. Error Handling, Reliability and Recoverability

| Scenario | Required behavior |
|---|---|
| Google returns 401/403 or inaccessible source | Localized source error, no silent OAuth fallback |
| Google returns 429 | No aggressive retries; safe error messaging |
| Upstream timeout / 5xx | Bounded request, safe error, no fake success |
| HTML/login page instead of XLSX | Reject response |
| Empty, oversized or invalid ZIP/XLSX | Reject invalid workbook |
| Required sheet or header missing | Structural validation failure; no partial render |
| Valid workbook with zero listings | Proper empty-data UI, not mistaken for fetch failure |
| Unknown Place ID on valid dataset | Localized not-found |
| Unknown Area ID on valid dataset | Localized not-found |
| Null/out-of-range rating | Excluded from numeric aggregates; null never becomes zero |
| Invalid Maps URL | Omit Maps action |
| Rapid Update click | Prevent extra browser action |
| Cooldown active | Disabled button with accessible state |
| Browser storage unavailable/corrupt | Graceful fallback; no crash |
| Failed Update | Never claim success; use established localized failure behavior |
| Same workbook as before | No fabricated “new data” announcement |
| New valid workbook | Updated normalized data rendered coherently |
| Page disappears due to source rename | Established valid-dataset not-found behavior |
| Vercel Function timeout | Log safe diagnostics; report runtime limitation |

**Last-known-good clarification:** keeping currently displayed content in the browser while a retry fails is different from keeping an authoritative last-good snapshot shared across requests or deployments. The latter needs a separately approved storage/cache design. Do not claim it is provided by a module-level variable.

---

# 10. Security and Performance Review

## 10.1 Security

- Source ID is fixed/configured, not visitor-supplied.
- Do not expose raw XLSX bytes, parser internals or transient signed redirect URLs.
- Redirect host, content type, HTTP status, response size and ZIP signature validation remain enabled.
- Do not render workbook strings as trusted HTML; use React escaping, not `dangerouslySetInnerHTML`.
- External Google Maps URLs are validated, not generated from names/addresses.
- No secrets, API keys, cookies or private user data in public output/logs.
- Manual Update is read-only and accessible to all users.
- Browser guard limitations are documented honestly.
- Strict server-wide rate limiting requires approved platform protection; client code cannot guarantee it.
- Avoid unnecessary new endpoint, request logging, analytics or tracking.

## 10.2 Performance and Vercel costs

Measure actual data-loader behavior rather than guessing:

- Upstream fetch latency and bytes.
- Parse/mapping/validation time.
- Total server render time for Home, Explore, Place Detail and Insights.
- Number of upstream fetches per page request.
- Added client JS size for charts/Update controls.
- Function runtime memory/timeout compatibility.
- Build output, cold-start indicators and warnings where tools expose them.
- Controlled manual refresh behavior without stress-testing public Google.

Avoid repeated fetches per chart/card and avoid a browser-side workbook download. Keep existing `no-store` semantics and document that per-request parsing can have performance/cost consequences at scale. Do not quietly introduce a stale TTL to optimize cost; ask for approval if a different freshness policy becomes necessary.

---

# 11. QA Strategy and Detailed Test Plan

Automated unit/integration tests must use deterministic mocks or the approved offline XLSX fixture. **No automated test suite should call the public Google workbook or production website.** Live source tests must be controlled, read-only, separately identified smoke tests.

## 11.1 Data Foundation regression

Verify the real Phase 02 fixture (not hardcoded production totals):

| Fixture assertion | Expected inspected snapshot |
|---|---:|
| Worksheets | 14 |
| Detail worksheets | 11 |
| Supporting sheets | 3 |
| Valid named listings | 432 |
| Five main categories | 5 |
| Eight canonical areas | 8 |
| Numeric ratings | 395 |
| Null/non-numeric ratings | 37 |
| Valid Maps hyperlink targets | 424 |
| Missing Maps hyperlinks | 8 |
| Four same-name cross-sheet groups | 4 |
| Known `sourceArea`/canonical differences | 5 |

Additional tests: malformed/renamed sheet, missing required header, duplicate composite key, status `UNKNOWN`, canonical `unknown`, invalid/absent Maps URL, rating 0/5/boundaries/null, optional blank fields, preservation of raw notes/editorial.

If the live workbook changed since the fixture, compare and report; do not silently change fixture regression expectations or force live counts to equal 432.

## 11.2 UI and navigation journey matrix

Test **both `vi` and `en`**:

| Journey | Expected result |
|---|---|
| Home → Explore search | Query in URL, correct matches |
| Home category → Explore | Correct main category ID |
| Home area → Areas/Explore | Exact canonical `areaId` and only implemented destination |
| Explore search | Case- and accent-insensitive, including `đ`/`Đ` |
| Explore multi-filters | AND across dimensions; OR within a dimension |
| Explore Grid/List/Table | Same members, filters and page state |
| Explore pagination | 24/page; invalid/out-of-range pages safe |
| Explore → Detail → Back | Exact ID and original filtered URL |
| Duplicate same-name places | Separate source-sheet records/detail URLs |
| Area index → Area detail | Eight areas; exact membership |
| Area detail → Explore | Canonical area query state |
| Trip Ideas hub | 5/11/3/2 entries, verbatim source text |
| Insights | Category/area/status/rating totals, accessible charts |
| Locale switch | UI strings translated, workbook strings unchanged |
| Unknown route/ID/area | Localized not-found, not server source failure |
| Source failure simulation | Safe localized error, not fake empty data |
| Valid Maps external action | Exact validated href and safe attributes |
| Mobile/tablet/desktop | Readable, keyboard operable, no horizontal overflow |

## 11.3 Manual Update tests

1. First eligible click requests only one refresh.
2. Double-click and rapid repeated clicks do not create duplicate actions from the same mounted control.
3. `isPending`/disabled state is correctly conveyed.
4. Agreed browser cooldown applies after the attempt.
5. Cooldown survives reload where browser storage is usable.
6. Malformed stored timestamp is safely ignored/reset.
7. Storage access denied does not crash rendering or hydration.
8. Cooldown expires and control becomes usable.
9. Two separate browsers are **not falsely claimed** to share a browser guard.
10. Explore query, filters, sort, view and current page preserved during `router.refresh()`.
11. Place Detail ID, Area ID, Trip Ideas, Insights and locale preserved.
12. A valid source change appears after fresh render.
13. An unchanged source does not produce fake change notifications.
14. Source fetch/parser failure does not produce false success.
15. No Drive write/upload/tracker trigger occurs.
16. UI remains silent for content change, but accessible status exists.
17. No spinner can become permanently stuck because the chosen navigation mechanism has no completion event.
18. If user approved WAF/server-specific rule, verify that exact rule independently and note false positives, coverage and costs.

## 11.4 Security and negative tests

- Source responds HTML instead of XLSX.
- 403, 404, 429, 5xx and timeout.
- Redirect to disallowed host.
- Oversized and empty responses.
- Corrupt ZIP/XLSX.
- Missing worksheet and invalid composite key.
- Missing Maps URL and non-Maps hostname.
- Zero-listing valid dataset.
- Invalid Explore query/pagination.
- Unknown status/area, null rating.
- Long source text and potential HTML markup in workbook cells.
- Disabled/blocked browser storage.
- External link and cookie/security-header review.
- Secrets/client bundle inspection.

## 11.5 Accessibility and visual checks

- One `h1`, semantic landmarks, breadcrumbs and headings.
- Accessible forms, pagination and table headers.
- Charts have textual values accessible without tooltip/hover.
- Status labels not conveyed by color alone.
- Keyboard focus visible, Update operable by keyboard.
- Accessible pending/disabled/cooldown semantics.
- Source Notes & Tips full text visible even on mobile.
- Responsive 320px mobile, normal mobile, tablet and desktop checks.
- No page-level horizontal overflow, unreadable axis ticks or truncated labels.
- No hydration, console or accessibility warnings.
- Check supported dark/light themes without redesigning theme system.

## 11.6 Browser tool and dependency rule

If browser tooling is available, inspect actual pages, console and network behavior. If no browser E2E framework is installed, use available browser tooling/manual checks. **Do not install Playwright/Cypress or other packages without approval.** Record actual coverage and mark unavailable checks `NOT RUN`.

---

# 12. Vercel Readiness and Deployment

## 12.1 Pre-deployment audit

- Authorized GitHub repository and selected branch.
- Node 22 / pnpm 12 as required by the checked-out repository.
- Next.js runtime and parser compatibility; server-only Node.js behavior.
- Build scripts, lockfile reproducibility, existing CI.
- Existing `.env.example`, `src/constants/env.ts` schema and project environment values (do not reveal secret values).
- `NEXT_PUBLIC_*` build-time exposure risks.
- Production app URL, domain, redirects and locale negotiation.
- `src/proxy.ts` and approved `vi` default.
- Public source reachable from actual Vercel Functions runtime.
- Page dynamic rendering and data freshness; no accidental baked data.
- Function memory/timeouts/size and expected daily workload.
- Sitemap, robots, metadata, alternate languages, preview noindex behavior.
- Existing security headers and external-link validation.
- No XLSX fixture under `public/` or accidentally shipped to client bundle.
- No new paid feature, external store or secret without approval.

## 12.2 Required quality commands

Check actual `AGENTS.md` before running commands. Observed baseline requires:

```bash
pnpm lint
pnpm format:check
pnpm type-check
pnpm test
pnpm build
```

If components or stories changed:

```bash
pnpm build-storybook
```

Every new component must have the required colocated Storybook story according to the repository's rule. Use Biome, not ESLint/Prettier. **Zero errors and zero warnings** are required. Do not weaken type checking, suppress warnings, or alter config to force a green report.

## 12.3 Preview deployment — separate authorization

If tools and permissions allow and the user authorizes preview:

1. Verify project, environment, branch, and preview URL.
2. Deploy to preview only.
3. Verify build and function logs.
4. Exercise all actual public routes in both locales.
5. Verify public Google export works in Vercel runtime.
6. Verify Manual Update UI/behavior.
7. Verify `noindex` on preview and correct production metadata patterns.
8. Check responsive UX, console warnings, and critical navigation.
9. Record preview URL, deployment ID and actual results.

If unavailable/not approved: mark `PREVIEW NOT RUN` and provide precise manual Vercel steps instead. Do not fabricate deployment evidence.

## 12.4 Production release — strict permission gate

**Never deploy or promote to production from this prompt without explicit later approval.**

Before asking the user for release permission:

- All actual product prerequisites functional.
- No P0/P1 defects.
- Full required quality suite passed.
- Real source smoke test passed or blocker documented.
- Security and rate-limit trade-off accepted.
- Build and runtime limits verified.
- Production env/domain reviewed.
- Preview tested when approved/available.
- Rollback plan prepared.

After explicit approval, use user's approved Vercel/Git workflow and run production smoke tests. Record the real production URL, deployment ID and logs. Without that evidence, the status must not say “live”.

## 12.5 Rollback playbook

- Record last known-good Vercel deployment.
- Verify rollback/redeploy mechanism under the actual Vercel plan.
- Keep workbook source version separate from application deployment.
- Production rollback requires user authorization.
- Verify critical routes after rollback.
- **Application rollback does not restore a previous Google Drive workbook version.** Do not claim to restore deleted/overwritten XLSX content without source versioning.
- Do not treat in-memory state as durable backup.

---

# 13. Release Gates and Defect Severity

| Severity | Examples | Release rule |
|---|---|---|
| P0 — Critical | Secrets exposed, data corruption, core site down, fake success on invalid source | BLOCK |
| P1 — High | Main route broken, bad LOC mapping/identity, persistent refresh failure, critical locale/SEO issue | BLOCK |
| P2 — Medium | Noncritical accessibility/layout defect with workaround | Record, fix or request acceptance |
| P3 — Low | Purely cosmetic polish | Can defer with evidence |

Gates:

1. Actual Phase 02–07 code and shared loader verified; no fake production data.
2. Public source fetch/parse works in target runtime.
3. Cross-page data semantics reconcile.
4. Manual Update implemented with clearly specified guard level.
5. No unresolved P0/P1 issues.
6. Lint, formatting, types, tests, build and applicable Storybook pass.
7. Both locales, SEO, a11y, responsive critical paths verified.
8. Preview deployed/tested where authorized and available.
9. Explicit production deployment authorization obtained independently.

Do not mark the phase READY if a required gate has failed. Do not silently waive an unapproved strict server rate-limit requirement.

---

# 14. Implementation Tasks and Workflow

## Task 08.1 — Audit and plan

- Inspect working branch, tree, instructions, implementation reports and code.
- Identify completed vs missing Phase 01–07 work.
- Verify source loader, runtime, routes, translations, SEO and test patterns.
- Produce exact-file Implementation & Release Plan with risks/approvals.
- **STOP for approval before editing.**

## Task 08.2 — Cross-module integration

- Verify Home/Explore, Place Detail, Areas/Trip Ideas and Insights consume shared data.
- Repair only verified integration defects.
- Confirm stable IDs, canonical areas, statuses and raw source content.
- Check links/navigation in both locales.

## Task 08.3 — Latest source fetching

- Verify no-store export source fetch and dynamic render.
- Check App Router cache/prefetch implications.
- Confirm one coherent dataset per render.
- Measure fetch/parsing cost.

## Task 08.4 — Manual Update UX

- Implement approved shared client refresh control.
- Preserve route and current filters.
- Add in-flight/cooldown handling with safe browser storage.
- Keep silent UI changes and accessibility.
- Avoid fake success statuses and unnecessary endpoints.

## Task 08.5 — Anti-abuse review

- Document browser-only limits.
- If user requires strict server-side control, propose platform WAF or another approved solution.
- Never activate paid/security settings without explicit approval.

## Task 08.6 — Functional regression

- Verify all product routes, source data semantics, duplicate identities, filtering, editorial and Insights charts.
- Fix only confirmed defects within approved plan.

## Task 08.7 — Automated QA

- Execute offline workbook fixture regression and source failure tests.
- Test manual Update guard/cooldown, URL-state preservation and dynamic data.
- Run the full repository quality suite.

## Task 08.8 — Browser/a11y/responsive verification

- Check desktop/tablet/mobile, both locales, external links, charts, navigation, refresh and errors.
- Inspect browser console and network logs; record NOT RUN honestly when unavailable.

## Task 08.9 — Security/performance/Vercel audit

- Review server-only client bundle boundary.
- Measure key runtime timings and source call count.
- Verify env, Node/pnpm, build, SEO, runtime and potential rate-limit cost.

## Task 08.10 — Preview/release preparation

- Prepare README/runbook/deployment/rollback instructions.
- Preview deploy only after approval, smoke test and record evidence.
- Do not production deploy without separate approval.

## Task 08.11 — Final report and sign-off

- Report files changed, test evidence, remaining defects, blockers and accepted trade-offs.
- Complete all acceptance checklists.
- State READY/PARTIAL/BLOCKED accurately.
- Provide the exact next action for production authorization without performing it.

---
# 15. Acceptance Criteria — 76 Checks

Mark each criterion **PASS**, **PARTIAL**, **BLOCKED**, or **NOT RUN** with evidence: actual source file, test result, browser screenshot, route, deployment ID or observed logs. Do not mark PASS based on the fact that this specification exists.

## 15.1 Integration (INT-01 to INT-18)

| ID | Acceptance criterion |
|---|---|
| INT-01 | Active branch, HEAD, working tree and applicable agent instructions audited before edits. |
| INT-02 | Actual Phase 01–07 implementation readiness verified from code and reports. |
| INT-03 | All actual public product routes use the checked-out App Router and locale routing conventions. |
| INT-04 | Product pages reuse one normalized domain data contract. |
| INT-05 | Public Google connector remains server-only. |
| INT-06 | XLSX bytes/parser code are absent from client bundles. |
| INT-07 | All product pages use coherent shared loader/freshness semantics. |
| INT-08 | Home search/category/area navigation works. |
| INT-09 | Explore Grid/List/Table, query filters, URL history and 24/page remain correct. |
| INT-10 | Place Detail uses exact stable IDs and preserves cross-sheet duplicates. |
| INT-11 | Notes, price, opening hours, highlights and visit profile remain source-authentic. |
| INT-12 | Areas use canonical `areaId` and dynamically computed counts. |
| INT-13 | Trip Ideas uses source editorial sections without rewriting. |
| INT-14 | Public Insights metrics reconcile; no prohibited average rating/price analytics. |
| INT-15 | Validated source Maps URLs work; missing links are omitted. |
| INT-16 | `vi` and `en` navigation, UI translations and default locale work. |
| INT-17 | Localized metadata/sitemap/robots reflect actual implemented routes. |
| INT-18 | No broken internal links or fabricated product destinations remain. |

## 15.2 Initial loading and Update (SYNC-01 to SYNC-18)

| ID | Acceptance criterion |
|---|---|
| SYNC-01 | Initial page request fetches the latest available public XLSX from the source. |
| SYNC-02 | Source connector retains explicit `cache: 'no-store'`. |
| SYNC-03 | All data on each page render comes from one validated coherent snapshot. |
| SYNC-04 | No extra remote fetches per independent chart/card are introduced. |
| SYNC-05 | All visitors can access the shared Update action without authentication. |
| SYNC-06 | Update does not write Drive or trigger the external tracker. |
| SYNC-07 | Update causes a fresh server-rendered data read according to current App Router behavior. |
| SYNC-08 | In-flight/rapid double-click protection works within the browser control. |
| SYNC-09 | The explicitly approved browser cooldown interval is applied. |
| SYNC-10 | Pending/cooldown states are translated and accessible. |
| SYNC-11 | Browser storage corruption/unavailability does not break the UI. |
| SYNC-12 | Explore query, sort, filters, view and valid page context survive refresh. |
| SYNC-13 | Detail/Area/Trips/Insights route and active locale survive refresh. |
| SYNC-14 | A newly valid workbook is reflected after a successful fresh render. |
| SYNC-15 | Unchanged data does not trigger false “new data” announcements. |
| SYNC-16 | Failed/invalid source fetch does not claim update success or fake empty data. |
| SYNC-17 | Silent change display and accessible feedback are correctly balanced. |
| SYNC-18 | Browser-only versus server/platform anti-abuse is accurately disclosed; any mandatory strict enforcement is approved and verified. |

## 15.3 Data, QA, UX and security (QA-01 to QA-22)

| ID | Acceptance criterion |
|---|---|
| QA-01 | Approved offline XLSX fixture regression is tested; expected drift is explained. |
| QA-02 | Source 403/404/429/5xx, timeout, malformed XLSX and HTML responses tested. |
| QA-03 | Stable identity, cross-sheet duplicates, status mapping and exact LOC joins verified. |
| QA-04 | Canonical area IDs and counts reconcile; `sourceArea` not misused. |
| QA-05 | Null/numeric rating behavior verified; null never becomes zero. |
| QA-06 | No numeric price analytics, fabricated review counts or inferred open-now facts. |
| QA-07 | Notes, editorial and raw text are preserved exactly in both locales. |
| QA-08 | Home → Explore search/category/area journeys verified. |
| QA-09 | Explore AND/OR filters, search, pagination and URL history verified. |
| QA-10 | Explore → Place Detail → Back and same-name duplicate routes verified. |
| QA-11 | Areas and Trip Ideas navigation/data regression verified. |
| QA-12 | Public Insights charts, aggregates and text alternatives verified. |
| QA-13 | `vi` default and `en` supported routes verified. |
| QA-14 | Translation namespace/key parity verified with no missing-key warnings. |
| QA-15 | Keyboard/focus/semantic accessibility checked for critical workflows. |
| QA-16 | Mobile/tablet/desktop layout has no critical overflow or unusable controls. |
| QA-17 | Browser console/hydration warnings addressed or reported as blockers. |
| QA-18 | No XLSX binary or secret values reach public client bundle/output. |
| QA-19 | External URLs, redirects, HTTP response and size validation remain intact. |
| QA-20 | No unauthorized dependencies, credentials, services or durable stores introduced. |
| QA-21 | Automated tests run offline; live-source checks are controlled and separate. |
| QA-22 | All actual test results/coverage gaps and NOT RUN items reported honestly. |

## 15.4 Deployment and release (DEP-01 to DEP-18)

| ID | Acceptance criterion |
|---|---|
| DEP-01 | Actual Vercel project/branch/environment configuration inspected when accessible. |
| DEP-02 | Node/pnpm/Next.js runtime and server-only parser compatibility verified. |
| DEP-03 | Environment configuration verified without exposing secret values. |
| DEP-04 | `pnpm lint` executed and passed. |
| DEP-05 | `pnpm format:check` executed and passed. |
| DEP-06 | `pnpm type-check` executed and passed. |
| DEP-07 | `pnpm test` executed and passed. |
| DEP-08 | `pnpm build` executed and passed. |
| DEP-09 | `pnpm build-storybook` executed and passed when new/changed components require it. |
| DEP-10 | Public source fetch/parser works under target runtime or blocker is shown. |
| DEP-11 | Dynamic rendering and fresh-source behavior verified; no accidental static snapshot. |
| DEP-12 | Metadata, sitemap, robots, canonical and locale alternates verified. |
| DEP-13 | Preview deployed and smoke-tested only if authorized; otherwise clearly NOT RUN. |
| DEP-14 | Performance/request cost and source polling trade-offs documented. |
| DEP-15 | Rate-limit scope and possible WAF costs/permissions recorded; no unapproved activation. |
| DEP-16 | Production deployment checklist and explicit authorization gate prepared. |
| DEP-17 | Rollback/recovery playbook prepared; no false workbook restoration promise. |
| DEP-18 | Final READY/PARTIAL/BLOCKED assessment and all release blockers accurately reported; production not claimed without evidence. |

---

# 16. Final Implementation and Release Report

At completion, Codex must report:

1. **Phase status:** READY, PARTIALLY READY or BLOCKED.
2. **Repository baseline:** branch, HEAD SHA, working tree and preservation of user changes.
3. **Prerequisite matrix:** Phase 01–07 actual code status with paths/evidence.
4. **Actual routes:** Home/Explore/Place Detail/Areas/Trip Ideas/Insights and source loader paths.
5. **Freshness semantics:** what first load and client navigation really fetch; any cache caveats.
6. **Manual Update:** actual component, `router.refresh()` behavior, cooldown, in-flight guard, accessibility and errors.
7. **Anti-abuse truth statement:** browser-only vs strict server protection, platform permissions/plan/cost and unresolved gap.
8. **Source results:** fixture regression versus live public XLSX smoke test, clearly separated.
9. **Data integrity:** joins, counts, statuses, duplicates, area, rating, notes and editorial.
10. **User journeys:** tested routes, links, filters, detail navigation, Areas/Trips and Insights.
11. **Localization:** `vi` default, `en`, source text not translated.
12. **SEO/security:** canonical metadata, robots, sitemap, source/client separation, validated Maps URLs.
13. **Quality checks:** exact commands, pass/fail counts, build warnings, NOT RUN items.
14. **Browser QA:** sizes, screenshots/observations, console, accessibility evidence.
15. **Performance:** fetch/parse time, page response, function/size concerns.
16. **Modified files:** exact paths and purpose.
17. **Dependencies/services:** anything added/changed and exact authorization.
18. **Defect register:** P0/P1/P2/P3, status and evidence.
19. **Acceptance matrix:** INT-01–18, SYNC-01–18, QA-01–22, DEP-01–18.
20. **Vercel readiness:** project env, preview ID/URL if authorized and tested, no fake deployment claims.
21. **Rollback plan:** last-known-good app deployment and workbook limitations.
22. **Open decisions:** cooldown interval, Top Rated status policy, strict global rate limiting, platform costs and production approval.
23. **Next action:** what exactly remains before authorized production release.
24. **Production status:** explicitly state DEPLOYED WITH VERIFIED URL or NOT DEPLOYED; never imply production is live without proof.

---

# 17. Official References for Runtime-Dependent Choices

Recheck current official docs and the actual installed versions before implementing platform-sensitive behavior:

- Next.js App Router refresh: https://nextjs.org/docs/app/api-reference/functions/use-router
- Next.js Server Action refresh: https://nextjs.org/docs/app/api-reference/functions/refresh
- Next.js `revalidatePath`: https://nextjs.org/docs/app/api-reference/functions/revalidatePath
- Next.js caching / ISR: https://nextjs.org/docs/app/guides/incremental-static-regeneration
- Vercel Functions: https://vercel.com/docs/functions
- Vercel Function limits: https://vercel.com/docs/functions/limitations
- Vercel CDN caching: https://vercel.com/docs/caching/cdn-cache
- Vercel WAF Rate Limiting: https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting
- Vercel WAF pricing and plan: https://vercel.com/docs/vercel-firewall/vercel-waf/usage-and-pricing

**End of Phase 08 Detailed Implementation Specification.**
