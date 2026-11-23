# Phase 01 — Codebase Rules & Architecture Mapping
## Codex Detailed Implementation Specification

**Project:** Da Nang Travel Discovery  
**Repository:** https://github.com/PhanHoangQuocTu/nextjs-frontend-boilerplate  
**Target phase:** Phase 01 of 08  
**Document type:** Authoritative repository-audit and architecture-mapping task  
**Status:** Product decisions captured; current repository facts must be re-verified by Codex  
**Scope:** Inspect the boilerplate, map the product to its existing architecture, document rules/decisions/risks, and establish implementation guidance for later phases.

---

# 0. Instructions for Codex

This phase establishes a reliable, repository-specific source of truth for all later implementation phases. It is primarily an **audit and documentation phase**, not a feature implementation phase.

Treat this document as the authoritative scope for Phase 01. Do not start Phase 02 or implement product features.

Before changing any file:

1. Inspect the current repository, active branch, working tree, uncommitted changes, and latest commit.
2. Read the complete root `AGENTS.md` and `CLAUDE.md`, plus every nested instruction file that applies to the directories being inspected or documented.
3. Inspect the complete repository tree and identify the real locations of routes, modules, components, API clients, providers, hooks, stores, constants, types, messages, styles, tests, Storybook, scripts, CI, and deployment configuration.
4. Read the actual source files that define those conventions. Do not rely only on README summaries or this prompt.
5. Verify `package.json`, the active lockfile, `pnpm-workspace.yaml`, `.nvmrc` or equivalent runtime pin, TypeScript config, Biome config, Vitest config, Next config, next-intl config, and environment schema.
6. Inspect the existing API/BFF examples, Server Component and Client Component examples, providers, and the current Health/Posts demo modules. Treat them as examples to learn from, not as product features to extend.
7. Compare the current boilerplate behavior with the product decisions in this document. Explicitly separate:
   - existing repository behavior,
   - confirmed product decisions,
   - proposed future architecture,
   - unresolved questions.
8. Produce a repository-aware plan before editing documentation.
9. Do not install, add, upgrade, remove, or change any dependency or lockfile.
10. Do not modify application source code, app configuration, environment files, routes, dependencies, or business UI in this phase. Only create or update the documentation deliverables specified below, and only after checking for existing documents and avoiding destructive overwrites.
11. Do not commit, push, amend, rebase, or rewrite Git history. Do not discard user changes.
12. Do not claim a command, test, build, browser check, or deployment verification passed unless you actually ran it and inspected the output.
13. If the connected GitHub/MCP tools, repository files, local workspace, or required commands are unavailable, state the limitation and stop at the relevant boundary. Never fabricate a repository audit.

This phase is not permission to implement later phases.

---

# 1. Roles and Quality Bar

Work as a coordinated senior engineering team:

- **Senior Software Architect:** map the actual boilerplate architecture and define safe extension points.
- **Senior Next.js Engineer:** understand App Router, Server Components, Route Handlers, runtime boundaries, caching, and Vercel deployment implications.
- **Senior Frontend Engineer:** map page modules, UI components, client state, server state, design system, and interaction boundaries.
- **Senior Business Analyst:** preserve approved product decisions and distinguish them from assumptions.
- **Senior Security Reviewer:** inspect public/private data boundaries, environment variables, client bundle exposure, cookies, external URLs, and sync entry points.
- **Senior QA Engineer:** establish the test strategy, baseline commands, acceptance criteria, and verification plan for future phases.
- **Technical Lead:** keep the architecture minimal, reuse the boilerplate, avoid unnecessary abstractions, and document trade-offs.

The result must be practical for one Next.js frontend application. Do not design a separate backend, database, microservice architecture, queue, worker platform, or enterprise integration layer.

---

# 2. Product Context — Confirmed Decisions

The product is **Da Nang Travel Discovery**, a bilingual website that helps users discover tourism, sightseeing, food, cafes, entertainment, accommodation, and nearby destinations around Da Nang.

The product starts from the existing repository:

`https://github.com/PhanHoangQuocTu/nextjs-frontend-boilerplate`

The product and architecture decisions already confirmed by the user are listed below. Preserve them exactly. Do not ask the user to re-decide them in this phase.

## 2.1 Platform and operating model

- Frontend application: Next.js.
- Server and client processing live inside the same Next.js application.
- No separate backend service.
- No database.
- Deployment target: Vercel.
- Source workbook is public Google Drive / Google Sheets content (`Anyone` access).
- The workbook contains public travel-place information; secrets, API keys, credentials, and user-related private information must not be exposed.
- An external tracking process updates the workbook once per day.
- Workbook update mechanism: overwrite the file.
- Completion time of the external update is unknown.
- The website should load the latest available workbook data when users first enter the site.
- Users should also be able to trigger a manual update from the website.
- Manual update permission: all visitors/users.
- Latest available data has priority.
- Manual update must be protected against spam/repeated clicks.
- UI should show sync-related state appropriately; changes after synchronization should be silent rather than showing disruptive change announcements.
- Do not over-engineer the solution.

## 2.2 Language

- Supported UI languages: Vietnamese and English (`both`).
- Default locale: Vietnamese (`vi`).
- Workbook content is not translated. Localization is UI-only.
- Preserve source workbook text, including Vietnamese names, addresses, notes, tips, editorial text, and categories.
- Locale routing must be compatible with the existing next-intl setup, but current boilerplate behavior must be audited before any future change is proposed.

Important: the inspected boilerplate version previously showed `en` as `DEFAULT_LOCALE`. Treat that as existing repository behavior only. The confirmed product decision is `vi` as the product default. Phase 01 documents the required difference; it must not change routing code.

## 2.3 Product experience and design

- Overall visual direction: **Editorial**.
- Explore default presentation: **Grid View**.
- Listing status filter default: **All**.
- Map experience: **Simple**.
- Workbook data localization: **UI-only**.
- Place Detail follows the previously selected Option A. If the exact detailed meaning of that option is not present in the current project documentation, record it as a reference to the approved product specification rather than inventing the missing behavior.
- Duplicate listings from different source sheets must remain separate; do not merge solely because names match.
- Area canonical source: `LOC_THEO_KHU_VUC` (confirmed Option A). Detail-sheet column E remains preserved as source data.
- Status source: `LOC_THEO_KHU_VUC`.
- Editorial content from the workbook should remain source-authentic.
- Avoid adding product behavior that has not been approved.

## 2.4 Workbook and data decisions

The workbook contains 14 worksheets:
- 11 detail sheets.
- 3 supporting sheets: `TRANG BIA`, `LOC_THEO_KHU_VUC`, `TOP_PICKS_LICH_TRINH`.

The latest inspected snapshot contained 432 valid named listings. This count is a fixture baseline, not a production constant.

Confirmed rules:
- Detail-sheet records are the listing source.
- A listing is counted from a valid non-empty name, not `max_row` or descriptive summary totals.
- Five main categories are mapped from the 11 detail sheets.
- `LOC_THEO_KHU_VUC` is canonical for area and status.
- Detail-sheet area remains in `sourceArea`.
- Duplicate names across different source sheets remain distinct.
- Rating may be null; invalid ratings must not become zero.
- Price, opening hours, highlights, and notes are raw descriptive text, not numeric facts.
- Google Maps URL must come from the actual cell hyperlink; never synthesize it from the name/address.
- Column L contains a four-part visit profile separated by `|`.
- Workbook data is not translated.

The detailed field-level mapping, counts, and regression tests belong to Phase 02. Phase 01 must record the boundary and dependency, not reimplement the workbook mapper.

---

# 3. Repository Audit — Required Evidence

Audit the checked-out repository, not an imagined ideal architecture.

For each finding, record:
- What exists.
- Exact file/folder path.
- How it is used.
- Whether it is a convention, example, or mandatory rule.
- Relevance to Da Nang Travel Discovery.
- Gaps or risks.
- Confidence: verified, inferred, or unknown.

At minimum, audit the following.

## 3.1 Repository identity and tooling

- Repository name and URL.
- Default branch and audited commit SHA.
- Working-tree status if local workspace is available.
- Node.js version requirement and version pin.
- pnpm version and package manager declaration.
- Install scripts and pnpm build-script allowlist.
- Package scripts and their actual commands.
- CI workflows and quality gates.
- Docker and deployment files.
- Git conventions and commit hooks.

## 3.2 Actual technology inventory

Read package and lockfile data. Record exact installed versions (or declared ranges where that is what the manifest provides) for at least:

- Next.js.
- React and React DOM.
- TypeScript.
- Tailwind CSS.
- shadcn/ui-related packages and UI primitives.
- next-intl.
- TanStack Query and devtools.
- Axios.
- Zustand.
- Zod.
- React Hook Form and resolvers.
- Recharts.
- Lucide React.
- Framer Motion.
- Vitest.
- Testing Library.
- Storybook.
- Biome.
- Any XLSX/Excel parser already present.
- Any map/geospatial package already present.
- Any relevant date, URL, or data parsing library.

Do not infer installed packages from README alone. Verify `package.json` and lockfile. Do not recommend adding a dependency unless the product needs a capability not already present. No dependency changes are allowed in Phase 01.

## 3.3 Directory and architecture map

Inspect the complete tree and document actual paths for:

- `src/app`: layouts, locale routes, pages, Route Handlers, metadata, sitemap, robots, manifest, OG/Twitter images.
- `src/modules`: page-level UI modules.
- `src/components`: shared components, layouts, providers, SEO, utilities, forms, common UI.
- `src/components/ui`: generated UI primitives and story conventions.
- `src/api`: Axios clients and domain API modules.
- `src/constants`: environment, routes, constants.
- `src/enums`.
- `src/types`.
- `src/hooks`.
- `src/i18n`.
- `src/messages`.
- `src/lib`.
- `src/stores`.
- `src/utils`.
- `tests` and colocated `__tests__`.
- Storybook configuration and stories.
- `public`.
- scripts, CI, Docker, and deployment configuration.

Do not assume every folder in the boilerplate map exists exactly as described; verify it.

## 3.4 Route and rendering architecture

Inspect:
- Root layout and locale layout.
- Locale route group and route conventions.
- Page component composition.
- `generateMetadata` and SEO helpers.
- Server Component examples.
- Client Component examples.
- Server-to-client props and serialization boundaries.
- Loading, error, not-found, and global error boundaries.
- Static params and route generation.
- Locale-aware navigation helpers.

Document which responsibilities belong in:
- `src/app` route files,
- `src/modules`,
- shared `src/components`,
- server-only `src/lib` or domain service code,
- client hooks/components.

## 3.5 API and data access architecture

Inspect:
- Direct Axios client.
- Internal/BFF Axios client.
- `getApiRequestClient`.
- Route Handler examples.
- Query key conventions.
- Query hooks and mutation hooks.
- API type and error conventions.
- `/proxy/*` rewrite if present.
- Cache/revalidation patterns if present.
- Existing use of TanStack Query in Server and Client Components.

Document the actual request paths and trust boundaries. Do not assume a separate backend exists.

For the travel product, map likely future extension points without implementing them:
- Public workbook source.
- Server-only XLSX parser and normalizer (Phase 02).
- Google Drive fetch/export connector (Phase 03).
- Dataset loading and synchronization behavior (later sync phase).
- Client-facing data access through a same-origin Next.js boundary where appropriate.

Do not finalize unresolved caching, revalidation, or sync endpoint design beyond what existing code and confirmed requirements support. Mark those as later-phase decisions.

## 3.6 State management

Inspect:
- TanStack Query provider configuration.
- QueryClient defaults.
- Hydration/dehydration patterns if any.
- Zustand stores and persistence.
- Local component state patterns.
- URL search parameter patterns.

Map future state responsibilities:
- Normalized travel dataset: server-owned data.
- Query/cache state: TanStack Query if it fits existing architecture and later API boundary.
- Filters, selected category, sort, view mode, and open panels: local state or URL state based on actual patterns and UX requirements.
- Global client state: Zustand only when truly shared across distant components.
- Do not put the entire workbook dataset into Zustand by default.

## 3.7 i18n and content localization

Inspect:
- `src/i18n/routing.ts`.
- `src/i18n/request.ts`.
- `src/messages/index.ts`.
- Locale JSON files.
- Translation hooks.
- Locale-aware navigation.
- Locale parity checks.
- Locale metadata and SEO behavior.

Document:
- Existing supported locales.
- Existing default locale.
- Existing locale prefix behavior.
- Translation namespace registration.
- Rules for adding UI strings to every locale.
- Server/client translation APIs.
- Product-required locale behavior (`vi` default, `en` supported) as a delta, not an already implemented fact.

No locale code changes in Phase 01.

## 3.8 Styling and component system

Inspect:
- Tailwind CSS v4 setup.
- Global styles and theme tokens.
- shadcn/ui conventions.
- Component wrappers.
- Variants and `cn()` helper.
- Icon usage.
- Responsive breakpoints.
- Theme provider.
- Storybook setup and required stories.
- Existing chart support and chart component conventions.
- Existing map support, if any.

Map the Editorial design direction to the existing styling system without creating UI in this phase. Record any design-system gaps for later UI phases.

## 3.9 Testing and quality

Inspect:
- Vitest configuration.
- Testing Library setup.
- Test discovery patterns.
- Test file conventions.
- Mocking conventions.
- Coverage configuration.
- Storybook test/a11y setup if present.
- CI quality gates.

Record the exact commands from repository instructions. Distinguish commands required for every change from conditional build/storybook commands.

## 3.10 Environment, security, and deployment

Inspect:
- `.env.example` without exposing actual secret values.
- Environment schema and access helpers.
- `NEXT_PUBLIC_*` conventions.
- Next.js config.
- Security headers.
- Image remote patterns.
- Route Handler runtime defaults.
- Cookies and session storage.
- Auth assumptions and known limitations.
- Vercel configuration, if present.
- Docker and CI deployment assumptions.
- Rewrites and public API proxy behavior.

Explicitly identify:
- Values safe to expose to the browser.
- Secrets that must remain server-only.
- Risks from public workbook input.
- Risks from a public manual-sync endpoint in a later phase.
- Any existing auth/session behavior that is only a boilerplate example and not a production auth system.

Do not add environment variables, credentials, OAuth, service accounts, or API keys.

---

# 4. Product-to-Codebase Architecture Mapping

Produce a clear mapping from product requirements to existing repository extension points.

The architecture should remain within the current Next.js application.

## 4.1 Target conceptual architecture

Use this as a conceptual direction to validate against the real repository. Adapt paths to what actually exists.

```text
Google Drive public XLSX
        |
        v
Next.js server-side data boundary
        |
        v
Workbook parser + mapping + validation (Phase 02)
        |
        v
Normalized travel dataset
        |
        v
Drive fetch / latest data / manual sync (Phase 03 and sync phase)
        |
        v
Same-origin Next.js data access boundary
        |
        +------------------------------+
        |                              |
        v                              v
Server Components                Client interactions
        |                              |
        v                              v
Page-level modules               Filters / grid / table
        |                         charts / view state
        v                              |
Editorial UI / detail                  |
        |                              |
        +---------------+--------------+
                        |
                        v
                Shared design system
```

Do not treat this conceptual diagram as proof that the current repository already implements these modules. Mark existing versus planned elements.

## 4.2 Route and module mapping

Propose a route/module mapping for the product, subject to existing route conventions. At minimum consider these product surfaces:

- Home / Dashboard.
- Explore.
- Place Detail.
- Areas.
- Trip Ideas / Itinerary.
- Insights / Analytics if confirmed by the product specification.

For each route, state:
- Intended user goal.
- Candidate route path.
- Candidate `src/modules` module.
- Server Component responsibilities.
- Client Component responsibilities.
- Data dependencies.
- SEO/indexing needs.
- Locale implications.
- Which future phase owns implementation.

Do not create the routes or UI in Phase 01. If a screen's exact approved scope is not available, mark it as pending rather than inventing features.

## 4.3 Domain and data module mapping

Identify the smallest sensible future domain boundaries for:
- Workbook source / connector.
- Travel listing domain.
- Categories.
- Areas.
- Status.
- Editorial / Top Picks / itinerary.
- Sync state and diagnostics.

Map these to existing conventions. Avoid creating a generic repository framework or excessive abstraction.

## 4.4 Server/client responsibility matrix

Create a table with at least these operations:

| Operation | Server or Client | Reason |
|---|---|---|
| Fetch public XLSX | Server | Keep source retrieval and binary handling off client |
| Parse XLSX | Server-only | Parser/binary processing must not enter browser bundle |
| Map and normalize records | Server | One trusted canonical transformation |
| Validate workbook | Server | Reject unsafe/invalid new data |
| Build normalized JSON | Server | Send only the needed data to the client |
| Render SEO metadata | Server | App Router metadata |
| Initial page render | Prefer Server Component | Better initial rendering and smaller client JS |
| Search/filter/sort interactions | Client where interactive | User-driven state |
| Grid/Table toggle | Client | Interactive presentation state |
| Charts | Server or Client based on chart library and interaction | Verify Recharts and hydration constraints |
| Manual update button | Client trigger + server operation | UI action calls a protected same-origin server boundary |
| Sync guard/cooldown | Server authoritative, client feedback supplemental | Client-only guard is bypassable |
| Locale switch | Existing next-intl navigation pattern | Preserve locale routing conventions |

This is an architectural target, not a request to implement these operations now.

---

# 5. Confirmed Architecture Rules and Decision Register

Create an Architecture Decision Register. Separate confirmed decisions from recommendations and unresolved decisions.

At minimum record:

## ADR-001 — Frontend-only application

- Decision: use one Next.js application for server and client processing.
- No separate backend service.
- No database.
- Deployment target Vercel.
- Consequence: server-side Next.js capabilities are used for public source retrieval, parsing, validation, and serving data.

## ADR-002 — Public workbook source

- Decision: the Google Drive workbook is shared as `Anyone`.
- Workbook content is public.
- Secrets and user-related private data remain protected.
- Consequence: no Google OAuth or service account is required merely to read this public workbook, but the actual fetch/export URL and runtime constraints must be validated in the connector phase.

Do not infer that public sharing removes the need for input validation or abuse protection.

## ADR-003 — Server-only workbook processing

- Decision: raw XLSX parsing and normalization must run on the server.
- Client receives normalized serializable data only.
- Consequence: do not import parser modules into client components or browser hooks.

## ADR-004 — No database

- Decision: no database or persistent backend storage.
- Consequence: future caching and freshness strategy must use the capabilities appropriate to the Next.js/Vercel runtime and must be reviewed in the sync phase. Do not invent a persistence layer.

## ADR-005 — Bilingual UI, Vietnamese default

- Decision: support Vietnamese and English; default `vi`.
- Workbook content remains source language; UI-only localization.
- Consequence: current boilerplate default `en` is a known gap to address in the relevant implementation phase, not in Phase 01.

## ADR-006 — Workbook mapping and canonical area

- Decision: 11 detail sheets feed listing records; LOC is canonical for area and status.
- Preserve detail-sheet area as `sourceArea`.
- Duplicate names across different sheets remain separate.
- Detailed mapping belongs to Phase 02.

## ADR-007 — Editorial product direction

- Decision: Editorial visual direction, Grid View default, simple map, status filter default All.
- Consequence: future UI phases should use the existing design system and avoid adding a separate UI framework.

## ADR-008 — Manual synchronization intent

- Decision: initial page visit should use latest available data; all users can trigger manual update; latest data is prioritized; external tracking overwrites the workbook once daily; completion time is unknown; repeated update attempts must be guarded; post-sync UI change display is silent.
- Consequence: server-side authoritative sync coordination and failure-safe data replacement must be designed in the later sync phase. Phase 01 must not implement or over-specify the algorithm.

## ADR-009 — Dependency approval policy

- Decision: inspect the repository first; add a dependency only if a required capability is missing; present the dependency and rationale and obtain user approval before adding it.
- Consequence: no dependency change in Phase 01. This rule applies to all subsequent phases.

If the exact details of a decision are not supported by the confirmed product context, mark the ADR as proposed or unresolved. Do not invent additional approved decisions.

---

# 6. Coding Rules — Repository-Specific Rules to Preserve

Extract and restate the actual rules from `AGENTS.md`, `CLAUDE.md`, and source configuration. At minimum verify:

- Node and pnpm versions.
- Biome formatting/lint rules.
- TypeScript strict mode and path alias.
- File and folder naming conventions.
- Server Components preferred; Client Components only when needed.
- Thin App Router pages; page UI in modules.
- Shared components and UI primitive rules.
- Translation parity and typed message rules.
- `@/i18n/navigation` instead of direct Next navigation where instructed.
- `useTranslations` from the project hook barrel and server translation helper conventions.
- API domain file conventions.
- Direct server API client vs same-origin BFF client.
- Error normalization.
- Query key conventions.
- Zustand use boundaries.
- Zod validation conventions.
- Test location and naming.
- Storybook story requirement for new components.
- SEO metadata helpers and indexable route registration.
- Environment access only through the validated env module.
- Never commit `.env` or secrets.
- No `Co-Authored-By` or AI attribution in commits.
- No commits/pushes unless requested.

Do not copy generic rules that conflict with the checked-out repository. The current root instruction files are authoritative.

---

# 7. Dependency Inventory and Approval Workflow

Produce an inventory of installed packages relevant to the product.

For each candidate capability, classify it as:

- **Already available:** use the existing dependency/pattern if suitable.
- **Available but needs evaluation:** package exists but its capability/runtime behavior must be checked.
- **Missing:** no suitable installed dependency found.
- **Not needed:** do not add.

Areas to inspect:

- XLSX parsing and hyperlink extraction.
- Charting.
- Map rendering.
- Icons.
- UI primitives.
- Date/time.
- Validation.
- Client state and server cache.
- HTTP client.
- i18n.
- Testing.
- Storybook.

Do not install anything. Do not create a package proposal unless a concrete future requirement cannot be met with the existing stack. If a dependency is missing, record it as a future approval gate owned by the phase that needs it.

The confirmed dependency rule is:

**Inspect first → reuse if suitable → propose only if missing → wait for explicit user approval → install only after approval.**

---

# 8. Risk Register

Create a concise risk register with severity, evidence, impact, mitigation, and owning phase.

At minimum investigate:

1. Existing boilerplate locale default may be `en`, while product default is confirmed `vi`.
2. Public workbook may change schema or be temporarily unavailable.
3. Workbook overwrite timing is unknown.
4. Vercel runtime limits may affect XLSX parsing and refresh behavior; verify relevant limits rather than guessing.
5. A public manual-update endpoint may be abused if not rate-limited/cooldown-protected server-side.
6. Concurrent update attempts may race.
7. A failed parse must not replace a previously valid dataset.
8. No database means cache/freshness behavior must be designed carefully.
9. Client bundle must not include parser code or raw workbook bytes.
10. Existing boilerplate auth/session code may be a demo rather than production authentication.
11. `NEXT_PUBLIC_*` values are public and must not contain secrets.
12. Broad remote image patterns, if still present, require review before production.
13. Existing API proxy defaults may point to demo endpoints and must not be mistaken for the travel data source.
14. Maps links and workbook content are untrusted input.
15. Source data contains duplicate names and stale summary counts; Phase 02 handles data-level validation.

Do not exaggerate risks without evidence. Mark runtime limits and deployment behavior as requiring verification if they cannot be established from repository files.

---

# 9. Required Documentation Deliverables

After the audit and plan are complete, create or update the smallest useful documentation set. First inspect whether the repository already has a docs structure and whether equivalent documents exist. Do not overwrite useful user-authored documentation.

Recommended outputs (adapt to existing structure):

## Deliverable A — Repository Audit

Suggested path:

`docs/architecture/repository-audit.md`

Must include:
- Repository identity, audited ref/SHA, audit date.
- Exact stack and dependency inventory.
- Directory map.
- Scripts and quality gates.
- Existing examples and patterns.
- Config and environment summary.
- Deployment and CI observations.
- Evidence paths for key findings.
- Verified/inferred/unknown labels.

## Deliverable B — Project Architecture Mapping

Suggested path:

`docs/architecture/project-architecture.md`

Must include:
- Existing architecture map.
- Target product architecture map.
- Route-to-module mapping.
- API/data access mapping.
- Server/client responsibility matrix.
- State management mapping.
- i18n mapping and `vi` default gap.
- UI/design system mapping.
- Phase ownership for planned modules.

## Deliverable C — Coding Rules and Dependency Inventory

Suggested path:

`docs/architecture/coding-rules-and-dependencies.md`

Must include:
- Non-negotiable rules extracted from repository instructions.
- File/folder naming.
- TypeScript, Biome, testing, i18n, SEO, API, state, and environment conventions.
- Relevant package inventory and exact versions/ranges.
- Dependency approval workflow.
- Explicit statement that Phase 01 made no dependency changes.

## Deliverable D — Architecture Decisions and Risks

Suggested path:

`docs/architecture/decisions-and-risks.md`

Must include:
- ADR-001 through ADR-009 from Section 5.
- Decision status: confirmed, proposed, or unresolved.
- Consequences and owning implementation phase.
- Risk register with evidence and mitigations.
- Open questions that genuinely block a later phase.

## Deliverable E — Implementation Phase Map

Suggested path:

`docs/implementation/phase-map.md`

Must include:
- The agreed eight-phase project structure only to the extent already confirmed.
- Phase 01: Codebase Rules & Architecture Mapping.
- Phase 02: Data Foundation & Workbook Mapping.
- Phase 03: Google Drive Connector.
- Remaining phases should be recorded only from approved project context. If exact names/scope are not available, mark them as pending confirmation rather than inventing a roadmap.
- Dependencies between phases.
- Entry/exit criteria.
- Which decisions must be approved before the next phase.

If an existing documentation system already covers several deliverables, prefer updating that system rather than creating redundant files.

---

# 10. Acceptance Criteria — ARCH-01 to ARCH-20

Phase 01 is complete only when every applicable criterion has an evidence-backed status.

| ID | Acceptance criterion |
|---|---|
| ARCH-01 | Repository identity, default branch, audited ref/SHA, and working-tree status are recorded where accessible. |
| ARCH-02 | Root and applicable nested agent instructions have been read and summarized accurately. |
| ARCH-03 | Exact runtime, package manager, package scripts, and lockfile conventions are verified. |
| ARCH-04 | Relevant installed dependencies and versions/ranges are inventoried from manifest and lockfile. |
| ARCH-05 | Actual source directory structure is mapped with real paths. |
| ARCH-06 | App Router, locale layout, route, and metadata conventions are documented. |
| ARCH-07 | Server Component and Client Component boundaries are documented from actual examples. |
| ARCH-08 | API clients, BFF Route Handlers, rewrite proxy, error handling, and query conventions are mapped. |
| ARCH-09 | TanStack Query, Zustand, and local state responsibilities are documented. |
| ARCH-10 | next-intl routing, namespaces, translation hooks, and parity rules are documented. |
| ARCH-11 | The difference between current default locale and product-required `vi` default is explicit. |
| ARCH-12 | Styling, UI primitives, design tokens, icons, charts, maps, and Storybook conventions are audited. |
| ARCH-13 | Vitest, Testing Library, CI, and quality-gate commands are documented. |
| ARCH-14 | Environment schema, public/private boundary, secrets handling, and relevant security settings are documented. |
| ARCH-15 | Vercel/deployment compatibility is assessed from evidence; unknown runtime constraints are labeled unknown. |
| ARCH-16 | Product requirements are mapped to existing codebase extension points without implementing features. |
| ARCH-17 | Confirmed product decisions are separated from recommendations and unresolved questions. |
| ARCH-18 | Dependency approval rule is documented and no dependency or lockfile is changed. |
| ARCH-19 | ADRs, risks, phase ownership, and implementation checklist are documented. |
| ARCH-20 | Documentation is internally consistent, references real paths, and the final report lists actual verification results and remaining gaps. |

A criterion must not be marked PASS based only on assumption. Use PASS, PARTIAL, BLOCKED, or NOT APPLICABLE with evidence.

---

# 11. Implementation Workflow and Task Breakdown

Maintain a checklist and update it as work progresses.

## Task 01.1 — Repository state and instruction audit

- Inspect branch, commit, working tree, and tree.
- Read root/nested instructions.
- Identify any existing documentation.
- Do not alter user changes.

## Task 01.2 — Stack and dependency audit

- Read manifest and lockfile.
- Record actual versions/ranges.
- Inspect scripts and tooling.
- Identify relevant existing capabilities and missing dependencies.
- Do not install or edit dependencies.

## Task 01.3 — Architecture audit

- Inspect App Router and module boundaries.
- Inspect API/BFF and data patterns.
- Inspect providers and state management.
- Inspect i18n, SEO, styles, UI, tests, and Storybook.
- Inspect env, security, CI, Docker, and deployment files.

## Task 01.4 — Product mapping

- Map the confirmed product requirements to current extension points.
- Record current behavior vs product target.
- Identify phase ownership.
- Do not invent unspecified features.

## Task 01.5 — ADR and risk register

- Create the nine ADRs from Section 5.
- Classify decision status.
- Create evidence-backed risk register.
- Record open questions.

## Task 01.6 — Documentation plan

- Check for existing docs and naming conventions.
- Propose exact documentation files and contents.
- Avoid redundant files and overwriting user-authored material.

## Task 01.7 — Documentation implementation

- Create/update the approved documentation deliverables.
- Ensure links and paths are valid.
- Do not change application code, configuration, dependencies, or lockfile.

## Task 01.8 — Verification and review

- Run repository quality checks if the environment is available.
- Review all documentation for consistency.
- Verify every cited path exists.
- Verify no product source code or dependency changed.
- Report any baseline command failure as pre-existing/environmental where evidence supports that conclusion.

---

# 12. Explicit Non-goals

Do not implement in Phase 01:

- Workbook parser or mapping.
- Google Drive connector or export/download implementation.
- API Route Handlers for travel data.
- Manual sync/update button.
- Sync cooldown or server-side rate limiter.
- Cache/revalidation implementation.
- Database or persistent storage.
- Dashboard, Explore, Place Detail, Areas, itinerary, or chart UI.
- Map UI or geocoding.
- Locale default code change.
- New translation namespace.
- Dependency installation or version change.
- New environment variable.
- Authentication or user management.
- Vercel deployment or production configuration change.
- Refactoring existing boilerplate examples.
- Deleting Health/Posts demo features.
- Any unrelated code cleanup.

Phase 01 documents the architecture and rules needed to implement these safely in later phases.

---

# 13. Verification Requirements

Read and follow the current `AGENTS.md`. At minimum, attempt the repository's required checks if the workspace is available:

```bash
pnpm lint
pnpm format:check
pnpm type-check
pnpm test
```

Run `pnpm build` if the repository instructions or audit task requires a baseline production build. Do not modify source/config merely to make baseline commands pass.

For this documentation-only phase:
- Do not run Storybook build unless a story/component was changed (which should not happen).
- Do not claim browser verification unless a browser was actually used.
- If dependencies are not installed or network access is blocked, report the exact limitation.
- Record the actual command, exit status, and concise result.
- Separate pre-existing failures from changes introduced by this phase.

---

# 14. Final Report Format

At completion, report:

1. **Phase status:** completed, partially completed, or blocked.
2. **Repository snapshot:** branch, commit SHA, working-tree state, audit timestamp.
3. **Audit coverage:** files/configuration inspected and any inaccessible sources.
4. **Verified stack:** exact versions/ranges and relevant tooling.
5. **Architecture map:** existing architecture and product extension points.
6. **Server/client boundary:** responsibilities and trust boundaries.
7. **Product deltas:** current boilerplate behavior vs confirmed product decisions.
8. **Dependency inventory:** existing, missing, not needed; confirm no dependency changes.
9. **ADRs:** confirmed/proposed/unresolved.
10. **Risk register:** severity, evidence, mitigation, owning phase.
11. **Documentation files:** exact created/updated paths and contents.
12. **Quality checks:** commands run and actual outcomes.
13. **Acceptance checklist:** ARCH-01–ARCH-20 with PASS/PARTIAL/BLOCKED and evidence.
14. **Remaining questions:** only genuine blockers; do not ask already answered questions again.
15. **Phase 02 readiness:** confirm whether the repository map and coding rules are sufficient to begin Data Foundation & Workbook Mapping.

Do not claim Phase 01 complete if core repository files were inaccessible, architecture claims are unverified, documentation deliverables are missing, or acceptance criteria remain blocked.

**End of Phase 01 Detailed Specification.**
