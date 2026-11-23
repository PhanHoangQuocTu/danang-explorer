# Implementation phase map

[Repository audit](../architecture/repository-audit.md) · [Architecture](../architecture/project-architecture.md) · [Rules](../architecture/coding-rules-and-dependencies.md) · [Decisions and risks](../architecture/decisions-and-risks.md) · [Release runbook](phase-08-release-runbook.md)

This status reflects the `danang-explorer` checkout with `main` at `0355931` and the local Phase 07–08 working tree. Evidence comes from the source, commit history, offline regression and local browser runs.

| Phase | Implementation and evidence | Status |
| --- | --- | --- |
| [01 · Codebase audit](phases/phase-01-codebase-rules-architecture-mapping.md) | Repository audit and architecture decisions are in `docs/architecture/`. | On main |
| [02 · Data foundation](phases/phase-02-data-foundation.md) | `buildTravelDataset()` parses the approved XLSX fixture. Regression covers the exact LOC join, stable identity, 432 records, 395 usable ratings, 424 Maps targets, and five same-name groups across sheets. | On main |
| [03 · Google Drive connector](phases/phase-03-google-drive-connector.md) | `downloadLatestTravelWorkbook()` and `fetchLatestTravelDataset()` run on the server. A controlled local live read returned 432 records. Offline tests cover redirects, malformed responses, size limits, timeouts and upstream errors. | On main |
| [04 · Home and Explore](phases/phase-04-home-and-explore.md) | Localized pages use the shared server loader. Regression covers accent-insensitive search, filters, Grid/List/Table and 24 records per page. Browser QA confirmed search and Explore history. | On main |
| [05 · Place Detail](phases/phase-05-place-detail.md) | Exact listing ID resolves the detail view. Tests cover same-name entries, raw notes, localized labels, Maps links and source errors distinct from 404. | On main |
| [06 · Areas and Trip Ideas](phases/phase-06-areas-and-trip-ideas.md) | Eight canonical areas, runtime counts and the four editorial groups are verified with offline tests and browser QA. | On main |
| [07 · Public Travel Insights](phases/phase-07-public-travel-insights.md) | Selector totals, rating boundaries, Top Rated and text equivalents are verified offline. Chrome verified the four charts and responsive layout in both locales. | Local implementation verified |
| [08 · Integration, QA and deployment](phases/phase-08-integration-qa-deployment.md) | Manual Update, fixture-change refresh, production-mode SEO and local integration passed. The runbook records the remaining Storybook and platform gates. | Partially ready |

The local candidate passed lint, formatting, type checks, 197 offline tests and a production build. Storybook builds successfully and still reports a plugin timing warning on Node 22. Preview and production promotion require their own authorization and verification.
