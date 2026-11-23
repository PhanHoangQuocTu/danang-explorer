# Project architecture mapping

This is the Phase 01 baseline. See the [current README](../../README.md) and [phase map](../implementation/phase-map.md) for the implemented product and current entry points.

[Repository audit](repository-audit.md) · [Coding rules and dependencies](coding-rules-and-dependencies.md) · [Decisions and risks](decisions-and-risks.md) · [Phase map](../implementation/phase-map.md)

## Existing rendering and routing

| Verified behavior | Evidence and implication |
| --- | --- |
| The dynamic `[locale]` segment contains the root HTML layout. It validates supported locales, generates static params for both locales, sets document language, loads theme/fonts and website JSON-LD, and layers next-intl over the client providers. The provider subtree supplies progress, Query, theme, tooltips and toast while accepting server-rendered children. | [Locale layout](../../src/app/%5Blocale%5D/layout.tsx) · [Client providers](../../src/app/%5Blocale%5D/providers.tsx) |
| Home is a server-rendered boilerplate landing page with inline composition and a link to Health. The Health route is the thin-page example and renders an async module that passes translated text to shared UI. Client cards handle Query data, loading, errors and retry. | [Home](../../src/app/%5Blocale%5D/page.tsx) · [Health route](../../src/app/%5Blocale%5D/health/page.tsx) · [Health module](../../src/modules/Health/index.tsx) · [Health status card](../../src/modules/Health/components/HealthStatusCard.tsx) · [Posts card](../../src/modules/Health/components/ProxyExampleCard.tsx) |
| Locale catch-all delegates to not-found; locale error is a Client Component with reset. A separate global 404 covers URLs outside the locale layout and currently uses English. Demo skeletons live in components. The audited tree has no route `loading.tsx` or `global-error.tsx`. | [Catch-all](../../src/app/%5Blocale%5D/%5B...rest%5D/page.tsx) · [Locale error](../../src/app/%5Blocale%5D/error.tsx) · [Locale 404](../../src/app/%5Blocale%5D/not-found.tsx) · [Global 404](../../src/app/global-not-found.tsx) |
| Page metadata is generated on the server. The shared helper returns canonical, hreflang with `x-default`, robots, Open Graph and Twitter metadata. Sitemap is driven by `INDEXABLE_ROUTES` (home only). Health opts out. Root OG/Twitter image handlers are static. Manifest and robots sit outside the locale. | [SEO](../../src/lib/seo.ts) · [Route registry](../../src/constants/routes.ts) · [Sitemap](../../src/app/sitemap.ts) · [Robots](../../src/app/robots.ts) · [Manifest](../../src/app/manifest.ts) · [OG image](../../src/app/opengraph-image/route.tsx) · [Twitter image](../../src/app/twitter-image/route.tsx) |

New routes should own routing, metadata and server entry composition. Page-level views belong in modules, reusable views in app-owned components and generic primitives in `src/components/ui`. Send serializable data across client entry points. This is the intended boundary for future workbook data.

## Existing API and state

- **API.** `getApiRequestClient()` chooses direct Axios against `env.API_URL` on the server and same-origin `/api` in the browser. The Posts handler forwards query params and Authorization for list GET, accepts a JSON POST and preserves upstream create status, and the detail handler forwards the encoded ID. Both Axios instances attach interceptors. Browser session tokens can supply Authorization, and opt-in single-flight refresh can retry a 401 once. `IApiError` carries status, message and optional code/details. Handlers convert it to a status plus JSON message. `/proxy/:path*` is a separate, transparent rewrite. `/api/health` is a local status endpoint with forced dynamic rendering and a `Cache-Control: no-store` response. JSONPlaceholder is the demo upstream. [Axios](../../src/api/axios.ts) · [Interceptors](../../src/api/interceptors.ts) · [Posts list/create](../../src/app/api/posts/route.ts) · [Post detail](../../src/app/api/posts/%5Bid%5D/route.ts) · [Error response](../../src/utils/api-error.ts) · [Health handler](../../src/app/api/health/route.ts) · [Rewrite](../../next.config.ts)
- **Query.** The mounted client provider holds a stable QueryClient with 30-second stale time, refetch-on-mount enabled, focus refetch and retries disabled, development-only devtools and cache clearing on session revision changes. Posts use hierarchical keys, previous list data during parameter changes, gated detail queries and root-key invalidation after create. The audit found no application server Query dehydration/hydration or travel-data cache/revalidation. [Query provider](../../src/components/providers/QueryClientProvider.tsx) · [Keys](../../src/api/posts/keys.ts) · [Queries](../../src/api/posts/queries.ts) · [Mutations](../../src/api/posts/mutations.ts)
- **Shared and local client state.** Zustand holds modal targets in memory and persists the session example via a browser cookie. Theme choice is a local-storage-backed provider. The locale-aware query-parameter hook updates selected parameters with push/replace and preserves unrelated state. [Modal store](../../src/stores/modalStore.ts) · [Session store](../../src/stores/sessionStore.ts) · [Theme provider](../../src/components/providers/ThemeProvider.tsx) · [URL hook](../../src/hooks/useUrlSearchParams.ts)

## Language and design

The proxy negotiates `en` and `vi` and skips API, rewrite paths, internals and asset/metadata paths matched by its exclusions. With `localePrefix: 'as-needed'`, English is currently unprefixed and Vietnamese is prefixed, as in `/health` and `/vi/health`. The request config uses the explicit locale override or `next/root-params`, validates it and loads the registry. The typed client and server hooks read `common` and `health`. English JSON supplies the reference keys. Type checking enforces key parity and Vitest checks empty strings and ICU placeholder parity. Locale switching navigates to an explicit prefix with a full load and preserves query/hash. [Proxy](../../src/proxy.ts) · [Locale config](../../src/i18n/routing.ts) · [Request config](../../src/i18n/request.ts) · [Message registry](../../src/messages/index.ts) · [Client hook](../../src/hooks/useTranslations.ts) · [Server hook](../../src/hooks/useTranslationsServer.ts) · [Locale switch](../../src/hooks/useSwitchLanguage.ts) · [Parity tests](../../src/messages/__tests__/messages.test.ts)

**Confirmed product delta.** Vietnamese is the default shipping locale, with English supported and workbook content preserved in the source language. If prefix strategy is retained, unprefixed paths become Vietnamese and English uses `/en`. The locale/UI phase should verify redirects, the locale cookie, canonical and alternate URLs, `x-default`, sitemap and fallback UI. Changing the routing default does not inherently change the typed reference locale. [Phase specification](../implementation/phases/phase-01-codebase-rules-architecture-mapping.md) · [SEO](../../src/lib/seo.ts)

Existing styling uses Tailwind v4 through PostCSS with `@theme inline` to surface semantic variables. Light/dark OKLCH tokens cover surfaces, text, borders, chart colors and radii. Geist local font tokens and utility breakpoints are in use. The first-party theme provider supports light/dark/system, storage updates and a pre-hydration init script. shadcn uses the New York style, neutral base and CSS variables, with app-owned form/layout/common wrappers, CVA variants, `cn()` (clsx + tailwind-merge) and Lucide icons. Recharts is available through a client chart container with responsive sizing and themed tooltip/legend conventions. No map implementation is present. Storybook stories share i18n, Query and tooltip decorators and expose locale and light/dark controls. The preview initially uses English and light mode. [PostCSS](../../postcss.config.mjs) · [Tokens](../../src/styles/globals.css) · [Fonts](../../src/config/fonts.ts) · [Theme](../../src/lib/theme.ts) · [shadcn](../../components.json) · [Button variants](../../src/components/ui/button.tsx) · [Class helper](../../src/lib/utils.ts) · [Chart](../../src/components/ui/chart.tsx) · [Storybook preview](../../.storybook/preview.tsx)

**Proposed design direction.** Build the confirmed Editorial experience with existing primitives and semantic tokens. Typography hierarchy for Vietnamese/English, editorial spacing and photography, responsive grid behavior, map presentation and chart accessibility need design work in the UI phase. The product defaults to Grid and status All, with a simple map.

## Proposed product boundaries

```text
Public Drive XLSX → Phase 03 server connector → Phase 02 server parser and validation
    → normalized dataset → server page render and optional same-origin data boundary
    → travel modules and client interactions

Manual refresh → same-origin server operation → guarded fetch, validate and publish
    → client query/UI update when applicable
```

Suggested locations are ownership boundaries for future phases. Phase 02 can keep the workbook parser, Zod validation and normalized types under a server-owned workbook domain in `src/lib`, with browser-safe types in the domain where needed. The listing model owns source identity, categories, raw source area and nullable ratings. Canonical area/status comes from LOC. Editorial picks and itinerary source data can stay alongside the normalized workbook domain until the UI needs a distinct view. Phase 03 adds Drive retrieval to the server workbook boundary. The later sync phase owns current validated data, freshness, coordination and diagnostics. Server Components can call the server domain directly. If client requests are needed, a same-origin Route Handler under `src/app/api` and an `src/api` domain can expose only approved normalized fields. The demo rewrite and session refresh are separate examples.

| Operation | Boundary | Reason |
| --- | --- | --- |
| Fetch XLSX | Server connector | Bound the upstream request and keep bytes off the browser. |
| Parse XLSX and extract links | Server-only parser | Workbook bytes and parser modules stay off the client. |
| Map and validate, including LOC status/area | Server | One canonical transformation from untrusted source to normalized data. |
| Create serialized payload | Server | Select the public fields that each consumer needs. |
| Initial render and SEO | Prefer Server Components | Render public content and metadata within App Router. |
| Search, filters, sort, Grid/Table and panels | Client where interactive | Use URL state for shareable state where approved and component state for transient controls. |
| Charts | Client where current Recharts wrapper is used | Prepare data server-side where useful and verify hydration and accessibility in the UI phase. |
| Manual refresh | Client trigger, same-origin server operation | Show sync state quietly. Guard attempts and publish only validated refreshes on the server. |
| Locale switch | Existing next-intl navigation pattern | Switch UI messages and locale-aware routes while keeping workbook strings intact. |

Normalized travel data is server-owned. TanStack Query can manage client reads and invalidation if the future API calls for it. Use Zustand selectively for cross-component UI state. Keep the dataset out of persisted client stores by default. Cache, revalidation, refresh endpoint and cooldown details belong to the sync phase.

## Candidate route-to-module map

Candidate paths are locale-relative. The later UI phase owns these proposals after the Phase 02 contract and Phase 03 connector. Register only approved indexable routes and use shared metadata. UI labels and metadata follow locale conventions on every route.

| Surface and goal | Candidate route / module | Server responsibility and data | Client responsibility | SEO and locale |
| --- | --- | --- | --- | --- |
| Home / Dashboard — discover places | `/` · `src/modules/Home` | Render initial editorial/listing data and metadata. Exact dashboard scope pending. | Interactions only where needed. | Candidate indexable home with localized chrome and source-authentic editorial. |
| Explore — find and narrow listings | `/explore` · `src/modules/Explore` | Load normalized listings, categories, LOC areas/status. | Search, filter, sort and view controls. Grid and All are the defaults. | Candidate indexable landing. Decide query canonical policy in UI phase, with translated controls. |
| Place Detail — read listing details and open Maps | `/places/[id]` · `src/modules/PlaceDetail` | Resolve a stable source-aware identity and public listing data. | Approved interaction and map/link behavior. Obtain the approved Option A details before implementation. | Decide stable canonicals/indexing with UI scope. Localize UI and preserve content. |
| Areas — browse by canonical area | `/areas` · `src/modules/Areas` | Use LOC-derived areas and status. Scope pending. | Area selection and simple map if approved for this surface. | Indexing and area URL scheme pending. Preserve workbook area labels. |
| Trip Ideas / Itinerary — browse editorial suggestions | `/trip-ideas` · `src/modules/TripIdeas` | Use the normalized `TOP_PICKS_LICH_TRINH` data if scope is confirmed. | Only approved navigation and interactions. | Indexing pending. Preserve workbook editorial copy. |
| Insights / Analytics — inspect aggregate data if approved | `/insights` · `src/modules/Insights` | Derive aggregates only after scope and counting rules are agreed. | Evaluate accessible charts if needed. | Route, metadata and indexing pending product confirmation. |
