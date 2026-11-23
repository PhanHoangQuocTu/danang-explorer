# Implementation phase map

[Phase 01 specification](phases/phase-01-codebase-rules-architecture-mapping.md) · [Audit](../architecture/repository-audit.md) · [Architecture](../architecture/project-architecture.md) · [Rules](../architecture/coding-rules-and-dependencies.md) · [Decisions and risks](../architecture/decisions-and-risks.md)

The agreed project has eight phases. The available product context confirms the names and intent of phases 01–03. The later workstreams below express dependencies; their numbering and scope await confirmation.

| Phase | Entry | Exit and decision gates |
| --- | --- | --- |
| 01 · Codebase Rules & Architecture Mapping | Local checkout, instruction files and confirmed product context available. | Evidence-backed repo audit, architecture, coding rules, dependencies, ADRs, risks, phase gates and actual check results. The repository map can support Phase 02 planning with the audit's baseline check limitations recorded. |
| 02 · Data Foundation & Workbook Mapping | Phase 01 map and coding rules. Obtain an authoritative, representative workbook fixture before field-level proof. | Verify actual fields and hyperlink extraction, normalize the 11 detail sheets and supporting sheets as required by the approved mapping, and prove source identity, LOC area/status, data fidelity and invalid-input behavior with tests. The 432 baseline applies only to its corresponding snapshot. Inspect/reuse first, then obtain explicit approval before installing a required parser dependency. |
| 03 · Google Drive Connector | Phase 02's validated input/output contract and a public workbook reference. | Verify anonymous retrieval of real XLSX bytes in the target runtime, including unavailable/invalid source handling and measured resource costs. Record deployment settings and any approved config changes before relying on them. |
| 04 | Pending confirmation | Exact phase name, scope and gates pending. |
| 05 | Pending confirmation | Exact phase name, scope and gates pending. |
| 06 | Pending confirmation | Exact phase name, scope and gates pending. |
| 07 | Pending confirmation | Exact phase name, scope and gates pending. |
| 08 | Pending confirmation | Exact phase name, scope and gates pending. |

## Cross-phase implementation checklist

- [x] 01.1 Verify repository identity, refs, tree, instruction files and existing docs.
- [x] 01.2 Verify runtime, scripts, manifest, lockfile and capability gaps.
- [x] 01.3 Trace routes, rendering, API, state, i18n, UI, QA, security and deployment files.
- [x] 01.4 Map approved requirements to future extension points.
- [x] 01.5 Record ADRs, risks, owners and open decisions.
- [x] 01.6 Present the documentation plan before edits and confirm output paths are new.
- [x] 01.7 Write the five Phase 01 deliverables.
- [x] 01.8 Attempt required baseline commands and review Markdown links and Git change scope. Baseline blockers are recorded in the audit.
- [ ] Phase 02 verifies the workbook and normalized contract with fixtures. Any required dependency is subject to ADR-009.
- [ ] Phase 03 uses the normalized contract and validates the public workbook connector.
- [ ] Later sync work depends on the validated workbook contract and connector. Evaluate authoritative refresh coordination and caching before exposing manual updates.
- [ ] Later UI work depends on normalized data contracts. Obtain approved screen scope and the Place Detail Option A reference before implementing those surfaces. Verify the Vietnamese default, UI-only localization, Editorial direction, Grid, All and simple map.
- [ ] Deployment verification follows the relevant connector, sync and UI work. Measure the selected Vercel runtime, verify production SEO and env, and run applicable automated and browser gates.

The Phase 02 map and rules are ready for use. Field-level tests require the workbook, and adding a required parser package or any other dependency requires explicit approval. The existing type-check and formatting failures should be resolved in the verification environment before claiming a clean implementation baseline.
