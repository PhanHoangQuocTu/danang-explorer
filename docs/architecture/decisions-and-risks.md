# Architecture decisions and risks

[Repository audit](repository-audit.md) · [Architecture](project-architecture.md) · [Dependency policy](coding-rules-and-dependencies.md) · [Phase map](../implementation/phase-map.md)

## Architecture decision register

All nine ADRs are confirmed by sections 2 and 5 of the [Phase 01 specification](../implementation/phases/phase-01-codebase-rules-architecture-mapping.md). The consequences below identify the implementation owner.

| ADR | Status | Decision | Consequence and owner |
| --- | --- | --- | --- |
| ADR-001 | Confirmed | One frontend Next.js application runs server and client processing. Vercel is the deployment target. No separate backend and no database. | Use Next.js server features for public retrieval, validation and serving. Phase 03 and deployment work establish runtime fit. |
| ADR-002 | Confirmed | The Google Drive workbook has Anyone access and contains public data. Secrets and private user data must remain protected. | Public access alone needs no OAuth or service account. Phase 03 verifies the actual URL and anonymous binary retrieval. |
| ADR-003 | Confirmed | Parse and normalize raw XLSX on the server. Return normalized serializable data to the client. | Phase 02 builds the server boundary and later UI integration verifies bundle separation. |
| ADR-004 | Confirmed | No database or persistent backend storage. | Sync owns cache, freshness and cross-instance semantics within Next.js/Vercel constraints. |
| ADR-005 | Confirmed | Vietnamese default, English supported, UI-only localization. Preserve source workbook text. | UI/locale work closes the current `en` routing gap and verifies SEO. |
| ADR-006 | Confirmed | Eleven detail sheets feed listings and map to five main categories. LOC (`LOC_THEO_KHU_VUC`) is canonical for area and status. Preserve detail-sheet column E as `sourceArea` and retain same-name records across sheets. | Phase 02 validates and documents source-aware identity, join rules and field mappings. |
| ADR-007 | Confirmed | Editorial direction, Grid default, simple map and default status All. Place Detail follows the previously selected Option A. | UI phase reuses the design system and obtains the missing Option A behavior before implementing Place Detail. |
| ADR-008 | Confirmed | On first entry use latest available data, prioritize freshness, and allow any visitor to request an update. External tracking overwrites once daily at an unknown time. Guard repeated attempts and show appropriate sync state with silent post-sync changes. | Sync phase designs authoritative guards and failure-safe replacement. |
| ADR-009 | Confirmed | Inspect and reuse first. Propose a dependency with rationale only when a required capability is missing and install only after explicit approval. | All phases. Phase 02 owns the parser/hyperlink approval gate. |

Workbook context records 14 sheets, including `TRANG BIA`, `LOC_THEO_KHU_VUC` and `TOP_PICKS_LICH_TRINH` as the three supporting sheets. The 432 named rows are a reported snapshot baseline to validate against the fixture, not a fixed production count. Phase 02 counts valid named rows, keeps invalid/unavailable ratings null, preserves descriptive price, hours, highlights and notes, extracts the actual Maps cell hyperlink, and maps column L's four pipe-delimited parts. Workbook text remains in the original language. [Phase 01 specification](../implementation/phases/phase-01-codebase-rules-architecture-mapping.md)

**Proposed.** A small server-owned workbook domain, Zod at its normalization boundary, direct server reads, optional same-origin normalized client data, URL state for shareable filters and Recharts where approved. Exact paths, route scope and client contracts remain implementation decisions. [Architecture map](project-architecture.md)

**Unresolved.** Representative workbook access, parser approval, Drive retrieval route, runtime project settings, refresh coordination and caching strategy, the detailed Place Detail Option A reference and later phase names/scope. [Phase gates](../implementation/phase-map.md)

## Risk register

Severity estimates reflect impact on the proposed product. Product inputs below come from the [Phase 01 specification](../implementation/phases/phase-01-codebase-rules-architecture-mapping.md).

| Risk | Severity | Evidence and impact | Mitigation | Owner |
| --- | --- | --- | --- | --- |
| R01 Locale mismatch | High | Routing defaults to English, which would ship the wrong unprefixed locale. [Routing](../../src/i18n/routing.ts) | Verify default URLs, locale negotiation, redirects, metadata and sitemap when changing the locale. | UI/locale |
| R02 Workbook drift or outage | High | The public source is overwritten externally. Schema drift or fetch errors can make data unavailable. | Validate structure and data, handle unavailable fetches and keep the previous valid snapshot where feasible. | Phase 02, Phase 03, sync |
| R03 Unknown overwrite timing | Medium | Daily external overwrite has no confirmed completion time. A fixed assumption can serve stale data. | Define freshness behavior based on observed availability, without relying on a clock time. | Sync |
| R04 Platform resource limits | High | Actual Vercel plan/settings and workbook resource costs are unknown. Timeout, memory pressure or payload limits can break refresh. [Vercel limits](https://vercel.com/docs/functions/limitations) | Confirm runtime settings and measure fixture fetch/parse latency, peak memory and normalized response size on the target. | Phase 03, sync |
| R05 Public manual update abuse | High | Every visitor can trigger work. Repeat requests can exhaust resources. | Authoritative server-side cooldown/rate protection and quiet client feedback. | Sync |
| R06 Concurrent updates | High | Visitors and separate function instances may overlap. An older request could replace fresher data. | Verify coordination across instances as part of the chosen refresh strategy. | Sync |
| R07 Invalid replacement | High | Overwrites can supply invalid or unexpected content. Replacing valid data with a failed parse breaks pages. | Validate candidate data before publishing and test failure paths. | Phase 02, sync |
| R08 No database and freshness | High | Product prohibits persistent backend storage. In-process cache alone has cold-start and cross-instance limitations. | Evaluate supported cache semantics and verify first-load and fallback behavior before release. | Sync |
| R09 Parser or raw data enters browser | High | Client providers and interactive views cross a bundle boundary. A shared import can carry parser code to clients. [Providers](../../src/app/%5Blocale%5D/providers.tsx) | Keep parser imports in server-only modules and verify the client output contains only normalized fields. | Phase 02, UI |
| R10 Demo session reuse | Medium | Browser-readable session cookies and dormant auth scaffolding can be mistaken for a production security boundary. [Session](../../src/stores/sessionStore.ts) · [Proxy](../../src/proxy.ts) | Keep visitor refresh guards independent of demo auth. Treat production authentication as separate scope. | Sync, deployment |
| R11 Public env exposure | High | Public env values are build inputs and can enter client JS. [Env schema](../../src/constants/env.ts) | Keep credentials out of public env and exclude local secret files from Git. | Phase 03, deployment |
| R12 Broad remote images | Medium | The current config allows every HTTPS host, which is broad for production image optimization. [Next config](../../next.config.ts) | Revisit allowed hosts once real asset sources are known. | UI, deployment |
| R13 Demo proxy origin | Medium | BFF/rewrite defaults reference JSONPlaceholder. Using the demo upstream for travel would return unrelated data. [Env schema](../../src/constants/env.ts) · [Next config](../../next.config.ts) | Use a dedicated workbook connector and review demo route exposure before production. | Phase 03, deployment |
| R14 Untrusted content and Maps links | High | Workbook text and actual cell hyperlink targets come from a public upstream. Invalid targets may affect visitors. | Validate workbook structure and link targets, render source text safely and avoid synthesized links. | Phase 02, UI |
| R15 Duplicate names and stale counts | High | Names can repeat across sheets and summary counts can be stale. Name-only matching can merge listings or corrupt counts. | Count named rows, preserve source identity and fixture-test canonical LOC matching and summary discrepancies. | Phase 02 |

## Decisions that need later evidence or approval

- Phase 02 needs a representative workbook fixture to verify actual fields and hyperlinks. Obtain explicit approval before introducing a parser dependency.
- Phase 03 needs a public source reference and the anonymous download/export behavior. The connector and sync work need the Vercel settings and observed runtime limits before validating deployment behavior.
- Sync needs a reviewed approach to refresh, cooldown, cache, concurrent attempts and retaining valid data under the no-storage constraint.
- Place Detail needs the approved Option A specification. Remaining phase names and scope, including any Insights surface, require product confirmation before being scheduled or implemented.
