# Da Nang Travel Discovery

# Complete Product Redesign, Design System & SEO Specification

> **Version:** 2.0 — includes native Next.js SEO and Proxy/BFF architecture requirements.

> **Document type:** Authoritative product/design/SEO specification for
> Codex\
> **Project:** Da Nang Travel Discovery\
> **Repository:**
> `https://github.com/PhanHoangQuocTu/nextjs-frontend-boilerplate`\
> **Production domain:** `https://dn-explorer.phanhoangquoctu.io.vn`\
> **Design mission:** Full visual redesign and UX improvement --- not a
> superficial polish pass\
> **Product direction:** Modern Editorial Travel\
> **Locales:** Vietnamese (`vi`, default) and English (`en`)\
> **Deployment target:** Vercel\
> **Scope:** Redesign all currently implemented public product routes,
> establish one coherent design system, build a professional
> header/footer, and improve technical/on-page SEO\
> **Status:** This document is the approved design and implementation
> brief. Existing product/business rules remain authoritative.

------------------------------------------------------------------------

# 0. Mission

You are the senior cross-functional product and engineering team
responsible for a complete redesign of Da Nang Travel Discovery.

The main objective is to make the website:

1.  **More beautiful and visually distinctive** --- a polished,
    professional travel product with a strong and consistent identity.
2.  **More appropriate for travel and tourism** --- colors, imagery,
    typography, content hierarchy, and visual details should evoke Da
    Nang's coastline, natural landscape, culture, food, and travel
    experiences.
3.  **Easier to use** --- visitors should understand the site
    immediately, find destinations quickly, filter information
    confidently, and navigate between pages without confusion.
4.  **Consistent across the entire product** --- header, footer, pages,
    cards, filters, tables, charts, forms, empty states, and responsive
    layouts must use one coherent design system.
5.  **SEO-ready at an architectural level** --- correct metadata,
    canonical URLs, language alternates, crawlable routes, sitemap,
    robots, structured data, internal links, social previews, content
    semantics, and performance.
6.  **Excellent on every screen size** --- desktop, tablet, and mobile
    must be intentionally designed and verified.
7.  **Maintainable** --- preserve the existing Next.js architecture,
    component conventions, data pipeline, translations, and dependency
    set.

This is a **real redesign of the visual experience**. Do not merely
adjust a few colors, add shadows, or round existing cards. Re-evaluate
the current visual identity, page composition, navigation, information
hierarchy, component anatomy, typography, spacing, and interaction
patterns. Replace weak or generic visual patterns with a more considered
travel-editorial design while preserving the product's approved
functionality and source-data truth.

The result should feel like a premium, curated travel discovery guide
for Da Nang --- not a generic admin dashboard, generic SaaS template,
booking marketplace, or collection of unrelated page templates.

**SEO success means technically accessible, indexable, understandable,
useful pages. Do not promise a Google ranking, traffic volume, or
rich-result appearance.**

------------------------------------------------------------------------

# 1. Non-Negotiable Operating Contract

This document defines the design and SEO target. It does not override:

1.  Explicit user decisions.
2.  Approved Phase 01--08 product specifications and business rules.
3.  Current repository `AGENTS.md`, `CLAUDE.md`, nested agent
    instructions, and actual code conventions.
4.  The actual working branch and implementation.
5.  Security, accessibility, browser, Next.js, Vercel, and search-engine
    requirements.

When the current code, repository rules, and previous specifications
disagree:

-   Inspect the actual working branch and relevant implementation.
-   Identify the conflicting behavior.
-   Distinguish confirmed decisions, current implementation, proposals,
    and blockers.
-   Choose the smallest safe resolution that preserves approved
    behavior.
-   Ask the user before changing business logic, data contracts, route
    identity, external services, dependencies, deployment settings, or
    other consequential behavior.

## 1.1 Required approval gates

Before editing application code:

1.  Audit the repository and live website.
2.  Read the relevant project specifications and actual execution
    reports.
3.  Discover and read relevant installed skills.
4.  Inspect the current UI in a real browser if available.
5.  Inventory the implemented routes and current SEO behavior.
6.  Produce a repository-aware redesign and SEO implementation plan.
7.  Include exact files, components, design direction, route-level SEO
    changes, environment changes, tests, risks, and acceptance criteria.
8.  **Stop and wait for explicit user approval before changing code.**

Do not interpret this document as permission to deploy, commit, push,
alter Vercel project settings, add paid services, or introduce new
dependencies.

## 1.2 Protect user work

-   Inspect branch, HEAD, latest commit, `git status`, tracked/untracked
    files, and user modifications.
-   Preserve all uncommitted and untracked user work.
-   Do not reset, clean, discard, stash, amend, rebase, force-push,
    commit, or rewrite Git history.
-   Do not overwrite an existing `.env`, `.env.local`, or
    `.env.production` without inspecting it and preserving existing
    secrets.
-   Do not print secrets in logs or final reports.
-   Do not add secrets to `NEXT_PUBLIC_*` variables.
-   Do not claim a command, test, browser inspection, SEO validation, or
    deployment succeeded unless it was actually performed and its output
    inspected.

## 1.3 Scope discipline

This task includes:

-   Full visual redesign of currently implemented public product pages.
-   A unified design system.
-   A complete responsive header and footer.
-   Better navigation and information hierarchy.
-   Better search/filter UX without changing filter semantics.
-   Technical SEO and on-page SEO.
-   Page metadata and social previews.
-   Sitemap, robots, canonical, hreflang, and structured data review.
-   Public owner/contact details in the footer.
-   Environment configuration for the production domain and public owner
    details.
-   Accessibility, performance, and full QA.

This task does not automatically include:

-   A new backend, database, CMS, authentication, or user account
    system.
-   New travel booking, reservation, ticket, payment, or availability
    functionality.
-   AI itinerary generation, favorites, saved trips, or personalization.
-   New in-app maps, geocoding, route planning, or map providers.
-   New analytics trackers or advertising pixels.
-   New external services or paid Vercel features.
-   New content claims or fabricated travel facts.
-   A new product phase or a rewrite of the approved data pipeline.

------------------------------------------------------------------------

# 2. Product Context and Confirmed Decisions

## 2.1 Product

Da Nang Travel Discovery is a bilingual public travel-discovery website
for:

-   Sightseeing and tourism.
-   Nature and beaches.
-   Food and dining.
-   Cafes and check-in locations.
-   Entertainment.
-   Accommodation.
-   Nearby destinations around Da Nang.

The production domain is:

`https://dn-explorer.phanhoangquoctu.io.vn`

The repository is based on:

`https://github.com/PhanHoangQuocTu/nextjs-frontend-boilerplate`

The existing product architecture is one Next.js application, with no
separate backend and no database. Vercel is the intended deployment
platform. The public Google Drive workbook remains the source of listing
and editorial data through the existing server-side pipeline.

## 2.2 Confirmed product rules

Preserve these decisions:

  -----------------------------------------------------------------------
  Area                                Confirmed rule
  ----------------------------------- -----------------------------------
  UI languages                        Vietnamese (`vi`) and English
                                      (`en`)

  Default locale                      Vietnamese (`vi`)

  Localization                        UI-only; workbook content is not
                                      translated

  Visual direction                    Editorial / travel editorial

  Explore default                     Grid View

  Default listing status              All

  Explore page size                   24 listings

  Search                              Name, address, category

  Search matching                     Case-insensitive and Vietnamese
                                      accent-insensitive

  Filter semantics                    AND across dimensions; OR within a
                                      multi-select dimension

  Filter state                        Preserve supported state in the URL

  Main categories                     Five canonical categories

  Source categories                   Eleven workbook/source categories

  Canonical areas                     Eight canonical areas

  Area identity                       Use normalized `areaId` and
                                      `areaName`

  Status                              Use normalized status; never infer
                                      from notes

  Rating                              Numeric rating or null; null is
                                      never zero

  Price                               Descriptive source text; no numeric
                                      price slider or price analytics

  Visit profile                       Use normalized fields; never infer
                                      from notes or names

  Duplicate records                   Same-name listings from different
                                      source sheets remain separate

  Notes & Tips                        Render source text verbatim,
                                      without truncation or rewriting

  Map                                 Simple; use only validated original
                                      Google Maps links

  Insights                            Public travel insights, not an
                                      internal admin dashboard

  Refresh                             Latest available data on page entry
                                      and existing Manual Update behavior

  Refresh feedback                    Silent changes; no disruptive
                                      change announcement
  -----------------------------------------------------------------------

Do not change these rules to make the redesigned UI easier to implement.

## 2.3 Source-data integrity

A beautiful design that misrepresents the source data is a failure.

-   Preserve names, addresses, categories, canonical areas, price text,
    opening-hours text, highlights, Notes & Tips, editorial text, and
    visit-profile values exactly.
-   Do not translate workbook content in English UI.
-   Do not fabricate listing photos, review counts, ratings, prices,
    availability, opening status, coordinates, or popularity.
-   Do not claim "official", "verified", "open now", "best", "top", or
    "most popular" without an approved and reliable source.
-   Do not merge records from different source sheets solely because
    their names match.
-   Use the exact normalized listing ID for detail routes.
-   Do not filter by raw `sourceArea`.
-   Do not create an unapproved ninth canonical area.
-   Do not use source summary counts as current runtime truth.
-   Do not create new business logic inside UI components.

------------------------------------------------------------------------

# 3. Roles and Responsibilities

Work as a coordinated senior team. These roles define responsibilities,
not a requirement to create a multi-agent framework.

## 3.1 Senior Product Designer

-   Define the redesigned product identity.
-   Understand visitor goals and major journeys.
-   Establish page hierarchy and visual direction.
-   Ensure the design feels specific to Da Nang travel discovery.
-   Balance editorial inspiration with practical information.

## 3.2 Senior UI/UX Designer

-   Audit navigation, discoverability, cognitive load, and interaction
    patterns.
-   Redesign page layouts and component anatomy.
-   Make search and filters intuitive.
-   Ensure visitors can identify status, rating, location, and useful
    information quickly.
-   Design desktop, tablet, and mobile behavior separately.
-   Define loading, error, empty, disabled, and success states.

## 3.3 Senior Visual / Brand Designer

-   Create a professional travel-appropriate color system.
-   Establish typography, visual hierarchy, spacing, imagery, icons, and
    composition.
-   Avoid generic dashboard aesthetics.
-   Create a coherent visual identity across every route.
-   Ensure brand details are consistent without excessive decoration.

## 3.4 Design Systems Lead

-   Audit and reuse existing design tokens and UI primitives.
-   Define semantic tokens and reusable component variants.
-   Consolidate inconsistent styles.
-   Document design-system rules and examples.
-   Prevent one-off styling from spreading across pages.

## 3.5 Senior Next.js / Frontend Engineer

-   Preserve App Router architecture and repository conventions.
-   Prefer Server Components.
-   Keep Client Components limited to actual interactions.
-   Reuse existing components and helpers.
-   Keep page modules, shared UI, SEO helpers, and data logic separated
    appropriately.
-   Avoid unnecessary dependencies and abstractions.
-   Understand the installed Next.js App Router version, Metadata API, rewrites, Route Handlers, Server Components, server-only modules, caching, and revalidation.
-   Choose the correct data-access path instead of routing every request through a browser-side proxy.

## 3.6 Senior Technical SEO Engineer

-   Audit crawlability, indexability, canonical URLs, language
    alternates, metadata, sitemap, robots, and structured data.
-   Build a route-level SEO strategy.
-   Prevent duplicate and low-value indexed URLs.
-   Ensure metadata is localized and factually accurate.
-   Improve internal linking and semantic HTML.
-   Review performance and Core Web Vitals.

## 3.7 Senior Content / Search Intent Specialist

-   Map page types to real search intent.
-   Write concise, unique Vietnamese and English UI metadata.
-   Use natural travel-search terminology.
-   Avoid keyword stuffing and unsupported claims.
-   Preserve source-authentic workbook text.
-   Identify content gaps without fabricating articles or travel facts.

## 3.8 Accessibility Specialist

-   Target WCAG 2.2 AA.
-   Review keyboard navigation, focus, contrast, labels, semantics,
    screen-reader feedback, touch targets, reduced motion, and
    zoom/reflow.

## 3.9 Senior QA Engineer

-   Build a route/locale/viewport test matrix.
-   Verify functional behavior has not changed.
-   Capture and inspect browser screenshots.
-   Validate metadata and SEO output.
-   Run automated tests, lint, type-check, build, and Storybook where
    applicable.
-   Report evidence and remaining gaps.

## 3.10 Technical Lead

-   Protect project scope and architecture.
-   Keep the solution simple and maintainable.
-   Resolve implementation order and dependencies.
-   Stop unapproved changes.

## 3.11 Next.js BFF / API Security Specialist

-   Audit the existing Next.js rewrite, Route Handler, server-side data-loader, and cache/revalidation architecture.
-   Distinguish a transparent rewrite from a server-side Backend-for-Frontend (BFF) endpoint.
-   Select the smallest appropriate request path for public read-only requests, private upstream requests, and manual refresh actions.
-   Validate request inputs, methods, upstream destinations, timeout behavior, error handling, cache behavior, and abuse controls.
-   Prevent open-proxy behavior, SSRF, accidental secret exposure, and false claims about serverless rate limiting.
-   Preserve the no-separate-backend and no-database architecture.

------------------------------------------------------------------------

# 4. Mandatory Skills and Tool Discovery

The user expects Codex to use relevant UI/UX, frontend, accessibility,
and SEO capabilities available in the environment.

Before implementation:

1.  Discover installed Codex/plugin skills and repository-local skills.
2.  Read the full `SKILL.md` for every skill that materially applies.
3.  Read the relevant reference documents required by those skills.
4.  Discover available MCP tools, browser tools, Playwright tools,
    screenshot tools, and accessibility tools.
5.  Use only tools that actually exist and are relevant.
6.  Never claim that a skill or tool was used if it was unavailable or
    not used.

Prioritize these categories when present:

-   Impeccable / frontend design.
-   UI/UX critique and redesign.
-   Design-system extraction.
-   Responsive adaptation.
-   Typography and color systems.
-   Accessibility and inclusive design.
-   SEO / technical SEO.
-   Next.js metadata and route architecture.
-   Browser automation and visual regression.
-   Performance and Core Web Vitals.
-   Writing implementation plans.
-   Code review.
-   Verification before completion.

If the `impeccable` skill is installed:

-   Read its full skill instructions.
-   Run its required context-loading step once for the project,
    following the exact installed instructions.
-   Inspect the actual incumbent UI before redesign.
-   Read the craft-quality rules before UI edits.
-   Use the appropriate audit/critique/adapt/polish workflow according
    to its routing instructions.
-   Do not mechanically run every command.

If a required tool is unavailable, record the limitation and use the
best existing alternative. Do not install a new dependency or tool
without approval.

------------------------------------------------------------------------

# 5. Mandatory Discovery and Audit

## 5.1 Repository audit

Inspect:

-   Active branch, HEAD, latest commit, and working tree.
-   Root/nested `AGENTS.md`, `CLAUDE.md`, and all relevant instructions.
-   `package.json`, lockfile, Node version, package manager, and
    scripts.
-   Next.js configuration and App Router route tree.
-   `src/modules`, `src/components`, `src/components/ui`, `src/config`,
    `src/constants`, `src/lib`, `src/i18n`, and `src/messages`.
-   Existing design tokens and Tailwind v4 configuration.
-   Theme provider and supported themes.
-   Fonts and icon conventions.
-   Header, footer, app shell, page containers, and navigation.
-   Search/filter/listing components.
-   SEO helpers, metadata, JSON-LD, Open Graph images, robots, sitemap,
    manifest, and route constants.
-   Environment schema and `.env.example`.
-   Storybook, Vitest, Testing Library, Biome, and CI conventions.
-   Vercel configuration and deployment documentation.

Read the actual Phase 01--08 specifications and implementation reports.
A previous specification is not proof that the code exists.

## 5.2 Live website audit

Open the production website in an actual browser:

`https://dn-explorer.phanhoangquoctu.io.vn`

Inspect:

-   Homepage first viewport and full page.
-   Header and footer.
-   Navigation and locale switcher.
-   Explore and its search/filter behavior.
-   Listing Grid, List, and Table if implemented.
-   Place Detail.
-   Areas index and detail.
-   Trip Ideas.
-   Public Travel Insights.
-   Loading, empty, error, and not-found states.
-   Desktop, tablet, and mobile.
-   Browser console and network errors.
-   Actual page titles, descriptions, canonical links, language
    alternates, Open Graph tags, robots directives, JSON-LD,
    `robots.txt`, and `sitemap.xml`.

If the live website cannot be accessed, state that fact. Continue with
the local codebase and use the browser against the local application
after setup. Do not invent a live-site audit.

## 5.3 Visual audit

Capture baseline screenshots where possible:

-   Desktop: 1440px and 1280px.
-   Tablet: 1024px and 768px.
-   Mobile: 390px, 375px, 360px, and 320px.

Record:

-   Visual inconsistency.
-   Weak hierarchy.
-   Poor color contrast.
-   Generic or outdated styling.
-   Excessive card borders/shadows.
-   Misaligned spacing.
-   Cluttered filters.
-   Unclear buttons or navigation.
-   Mobile overflow.
-   Text clipping.
-   Unhelpful empty/loading/error states.
-   Inconsistent header/footer.
-   Missing or duplicated metadata.
-   Missing internal links.
-   Crawlability/indexability defects.

Each major issue should include the route, viewport, severity, evidence,
and proposed resolution.

------------------------------------------------------------------------

# 6. Redesign Direction --- Modern Editorial Travel

## 6.1 Brand feeling

The redesigned product should communicate:

-   Coastal discovery.
-   Local exploration.
-   Nature and culture.
-   Trustworthy practical information.
-   Curated travel inspiration.
-   Calm, premium, modern editorial quality.

It should be welcoming to domestic and international visitors.

Avoid:

-   Generic admin dashboards.
-   Generic SaaS landing-page templates.
-   Excessive glassmorphism.
-   Excessive gradients.
-   Neon/tropical rainbow colors.
-   Excessive rounded cards.
-   Dense walls of filters.
-   Arbitrary decorative icons.
-   Emoji as primary UI icons.
-   Fake travel imagery.
-   Stock images presented as actual places.
-   Excessive animations.
-   Unnecessary dashboard KPIs.

## 6.2 Proposed color direction

Use the existing theme architecture, but redesign its semantic color
roles to better match Da Nang travel.

Starting palette proposal (not a reason to skip contrast testing):

  -----------------------------------------------------------------------
  Role                    Suggested value         Intended use
  ----------------------- ----------------------- -----------------------
  Deep ocean              `#123B4A`               Strong headings,
                                                  navigation, primary
                                                  dark surfaces

  Coastal teal            `#0F6B70`               Primary interactive
                                                  accent, selected
                                                  controls, links

  Sea mist                `#E8F2F1`               Soft secondary surfaces

  Warm ivory              `#F8F7F2`               Main editorial
                                                  background

  Sand                    `#E6D4B5`               Restrained warm
                                                  supporting accent

  Sunset coral            `#D9785B`               Small highlights,
                                                  editorial accent only

  Nature green            `#557A63`               Semantic nature/success
                                                  use only

  Ink                     `#1F2D33`               Main text

  Muted slate             `#64747A`               Secondary text

  Soft border             `#E1E7E5`               Dividers and control
                                                  boundaries

  White                   `#FFFFFF`               Primary surface
  -----------------------------------------------------------------------

Rules:

1.  Treat these values as a design starting point. Inspect existing
    theme behavior and adjust only with a documented reason.
2.  Check WCAG contrast for all text, buttons, icons, borders, selected
    states, badges, and focus indicators.
3.  Use deep ocean and coastal teal as the primary identity, not coral.
4.  Use warm ivory and sand to create a travel-editorial atmosphere.
5.  Use coral sparingly; do not use it for every CTA.
6.  Keep status colors semantically distinct and always pair them with
    text/icons.
7.  Do not assign a different unrelated accent to each category.
8.  Keep light/dark behavior consistent with the repository's existing
    theme support. Do not introduce a second theme system.

## 6.3 Typography

-   Inspect the existing font setup before changing it.
-   Preserve local font and licensing constraints.
-   Use a clear editorial display hierarchy for page titles and section
    headings.
-   Use highly readable body typography for long Vietnamese and English
    text.
-   Ensure Vietnamese diacritics render correctly.
-   Use fluid but bounded responsive typography.
-   Avoid overly small labels, metadata, chips, and table content.
-   Keep comfortable line lengths for editorial text.
-   Do not add a new font dependency or remote font without approval.

## 6.4 Layout and composition

Define a consistent layout system:

-   Main content max-width.
-   Desktop/tablet/mobile gutters.
-   Section spacing.
-   Grid gaps.
-   Card padding.
-   Form control heights.
-   Header height.
-   Footer columns and spacing.
-   Border radius.
-   Border width.
-   Elevation/shadows.
-   Sticky layers and z-index.
-   Responsive behavior.

Use whitespace intentionally. Do not put every section into a bordered
card. Prefer editorial section composition, clean surfaces, subtle
dividers, and consistent alignment.

## 6.5 Imagery

-   Audit existing assets.
-   Use approved local or user-provided assets only.
-   Do not scrape, hotlink, or invent images.
-   Do not associate random images with workbook listings.
-   If a genuine brand/hero image exists, optimize it and use it with
    responsive dimensions and a clear focal point.
-   If no trustworthy hero image exists, use a strong typographic hero
    with a restrained graphic treatment.
-   Use `next/image` and existing image conventions.
-   Provide meaningful alt text for informative images; decorative
    images use empty alt.
-   Do not make the website depend on images for basic understanding.

------------------------------------------------------------------------

# 7. Unified Design System

Create or refine one source of truth using the repository's current CSS
variables and Tailwind conventions.

## 7.1 Design documentation

If the project already has `DESIGN.md`, `PRODUCT.md`, or equivalent,
update it instead of creating duplicates.

Otherwise propose the smallest useful documentation location, such as
`DESIGN.md` or `docs/design-system.md`.

Document:

1.  Product identity and design principles.
2.  Color palette and semantic token mapping.
3.  Typography scale.
4.  Spacing and layout scale.
5.  Containers and breakpoints.
6.  Radius, border, shadow, and elevation.
7.  Iconography.
8.  Motion and interaction behavior.
9.  Shared component inventory.
10. Component variants and states.
11. Accessibility requirements.
12. Page composition patterns.
13. Responsive rules.
14. Source-content integrity rules.
15. Examples of correct and incorrect usage.

## 7.2 Semantic tokens

Use the existing token naming convention. Relevant roles include:

-   `background`, `surface`, `surface-muted`.
-   `foreground`, `foreground-muted`, `foreground-subtle`.
-   `primary`, `primary-foreground`.
-   `secondary`, `secondary-foreground`.
-   `accent`, `accent-foreground`.
-   `border`, `input`, `ring`.
-   `success`, `warning`, `danger`, `info`.
-   `disabled`, `overlay`, `focus`.
-   Chart colors only where existing chart components require them.

Do not scatter raw hex values through page components.

## 7.3 Shared components

Audit before creating. Reuse or refine existing components for:

-   Header and mobile navigation.
-   Footer.
-   Brand/wordmark.
-   Page container.
-   Section heading.
-   Breadcrumbs.
-   Buttons and icon buttons.
-   Links.
-   Search input.
-   Inputs and selects.
-   Checkboxes and multi-selects.
-   Filter panel and filter chips.
-   Status badges.
-   Rating display.
-   Listing card.
-   Listing row.
-   Data table.
-   Pagination.
-   View switcher.
-   Tabs and popovers.
-   Dialog/drawer/sheet if supported.
-   KPI cards.
-   Chart containers and legends.
-   Empty/loading/error states.
-   Maps external link.
-   Manual Update control.
-   Not-found state.
-   Social/contact links.

Every interactive component must define:

-   Default.
-   Hover.
-   Focus-visible.
-   Active/selected.
-   Disabled.
-   Loading.
-   Invalid/error.
-   Empty.
-   Read-only, if relevant.

Do not create abstractions for one-off decorative details without a
meaningful reuse case.

------------------------------------------------------------------------

# 8. Header and Footer --- Required High-Priority Work

Header and footer are part of the product identity and must be
deliberately redesigned, not left as generic boilerplate.

## 8.1 Header goals

The header must:

-   Identify the product immediately.
-   Make primary navigation easy to understand.
-   Help visitors reach discovery content quickly.
-   Work consistently in Vietnamese and English.
-   Be responsive and accessible.
-   Remain visually balanced with the editorial page layouts.

### Desktop header

Recommended composition:

1.  Brand/wordmark on the left.
2.  Primary navigation in the center or adjacent to the brand.
3.  Locale switcher and any existing primary utility action on the
    right.

Use only routes that actually exist in the working application.
Candidate navigation labels include:

-   Trang chủ / Home.
-   Khám phá / Explore.
-   Khu vực / Areas.
-   Gợi ý hành trình / Trip Ideas.
-   Insights / Travel Insights.

Do not add a link to an unimplemented route.

Requirements:

-   Clearly indicate the active route.
-   Use semantic navigation and accessible labels.
-   Provide visible keyboard focus.
-   Keep spacing and hover states consistent.
-   Avoid excessive header height.
-   If sticky behavior is used, ensure it does not cover content or
    anchor targets.
-   Do not add social icons to the main navigation unless a strong UX
    reason exists.

### Mobile header

-   Use a compact brand treatment.
-   Provide an accessible menu button with a clear expanded/collapsed
    state.
-   Manage focus correctly when the menu opens and closes.
-   Support Escape to close.
-   Keep locale switching reachable.
-   Avoid hover-only behavior.
-   Prevent overlay clipping and background scroll issues.
-   Do not let the header consume too much of the first viewport.

## 8.2 Footer goals

Build a complete, professional footer that reinforces product identity
and gives visitors useful next steps.

Recommended desktop structure:

**Column 1 --- Brand** - Da Nang Travel Discovery wordmark/name. -
Short, truthful description of the website as a Da Nang travel discovery
guide. - No unsupported claims such as official city portal, verified
source, or best travel guide.

**Column 2 --- Explore** - Links to implemented discovery routes. - Main
categories only when they have a real route or a valid Explore filter
link. - Canonical areas only when supported by the real dataset.

**Column 3 --- Useful links** - Areas. - Trip Ideas. - Travel
Insights. - Other implemented public pages. - Sitemap link only if a
human-readable HTML sitemap exists.

**Column 4 --- Owner / Contact** Use the exact user-provided details:

-   Owner name: `Phan Hoàng Quốc Tú`
-   Email: `tuphan694@gmail.com`
-   Facebook: `https://www.facebook.com/phanhoangquoctu/`
-   LinkedIn: `https://www.linkedin.com/in/phanhoangquoctu/`

Suggested localized label: - Vietnamese: `Chủ sở hữu website` - English:
`Website owner`

Required behavior:

-   Email uses `mailto:`.
-   Facebook and LinkedIn are real external links.
-   External links opened in a new tab must use
    `rel="noopener noreferrer"` and accessible labels.
-   Social icons must have text/accessible names; do not rely on icon
    shape alone.
-   Use the repository's existing icon package.
-   Do not invent phone numbers, office addresses, company names, legal
    registrations, or extra social profiles.
-   Do not label the owner as a registered company or official tourism
    authority.
-   Keep the footer readable and compact on mobile.
-   Use a restrained visual treatment consistent with the new color
    system.

The footer may include a small copyright line such as
`© {current year} Da Nang Travel Discovery` only if this is appropriate
for the project. Do not invent legal terms or privacy policy pages that
do not exist.

------------------------------------------------------------------------

# 9. Page-by-Page Redesign Requirements

Audit actual routes first. Implement only pages that exist in the
working branch.

## 9.1 Shared app shell

-   Consistent header, navigation, footer, page container, and
    background system.
-   Correct locale-aware links.
-   Correct active-route indication.
-   Clear focus and keyboard behavior.
-   Consistent content width and responsive gutters.
-   No unnecessary page-level layout duplication.

## 9.2 Home

Purpose: introduce the product and lead visitors into discovery.

Recommended hierarchy:

1.  Editorial hero with clear localized headline and concise supporting
    text.
2.  Prominent search entry point.
3.  Main category discovery.
4.  Canonical area discovery.
5.  Source-authentic Trip Ideas / Top Picks preview.
6.  Useful editorial/data summary only where supported.
7.  Clear calls to action into Explore and other implemented surfaces.

Requirements:

-   Strong first viewport.
-   One primary message and one clear primary action.
-   Do not overwhelm the hero with multiple CTAs.
-   Do not invent listing photos, featured places, rankings, or
    editorial entries.
-   Category and area counts must come from the actual normalized
    dataset.
-   Search navigates to Explore using the existing URL-state contract.
-   Avoid turning Home into an analytics dashboard.
-   Ensure the page remains meaningful without decorative images.

## 9.3 Explore

This is the highest-priority repeated-use surface.

### Page hierarchy

1.  Page title and concise description.
2.  Search.
3.  Logical filter controls.
4.  Active filter summary and Clear All.
5.  Result count.
6.  Sort control only if supported by actual approved behavior.
7.  Grid/List/Table view switcher.
8.  Results.
9.  Pagination.

### Search behavior --- preserve exactly

-   Search by listing name, address, and category.
-   Case-insensitive.
-   Vietnamese accent-insensitive, including `đ` and `Đ`.
-   Preserve supported query state in the URL.
-   Keep search accessible and easy to clear.
-   Do not create unnecessary network requests.
-   Preserve query/filter state when switching views and locales where
    supported.

### Filters --- preserve business semantics

Dimensions:

-   Main category.
-   Source category.
-   Canonical area.
-   Rating.
-   Listing status.
-   Suitable-for.
-   Recommended time.

Rules:

-   AND across different dimensions.
-   OR within a multi-select dimension.
-   Default status = All.
-   Default view = Grid.
-   Page size = 24.
-   Clear All resets the approved default state and pagination.
-   Preserve applied filters when switching Grid/List/Table.
-   Use canonical `areaId` and `areaName`.
-   Null rating remains null.
-   Do not create numeric price filters.
-   Do not infer visit profile values from notes, names, or categories.

### Filter UX

Group filters by user intent:

-   Category.
-   Location.
-   Rating.
-   Status.
-   Experience / visit profile.

Desktop:

-   Use a sidebar or compact toolbar based on actual available width.
-   Avoid a sidebar that reduces result cards to unreadable widths.
-   Keep result count and view controls close to results.
-   Use progressive disclosure for secondary filters when helpful.

Tablet:

-   Collapse/adapt the filter area deliberately.
-   Preserve visible selected-filter state.
-   Do not squeeze the desktop sidebar into a narrow column.

Mobile:

-   Provide a clear Filters trigger with selected-filter count.
-   Use an existing accessible drawer/sheet/dialog if available.
-   Group controls with clear headings.
-   Keep Clear All and selected values easy to find.
-   Preserve current apply semantics; do not add staged Apply behavior
    if filters currently apply immediately.
-   Prevent background scroll when modal behavior is used.
-   Manage focus, Escape, and focus restoration.
-   Do not push the result list far below a permanently expanded filter
    wall.

### Active filter summary

-   Removable chips or an equally clear compact summary.
-   Accessible remove buttons.
-   Clear All.
-   No duplicate labels.
-   No page-level horizontal overflow.
-   Default All status must not be confused with an explicit narrowed
    selection.

### Grid/List/Table

**Grid** - Consistent card anatomy. - Listing name, category, canonical
area, normalized status, and numeric rating when valid. - Clear click
target. - No fake photos.

**List** - Compact scanning layout. - Preserve important fields. - Avoid
metadata clutter.

**Table** - Semantic table markup and headers. - Useful columns only. -
Deliberate mobile strategy: compact transformation or contained
horizontal scroll. - Never cause page-level horizontal overflow. -
Actions must not depend on hover.

Pagination remains 24 records per page.

## 9.4 Place Detail

-   Clear page title and information hierarchy.
-   Show category, canonical area, normalized status, and valid numeric
    rating.
-   Group address, price text, opening hours, highlights, visit profile,
    and Notes & Tips logically.
-   Use exact listing ID for route identity.
-   Preserve duplicate records from different source sheets.
-   Use only validated Maps URLs.
-   Preserve all source text verbatim.
-   Notes & Tips remain fully visible and are not collapsed/truncated by
    default.
-   Do not invent images, related-place suggestions, ratings, or
    availability.
-   Distinguish missing optional fields from a source error.

## 9.5 Areas index and Area Detail

-   Show exactly the eight canonical areas from the normalized data.
-   Preserve exact Vietnamese names.
-   Use canonical IDs.
-   Show runtime listing counts from exact `areaId` equality.
-   Preserve source area descriptions verbatim.
-   Do not create map polygons or imply precise geographic boundaries.
-   Provide clear navigation into Explore and exact supported Place
    Detail routes.

## 9.6 Trip Ideas / Editorial

-   Reading-first editorial layout.
-   Strong title/subtitle hierarchy.
-   Readable line lengths.
-   Clear day/section grouping.
-   Source-authentic text.
-   Exact listing links only where a deterministic supported
    relationship exists.
-   No invented itinerary facts or AI itinerary generation.

## 9.7 Public Travel Insights

-   Public-facing, editorial data story --- not an admin dashboard.
-   Use only approved metrics:
    -   Total listings.
    -   Main-category distribution.
    -   Canonical-area distribution.
    -   Listing-status distribution.
    -   Numeric-rating distribution.
    -   Top-rated listings.
-   Do not add average system-wide rating or average price.
-   Use readable charts and text/table alternatives.
-   Do not imply that top-rated listings are verified, currently open,
    or guaranteed recommendations.

## 9.8 Loading, error, empty, and not-found states

-   Distinguish no search results, valid empty dataset, source error,
    and not-found.
-   Do not show fake zero metrics while data is loading.
-   Use calm, localized, helpful copy.
-   Retry only where a real safe retry exists.
-   Do not expose stack traces, parser details, secrets, or private
    URLs.
-   Keep silent refresh behavior.

------------------------------------------------------------------------

# 10. Responsive Design Requirements

Use existing breakpoints and layout conventions. Do not invent new
breakpoints unless necessary and documented.

## 10.1 Desktop

Test at 1280px and 1440px.

-   Readable max-width.
-   Consistent page gutters.
-   Multi-column grids only when card content remains legible.
-   Balanced header/navigation.
-   Filters and results align.
-   Editorial line length remains comfortable.
-   No excessive empty space or card clutter.

## 10.2 Tablet

Test at 768px and 1024px.

-   Deliberate grid reflow.
-   Navigation adapts.
-   Filters collapse or change layout.
-   Cards remain readable.
-   Tables remain usable.
-   Touch targets remain comfortable.

## 10.3 Mobile

Test at 320px, 360px, 375px, and 390px.

-   Search remains easy to reach.
-   Mobile navigation is accessible.
-   Filters use a compact interaction.
-   Cards stack cleanly.
-   Tables have a deliberate strategy.
-   Long Vietnamese names and English text wrap.
-   No clipped controls, badges, labels, or chips.
-   No page-level horizontal overflow.
-   Sticky/fixed UI respects safe areas.
-   Essential information is not hidden merely to reduce height.

## 10.4 Responsive acceptance

-   No unintended body-level horizontal scroll.
-   No overlap between header, drawer, dialogs, sticky bars, or bottom
    actions.
-   No hover-only actions.
-   No clipped long strings.
-   No broken locale switcher.
-   No layout shift from missing media dimensions.
-   Usable at 200% browser zoom and narrow reflow widths.

------------------------------------------------------------------------

# 11. Accessibility Requirements

Target WCAG 2.2 AA as the design and verification goal.

Verify:

1.  Semantic landmarks.
2.  Correct heading hierarchy and one clear `h1` per page.
3.  Accessible names and labels for controls.
4.  Keyboard operation for all interactive elements.
5.  Visible focus-visible state.
6.  Logical focus order.
7.  No keyboard traps.
8.  Dialog/drawer focus management and Escape behavior.
9.  Semantic table headers.
10. Contrast for text, icons, controls, and focus states.
11. Status is not communicated by color alone.
12. Prefer touch targets of at least 44 × 44 CSS pixels where practical.
13. Screen-reader feedback for meaningful state changes.
14. Reduced-motion support.
15. No hover-only information.
16. Appropriate image alt text.
17. Correct language metadata.
18. Long source text remains selectable and readable.
19. 200% zoom/reflow.
20. Chart text/table equivalents.

Automated scanners are not sufficient by themselves. Combine automated
checks with manual keyboard and visual inspection. Report unverified
criteria honestly.

------------------------------------------------------------------------

# 12. SEO Strategy --- Technical and On-Page

SEO is a first-class implementation requirement. Do not treat it as a
final metadata patch.

## 12.1 SEO goals

Improve:

-   Search-engine crawlability.
-   Indexability of useful public pages.
-   Canonical consistency.
-   Vietnamese and English language targeting.
-   Page titles and descriptions.
-   Structured content and semantic HTML.
-   Internal linking and crawl paths.
-   Social sharing previews.
-   Mobile usability.
-   Core Web Vitals and page performance.
-   Discoverability of actual places, canonical areas, and editorial
    content.

Do not guarantee rankings or search traffic.

## 12.2 Existing SEO architecture --- inspect and reuse

The public boilerplate baseline already contains these SEO building
blocks. Verify the actual working branch before editing:

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
-   `src/app/opengraph-image/route.tsx`
-   `src/app/twitter-image/route.tsx`
-   `src/lib/og-image.tsx`
-   `src/config/site.ts`
-   `src/constants/env.ts`
-   `src/app/[locale]/layout.tsx`
-   `src/components/seo/JsonLd`
-   `next-intl` locale routing and localized message namespaces.
-   Next.js App Router Metadata API: `Metadata`, static `metadata`, and `generateMetadata()`.
-   Root/locale layout metadata including `metadataBase`.
-   Next.js metadata route types: `MetadataRoute.Robots` and `MetadataRoute.Sitemap`.
-   Next.js generated social image support using the existing Open Graph/Twitter image routes or the supported file conventions for the installed Next.js version.

Rules:

1.  Reuse the existing shared SEO helpers.
2.  Do not build a second metadata system.
3.  Do not handwrite partial `openGraph` or `alternates` objects if they
    replace data from `buildMetadata`.
4.  All public indexable pages must use the established metadata
    pattern.
5.  Keep metadata localized.
6.  Verify canonical and language alternates from actual generated HTML.
7.  Keep private/operational pages out of the sitemap.
8.  Preview and non-production environments remain noindex according to
    existing environment rules.
9.  Use the native Next.js App Router Metadata API rather than manually injecting SEO tags into page markup.
10. Use static `metadata` for truly static routes and `generateMetadata()` for dynamic routes whose title/description depend on validated route data.
11. Configure `metadataBase` once in the correct root/locale layout using the canonical app origin; do not duplicate or conflict with the existing layout-level configuration.
12. Use the installed Next.js version's `Metadata` and `MetadataRoute` types. Do not copy APIs from a different Next.js version.
13. Keep metadata generation server-side and ensure dynamic metadata does not require a client-side fetch after hydration.
14. Preserve Next.js nested metadata merge/replace behavior: build complete nested `openGraph`, `twitter`, and `alternates` objects through the shared helper.
15. Verify rendered HTML and HTTP responses, not just TypeScript objects.

### Native Next.js SEO implementation checklist

- `metadataBase` is configured at the appropriate App Router layout level and points to `https://dn-explorer.phanhoangquoctu.io.vn` in production.
- Use `Metadata` from `next` for shared metadata helpers and route metadata typing.
- Use `generateMetadata()` for Place Detail and Area Detail pages when metadata depends on the validated record/area; return a real not-found outcome for invalid IDs rather than fabricated metadata.
- Use static `metadata` only when the route metadata is genuinely static.
- Use `MetadataRoute.Robots` in `src/app/robots.ts` and `MetadataRoute.Sitemap` in `src/app/sitemap.ts`.
- Reuse `opengraph-image` and `twitter-image` route implementations or migrate to the installed Next.js file convention only when it is compatible and materially improves the existing implementation.
- Keep `robots`, canonical, language alternates, Open Graph, and Twitter metadata in the shared SEO helper where appropriate.
- Avoid hand-injected `<meta>` tags, duplicate canonical tags, duplicate JSON-LD, or client-only metadata.
- Confirm the production, local, and Vercel Preview metadata outputs separately.

The inspected boilerplate baseline currently configures `metadataBase` in `src/app/[locale]/layout.tsx` through its `generateMetadata()` function, and uses `buildMetadata()` in `src/lib/seo.ts`. Preserve and adapt that established pattern instead of adding a competing root-level system.

## 12.3 Site origin and environment variables

The existing boilerplate uses `NEXT_PUBLIC_APP_URL` as the app origin.
Do not introduce `NEXT_PUBLIC_SITE_URL` as a duplicate.

Production origin:

`https://dn-explorer.phanhoangquoctu.io.vn`

Use the exact origin without a trailing slash.

Required public configuration:

``` dotenv
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_APP_URL=https://dn-explorer.phanhoangquoctu.io.vn
NEXT_PUBLIC_OWNER_NAME="Phan Hoàng Quốc Tú"
NEXT_PUBLIC_OWNER_EMAIL=tuphan694@gmail.com
NEXT_PUBLIC_OWNER_FACEBOOK_URL=https://www.facebook.com/phanhoangquoctu/
NEXT_PUBLIC_OWNER_LINKEDIN_URL=https://www.linkedin.com/in/phanhoangquoctu/
```

These owner/contact variables are intentionally public because the user
requested them for the public footer. They are not secrets.

Implementation requirements:

-   Inspect the existing `.env.example` and environment loader.
-   Add the owner variables to the existing Zod environment schema in
    the same style as other public variables.
-   Map each variable through explicit `process.env.NEXT_PUBLIC_*`
    access, following Next.js static inlining requirements.
-   Validate email and URLs using the existing Zod version.
-   Handle optional/empty values safely if preview/test environments do
    not provide them.
-   Do not break the build when local or CI environments are missing
    optional public profile variables.
-   Update `.env.example` with the exact names and comments.
-   Preserve existing unrelated environment values.
-   Never overwrite existing `.env.local` or secrets.
-   Do not add credentials, API keys, verification tokens, or private
    values to `NEXT_PUBLIC_*`.
-   Configure Vercel Production variables only with explicit user
    approval or through the user's own dashboard.
-   Set Vercel Preview/Staging to noindex using the existing environment
    mechanism.
-   Remember that `NEXT_PUBLIC_*` values are inlined at build time;
    changing them requires a new build/deployment.

For local development, use `NEXT_PUBLIC_APP_ENV=development` and a
localhost app URL. For production, use the production origin and
`NEXT_PUBLIC_APP_ENV=production`.

Do not add an API backend URL merely because the original boilerplate
has a placeholder API variable. This travel product has no separate
backend in its approved architecture.

## 12.4 Site identity and localized metadata

Update the actual site configuration and translation messages to reflect
the real product rather than boilerplate defaults.

Use a consistent product identity such as:

-   Brand/site name: `Da Nang Travel Discovery`.
-   Vietnamese descriptive identity: `Khám phá du lịch Đà Nẵng`.
-   English descriptive identity:
    `Discover places, areas, and travel experiences in Da Nang`.

These are starting copy proposals. Refine wording based on the actual
product and avoid unsupported claims.

For each implemented public route and locale, provide:

-   Unique title.
-   Unique meta description.
-   Canonical URL.
-   `hreflang` alternates.
-   Open Graph title, description, URL, locale, and image.
-   Twitter card metadata.
-   Appropriate robots directives.

Requirements:

-   Titles must be concise and accurately describe the page.
-   Descriptions should explain the page's real value and encourage a
    relevant click.
-   Avoid repeating one generic description across every route.
-   Avoid keyword stuffing.
-   Do not put source sheet names, parser terms, internal IDs, or
    diagnostics into metadata.
-   Do not claim the site is an official city tourism portal.
-   Do not claim a place is verified, currently open, best, or most
    popular without reliable support.
-   Ensure the title template does not duplicate the site name.
-   Avoid empty titles and descriptions.

## 12.5 Search intent and keyword mapping

Map page types to real search intent. Use natural wording in Vietnamese
and English.

Suggested Vietnamese topic clusters:

-   Du lịch Đà Nẵng.
-   Khám phá Đà Nẵng.
-   Địa điểm du lịch Đà Nẵng.
-   Địa điểm tham quan Đà Nẵng.
-   Địa điểm vui chơi Đà Nẵng.
-   Ăn gì ở Đà Nẵng.
-   Quán cà phê Đà Nẵng.
-   Địa điểm check-in Đà Nẵng.
-   Khu vực du lịch Đà Nẵng.
-   Kinh nghiệm khám phá Đà Nẵng.

Suggested English topic clusters:

-   Da Nang travel guide.
-   Places to visit in Da Nang.
-   Things to do in Da Nang.
-   Da Nang attractions.
-   Da Nang food and cafes.
-   Da Nang travel areas.
-   Explore Da Nang.

Use these as topic guidance, not a keyword list to stuff into every
page.

Page intent mapping:

  -----------------------------------------------------------------------
  Page type               Primary intent          Metadata direction
  ----------------------- ----------------------- -----------------------
  Home                    Broad discovery of Da   Da Nang travel
                          Nang                    discovery guide

  Explore                 Find and browse places  Explore places,
                                                  attractions, food,
                                                  cafes, and experiences

  Area index              Understand destination  Explore Da Nang areas
                          areas

  Area detail             Discover places in one  Exact area name +
                          canonical area          useful travel discovery
                                                  context

  Place detail            Learn about one exact   Exact place name +
                          place                   supported category/area

  Trip Ideas              Read curated            Da Nang travel ideas
                          source-authentic ideas  and itineraries

  Insights                Understand the public   Da Nang travel
                          dataset                 discovery data overview
  -----------------------------------------------------------------------

Do not create new SEO landing pages for every query/filter combination.
Only create dedicated landing pages if they have unique, useful,
approved content and a real route.

## 12.6 Canonical and language alternates

-   Use one canonical origin.
-   Canonical URLs must be absolute and locale-aware.
-   Use `vi-VN` and `en` language alternates according to existing
    locale conventions.
-   Include `x-default` only according to the shared helper's intended
    behavior.
-   Preserve the confirmed default locale `vi`.
-   Verify whether the working branch has corrected the original
    boilerplate's `DEFAULT_LOCALE='en'` discrepancy. Do not assume.
-   Ensure the default locale path and non-default locale prefix are
    correct.
-   Do not generate canonical URLs with query parameters unless a route
    is explicitly approved as a unique canonical page.
-   Do not create duplicate canonicals between language versions.
-   Ensure the locale switcher preserves the equivalent route where
    possible.
-   Verify actual generated tags, not only TypeScript return objects.

## 12.7 Filter, search, and pagination URLs

Explore filter/search variants should not create thousands of low-value
indexable URLs.

-   Keep filter and search behavior unchanged.
-   Keep URL state shareable as approved.
-   Canonicalize ordinary filtered/search variants to the appropriate
    base Explore URL.
-   Consider `noindex,follow` for query-state variants when appropriate
    to prevent duplicate/thin indexing.
-   Do not block query URLs in robots.txt if doing so prevents crawlers
    from seeing `noindex`.
-   Decide pagination canonical behavior based on the actual route and
    content. Do not blindly canonicalize distinct paginated content if
    that would hide useful records.
-   Do not add arbitrary query parameters to canonical URLs.
-   Document the route/query policy and test it.

## 12.8 Indexable route inventory

Inspect the actual route tree and create an explicit route-indexability
matrix.

Potential public routes, only if implemented:

-   Home.
-   Explore base route.
-   Areas index.
-   Eight canonical area detail routes.
-   Place Detail routes for actual valid normalized listing IDs.
-   Trip Ideas.
-   Public Travel Insights.

Rules:

-   Add only real, useful, public routes to `INDEXABLE_ROUTES`.
-   Do not include `/api`, `/proxy`, health, internal, private, preview,
    or not-found routes.
-   Do not list nonexistent pages.
-   Do not list unknown IDs.
-   Do not list invalid area IDs.
-   Do not list query/filter variants as independent landing pages.
-   Avoid indexing thin or duplicate content.
-   Keep public Insights indexable according to the approved Phase 07
    decision.
-   Do not mark all detail routes noindex simply because they are
    dynamic; evaluate their real content and canonical route.
-   Record reasons for every included/excluded route class.

## 12.9 Sitemap

Review the existing `src/app/sitemap.ts` and route constants.

Requirements:

-   Include only canonical, indexable, valid public URLs.
-   Include Vietnamese and English variants with correct language
    alternates.
-   Include actual dynamic area/place routes when they are approved and
    valid.
-   Do not include query/filter URLs.
-   Do not include operational/private endpoints.
-   Avoid duplicate URLs.
-   Use the exact production origin.
-   Keep sitemap generation bounded and compatible with the current
    server-side data loader.
-   Do not add a new backend or database for sitemap generation.
-   If the data source cannot be safely loaded during sitemap
    generation, report the constraint and propose a minimal reliable
    strategy.
-   Do not fabricate `lastModified` timestamps. Use a trustworthy source
    timestamp only if it exists; otherwise omit the field rather than
    setting every URL to the current time.
-   Do not invent priority/change-frequency values solely for SEO
    appearance.
-   Verify the final sitemap XML and its HTTP response.

## 12.10 Robots

Review `src/app/robots.ts`.

Requirements:

-   Production: allow public content.
-   Disallow private operational prefixes such as `/api/` and `/proxy/`
    where appropriate.
-   Non-production/preview: disallow indexing according to existing
    `getRobots` and environment behavior.
-   Point to the correct absolute sitemap URL.
-   Do not block CSS, JavaScript, images, or assets required to render
    public pages.
-   Do not use robots.txt as a replacement for page-level `noindex`.
-   Do not expose private operational routes in sitemap.
-   Verify the production and preview behavior.

## 12.11 Structured data / JSON-LD

Reuse the existing `JsonLd` component and shared builders. Use
Schema.org types only when they accurately describe the actual page and
data.

Potential types:

-   `WebSite` for the overall site.
-   `WebPage` for public pages.
-   `BreadcrumbList` for real breadcrumbs.
-   `Place` or a more specific supported subtype for Place Detail.
-   `TouristAttraction` only for records genuinely classified as
    attractions.
-   `Restaurant`, `CafeOrCoffeeShop`, `Hotel`, or another specific type
    only when the normalized category and source facts support that
    type.
-   `Person` for the named website owner only if the implementation
    represents the relationship accurately.
-   `Organization` only if the project has a real organization identity
    and supported details. Do not invent a company.

Owner profile details supplied by the user:

-   Name: `Phan Hoàng Quốc Tú`.
-   Email: `tuphan694@gmail.com`.
-   Facebook: `https://www.facebook.com/phanhoangquoctu/`.
-   LinkedIn: `https://www.linkedin.com/in/phanhoangquoctu/`.

Structured-data rules:

-   Do not invent coordinates, telephone, price range, opening-hours
    specifications, address details, aggregate ratings, review counts,
    or offers.
-   Do not use `aggregateRating` without genuine review data and count.
-   Do not parse mixed descriptive `priceText` into numeric price
    fields.
-   Do not mark a place as open now without a reliable real-time source.
-   Do not use `LocalBusiness` for every record by default.
-   Only include `sameAs` links that were supplied and verified as exact
    URLs.
-   Escape JSON-LD safely and do not inject untrusted workbook text as
    executable HTML.
-   Avoid duplicate conflicting JSON-LD graphs.
-   Validate representative outputs and ensure they match visible page
    content.

## 12.12 Open Graph and social previews

-   Reuse the existing generated Open Graph and Twitter image routes.
-   Redesign the generated image to match the new travel brand.
-   Use correct 1200 × 630 dimensions unless repository requirements
    differ.
-   Include brand name and clear page title.
-   Use localized metadata.
-   Use actual listing/place names when generating detail previews.
-   Do not use fake listing photographs.
-   Ensure `openGraph` and `twitter` metadata are complete through the
    shared helper.
-   Verify image routes return a valid image and do not redirect
    unexpectedly.
-   Avoid text clipping and low-contrast combinations.

## 12.13 Internal linking and crawl paths

Create a useful internal-link structure:

-   Home → Explore, Areas, Trip Ideas, Insights.
-   Explore → exact Place Detail.
-   Area index → canonical Area Detail.
-   Area Detail → relevant exact Place Detail and Explore filtered by
    canonical area.
-   Place Detail → its canonical Area page where available.
-   Trip Ideas → exact Place Detail only when source relationship is
    unambiguous.
-   Breadcrumbs → real parent routes.

Requirements:

-   Use locale-aware navigation helpers.
-   Avoid orphan pages.
-   Avoid links to unimplemented routes.
-   Avoid arbitrary related-place recommendations.
-   Use descriptive link text rather than repeated "Read more".
-   Keep pagination crawlable when the product needs it.
-   Avoid JavaScript-only links that crawlers cannot discover.
-   Do not create internal link loops or duplicate route aliases.

## 12.14 Semantic HTML and content structure

-   One clear `h1` per page.
-   Logical `h2`/`h3` hierarchy.
-   Semantic `header`, `nav`, `main`, `section`, `article`, `footer`,
    and table elements.
-   Use links for navigation and buttons for actions.
-   Use descriptive anchor text.
-   Use real breadcrumbs where the page hierarchy supports them.
-   Ensure important content is present in server-rendered HTML.
-   Do not hide the core page content behind client-only rendering or
    interaction.
-   Preserve source-authentic text.
-   Add meaningful alt text only when an image conveys real information.
-   Do not use keyword stuffing in headings or alt text.

## 12.15 Content quality and E-E-A-T

-   Use accurate, useful, source-grounded content.
-   Make the product's purpose and data limitations clear.
-   Do not claim government/official affiliation.
-   Do not claim every place is verified.
-   Do not fabricate author credentials, travel expertise, years of
    experience, reviews, or editorial credentials.
-   Display the supplied owner information transparently in the footer.
-   If content is sourced from a workbook, do not imply independent
    verification.
-   Where helpful, explain that listing details are source-provided and
    may need confirmation before visiting, without rewriting the
    workbook itself.
-   Do not generate a fake blog/news section solely to target keywords.
-   Identify future content opportunities separately for user approval.

## 12.16 Google Search Console and webmaster tools

Prepare the website for Search Console and other webmaster tools:

-   Ensure the production domain and sitemap are correct.
-   Ensure robots, canonical, hreflang, and indexability are valid.
-   Provide a short final checklist for adding the domain property and
    submitting `/sitemap.xml`.
-   Do not invent a Google verification token.
-   Add a verification environment variable/meta tag only if the user
    supplies the actual token or explicitly approves the integration
    approach.
-   Do not add Analytics, Tag Manager, advertising pixels, or behavioral
    tracking without explicit approval.
-   Do not claim Search Console verification or indexing has completed
    unless it was actually verified.

------------------------------------------------------------------------


# 13. Next.js App Router API, Proxy Rewrite, BFF, and Data Access Architecture

This project remains one Next.js application deployed on Vercel. Next.js Route Handlers and server-side services are part of the frontend application; they do not constitute a separate backend product. Do not introduce a separate server, database, or new infrastructure.

The objective is to reuse the existing request architecture correctly, not to force every request through a proxy.

## 13.1 Inspect the actual boilerplate baseline

The inspected public boilerplate baseline currently contains the following patterns. Its `package.json` declares Next.js `^16.4.2`; verify the lockfile and installed version in the working branch before implementation because the working branch may have evolved:

- `next.config.ts` defines a rewrite with source `/proxy/:path*` and destination `${API_URL}/:path*`.
- The rewrite destination is currently derived from `NEXT_PUBLIC_API_URL`, with a JSONPlaceholder fallback in the boilerplate.
- `src/constants/env.ts` maps the literal `process.env.NEXT_PUBLIC_API_URL` value into the typed `env.API_URL` field.
- `src/app/api/health/route.ts` contains a lightweight `GET /api/health` liveness endpoint and returns `Cache-Control: no-store`.
- `src/app/robots.ts` currently disallows `/api/` and `/proxy/` for production crawlers.
- `src/app/[locale]/layout.tsx` currently uses `generateMetadata()` and configures `metadataBase` from `siteConfig.appUrl`.
- The existing product data pipeline reads the public Google Drive workbook through its approved server-side flow.

Do not assume the existence of a generic BFF endpoint. Inspect every Route Handler and every `/proxy/*` call site. Document what actually exists, what is used, and what is unused.

The JSONPlaceholder fallback is boilerplate placeholder behavior. Do not allow production product features to accidentally depend on it. If the product does not need a browser-side public API, do not add one merely to demonstrate proxy usage.

## 13.2 Understand the difference between request mechanisms

Choose the appropriate mechanism for each request:

| Mechanism | Intended role | Important constraint |
|---|---|---|
| Server Component / server-only data service | Read public workbook data and render pages on the server | Preferred for the existing Google Drive data pipeline; avoids an unnecessary browser-to-API round trip |
| Next.js Route Handler under `/api/*` | Same-application BFF endpoint for a real browser-triggered action or controlled upstream request | Public HTTP endpoint; validate and protect it. Server-side code can use server-only environment values |
| Existing `/proxy/:path*` rewrite | Transparent forwarding to a configured public upstream API | Not a secret vault, authentication layer, allowlist, or complete security boundary |
| Server Action | A server-side mutation/action when it fits existing project conventions | Must still validate inputs and protect state-changing behavior |
| Direct browser request to a public third-party API | Only for an explicitly approved public API with no private credentials | Avoid if an existing server-side data flow already provides the required data |

### `/proxy/*` rewrite rules

- Reuse the existing rewrite only when a browser-side request to a genuinely public, read-only upstream API is required and the existing rewrite is appropriate.
- Treat `NEXT_PUBLIC_API_URL` as public configuration. Never place API keys, private tokens, service-account credentials, or secrets in it.
- A rewrite is not a security boundary and must not be described as a secure BFF. It does not automatically provide request allowlisting, authentication, input validation, rate limiting, response filtering, or secret isolation.
- Do not use the rewrite for private upstream APIs, authenticated Google Drive access, credential-bearing requests, manual workbook mutation, or privileged operations.
- Do not allow user input to control the upstream host or arbitrary destination URL.
- Do not create an open proxy such as `/api/proxy?url=<arbitrary-url>`.
- Do not add browser-side requests to the Google Drive workbook if the existing server-side data pipeline already handles it.

### `/api/*` Route Handler / BFF rules

- Use a Route Handler only when a real browser-triggered operation requires a server endpoint or when server-side request mediation is materially useful.
- Route Handlers are public endpoints even though their implementation runs on the server. They are not automatically protected by being under `/api`.
- Keep privileged upstream URLs and credentials in server-only environment variables/modules. Never import a secret-bearing module into a Client Component.
- Do not create a generic catch-all proxy. Define explicit route paths and supported HTTP methods.
- Do not create duplicate endpoints for data that Server Components or the existing data service already fetches.
- Keep API response contracts typed and validate untrusted input with the existing Zod conventions.
- Return predictable status codes and safe, normalized error bodies.
- Never return raw upstream stack traces, secrets, environment values, or private provider responses to the browser.

## 13.3 Server-side Google Drive workbook data flow

The public workbook remains the source of truth. Preserve the existing approved data loader, parsing, normalization, mapping, and cache strategy.

- Prefer the existing server-only workbook service from Server Components or the existing refresh endpoint/action.
- Do not expose Google Drive fetch/parsing internals to Client Components.
- Do not create a second workbook parser or duplicate source-of-truth cache.
- Do not move the workbook URL, API credentials, or future private credentials into a client bundle.
- Public accessibility of the workbook does not mean the client should bypass the existing data pipeline.
- Do not route normal page rendering through `/proxy/*` if the server-side data service already provides the data.
- Do not add a separate backend, database, CMS, or external storage service.
- Keep UI-only localization and workbook text unchanged.

## 13.4 Route Handler validation and security

For every Route Handler that accepts browser input or calls an upstream service:

1. Define an explicit route and allow only the required HTTP methods.
2. Validate path parameters, query parameters, headers, and request bodies using existing Zod patterns.
3. Use a fixed, trusted upstream origin from server-only configuration where a private upstream is genuinely required.
4. Never accept a complete arbitrary upstream URL from the client.
5. Allowlist any variable upstream path segments; encode identifiers safely.
6. Apply request-body size limits where a body is accepted.
7. Set a bounded timeout and handle aborts. Use APIs supported by the installed Node/Next.js runtime.
8. Check upstream status and content type before parsing.
9. Validate important upstream response shapes where practical.
10. Normalize error responses; do not leak provider details or secrets.
11. Avoid broad permissive CORS configuration. Same-origin browser calls should remain same-origin.
12. For state-changing endpoints, follow the existing CSRF/origin protection convention. If none exists, propose the smallest safe protection before implementation.
13. Do not rely on `robots.txt` disallow rules as access control.
14. Do not add authentication to public read-only features unless an approved requirement calls for it.
15. Do not add a new security library or dependency without approval.

## 13.5 Caching, revalidation, and response behavior

- Inspect the installed Next.js version and existing cache APIs before changing caching behavior.
- Keep the existing workbook cache/revalidation model as the source of truth.
- Use a deliberate cache policy for read-only GET requests.
- Do not cache state-changing POST/PUT/PATCH/DELETE operations.
- Use `Cache-Control: no-store` for liveness/health and manual refresh operation responses where appropriate.
- After a successful manual refresh, invalidate or revalidate only the existing relevant data cache/path/tag using the API supported by the installed Next.js version.
- Do not introduce a second cache layer or duplicate stale state.
- Do not set every request to `no-store` without evidence; this may unnecessarily increase Google Drive reads and page latency.
- Do not serve a stale successful response as if a manual refresh had just completed.
- Test cache hit, cache miss, revalidation, upstream failure, and refresh completion behavior.

## 13.6 Manual Update and anti-spam behavior

Preserve the approved manual update feature and its silent user-facing behavior.

- Keep the button disabled while a refresh request is pending.
- Prevent duplicate submissions from rapid repeated clicks.
- Provide a short client-side cooldown/debounce consistent with the current UX.
- Enforce server-side validation and a modest server-side cooldown/deduplication mechanism where the current architecture supports it.
- Return a clear, safe response for an update already in progress or temporarily throttled.
- Do not expose workbook mutation or upstream credentials to the browser.
- Do not change the rule that all users are allowed to request an update.
- Do not announce row-level or data-change details to users; preserve silent refresh behavior.

Important Vercel/serverless limitation:

- An in-memory lock or cooldown only protects the current runtime instance; it is not a guaranteed global lock across concurrent Vercel instances or cold starts.
- Do not claim global anti-spam protection unless the implementation truly provides it.
- Because this project has no database and the user prefers a simple architecture, do not add Redis, Vercel KV, a database, or another distributed-lock service automatically.
- If a robust cross-instance global rate limit is genuinely required, explain the limitation and ask for approval before adding external infrastructure.
- Keep the solution proportionate to the existing once-daily automated workbook update and manual refresh workflow.

## 13.7 Environment and secret-handling rules

- `NEXT_PUBLIC_APP_URL` remains the canonical website origin.
- `NEXT_PUBLIC_API_URL` is public configuration used by the existing rewrite in the inspected boilerplate. It must not contain credentials or secrets.
- The typed `env.API_URL` field in the baseline is populated from `NEXT_PUBLIC_API_URL`; do not mistake the internal property name `API_URL` for proof that its value is private.
- If a real private upstream origin or credential is needed by a Route Handler, use a server-only environment variable with a clear name and schema entry only after inspecting the actual integration and obtaining approval for any new configuration.
- Never prefix a secret with `NEXT_PUBLIC_`.
- Do not put Google service-account JSON, OAuth refresh tokens, API keys, private spreadsheet credentials, or signing secrets in `.env.example`, client code, browser storage, logs, or final reports.
- The workbook currently being used is public (`Anyone` sharing); do not invent a credential requirement for it.
- Preserve existing environment variables and do not overwrite `.env.local`.

## 13.8 API and data-flow verification

Verify only the endpoints and request flows that actually exist or are approved for implementation:

- Browser requests use the intended same-origin route/rewrite where applicable.
- Normal workbook page rendering uses the existing server-side data pipeline.
- No client bundle contains private credentials.
- No arbitrary URL forwarding or open-proxy behavior exists.
- Unsupported HTTP methods are rejected.
- Invalid query/body/path input is rejected safely.
- Upstream timeout and 4xx/5xx errors produce safe responses.
- Response cache headers match the operation.
- Manual Update disables during pending requests and blocks rapid duplicate clicks.
- Server-side cooldown/deduplication behavior is tested within its real runtime limitations.
- Successful refresh triggers the intended cache revalidation.
- Health and operational routes remain out of the sitemap and index.
- `robots.txt` rules are not treated as security controls.
- No unapproved dependency or external service was introduced.

If there is no real need for a browser-side proxy request, explicitly report that the existing rewrite was audited and intentionally left unused by the travel data flow. This is preferable to adding an unnecessary request hop.

---

# 14. Header/Footer Owner Configuration and Environment Integration

The project baseline uses:

-   `.env.example`.
-   `NEXT_PUBLIC_APP_ENV`.
-   `NEXT_PUBLIC_APP_URL`.
-   `NEXT_PUBLIC_API_URL` (boilerplate backend placeholder; do not add a
    fake backend for this product).
-   Zod validation in `src/constants/env.ts`.
-   `env.APP_URL` in SEO and site configuration.

Use `NEXT_PUBLIC_APP_URL` as the canonical site origin.

Add these public variables to the existing environment schema and
`.env.example`:

  -----------------------------------------------------------------------------------------------------------
  Variable                           Value                                            Purpose
  ---------------------------------- ------------------------------------------------ -----------------------
  `NEXT_PUBLIC_APP_URL`              `https://dn-explorer.phanhoangquoctu.io.vn`      Canonical production
                                                                                      origin

  `NEXT_PUBLIC_OWNER_NAME`           `Phan Hoàng Quốc Tú`                             Footer owner identity

  `NEXT_PUBLIC_OWNER_EMAIL`          `tuphan694@gmail.com`                            Public mailto link

  `NEXT_PUBLIC_OWNER_FACEBOOK_URL`   `https://www.facebook.com/phanhoangquoctu/`      Public Facebook profile

  `NEXT_PUBLIC_OWNER_LINKEDIN_URL`   `https://www.linkedin.com/in/phanhoangquoctu/`   Public LinkedIn profile
  -----------------------------------------------------------------------------------------------------------

`NEXT_PUBLIC_APP_ENV` must be set appropriately per environment:

-   Local development: `development`.
-   Vercel Preview: non-production/staging value supported by the
    current enum.
-   Vercel Production: `production`.

Implementation requirements:

1.  Inspect current env schema and `.env.example`.
2.  Extend the existing schema, do not create a second env module.
3.  Validate URL and email formats.
4.  Use explicit process.env references.
5.  Make optional public profile variables fail gracefully in
    environments where they are intentionally absent.
6.  Keep the provided owner values available in the production
    configuration.
7.  Update `src/config/site.ts` or the existing site config to use the
    actual product identity.
8.  Use the exact production origin without trailing slash.
9.  Preserve unrelated environment variables.
10. Do not print secrets.
11. Do not add any secret to `NEXT_PUBLIC_*`.
12. Do not commit a real `.env` file.
13. Update `.env.example` and provide the required Vercel variable
    checklist.
14. Do not modify Vercel settings or deploy without explicit approval.

The user has explicitly requested the owner email and social URLs to be
public footer links. Explain in the final report that these are public
and may be visible to visitors and crawlers.

------------------------------------------------------------------------

# 15. Performance and Core Web Vitals

Performance is part of SEO and UX.

Preserve the existing stack and optimize only where evidence supports
it.

Review:

-   LCP.
-   INP.
-   CLS.
-   Image sizing and loading.
-   Font loading.
-   Client JavaScript.
-   Hydration.
-   Route transitions.
-   Filter interactions.
-   Chart rendering.
-   Large component trees.
-   Third-party scripts.
-   Layout stability.
-   Server/client boundaries.

Targets:

-   Aim for Google's "good" Core Web Vitals thresholds where practical:
    -   LCP ≤ 2.5 seconds.
    -   INP ≤ 200 milliseconds.
    -   CLS ≤ 0.1.
-   Use Lighthouse/PageSpeed results as diagnostics, not as a guarantee
    of field performance.
-   Do not claim field Core Web Vitals passed from a single local
    Lighthouse run.
-   Do not add analytics or monitoring scripts without approval.
-   Avoid unnecessary `'use client'`.
-   Use responsive images with explicit dimensions.
-   Lazy-load below-the-fold media where appropriate.
-   Do not lazy-load the true LCP hero image if it is the primary
    above-the-fold visual.
-   Avoid heavy animation and layout shifts.
-   Reuse existing packages.
-   Do not add a new performance dependency without approval.

------------------------------------------------------------------------

# 16. Implementation Workflow

Maintain a checklist and update it as work progresses.

## Stage 1 --- Read-only discovery

-   [ ] Inspect branch, HEAD, working tree, and user changes.
-   [ ] Read all applicable repository instructions.
-   [ ] Read Phase 01--08 specifications and actual implementation
    reports.
-   [ ] Discover and read relevant skills.
-   [ ] Discover available browser, screenshot, MCP, and accessibility
    tools.
-   [ ] Inventory all implemented routes.
-   [ ] Audit current design system and shared components.
-   [ ] Audit live website at desktop/tablet/mobile.
-   [ ] Audit current header and footer.
-   [ ] Audit SEO helper, route list, metadata, robots, sitemap,
    JSON-LD, OG/Twitter images.
-   [ ] Audit environment schema and Vercel env assumptions.
-   [ ] Audit `next.config.ts` rewrites, every `/api/*` Route Handler, every `/proxy/*` call site, server-only workbook loaders, cache/revalidation, and the Manual Update request path.
-   [ ] Capture baseline screenshots where possible.
-   [ ] Record defects with evidence and severity.

## Stage 2 --- Redesign and SEO plan

Produce a plan with:

1.  Redesign concept and rationale.
2.  Visual audit findings.
3.  Proposed color palette and semantic tokens.
4.  Typography and spacing.
5.  Header and footer composition.
6.  Component inventory and reuse decisions.
7.  Page-by-page layout and UX changes.
8.  Explore filter desktop/tablet/mobile behavior.
9.  Route-level SEO strategy.
10. Metadata title/description plan in both locales.
11. Canonical/hreflang/indexability matrix.
12. Sitemap/robots strategy.
13. Structured-data plan.
14. Open Graph/Twitter image plan.
15. Environment schema and `.env.example` changes.
16. Internal linking strategy.
17. Performance and accessibility strategy.
18. Exact files to create/modify.
19. Test and browser verification matrix.
20. Risks and unresolved decisions.
21. Native Next.js Metadata API implementation plan, including `metadataBase`, static metadata, and dynamic `generateMetadata()` routes.
22. Proxy/BFF decision matrix: which requests remain server-side, which (if any) use `/proxy/*`, and which require explicit `/api/*` Route Handlers.
23. API validation, timeout, caching/revalidation, safe error handling, and Manual Update anti-spam verification plan.

**Stop and wait for explicit approval.**

## Stage 3 --- Design system foundation

After approval:

-   [ ] Update/create one approved design-system document.
-   [ ] Implement semantic color tokens.
-   [ ] Implement typography and spacing scale.
-   [ ] Implement responsive container/layout rules.
-   [ ] Implement consistent radii, borders, shadows, and elevation.
-   [ ] Verify contrast.
-   [ ] Document component usage and variants.
-   [ ] Verify Vietnamese and English content fit.

## Stage 4 --- Header and footer

-   [ ] Redesign desktop header.
-   [ ] Redesign mobile navigation.
-   [ ] Add accessible active-route state.
-   [ ] Preserve locale switching.
-   [ ] Build the responsive footer.
-   [ ] Display the supplied owner details.
-   [ ] Add email, Facebook, and LinkedIn links.
-   [ ] Verify accessible names and external-link safety.
-   [ ] Verify both locales and all viewports.

## Stage 5 --- Shared components

Refine shared components in dependency order:

1.  Page container and section heading.
2.  Buttons and links.
3.  Inputs and search.
4.  Selects and multi-selects.
5.  Filter panel and chips.
6.  Status and rating.
7.  Listing card/list row/table.
8.  Pagination and view switcher.
9.  KPI and chart wrappers.
10. Breadcrumbs.
11. Empty/loading/error states.
12. Dialog/drawer if needed.
13. Manual Update control if present.

## Stage 6 --- Page redesign

Redesign every implemented public page:

-   [ ] Home.
-   [ ] Explore.
-   [ ] Place Detail.
-   [ ] Areas index.
-   [ ] Area Detail.
-   [ ] Trip Ideas.
-   [ ] Public Travel Insights.
-   [ ] Not-found/loading/error states.

Do not add missing routes or unapproved product features.

## Stage 7 --- SEO implementation

-   [ ] Update site identity and localized SEO messages.
-   [ ] Extend public environment schema.
-   [ ] Update `.env.example`.
-   [ ] Use `NEXT_PUBLIC_APP_URL` for the production origin.
-   [ ] Ensure every public page uses the existing shared `buildMetadata` pattern and native Next.js Metadata API.
-   [ ] Verify `metadataBase` is configured once in the appropriate App Router layout.
-   [ ] Use `generateMetadata()` for dynamic Place/Area pages when metadata depends on validated route data.
-   [ ] Use `MetadataRoute.Robots` and `MetadataRoute.Sitemap` for the existing metadata routes.
-   [ ] Add unique localized titles/descriptions.
-   [ ] Verify canonical URLs.
-   [ ] Verify `vi`/`en` alternates and `x-default`.
-   [ ] Review query/filter noindex/canonical behavior.
-   [ ] Review indexable route inventory.
-   [ ] Update sitemap with real valid public routes.
-   [ ] Update robots behavior for production and preview.
-   [ ] Add/verify JSON-LD only for supported facts.
-   [ ] Redesign OG/Twitter images.
-   [ ] Add/verify breadcrumbs and internal links.
-   [ ] Verify semantic HTML and crawlable server-rendered content.
-   [ ] Provide Search Console setup instructions without inventing
    verification tokens.

## Stage 7A --- Next.js Proxy/BFF and data-access integration

-   [ ] Reuse the existing `/proxy/:path*` rewrite only for suitable public upstream requests.
-   [ ] Use an explicit `/api/*` Route Handler only for a real browser-triggered server-side operation or controlled BFF request.
-   [ ] Keep Google Drive workbook loading in the existing server-side data pipeline.
-   [ ] Validate API inputs, allowed methods, upstream destinations, timeouts, and safe errors.
-   [ ] Verify cache policy and targeted revalidation after successful Manual Update.
-   [ ] Verify duplicate-click prevention and document Vercel serverless rate-limit limitations.
-   [ ] Confirm no open proxy, SSRF path, secret exposure, or unnecessary proxy hop was introduced.
-   [ ] If `/proxy/*` is not needed by the product, document that it was audited and intentionally left unused.

## Stage 8 --- Responsive and accessibility

-   [ ] Verify desktop.
-   [ ] Verify tablet.
-   [ ] Verify mobile.
-   [ ] Check 320px width.
-   [ ] Check 200% zoom.
-   [ ] Check horizontal overflow.
-   [ ] Check keyboard navigation.
-   [ ] Check focus and dialogs.
-   [ ] Check screen-reader labels and announcements.
-   [ ] Check color contrast.
-   [ ] Check reduced motion.
-   [ ] Check long Vietnamese/English text.

## Stage 9 --- Functional regression

-   [ ] Search behavior.
-   [ ] Vietnamese accent-insensitive search.
-   [ ] Filter AND/OR semantics.
-   [ ] Status All default.
-   [ ] Grid default.
-   [ ] 24 listings/page.
-   [ ] Clear All.
-   [ ] Active filter chips.
-   [ ] URL filter state and history.
-   [ ] Grid/List/Table parity.
-   [ ] Exact listing IDs.
-   [ ] Duplicate same-name records remain separate.
-   [ ] Canonical areas.
-   [ ] Raw source text remains unchanged.
-   [ ] Maps URLs.
-   [ ] Insights data definitions.
-   [ ] Manual Update behavior remains unchanged.

## Stage 10 --- Visual QA

Use a bounded process:

1.  Capture one complete screenshot set across implemented routes at
    desktop and mobile; include tablet for responsive-critical pages.
2.  Inspect the set in one batch for hierarchy, layout, color,
    typography, spacing, clipping, overflow, and consistency.
3.  Fix all material defects from that pass.
4.  Capture one final confirmation set for changed surfaces.
5.  Stop. Do not run endless subjective micro-polish cycles.

If browser tooling is unavailable, state the gap and use existing
Storybook/tests/static checks.

## Stage 11 --- SEO QA

-   [ ] Inspect generated HTML for every route type and locale.
-   [ ] Verify native Next.js `metadataBase`, `Metadata`, and `generateMetadata()` behavior.
-   [ ] Verify `MetadataRoute.Robots` and `MetadataRoute.Sitemap` output and HTTP responses.
-   [ ] Check title and meta description.
-   [ ] Check canonical.
-   [ ] Check `hreflang`.
-   [ ] Check Open Graph and Twitter metadata.
-   [ ] Check JSON-LD validity and visible-content consistency.
-   [ ] Check robots.txt.
-   [ ] Check sitemap.xml.
-   [ ] Check query/filter canonical/noindex behavior.
-   [ ] Check dynamic route inclusion/exclusion.
-   [ ] Check production vs preview noindex.
-   [ ] Check internal links and breadcrumbs.
-   [ ] Check broken links and redirects.
-   [ ] Check image metadata and alt text.
-   [ ] Run available Lighthouse/SEO/accessibility audits.
-   [ ] Do not claim Google indexing or Search Console verification
    without external evidence.

## Stage 12 --- Final code quality gates

Use the actual checked-out scripts. Known boilerplate commands include:

``` bash
pnpm lint
pnpm format:check
pnpm type-check
pnpm test
pnpm build
```

When shared UI/stories change:

``` bash
pnpm build-storybook
```

Additional checks:

-   Browser console.
-   Hydration warnings.
-   Network errors.
-   Broken images.
-   Missing translations.
-   Route failures.
-   SEO metadata output.
-   JSON-LD output.
-   robots/sitemap response.
-   No server-only code in client bundles.
-   No accidental dependency or lockfile changes.
-   No untracked secrets.

Read full command output and record exit codes. Do not suppress warnings
or weaken configuration to make checks pass.

## Stage 13 --- Final report

Provide the complete report in Section 19. Do not deploy, commit, push,
or change Vercel settings without explicit approval.

------------------------------------------------------------------------

# 17. Verification Matrix

Mark each criterion `PASS`, `PARTIAL`, `BLOCKED`, or `NOT RUN`, with
evidence.

## 17.1 Redesign and design system

  -----------------------------------------------------------------------
  ID                                  Acceptance criterion
  ----------------------------------- -----------------------------------
  DS-01                               Actual working branch and
                                      repository rules were audited
                                      before edits.

  DS-02                               All implemented public routes were
                                      inventoried.

  DS-03                               Live UI was inspected or access
                                      limitation was explicitly recorded.

  DS-04                               Redesign is a meaningful visual
                                      redesign, not only superficial
                                      polish.

  DS-05                               One documented design system is the
                                      source of truth.

  DS-06                               Travel-appropriate semantic palette
                                      is implemented and contrast-tested.

  DS-07                               Typography and spacing hierarchy
                                      are consistent.

  DS-08                               Shared components have consistent
                                      variants and states.

  DS-09                               No unapproved dependency/font/UI
                                      kit was added.

  DS-10                               No unrelated architecture refactor
                                      occurred.
  -----------------------------------------------------------------------

## 17.2 Header/footer

  -----------------------------------------------------------------------
  ID                                  Acceptance criterion
  ----------------------------------- -----------------------------------
  HF-01                               Desktop header is clear and
                                      professional.

  HF-02                               Mobile navigation is accessible and
                                      responsive.

  HF-03                               Active route and locale switch are
                                      correct.

  HF-04                               Footer has coherent brand,
                                      navigation, and contact hierarchy.

  HF-05                               Exact owner name is displayed.

  HF-06                               Email uses a valid mailto link.

  HF-07                               Facebook URL is exact and
                                      accessible.

  HF-08                               LinkedIn URL is exact and
                                      accessible.

  HF-09                               No false
                                      company/official/phone/address
                                      information was invented.

  HF-10                               Header/footer work in both locales
                                      and all viewport classes.
  -----------------------------------------------------------------------

## 17.3 Product UX and integrity

  -----------------------------------------------------------------------
  ID                                  Acceptance criterion
  ----------------------------------- -----------------------------------
  UX-01                               All implemented pages use the
                                      unified visual system.

  UX-02                               Home gives a clear entry into
                                      discovery.

  UX-03                               Explore search remains correct.

  UX-04                               Filter AND/OR semantics are
                                      unchanged.

  UX-05                               Grid remains the default view.

  UX-06                               Status All remains the default.

  UX-07                               Page size remains 24.

  UX-08                               Clear All and active chips work.

  UX-09                               Grid/List/Table preserve filtered
                                      data and state.

  UX-10                               URL state and browser history work.

  UX-11                               Place Detail exact identity remains
                                      correct.

  UX-12                               Eight canonical areas remain exact.

  UX-13                               Source text remains verbatim.

  UX-14                               No fake listing images, ratings,
                                      reviews, availability, or
                                      recommendations were added.

  UX-15                               Maps actions use validated source
                                      URLs.

  UX-16                               Insights metrics remain approved
                                      and accurate.

  UX-17                               Loading/error/empty/not-found
                                      states are distinct.
  -----------------------------------------------------------------------

## 17.4 Responsive and accessibility

  ID        Acceptance criterion
  --------- --------------------------------------------------
  RSP-01    Desktop verified.
  RSP-02    Tablet verified.
  RSP-03    Mobile verified.
  RSP-04    No unintended horizontal overflow.
  RSP-05    Long text does not clip.
  RSP-06    Mobile filters and navigation are usable.
  RSP-07    Tables have a deliberate mobile strategy.
  RSP-08    200% zoom and narrow reflow work.
  A11Y-01   Semantic headings and landmarks.
  A11Y-02   Keyboard support for all interactions.
  A11Y-03   Visible focus states.
  A11Y-04   Contrast reviewed.
  A11Y-05   Status is not color-only.
  A11Y-06   Drawer/dialog focus and Escape behavior.
  A11Y-07   Screen-reader labels and meaningful feedback.
  A11Y-08   Reduced motion respected.
  A11Y-09   No hover-only functionality.
  A11Y-10   Automated and manual findings reported honestly.

## 17.5 SEO

  -----------------------------------------------------------------------
  ID                                  Acceptance criterion
  ----------------------------------- -----------------------------------
  SEO-01                              Existing shared SEO helper is
                                      reused.

  SEO-02                              Correct production origin is
                                      configured.

  SEO-03                              Site name and description reflect
                                      the actual product.

  SEO-04                              Every public route has unique
                                      localized metadata.

  SEO-05                              Canonical URLs are absolute and
                                      correct.

  SEO-06                              `vi`/`en` hreflang alternates are
                                      correct.

  SEO-07                              Query/filter variants do not become
                                      duplicate indexable pages.

  SEO-08                              Indexable route list contains only
                                      valid public routes.

  SEO-09                              Sitemap contains correct canonical
                                      public URLs.

  SEO-10                              Sitemap does not fabricate
                                      last-modified dates.

  SEO-11                              Robots allows production public
                                      content and blocks
                                      operational/private routes
                                      appropriately.

  SEO-12                              Preview/nonproduction remains
                                      noindex.

  SEO-13                              JSON-LD matches visible page
                                      content and supported facts.

  SEO-14                              No fake ratings, coordinates,
                                      offers, or business claims in
                                      schema.

  SEO-15                              Open Graph and Twitter images are
                                      valid and on-brand.

  SEO-16                              Breadcrumbs and internal links are
                                      correct.

  SEO-17                              Semantic HTML and server-rendered
                                      content are crawlable.

  SEO-18                              No keyword stuffing or fabricated
                                      editorial content.

  SEO-19                              Search Console instructions are
                                      provided without invented
                                      verification tokens.

  SEO-20                              No claim of Google indexing/ranking
                                      without evidence.
  -----------------------------------------------------------------------

## 17.6 Environment, quality, and verification

  -----------------------------------------------------------------------
  ID                                  Acceptance criterion
  ----------------------------------- -----------------------------------
  ENV-01                              `.env.example` includes the exact
                                      production URL and owner variable
                                      names.

  ENV-02                              Zod env schema supports the new
                                      variables.

  ENV-03                              Existing `.env.local` and secrets
                                      were preserved.

  ENV-04                              Public variables contain no
                                      secrets.

  ENV-05                              Production/preview environment
                                      behavior is documented.

  QA-01                               Vietnamese and English UI message
                                      parity is complete.

  QA-02                               Vietnamese remains the default
                                      locale.

  QA-03                               Source workbook content is
                                      unchanged.

  QA-04                               No hydration warnings or missing
                                      translation keys.

  QA-05                               `pnpm lint` run and result
                                      recorded.

  QA-06                               `pnpm format:check` run and result
                                      recorded.

  QA-07                               `pnpm type-check` run and result
                                      recorded.

  QA-08                               `pnpm test` run and result
                                      recorded.

  QA-09                               `pnpm build` run and result
                                      recorded.

  QA-10                               `pnpm build-storybook` run when
                                      applicable.

  QA-11                               Browser console checked.

  QA-12                               Browser screenshots reviewed.

  QA-13                               No unapproved dependency or
                                      lockfile changes.

  QA-14                               No commit/push/deployment occurred
                                      without approval.

  QA-15                               Remaining defects and blocked
                                      criteria are listed.
  -----------------------------------------------------------------------

------------------------------------------------------------------------


## 17.7 Next.js Proxy, BFF, and data access

| ID | Acceptance criterion |
|---|---|
| API-01 | `next.config.ts` rewrites and all `/proxy/*` call sites were audited. |
| API-02 | All existing `/api/*` Route Handlers were inventoried and their purpose documented. |
| API-03 | `/proxy/*` is treated only as a transparent rewrite for suitable public upstream requests, not as a secret boundary or secure BFF. |
| API-04 | No private credentials or secrets are stored in `NEXT_PUBLIC_API_URL` or any other `NEXT_PUBLIC_*` variable. |
| API-05 | Normal Google Drive workbook reads continue through the approved server-side data pipeline. |
| API-06 | No unnecessary browser-to-proxy round trip or duplicate data loader was introduced. |
| API-07 | Any new Route Handler has an explicit route, method allowlist, and Zod input validation. |
| API-08 | Upstream destination is fixed/trusted; no arbitrary URL forwarding or open proxy exists. |
| API-09 | Timeouts, upstream failures, response validation, and safe error bodies are handled. |
| API-10 | Cache headers and targeted revalidation match the request type. |
| API-11 | Manual Update blocks duplicate clicks and has server-side safeguards appropriate to the actual Vercel runtime. |
| API-12 | No claim of globally distributed rate limiting is made for an in-memory/serverless-instance lock. |
| API-13 | `/api/*` and `/proxy/*` are excluded from sitemap/indexing, and robots rules are not treated as access control. |
| API-14 | No separate backend, database, Redis/KV, or unapproved external infrastructure was introduced. |

# 18. Explicit Non-Goals

Do not introduce:

-   New backend or database.
-   New CMS.
-   Authentication or user accounts.
-   Saved trips, favorites, or personalization.
-   Booking, reservations, payments, ticket sales, or availability.
-   AI itinerary generation.
-   Interactive maps, geocoding, or route planning.
-   Fake listing images.
-   Fake reviews, ratings, coordinates, opening hours, prices, or
    business claims.
-   Numeric price filters or analytics.
-   A new analytics tracker, ad pixel, or behavioral profiling.
-   A new UI framework or design system.
-   New font, icon, chart, or animation dependencies without approval.
-   New paid services or Vercel features.
-   New secrets or invented verification tokens.
-   A new product phase.
-   Unrelated refactors.
-   A generic/open proxy endpoint or arbitrary URL forwarding.
-   A duplicate BFF/API layer when the existing server-side data pipeline already serves the requirement.
-   Treating `/proxy/*` rewrite or `robots.txt` as a security boundary.
-   Redis, Vercel KV, database-backed distributed locks, or other new infrastructure without explicit approval.
-   Production deployment without explicit approval.

------------------------------------------------------------------------

# 19. Final Report Format

At completion, provide:

1. **Status:** completed / partially completed / blocked.
2. **Repository snapshot:** branch, commit SHA, working-tree status.
3. **Skills and tools used:** exact names and actual contribution.
4. **Live-site audit:** what was inspected and any access limitations.
5. **Before/after visual summary:** major redesign improvements.
6. **Design direction:** actual palette, typography, spacing, layout, and rationale.
7. **Design system:** documentation path, tokens, shared components, variants.
8. **Header:** desktop/mobile behavior and accessibility.
9. **Footer:** owner details and verified links.
10. **Page-by-page changes:** route and file paths.
11. **Explore UX:** search, filters, chips, Grid/List/Table, pagination, URL state.
12. **SEO architecture:** native Next.js Metadata API, `metadataBase`, static metadata, dynamic `generateMetadata()`, shared helpers, route policy, canonical, hreflang, robots, and sitemap.
13. **Proxy/BFF architecture:** actual rewrite and Route Handler inventory, request flows used or intentionally unused, server-side workbook data flow, validation, timeout, caching/revalidation, anti-spam behavior, and security evidence.
14. **Route-indexability matrix:** included/excluded route classes and rationale.
15. **Metadata:** representative Vietnamese and English titles/descriptions.
16. **Canonical and hreflang:** actual rendered output and verification.
17. **Robots and sitemap:** endpoint responses and production/preview behavior.
18. **Structured data:** schemas implemented and evidence supporting each field.
19. **Social previews:** Open Graph/Twitter image verification.
20. **Environment:** exact variable names, files changed, and Vercel setup requirements.
21. **Responsive verification:** actual viewport sizes and results.
22. **Accessibility:** automated and manual findings.
23. **Performance:** Core Web Vitals/Lighthouse observations and limitations.
24. **Functional regression:** confirmed product rules preserved.
25. **Screenshots:** exact paths/links only when created and verified.
26. **Tests:** exact commands, exit codes, and summarized output.
27. **Files changed:** exact paths and purpose.
28. **Dependencies:** whether package/lockfile changed and why.
29. **Acceptance matrix:** all DS/HF/UX/RSP/A11Y/SEO/ENV/API/QA criteria.
30. **Known limitations:** unavailable tools, missing assets, blocked pages, and unverified items.
31. **Scope confirmation:** state that no unapproved business/data rules were changed.
32. **Next actions:** only remaining user decisions or approvals.

Do not claim "pixel-perfect", "fully accessible", "all SEO passed", "Google indexed", "ranked", "globally rate-limited", or "production ready" without evidence appropriate to each statement.

------------------------------------------------------------------------

# 20. Final Instruction

Redesign Da Nang Travel Discovery into a distinctive, polished,
professional travel-discovery website with a coherent coastal editorial
identity.

The redesign must make the website more attractive, more intuitive, more
trustworthy, more readable, more responsive, and easier for search
engines to understand.

The header and footer are mandatory product surfaces, not optional
finishing touches. The supplied owner details must be represented
accurately and accessibly.

SEO must be implemented throughout the architecture --- not added as a
few meta tags at the end.

Preserve the approved product rules and source data. Reuse the existing
Next.js, i18n, SEO, design-system, testing, and deployment conventions.
Avoid over-engineering.

**Start with discovery, skill/tool use, and a real visual/SEO audit.
Present the complete implementation plan and wait for explicit approval
before editing code. After approval, implement the redesign, verify it
with browser/test/SEO evidence, and deliver the final report.**

**End of specification.**
