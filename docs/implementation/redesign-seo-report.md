# Redesign, brand and SEO verification

## Scope and status

Local implementation of the approved redesign and public identity for Cẩm nang Đà Nẵng. Branch `main` started at `a8a76c70f604d2fdb9661b0df0d66f800ab91c22`. Changes are in the working tree. The package manifest and lockfile have no redesign diff. The original two specification files are user work. Production deployment, Vercel settings, DNS verification and Search Console submission are outside this execution.

**Local release status is PARTIAL.** The production build and 232 offline tests passed. Storybook builds successfully with one upstream Node deprecation. Both locale layouts passed responsive and native Chrome zoom checks.

## Baseline and identity

The initial read-only live audit examined `https://dn-explorer.phanhoangquoctu.io.vn` in Chrome. At 320 CSS pixels the original header measured 137 px high. The production sitemap had 26 URLs and omitted place pages. It emitted modification dates without a per-record source. The English Insights page had an indexable canonical. The redesigned build uses a sheet on small screens, a linked area index, hierarchy for editorial text, and a sitemap derived from the same normalized dataset as the guide.

The original sail, sun and wave mark appears in the header, footer, favicon, touch icon, manifest and social art. Vector source: `src/app/icon.svg`. Exports: `public/brand-mark.png` (512 × 512) and `src/assets/brand/apple-icon.png` (180 × 180). Light paper, ink, ocean and action colors are `#F8F7F2`, `#1F2D33`, `#123B4A` and `#0F6B70`. Dark uses `#0D242C`, `#EDF4F1`, `#DEF1EE` and `#9ADFD4`. System serif titles scale from 2.6 to 5 rem on section pages. Self-hosted Geist supports controls and copy. Source prose wraps at a comfortable measure around 68 characters. Layouts use larger section gaps than row gaps, semantic state colors, tabular counts and visible focus. [Design system](../../DESIGN.md) · [Product rules](../../PRODUCT.md)

## Surfaces and ownership

| Surface | Implementation and behavior |
| --- | --- |
| Shared frame | `src/components/layouts/{MainLayout,Header,HeaderNavigation,Footer,FooterView,LanguageSwitcher,ThemeSwitcher,TravelRefreshButton}.tsx`, `navigation.ts`, `src/styles/globals.css`. Desktop links expose the active route or parent section. Mobile uses a labeled Radix sheet with keyboard dismissal. The shell includes a skip link, locale, theme and silent refresh controls. |
| Home | `src/modules/Home/HomeView.tsx` and `src/modules/Travel/SearchField.tsx`. Search entry with a coastal illustration, category and canonical-area links, runtime counts and original editorial previews. |
| Explore | `src/modules/Explore/{ExploreView,ExploreForm,ExploreFilters,ExploreResults}.tsx`. Visible search, desktop filters and a mobile sheet, removable selections, separate sorting, and grid/list/table. Validated URL state preserves filters through presentation changes. Narrow tables scroll within their container. |
| Places | `src/modules/PlaceDetail/{PlaceDetailView.tsx,resolvePlace.ts}`. Stable source ID, breadcrumb, canonical area link, facts, optional Maps CTA, full original notes and visit profile. |
| Areas | `src/modules/Areas/{index.tsx,AreasView.tsx}`. Ruled area list in source order with computed counts, then the original description and matching listings. |
| Trip Ideas | `src/modules/TripIdeas/TripIdeasView.tsx`. Section links, chapter headings, full source entries and preserved line breaks. |
| Insights | `src/modules/Insights/InsightsView.tsx`. Overview, distributions, chart/table pairs and top-rated entries reuse the existing selectors. |
| Shared guidance and states | `src/modules/Travel/{SectionBreadcrumb,TravelState}.tsx`, `src/app/[locale]/{error,not-found}.tsx` and `src/app/global-not-found.tsx`. Recovery UI hides internal source errors. |
| Localization and tests | `src/messages/{vi,en}/{common,travel}.json`, module tests, shell/env/SEO/BFF tests and colocated Storybook stories. |

The footer labels the website owner **Phan Hoàng Quốc Tú** and links to `mailto:tuphan694@gmail.com`, `https://www.facebook.com/phanhoangquoctu/` and `https://www.linkedin.com/in/phanhoangquoctu/`. These details are public to visitors and crawlers. External profiles use new-tab safety attributes. Forms and controls localize UI. Workbook names, area metadata, raw notes and editorial content retain their source text.

## Search, routing and structured data

The locale layout sets `metadataBase`. Page-level `generateMetadata` uses `src/lib/seo.ts`, with route-specific copy and Explore query policy from `src/lib/guide-seo.ts`. Route files live under `src/app/[locale]/`. Next.js generates native robots/sitemap metadata from `src/app/{robots,sitemap}.ts`. Native metadata publishes alternates; next-intl's additional alternate-link header is disabled. Absolute URLs use the configured public origin. Every indexable locale pair has `vi`, `en` and a Vietnamese `x-default`.

| Production route class | Canonical and indexing policy |
| --- | --- |
| Home, Explore, Areas, Trip Ideas, Insights | Indexable. Vietnamese has no prefix. English uses `/en`. Both self-canonicalize. |
| Canonical area and existing place detail | Indexable localized ID URLs. Place IDs resolve exactly, including records sharing a name. |
| Explore with a single valid page number from 2 through the current last page | Self-canonical and indexable with localized pagination title. Crawlable links expose these pages. |
| Explore with filters, sort, view, search, invalid query or invalid pagination | Noindex with canonical to the localized Explore landing page. |
| Health and missing detail pages | Health is noindex. Unknown valid IDs are handled separately from source failures. |
| `/api/*`, `/proxy/*` | Excluded from sitemap and production robots rules. Production sends a noindex response header. |
| Development and Preview | Global noindex and robots disallow. Sitemap is empty. Vercel Preview requires the documented staging build configuration. |

The production fixture yielded **890 sitemap URLs**: five hubs, eight areas and 432 places in each locale. Dates are omitted. Failure to load a valid workbook fails the production sitemap request rather than publishing an incomplete replacement. The generator rejects an output over 50,000 URLs.

Home examples include **Khám phá Đà Nẵng** with “Tìm chỗ ăn uống, tắm biển và vui chơi ở Đà Nẵng cùng các vùng lân cận. Xem theo danh mục hoặc khu vực.” and **Discover Đà Nẵng** with “Find places to eat, swim, and explore in Đà Nẵng and nearby. Browse by category or see what’s in each area.” Place descriptions use the exact name and available normalized category/area. JSON-LD covers `WebSite`, `WebPage`, detailed-page `BreadcrumbList` and `Place` with source address and validated `hasMap` when available. Social renderers share `src/lib/og-image.tsx`; the OG and Twitter endpoints accept a validated path/locale, use source-aware copy and embed the local brand PNG.

## Request boundaries and configuration

- Travel pages and dynamic data consumers use the shared `loadTravelDataset()` with request-scoped React memoization and Next's `connection()`. The public server connector uses `cache: 'no-store'`, a 30 s deadline, 8 MiB download limit, at most three allowlisted redirects, XLSX signature validation and the existing normalized dataset builder. The browser receives rendered content or small chart DTOs.
- Manual Update uses `router.refresh()`, immediate duplicate-click protection and a 60 s browser deadline with a storage-failure fallback. The action preserves the URL and history. No global rate limiter was configured or measured on Vercel. The connector's bounds limit individual requests.
- `next.config.ts` rewrites `/proxy/:path*` to the configured public API origin. It is a transparent forwarding rule. Travel reads bypass this example. `GET /api/health` is an independent liveness probe. `GET/POST /api/posts` and `GET /api/posts/[id]` serve the Health domain example.
- `src/api/posts/boundary.ts` bounds pagination, IDs, JSON post bodies (32 KiB), upstream response size (1 MiB), redirects (zero) and time (8 s). It validates response shapes, checks browser write origins and returns safe errors and no-store responses. Incoming Authorization is excluded. Offline route tests cover valid payloads, failures, timeout, status handling and rejected inputs.
- Production uses `NEXT_PUBLIC_APP_ENV=production` and `NEXT_PUBLIC_APP_URL=https://dn-explorer.phanhoangquoctu.io.vn`. Set Preview to `staging` and local to `development`. The optional example API uses `NEXT_PUBLIC_API_URL`. The four `NEXT_PUBLIC_OWNER_*` variables are documented in `.env.example`. Public values are inlined at build time and passed to Docker as build arguments. User env files and platform settings were left in place. The README documents Domain-property DNS TXT verification, sitemap submission and URL Inspection. Search Console verification, indexing and ranking have not been measured. [Environment and Search Console](../../README.md)

## Verification evidence

The approved workflow used Caveman, Superpowers, UI UX Pro Max, Impeccable, Awesome DESIGN.md and UI Styling. Tools included CodeGraph, RTK/PowerShell, Git, Biome, Vitest, TypeScript, Next.js, Storybook, Sharp and Chrome DevTools Protocol. CodeGraph reported an older extraction index. The initial audit encountered a CodeGraph error; resumed targeted queries succeeded. Impeccable's deterministic scan returned an empty findings list for Home. The browser QA server substituted the repository's XLSX fixture at the connector boundary. This exercises real parsing, SSR, localization and navigation, without depending on Google uptime.

| Final check | Exit | Observed result |
| --- | ---: | --- |
| `pnpm lint` | 0 | Biome checked 367 files. |
| `pnpm format:check` | 0 | Biome checked 366 files. |
| `pnpm type-check` | 0 | Route type generation and TypeScript completed. |
| `pnpm test` | 0 | 33 test files, 232 tests passed. |
| `pnpm build` | 0 | Next.js 16.4.6, 21 static pages generated, travel routes and sitemap dynamic. |
| `pnpm build-storybook` | 0 | Storybook 10.6.8, 4,981 modules transformed. Node 26 emitted `DEP0205` for `module.register()`. |

The Storybook warning originates in the installed package's `registerTypescriptLoader()`, called unconditionally by `importModule()` before loading project config. In this release the call is at `dist/_node-chunks/chunk-2MESDN4Q.js:735`. Reformatting app components or renaming the Storybook configuration would leave that call in place. The warning remains visible. An earlier CLI-version probe populated pnpm's transient dlx cache. The project dependencies and lockfile were unchanged.

## Browser and HTTP verification

The local production build ran with the repository workbook fixture. Chrome checked 11 routes and states in each locale, including a real place, unknown place, empty search, and Grid/List/Table. The runner verified the document language on every navigation. At 320, 360, 375, 390, 768, 1024, 1280 and 1440 CSS pixels, all 176 measurements fit within the viewport. The equivalent reflow viewport for 1280 pixels at 200% also passed. A separate Chrome profile set native page zoom to 200%. Six routes including Explore Table fit within the 632 CSS pixel viewport of a 1280 pixel window at devicePixelRatio 2. Physical screen-reader output remains unmeasured. Chrome reported zero console warnings or exceptions in the final route run.

The keyboard checks verified focus containment, Escape and trigger focus restoration for the mobile menu and filters. Browser Back restored the filtered Explore URL after visiting a place. Forward reopened the place. Axe reported zero WCAG A/AA violations in the measured mobile dialogs and six mobile Home, Explore and Insights states across both languages. The six page scans used dark color preference and reduced motion.

Explore originally measured CLS 0.906 at desktop width. Chrome attributed the shift to the footer moving when streamed results replaced the loading message. The loading state now reserves viewport height. The final fixed-width desktop measurements recorded CLS 0 on Home and Explore in both languages. These results use a local fixture. Field CWV, INP and search ranking remain unmeasured. Final screenshots and browser observations were written to the temporary QA directory `%TEMP%/dn-confirm-QTptF0` in `audit.json` and reviewed in `overview.png`.

The HTTP crawl validated 20 route responses, canonicals, language alternates, indexing directives, unknown IDs and three 1200 × 630 PNG social images. The fixture sitemap served 890 unique URLs, comprising 432 places, eight areas and five hub pages per language. The earlier 307 occurred with an explicit loopback-IP bind. Both the default Next start command and localhost binding returned 200 with the correct HTML language.

Concurrent reads of the same public workbook now share the active promise in `src/lib/travel-data/source/latest.ts`. Each runtime releases the promise on settlement. Tests reproduce two requests before the change and verify one download for overlapping requests after both HTTP 200 and 403. A subsequent request always reads afresh. The scope is one running instance.

## Acceptance ledger

Ranges include both endpoints. Results apply to the local production build.

| Criteria | Result | Evidence |
| --- | --- | --- |
| DS-01–DS-10 | PASS | Baseline, logo, shared components, theme tokens, measured contrast and design documentation. |
| HF-01–HF-10 | PASS | Both locales, responsive navigation, keyboard focus and footer contact tests. |
| UX-01–UX-17 | PASS | Route and source regressions, all three Explore views, canonical filters and browser history. |
| RSP-01–RSP-07 | PASS | Both languages across eight widths, mobile dialogs and scoped table overflow. |
| RSP-08 | PASS | Narrow reflow and native Chrome zoom at 200% passed. |
| A11Y-01–A11Y-10 | PASS | Semantic and keyboard tests, focus restoration, token contrast, reduced-motion styles and scoped axe scans. |
| SEO-01–SEO-20 | PASS | Metadata tests, bilingual HTTP crawl, sitemap, social images, 404 handling and Search Console instructions. |
| ENV-01–ENV-05 | PASS | Schema, example values, Docker build arguments and public-origin tests. |
| QA-01–QA-09, QA-11–QA-15 | PASS | Offline regression, responsive checks, browser console, production build and dependency diff. |
| QA-10 | PARTIAL | Storybook completed with Node 26 deprecation DEP0205 in the installed Storybook loader. |
| API-01–API-14 | PASS | Request inventory, input/output boundaries, upstream limits, browser cooldown and per-instance concurrent read tests. |

## Contrast measurements

Token contrast was measured using WCAG relative luminance. Light body, secondary and button text have contrast ratios of 13.22:1, 5.64:1 and 6.25:1 against their defined backgrounds. Corresponding dark pairs measure 14.41:1, 9.11:1 and 10.12:1. Focus against the page surface measures 5.51:1 light and 10.63:1 dark. The footer pair measures 11.19:1. DS-06 and A11Y-04 pass the token-level review. Browser checks cover additional composed states.
