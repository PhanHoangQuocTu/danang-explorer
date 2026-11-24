# Codex Execution Prompt

> **Version:** 2.0 — includes native Next.js SEO and Proxy/BFF architecture requirements.

# Redesign Da Nang Travel Discovery + Header/Footer + Technical SEO

You are Codex working in the existing repository:

`https://github.com/PhanHoangQuocTu/nextjs-frontend-boilerplate`

The production website is:

`https://dn-explorer.phanhoangquoctu.io.vn`

The authoritative product/design/SEO specification is:

`docs/implementation/redesign-seo-spec.md` (Version 2.0)

Read that specification completely before doing anything. It defines the
scope, roles, design direction, approved product rules, SEO
requirements, environment variables, implementation workflow, and
acceptance criteria.

Your task is to perform a **real project-wide UI/UX redesign and SEO
improvement**, not a superficial styling pass.

------------------------------------------------------------------------

## 1. Mission

Redesign the currently implemented Da Nang Travel Discovery website so
it becomes:

-   More beautiful, distinctive, professional, and appropriate for
    travel/tourism.
-   Visually consistent across all implemented routes.
-   Based on a polished Modern Editorial Travel identity inspired by Da
    Nang's ocean, coastline, nature, sand, and warm light.
-   Easy to understand and use, especially for discovery, search, and
    filters.
-   Fully responsive across desktop, tablet, and mobile.
-   SEO-ready at the technical, on-page, structured-data,
    internal-linking, and performance levels.
-   Equipped with a professional responsive header and footer.
-   Faithful to the existing product behavior, source data,
    architecture, and repository rules.

Do not turn the product into an admin dashboard, booking platform, or
generic SaaS template.

## 2. Confirmed project facts

Preserve:

-   Product: Da Nang Travel Discovery.
-   Production origin: `https://dn-explorer.phanhoangquoctu.io.vn`.
-   One Next.js application.
-   No separate backend and no database.
-   Vercel deployment target.
-   UI locales: `vi` and `en`.
-   Default locale: `vi`.
-   UI-only translation; workbook source values remain unchanged.
-   Editorial visual direction.
-   Explore default view: Grid.
-   Default status filter: All.
-   Page size: 24.
-   Search by name/address/category, case-insensitive and Vietnamese
    accent-insensitive.
-   AND across filter dimensions; OR within a multi-select dimension.
-   Eight canonical areas from normalized `areaId` / `areaName`.
-   Numeric rating or null; null is never zero.
-   Descriptive price text; no numeric price slider.
-   Source-authentic Notes & Tips and editorial content.
-   Duplicate same-name listings from different source sheets remain
    separate.
-   Simple map behavior using only validated original Maps URLs.
-   Public Travel Insights, not an admin dashboard.
-   Existing silent refresh behavior.
-   Existing Next.js App Router request architecture must be audited and reused: `/proxy/*` rewrites, `/api/*` Route Handlers, server-side workbook loader, and cache/revalidation.

Do not change these business rules as part of redesign or SEO.

## 3. Owner information --- use exactly

The user has explicitly requested these details for the public footer:

``` text
Owner name: Phan Hoàng Quốc Tú
Email: tuphan694@gmail.com
Facebook: https://www.facebook.com/phanhoangquoctu/
LinkedIn: https://www.linkedin.com/in/phanhoangquoctu/
```

Footer requirements:

-   Show the owner name under a clear localized label such as
    `Chủ sở hữu website` / `Website owner`.
-   Email must use `mailto:`.
-   Facebook and LinkedIn must use the exact URLs above.
-   Use existing icon components with accessible labels.
-   External links opened in a new tab must use
    `rel="noopener noreferrer"`.
-   Do not invent company name, phone, address, legal registration, or
    extra social accounts.
-   Do not claim the site is an official city tourism portal.
-   Explain in the final report that these values are public and visible
    to visitors/crawlers.

## 4. Environment configuration

The existing boilerplate uses `NEXT_PUBLIC_APP_URL` as the app origin.
**Use this exact existing variable. Do not introduce
`NEXT_PUBLIC_SITE_URL` as a duplicate.**

Production configuration:

``` dotenv
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_APP_URL=https://dn-explorer.phanhoangquoctu.io.vn
NEXT_PUBLIC_OWNER_NAME="Phan Hoàng Quốc Tú"
NEXT_PUBLIC_OWNER_EMAIL=tuphan694@gmail.com
NEXT_PUBLIC_OWNER_FACEBOOK_URL=https://www.facebook.com/phanhoangquoctu/
NEXT_PUBLIC_OWNER_LINKEDIN_URL=https://www.linkedin.com/in/phanhoangquoctu/
```

Tasks:

1.  Inspect `.env.example`, `src/constants/env.ts`,
    `src/config/site.ts`, and current environment validation.
2.  Preserve existing environment values and any existing user secrets.
3.  Add the four `NEXT_PUBLIC_OWNER_*` variables to the existing Zod
    schema and explicit `process.env` mapping.
4.  Validate URLs and email.
5.  Make optional public profile fields safe in preview/test
    environments if absent.
6.  Update `.env.example` using the repository convention.
7.  Use the production origin without a trailing slash.
8.  Keep local development noindex with
    `NEXT_PUBLIC_APP_ENV=development`.
9.  Keep Vercel Preview/Staging noindex.
10. Use `NEXT_PUBLIC_APP_ENV=production` and the production URL in
    Vercel Production.
11. Remember `NEXT_PUBLIC_*` values are inlined at build time.
12. Do not commit `.env`, overwrite `.env.local`, print secrets, or add
    private credentials to public variables.
13. Do not change Vercel settings or deploy without explicit user
    approval.

The owner variables are public profile data, not secrets. Do not add a
fake API backend; this project has no separate backend in its approved
architecture.

## 5. Repository and skill audit --- mandatory first

Before editing code:

1.  Inspect active branch, HEAD, latest commit, `git status`,
    tracked/untracked files, and all user changes.
2.  Read root and nested `AGENTS.md`, `CLAUDE.md`, and project
    instructions.
3.  Read Phase 01--08 specifications and actual execution reports
    relevant to the working branch.
4.  Inspect the real route tree and actual page modules.
5.  Inspect current design tokens, Tailwind v4 setup, theme, fonts,
    icons, UI primitives, shared layouts, translations, and Storybook.
6.  Inspect current SEO implementation and environment schema.
7.  Inspect `next.config.ts`, all `src/app/api/**/route.ts` handlers, `/proxy/*` call sites, `NEXT_PUBLIC_API_URL`, server-only workbook loaders, cache/revalidation, and the Manual Update request flow.
8.  Discover all available installed skills, repository-local skills,
    MCP tools, browser tools, screenshot tools, and accessibility tools.
9.  Read the full instructions for relevant skills before using them.

Prioritize available skills for:

-   Impeccable/frontend design and UI/UX redesign.
-   Design-system extraction.
-   Responsive adaptation.
-   Typography and color.
-   Accessibility.
-   SEO/technical SEO.
-   Next.js metadata and route architecture.
-   Browser visual QA.
-   Performance.
-   Implementation planning.
-   Code review.
-   Verification before completion.

If the `impeccable` skill exists, follow its exact setup/context
instructions, inspect the incumbent visual UI, read its craft-quality
rules before UI edits, and use the appropriate critique/adapt/polish
workflow. Do not assume a skill or tool exists. Never claim to have used
something that was not actually available and used.

Use the available browser/screenshot tools where possible. Do not
install a new tool or package without approval.

## 6. Live website audit

Open the production site in a real browser:

`https://dn-explorer.phanhoangquoctu.io.vn`

Inspect all currently implemented pages and states:

-   Home.
-   Explore.
-   Place Detail.
-   Areas index and Area Detail.
-   Trip Ideas.
-   Public Travel Insights.
-   Header and footer.
-   Mobile navigation and locale switching.
-   Search/filter states.
-   Loading, empty, error, and not-found states.

Capture screenshots at:

-   Desktop: 1440px and 1280px.
-   Tablet: 1024px and 768px.
-   Mobile: 390px, 375px, 360px, and 320px.

Inspect browser console, network errors, layout overflow, clipped text,
broken links, and current SEO output.

If the production site cannot be reached, report that limitation.
Continue with the actual local codebase and verify the local application
after setup. Do not fabricate screenshots or claim a live audit
occurred.

## 7. Stage 1 --- Produce a plan and STOP

Before changing any application code, produce a concise but complete
repository-aware plan.

Include:

1.  Current UI audit and visual defects.
2.  Current SEO audit.
3.  Proposed redesign direction and palette.
4.  Typography and spacing system.
5.  Header and footer design.
6.  Shared component inventory.
7.  Page-by-page redesign.
8.  Explore filter desktop/tablet/mobile behavior.
9.  SEO route/indexability matrix.
10. Metadata plan for both locales.
11. Canonical and hreflang strategy.
12. Sitemap and robots strategy.
13. JSON-LD strategy.
14. Open Graph/Twitter image strategy.
15. Environment schema and `.env.example` changes.
16. Internal linking plan.
17. Accessibility and performance plan.
18. Exact files to create/modify.
19. Test and browser QA plan.
20. Risks, blocked dependencies, and acceptance criteria.
21. Native Next.js Metadata API plan: `metadataBase`, static `metadata`, dynamic `generateMetadata()`, and `MetadataRoute` usage.
22. Proxy/BFF request-flow decision: what stays server-side, whether any safe public request needs `/proxy/*`, and whether any explicit `/api/*` Route Handler is necessary.
23. API validation, timeout, caching/revalidation, safe errors, and Manual Update anti-spam verification plan.

**STOP after presenting this plan. Wait for explicit user approval
before editing code.**

Do not silently begin implementation after presenting the plan.

------------------------------------------------------------------------

# 8. Stage 2 --- Implement after approval

After approval, implement the approved plan in small, testable
increments.

## 8.1 Design system and visual redesign

-   Redesign the visual identity rather than only adding minor polish.
-   Use the Modern Editorial Travel direction.
-   Use the proposed
    deep-ocean/coastal-teal/warm-ivory/sand/sunset-coral palette as the
    starting point; adjust only with documented contrast and usability
    evidence.
-   Use semantic tokens in the existing CSS/Tailwind architecture.
-   Improve typography hierarchy, spacing, content widths, layout,
    borders, radii, shadows, and icon consistency.
-   Avoid excessive gradients, glassmorphism, card borders, random
    colors, and decorative dashboard chrome.
-   Preserve the current font unless a change is explicitly approved.
-   Do not add a new font, icon library, UI kit, CSS framework, or
    dependency without approval.
-   Use real approved assets only. Never fabricate listing photos.

## 8.2 Header

Build a professional responsive header:

-   Brand/wordmark.
-   Navigation to real implemented routes only.
-   Active route indication.
-   Vietnamese/English locale switcher.
-   Accessible keyboard focus.
-   Compact mobile menu with correct expanded state, Escape behavior,
    and focus management.
-   No excessive header height.
-   No links to unimplemented routes.
-   Sticky behavior only if it materially improves navigation and does
    not cover content.

## 8.3 Footer

Build a professional responsive footer with:

-   Brand and truthful product description.
-   Links to implemented routes.
-   Useful Explore/Area/Trip Ideas/Insights links where supported.
-   Owner/contact section using the exact supplied name, email,
    Facebook, and LinkedIn.
-   Localized labels.
-   Accessible social icons.
-   Safe external link attributes.
-   Compact, readable mobile layout.
-   No invented company information or contact details.

## 8.4 Page-by-page redesign

Redesign every implemented public page using the shared design system.

### Home

-   Clear editorial hero.
-   Prominent search.
-   Category and area discovery.
-   Source-authentic editorial preview.
-   Useful and factual CTAs.
-   No fabricated featured places or images.

### Explore

-   Clear hierarchy from search to filters to results.
-   Logical filter groups.
-   Active-filter summary and Clear All.
-   Responsive filter interaction.
-   Consistent Grid/List/Table.
-   Readable result count and pagination.
-   Keep Grid default, Status All default, and 24 records/page.

Preserve exact search and filter semantics. Do not add numeric price
filters.

### Place Detail

-   Clear identity and information hierarchy.
-   Preserve all source text.
-   Show normalized status and numeric rating only when valid.
-   Use exact Maps URL.
-   Keep Notes & Tips fully visible.
-   No fake images, reviews, or recommendations.

### Areas

-   Exactly eight canonical areas.
-   Exact canonical IDs/names.
-   Runtime counts from normalized data.
-   Source descriptions verbatim.
-   No invented map boundaries.

### Trip Ideas

-   Reading-first editorial design.
-   Preserve source titles/body.
-   Link only to exact supported place relationships.

### Insights

-   Public editorial analytics.
-   Only approved metrics.
-   No average rating or average price.
-   Accessible chart text/table alternatives.

### Shared states

-   Distinguish loading, no-results, empty-data, source-error, and
    not-found.
-   Use localized helpful copy.
-   Do not fabricate success or zero values.

## 8.5 Responsive behavior

Implement and verify desktop, tablet, and mobile independently.

-   Desktop: 1280px and 1440px.
-   Tablet: 768px and 1024px.
-   Mobile: 320px, 360px, 375px, and 390px.

Requirements:

-   No unintended page-level horizontal overflow.
-   No clipped controls, labels, chips, badges, or long Vietnamese
    names.
-   Search remains accessible.
-   Mobile filters use an accessible drawer/sheet or the simplest
    existing equivalent.
-   Tables use a deliberate mobile strategy.
-   No hover-only functionality.
-   Sticky elements respect safe areas.
-   Verify 200% zoom/reflow.

------------------------------------------------------------------------

# 9. Stage 3 --- SEO implementation

SEO is mandatory. Do not stop after adding page titles.

## 9.1 Reuse existing SEO architecture

Inspect and reuse the actual existing helpers, expected in the
boilerplate baseline:

-   `src/lib/seo.ts`
-   `buildMetadata`
-   `getLocalizedPath`
-   `getAbsoluteUrl`
-   `getLanguageAlternates`
-   `getRobots`
-   `webSiteJsonLd`
-   `breadcrumbJsonLd`
-   `src/constants/routes.ts`
-   `INDEXABLE_ROUTES`
-   `src/app/robots.ts`
-   `src/app/sitemap.ts`
-   `src/config/site.ts`
-   `src/constants/env.ts`
-   `src/app/opengraph-image/route.tsx`
-   `src/app/twitter-image/route.tsx`
-   `src/lib/og-image.tsx`
-   `src/components/seo/JsonLd`
-   Next.js App Router `Metadata` type and Metadata API.
-   `metadataBase` in the appropriate root/locale layout.
-   Static `metadata` and dynamic `generateMetadata()` for record-dependent pages.
-   `MetadataRoute.Robots` and `MetadataRoute.Sitemap`.
-   Existing Open Graph/Twitter image route handlers or supported Next.js metadata image conventions.

Verify actual paths in the working branch. Do not create a second SEO
system.

All public pages must use the existing `buildMetadata` pattern. Do not
handwrite partial `openGraph` or `alternates` objects that overwrite the
shared metadata.

Use the native Next.js App Router Metadata API correctly for the installed version:
- Preserve/configure `metadataBase` once in the appropriate layout using the production app origin. The inspected boilerplate baseline already configures it in `src/app/[locale]/layout.tsx` through `generateMetadata()` and `siteConfig.appUrl`; audit and adapt that exact pattern.
- Use `Metadata` from `next` for metadata typing.
- Use static `metadata` for genuinely static routes and `generateMetadata()` for dynamic Place/Area pages whose metadata depends on validated server-side data.
- Use `MetadataRoute.Robots` and `MetadataRoute.Sitemap` in the existing route files.
- Reuse existing OG/Twitter image routes or migrate to supported metadata image file conventions only if compatible with the installed Next.js version and clearly beneficial.
- Do not manually inject duplicate `<title>`, `<meta>`, canonical, or hreflang tags.
- Verify the actual rendered HTML and endpoint responses for production and preview behavior.

## 9.2 Metadata

For every implemented public page and locale:

-   Unique title.
-   Unique, accurate meta description.
-   Absolute canonical URL.
-   Correct `vi` / `en` hreflang alternates.
-   Correct `x-default` behavior through the shared helper.
-   Open Graph metadata.
-   Twitter card metadata.
-   Correct robots directives.

Use the real product identity, not boilerplate defaults.

Suggested page search intent:

-   Home: Da Nang travel discovery guide.
-   Explore: places, attractions, food, cafes, and experiences.
-   Areas: discover Da Nang areas.
-   Area Detail: exact canonical area name and supported travel context.
-   Place Detail: exact place name plus supported category/area.
-   Trip Ideas: source-authentic Da Nang travel ideas.
-   Insights: public Da Nang travel dataset overview.

Use natural Vietnamese and English wording. Avoid keyword stuffing and
unsupported claims.

## 9.3 Canonical and hreflang

-   Production origin: `https://dn-explorer.phanhoangquoctu.io.vn`.
-   Use `NEXT_PUBLIC_APP_URL`.
-   No trailing slash in the configured origin.
-   Verify the working branch uses Vietnamese as the default locale.
-   The boilerplate baseline previously used English by default;
    preserve any approved fix or propose the smallest correction if the
    mismatch remains.
-   Verify canonical and language alternates from actual generated HTML.
-   Do not create duplicate language canonicals.
-   Do not include arbitrary query parameters in canonical URLs.

## 9.4 Query/filter URLs

-   Preserve Explore URL state.
-   Do not index thousands of filter/search variants as separate landing
    pages.
-   Canonicalize ordinary filtered/search variants to the appropriate
    base Explore route.
-   Consider `noindex,follow` for query-state variants when appropriate.
-   Do not block query URLs in robots.txt if doing so prevents crawlers
    from seeing `noindex`.
-   Decide pagination behavior based on the actual route and content.
-   Test query-state metadata.

## 9.5 Indexable routes and sitemap

Create an explicit route/indexability matrix.

Potential public routes, only if actually implemented:

-   Home.
-   Explore base.
-   Areas index.
-   Eight valid Area Detail routes.
-   Valid Place Detail routes from actual normalized records.
-   Trip Ideas.
-   Public Travel Insights.

Do not include:

-   `/api`, `/proxy`, health, internal, private, preview, not-found
    routes.
-   Unknown IDs or invalid area IDs.
-   Query/filter variants as separate landing pages.
-   Unimplemented routes.

Update `INDEXABLE_ROUTES` and sitemap using the existing convention.

For dynamic place/area URLs:

-   Use actual valid IDs only.
-   Preserve locale alternates.
-   Avoid duplicates.
-   Keep sitemap generation bounded and compatible with the current
    server-side data loader.
-   Do not add a database or backend for SEO.
-   If the existing data loader cannot safely support sitemap
    generation, report the constraint and propose a minimal strategy.
-   Do not fabricate `lastModified: new Date()` for every URL. Use a
    trustworthy source timestamp or omit it.
-   Verify the final XML response.

## 9.6 Robots

Review `src/app/robots.ts`:

-   Production allows public content.
-   Operational/private endpoints are disallowed appropriately.
-   Preview/nonproduction remains noindex/disallowed according to
    existing environment rules.
-   Sitemap URL uses the correct production origin.
-   Do not block assets needed to render public pages.
-   Do not use robots.txt instead of page-level noindex.

Verify production and preview behavior.

## 9.7 JSON-LD structured data

Use the existing `JsonLd` component and shared builders.

Use only schemas supported by actual content:

-   `WebSite`.
-   `WebPage`.
-   `BreadcrumbList`.
-   `Place` or an accurate specific subtype for Place Detail.
-   `TouristAttraction` only for genuine attractions.
-   `Restaurant`, `CafeOrCoffeeShop`, `Hotel`, or other types only when
    the normalized category and source facts support them.
-   `Person` for the supplied owner only if the owner/publisher
    relationship is represented accurately.
-   Do not invent an `Organization` or legal company.

Never fabricate:

-   Coordinates.
-   Phone numbers.
-   Review counts.
-   Aggregate ratings.
-   Numeric price ranges.
-   Structured opening hours from ambiguous free text.
-   Offers or availability.
-   Official/verified status.

Structured data must match visible content. Validate representative
JSON-LD output.

## 9.8 Open Graph and Twitter

-   Reuse the existing image routes.
-   Redesign generated images to match the new travel identity.
-   Use 1200 × 630 unless the existing implementation requires
    otherwise.
-   Use localized page title/description.
-   Use actual place names for detail pages.
-   Do not invent listing photos.
-   Ensure the image route returns a valid image without unexpected
    redirects.
-   Check text clipping, contrast, and mobile/social preview
    readability.

## 9.9 Internal linking and semantic HTML

-   Home links to Explore, Areas, Trip Ideas, Insights.
-   Explore links to exact Place Detail pages.
-   Areas index links to canonical Area Detail.
-   Area Detail links to supported places and filtered Explore.
-   Place Detail links to its canonical Area where available.
-   Trip Ideas link only to exact supported places.
-   Use real breadcrumbs.
-   Use locale-aware links.
-   Avoid orphan pages and unimplemented routes.
-   Use descriptive link text.
-   Ensure core content is server-rendered and crawlable.
-   Use one clear `h1` and logical heading hierarchy.
-   Use semantic landmarks, articles, tables, and links/buttons
    correctly.

## 9.10 Search Console

Prepare the site for Google Search Console:

-   Verify production origin and sitemap.
-   Provide a final checklist for adding the domain property and
    submitting `/sitemap.xml`.
-   Do not invent verification tokens.
-   Add verification metadata only when the user provides the real token
    or approves the method.
-   Do not add Analytics, Tag Manager, ad pixels, or behavioral tracking
    without approval.
-   Do not claim the site is indexed or verified unless that has been
    externally confirmed.

------------------------------------------------------------------------


# 10. Stage 4 — Next.js Proxy Rewrite, Route Handlers (BFF), and Data Access

This is still one Next.js application on Vercel. A Next.js Route Handler is not a separate backend. Do not add a database or a separate server.

## 10.1 Audit the actual boilerplate request architecture

The inspected boilerplate baseline currently declares Next.js `^16.4.2` in `package.json`; verify the lockfile and installed version. It currently has:

- `next.config.ts` rewrite: `/proxy/:path*` → `${API_URL}/:path*`.
- `API_URL` is derived from `NEXT_PUBLIC_API_URL`, with a JSONPlaceholder fallback in the boilerplate.
- `src/constants/env.ts` maps the literal `process.env.NEXT_PUBLIC_API_URL` value into typed `env.API_URL`.
- `src/app/api/health/route.ts` provides a lightweight `GET /api/health` liveness response with `Cache-Control: no-store`.
- `src/app/robots.ts` disallows `/api/` and `/proxy/` for crawlers.
- `src/app/[locale]/layout.tsx` already uses `generateMetadata()` and sets `metadataBase` from `siteConfig.appUrl`.

Re-check the working branch. Inventory every Route Handler and `/proxy/*` call site. Do not assume a generic BFF endpoint exists.

## 10.2 Choose the correct request mechanism

- **Server Components / server-only data service:** preferred for normal Google Drive workbook reads and server-rendered pages. Keep the existing workbook fetch, parsing, mapping, normalization, and cache pipeline here.
- **`/api/*` Route Handler:** use only for a real browser-triggered action that needs server-side execution or a controlled BFF request. Route Handlers are public HTTP endpoints and must validate inputs and protect state-changing behavior.
- **`/proxy/*` rewrite:** reuse only for a genuinely required public, read-only upstream API call from the browser. It is a transparent rewrite, not a secure BFF, not a secret vault, and not an automatic authentication, validation, allowlisting, or rate-limit layer.
- **Server Action:** use only if it fits the existing codebase conventions and is a better fit for the operation.

Do not force all data requests through a proxy. Do not route ordinary workbook page rendering through `/proxy/*` when the approved server-side data service already provides the data. If no browser-side public API request is needed, audit the rewrite and intentionally leave it unused.

## 10.3 Security and validation

For any `/api/*` Route Handler that accepts input or calls an upstream:

1. Use explicit route paths and supported HTTP methods; no generic catch-all proxy.
2. Validate params, query, headers, and body with the existing Zod conventions.
3. Use a fixed trusted upstream origin from server-only configuration when a private upstream is genuinely needed.
4. Never accept an arbitrary complete URL from the browser.
5. Allowlist dynamic upstream path segments.
6. Bound request body size and request timeout.
7. Check upstream status/content type and validate important response shapes.
8. Return normalized, safe error responses; never expose stack traces, secrets, or private upstream payloads.
9. Avoid broad permissive CORS. Keep same-origin browser calls same-origin.
10. Apply the existing CSRF/origin protection convention for state-changing actions; if none exists, propose a minimal approach before implementation.
11. Never treat `robots.txt` disallow rules as access control.
12. Do not put credentials in `NEXT_PUBLIC_API_URL` or any `NEXT_PUBLIC_*` variable.
13. Do not build an open proxy such as `/api/proxy?url=...`.

The existing `NEXT_PUBLIC_API_URL` is public configuration. The internal name `env.API_URL` does not make that value private. If a private upstream origin or credential is truly required, propose a server-only environment variable and schema change, explain why it is needed, and obtain approval before adding it.

## 10.4 Google Drive workbook and Manual Update

- Preserve the current server-side workbook data pipeline; the public `Anyone` sharing setting does not require the browser to bypass it.
- Do not expose workbook fetching/parsing internals or future private credentials to Client Components.
- Do not create a second parser, cache, or source of truth.
- For Manual Update, reuse the existing server-side endpoint/action if present; create a minimal explicit Route Handler only if the current architecture requires it.
- Keep the existing silent user experience and the rule that all users may request an update.
- Disable the button while a request is pending; block rapid duplicate clicks and apply a modest UI cooldown.
- Add server-side validation and cooldown/deduplication where supported by the existing architecture.
- After successful refresh, invalidate/revalidate only the relevant existing data cache/path/tag using APIs supported by the installed Next.js version.
- Do not cache state-changing requests; use `no-store` for health and refresh operation responses where appropriate.
- Test timeout, upstream failure, duplicate requests, cache revalidation, and safe error behavior.

Vercel serverless caveat: an in-memory lock/cooldown is not a guaranteed global lock across all instances. Do not claim global rate limiting unless the mechanism actually guarantees it. Because the project has no database and should remain simple, do not add Redis, Vercel KV, or distributed-lock infrastructure automatically. Ask for approval if global cross-instance enforcement is genuinely required.

## 10.5 Explicit proxy decision

Use `/proxy/*` only when a real public upstream request requires it. Do not use it for the public Google Drive workbook pipeline if that pipeline already runs server-side. Do not use it for secret-bearing or privileged operations. If it is not needed, document that the existing rewrite was audited and intentionally left unused by the travel application.

## 10.6 Proxy/BFF verification

- [ ] All existing API routes and proxy call sites inventoried.
- [ ] Browser request paths match the intended same-origin architecture.
- [ ] Workbook reads remain server-side.
- [ ] No secret appears in browser bundles or public env values.
- [ ] No arbitrary URL forwarding or open-proxy behavior.
- [ ] Unsupported methods and invalid inputs are rejected.
- [ ] Upstream timeouts and failures return safe responses.
- [ ] Cache headers and targeted revalidation are correct.
- [ ] Manual Update blocks rapid duplicate clicks and reports in-progress/throttled states safely.
- [ ] Serverless anti-spam limitations are documented honestly.
- [ ] No unnecessary proxy hop, database, backend, or unapproved infrastructure was added.

---

# 11. Stage 5 --- Accessibility and performance

## Accessibility

Target WCAG 2.2 AA:

-   Semantic landmarks and headings.
-   Accessible names/labels.
-   Keyboard support.
-   Visible focus.
-   Logical focus order.
-   Correct dialog/drawer focus and Escape behavior.
-   Semantic tables.
-   Contrast.
-   Status not color-only.
-   Touch targets preferably 44 × 44 CSS pixels where practical.
-   Screen-reader state feedback.
-   Reduced motion.
-   No hover-only actions.
-   Correct image alt.
-   Correct language metadata.
-   200% zoom/reflow.
-   Chart text/table alternatives.

Use automated and manual checks. Do not claim full conformance from an
automated scanner alone.

## Performance

Review:

-   LCP.
-   INP.
-   CLS.
-   Image sizing/loading.
-   Fonts.
-   Client JS.
-   Hydration.
-   Layout shifts.
-   Route transitions.
-   Filter interactions.
-   Chart rendering.
-   Third-party scripts.

Aim for good Core Web Vitals where practical:

-   LCP ≤ 2.5s.
-   INP ≤ 200ms.
-   CLS ≤ 0.1.

Do not claim field CWV passed from one local Lighthouse run. Do not add
tracking/performance services without approval.

------------------------------------------------------------------------

# 12. Stage 6 --- Functional regression

Verify the redesign did not change product behavior:

-   Search by name/address/category.
-   Case-insensitive search.
-   Vietnamese accent-insensitive search, including `đ` / `Đ`.
-   Main category.
-   Source category.
-   Canonical area.
-   Rating including null.
-   All normalized statuses.
-   Suitable-for.
-   Recommended time.
-   AND across dimensions.
-   OR within multi-select dimension.
-   Clear All.
-   Active filter removal.
-   URL serialization/parsing.
-   Reload and Back/Forward.
-   Grid default.
-   Status All default.
-   24 records/page.
-   Grid/List/Table parity.
-   Pagination after filter changes.
-   Zero-results state.
-   Valid empty dataset vs source error.
-   Exact Place Detail IDs.
-   Same-name records from different source sheets remain separate.
-   Eight canonical areas.
-   Source text unchanged in both locales.
-   Maps links use validated URLs.
-   Insights use approved metrics.
-   Manual Update remains silent and preserves its approved behavior.

------------------------------------------------------------------------

# 13. Stage 7 --- Browser, visual, SEO, API, and code verification

## Visual QA

1.  Capture a complete screenshot set for implemented routes at desktop
    and mobile; include tablet for responsive-critical pages.
2.  Inspect all screenshots in one batch.
3.  Fix all material issues found.
4.  Capture one final confirmation set for changed surfaces.
5.  Stop after the confirmation pass; do not enter endless subjective
    polish.

## SEO QA

Inspect actual output:
- Native Next.js `metadataBase` and Metadata API behavior.
- Static metadata and dynamic `generateMetadata()` output for route types.
- `MetadataRoute.Robots` and `MetadataRoute.Sitemap` responses.

-   `<title>`.
-   Meta description.
-   Canonical.
-   `hreflang`.
-   Open Graph.
-   Twitter card.
-   JSON-LD.
-   Robots.
-   Sitemap.
-   Query/filter canonical and noindex.
-   Dynamic route inclusion.
-   Internal links.
-   Breadcrumbs.
-   Image alt and social image endpoints.
-   Production vs preview behavior.

Run available Lighthouse/SEO/accessibility checks. Record actual output
and limitations.

## API / Proxy QA

- Test existing `/proxy/*` rewrite only where the product actually uses it.
- Test every new or changed Route Handler for supported methods, Zod validation, timeout, upstream 4xx/5xx, safe error bodies, and cache headers.
- Confirm no arbitrary URL forwarding, open proxy, SSRF path, or public secret.
- Confirm the Google Drive workbook still uses the existing server-side data path.
- Test Manual Update pending state, duplicate-click blocking, cooldown, and cache revalidation.
- Record that an in-memory lock on Vercel is instance-local, not a guaranteed global distributed lock.
- Confirm `/api/*` and `/proxy/*` are not indexed and that robots disallow is not treated as endpoint security.

## Code quality

Use actual repository scripts. Known boilerplate commands:

``` bash
pnpm lint
pnpm format:check
pnpm type-check
pnpm test
pnpm build
```

When components/stories change:

``` bash
pnpm build-storybook
```

Also inspect:

-   Browser console.
-   Hydration warnings.
-   Network errors.
-   Broken images.
-   Missing translation keys.
-   Route failures.
-   Build output.
-   Server-only imports leaking into client bundles.
-   Unexpected dependency/lockfile changes.
-   Untracked `.env` files and secrets.

Read full command output and record exit codes. Do not claim a check
passed unless it was run.

------------------------------------------------------------------------

# 14. Required Final Report

Report:

1. Status: completed / partially completed / blocked.
2. Branch, commit SHA, and working-tree status.
3. Exact skills/tools used and unavailable tools.
4. Live website audit and any access limitation.
5. Before/after design summary.
6. Actual palette and semantic tokens.
7. Typography, spacing, and responsive rules.
8. Header implementation and mobile behavior.
9. Footer implementation and exact owner links.
10. Page-by-page routes and files changed.
11. Explore UX and functional regression.
12. Native Next.js Metadata API, `metadataBase`, `generateMetadata()`, `MetadataRoute`, SEO helper reuse, and changed files.
13. Proxy/BFF architecture: existing rewrite/Route Handler inventory, request paths used or intentionally unused, workbook data flow, validation, timeout, caching/revalidation, anti-spam, and security verification.
14. Route-indexability matrix.
15. Representative localized titles/descriptions.
16. Canonical and hreflang results.
17. Robots and sitemap results.
18. JSON-LD types and evidence supporting them.
19. Open Graph/Twitter image results.
20. Environment variables and `.env.example` updates.
21. Vercel variables the user must set manually.
22. Responsive viewport results.
23. Accessibility findings.
24. Performance observations and limitations.
25. Browser screenshots, using exact verified paths only.
26. Exact test commands, exit codes, and outputs.
27. Acceptance criteria status.
28. Remaining defects and unverified items.
29. Confirmation that no business/data rules were changed.
30. Confirmation that no commit, push, Vercel setting change, or production deployment occurred without approval.

Never claim Google indexing, search ranking, Search Console verification, perfect accessibility, globally distributed rate limiting, or production readiness without evidence.

------------------------------------------------------------------------

# 15. Final Instructions

This is a full redesign and SEO improvement task. Make the product more
beautiful, professional, distinctive, understandable, and useful.

Prioritize:

1.  Real visual redesign.
2.  Excellent header and footer.
3.  Clear information architecture.
4.  Intuitive search and filters.
5.  Professional responsive layouts.
6.  Technical and on-page SEO using native Next.js App Router capabilities.
7.  Correct use of existing Proxy Rewrite and Route Handler/BFF architecture.
8.  Accessible interactions.
9.  Performance and reliable implementation.

Preserve all confirmed product and data rules. Reuse the existing
Next.js App Router, native Metadata API, SEO helpers, server-side
workbook pipeline, `/proxy/*` rewrite, and `/api/*` Route Handler
conventions where they are genuinely appropriate. A rewrite is not a
secure BFF; use server-side Route Handlers for secret-bearing or
privileged operations. Do not force unnecessary proxy hops, create an
open proxy, or over-engineer the no-backend/no-database architecture.
Do not add unapproved dependencies or infrastructure.

**First audit and present the implementation plan. Stop for explicit
user approval. After approval, implement, verify, and report with real
evidence.**

**End of Codex execution prompt.**
