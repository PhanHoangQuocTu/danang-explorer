# Phase 03 — Google Drive Connector & Workbook Source Integration
## Codex Detailed Implementation Specification

**Project:** Da Nang Travel Discovery  
**Repository:** https://github.com/PhanHoangQuocTu/nextjs-frontend-boilerplate  
**Target phase:** Phase 03 of 08  
**Document type:** Authoritative implementation specification  
**Scope:** Retrieve the latest public Google Sheets workbook as XLSX and connect the source adapter to the Phase 02 Travel Data Foundation.  
**Execution mode:** Repository-aware, server-only, no database, no separate backend.  
**Status:** Product source and sharing decisions are confirmed. Phase 02 implementation readiness must be verified before integration.

---

# 0. Instructions for Codex

Treat this document as the authoritative scope for Phase 03. Implement only the public workbook source connector and its narrow integration with the existing Phase 02 parser/data builder.

This phase is **not** the full synchronization workflow. Do not implement initial page loading, manual update UI, sync API, cooldown/rate limiting, cache persistence, or any product page.

Before changing any file:

1. Inspect the active branch, latest commit, `git status`, and current working tree. Preserve all user changes.
2. Read the complete root `AGENTS.md`, `CLAUDE.md`, and applicable nested instruction files.
3. Read the Phase 01 repository audit / architecture documents if present.
4. Read the Phase 02 detailed specification and execution report, then inspect the actual Phase 02 implementation in source code.
5. Verify whether Phase 02 is complete. Locate the real server-only XLSX parser and the actual public data-builder function/type/diagnostics contract. Do not guess exported function names or duplicate its logic.
6. Inspect package manifest, lockfile, environment schema, Next.js config, test setup, API conventions, and current server-only patterns.
7. Produce a concise, dependency-aware implementation plan before editing.
8. Do not install, add, upgrade, remove, or change any dependency or lockfile without explicit user approval.
9. Do not introduce Google OAuth, Google service accounts, Google API keys, `googleapis`, a database, a separate backend, a queue, a worker, or a generic provider framework.
10. Do not commit, push, amend, rebase, or rewrite Git history.
11. Do not claim tests, builds, smoke tests, or deployment checks passed unless they were actually run and their output inspected.
12. If the public export endpoint is not accessible, do not silently switch to an authenticated Drive API or a third-party proxy. Report the evidence and stop at the source-access blocker.

**Phase dependency gate:** if Phase 02 has not produced a working server-only parser/data builder, Phase 03 may still implement and test the isolated download connector if that can be done without changing or duplicating Phase 02. Mark end-to-end source-to-dataset integration BLOCKED until Phase 02 is ready. Do not declare Phase 03 fully complete while that integration is blocked.

---

# 1. Roles and Quality Bar

Work as a coordinated senior engineering team:

- **Senior Next.js Engineer:** preserve the existing App Router architecture, Node.js runtime boundaries, and server/client separation.
- **Senior Integration Engineer:** implement a small, reliable public Google Sheets export connector.
- **Senior TypeScript Engineer:** use explicit types and safe error contracts.
- **Senior Data Engineer:** integrate downloaded bytes with the existing Phase 02 parser without reimplementing workbook mapping.
- **Senior Security Reviewer:** prevent SSRF, untrusted redirects, HTML/login responses, oversized downloads, and leakage of source internals.
- **Senior QA Engineer:** cover HTTP success/failure paths with deterministic mocked tests and verify the actual public source with a controlled smoke test when possible.
- **Technical Lead:** keep the solution minimal and proportionate to one public workbook.

The target remains one Next.js application deployed to Vercel. The connector is a small server-side adapter, not an integration platform.

---

# 2. Confirmed Product and Architecture Context

Preserve these decisions:

## 2.1 Application architecture

- Next.js handles both server and client work.
- No separate backend service.
- No database.
- Deployment target: Vercel.
- The source workbook is public and shared as `Anyone` (viewer access).
- Workbook content is public; API keys, credentials, secrets, and user-related private information must remain private.
- Workbook parsing and normalization are server-only.
- Client-facing features receive normalized JSON, never raw XLSX bytes or parser objects.
- Avoid over-engineering.

## 2.2 Workbook identity

The authoritative public Google Sheets URL is:

`https://docs.google.com/spreadsheets/d/1b5ozJ_3cu1cp9JUNdX7fTggV2EQGI4Th/edit?usp=sharing&ouid=107497916965545826710&rtpof=true&sd=true`

Spreadsheet ID:

`1b5ozJ_3cu1cp9JUNdX7fTggV2EQGI4Th`

The workbook is overwritten by an external tracking process approximately once per day. The exact completion time is unknown.

Product priority:
- Latest available workbook data takes priority.
- The website should eventually load the latest available data on initial visit.
- All users should eventually be able to request a manual update.
- Repeated manual update attempts must eventually be guarded server-side.
- After synchronization, changes should be reflected silently without disruptive change announcements.

These last four points are **future synchronization requirements**, not permission to implement sync UI or sync orchestration in Phase 03.

## 2.3 Localization and content

- UI locales: Vietnamese and English.
- Default UI locale: `vi`.
- Workbook content is not translated; localization is UI-only.
- Preserve workbook source text exactly through the existing Phase 02 data contract.

## 2.4 Phase 02 ownership

Phase 02 owns:
- XLSX parsing.
- Worksheet/header validation.
- Mapping the 11 detail sheets and 3 supporting sheets.
- Listing normalization and stable identity.
- LOC-based canonical area and status mapping.
- Rating, Maps hyperlink, and visit-profile normalization.
- Editorial content mapping.
- Structural errors, row warnings, and informational diagnostics.
- Regression tests against the workbook snapshot.

Phase 03 must not repeat or alter those rules.

The Phase 02 specification explicitly says the parser receives XLSX bytes as a server-side input, returns a typed normalized result and diagnostics, does not fetch Google Drive, and does not add caching or mutate shared state. Phase 03 supplies the missing source bytes to that foundation.

---

# 3. Source Access Strategy

## 3.1 Preferred approach: public Google Sheets XLSX export

Use the public Google Sheets export URL built from the fixed spreadsheet ID:

```text
https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/export?format=xlsx
```

For the confirmed workbook, the resolved URL is:

```text
https://docs.google.com/spreadsheets/d/1b5ozJ_3cu1cp9JUNdX7fTggV2EQGI4Th/export?format=xlsx
```

This is a direct public export request to Google Sheets. It is not the authenticated Google Drive API.

The connector must:
- Build the URL internally from the configured spreadsheet ID.
- Fetch from the Next.js server only.
- Request XLSX bytes.
- Follow only expected Google export redirects.
- Validate the response before returning bytes.
- Never send the spreadsheet ID, download URL, binary bytes, or parser output to the browser unless a later feature explicitly needs safe normalized data.

Do not use the edit URL as a fetch URL. Do not scrape the Google Sheets HTML UI. Do not parse HTML pages.

## 3.2 Do not use authenticated Drive API in this phase

The official Google Drive API `files.export` method exports Google Workspace documents to a requested MIME type, but it requires an OAuth scope. The user has explicitly chosen an `Anyone` public workbook and a frontend-only Next.js application without a separate backend or credential management.

Therefore:
- Do not enable the Drive API just for this public workbook.
- Do not create OAuth consent screens or service accounts.
- Do not add Google API keys or credentials.
- Do not add `googleapis` or an equivalent SDK.
- Do not request user Google sign-in.
- Do not fall back to an authenticated API automatically if the public export URL fails.

If Google changes public export behavior or the user's sharing settings prevent the export, stop and report the exact failure. Ask for a decision before proposing a different access model.

## 3.3 Public sharing versus Publish to web

The confirmed setting is `Anyone` sharing. Do not silently change the spreadsheet's sharing or publishing settings.

The connector should test the actual public export URL. If it returns an access-denied page, login HTML, or a non-XLSX response, classify it as a source-access failure. Do not assume `Anyone` sharing guarantees every export path will remain available forever.

---

# 4. Connector Responsibilities and Boundaries

The connector has one responsibility:

**Retrieve the current XLSX export bytes for the configured public spreadsheet and return validated bytes plus source-fetch metadata.**

It must not:
- Interpret worksheet contents.
- Map categories, areas, statuses, or listing records.
- Parse XLSX cells.
- Modify the workbook.
- Upload or write to Google Drive.
- Choose a historical revision.
- Decide whether the source tracking process has finished its daily overwrite.
- Persist a dataset.
- Manage a cache.
- Expose an API endpoint.
- Trigger itself during build.
- Add UI, a button, or a page.
- Implement cooldown/rate limiting.

## 4.1 Narrow integration responsibility

If Phase 02 is ready, add one small server-side composition function that:

1. Calls the connector to download the current XLSX bytes.
2. Passes those bytes to the existing Phase 02 parser/data builder.
3. Returns the existing normalized dataset and diagnostics, with source-fetch metadata attached in a clearly typed wrapper.

Do not copy the Phase 02 parser or mapping code.

If Phase 02's actual API is not compatible with the expected input, adapt through a small boundary wrapper only when the change is safe and does not alter Phase 02 business rules. Otherwise document the mismatch and stop.

## 4.2 Runtime boundary

- Use the Node.js runtime for server code that downloads and passes binary workbook bytes to the parser.
- Do not use the Edge runtime for this connector unless the actual parser and repository architecture are explicitly proven compatible and the user approves the change.
- Mark the connector module as server-only using the repository's existing convention. If `server-only` is already available, use it; do not add a package solely for this marker.
- Never import the connector from Client Components, client hooks, shared UI components, or browser entry points.
- No raw XLSX bytes may cross the React Server Component serialization boundary.

---

# 5. Source Configuration

Keep configuration small and centralized.

Preferred configuration:
- A single constant for the known spreadsheet ID in the appropriate server-side travel-data source configuration.
- A pure URL builder that accepts the configured ID internally.
- A small set of connector constants for timeout, allowed content types, and maximum byte size.

Do not create a generic multi-provider configuration framework for one workbook.

The spreadsheet ID is public source metadata, not a secret. Do not mislabel it as an API key. Prefer not to add an environment variable unless the actual repository has an established pattern that makes it materially cleaner. If a new environment variable is proposed, explain why a source constant is insufficient and obtain approval before changing environment configuration.

Do not accept a caller-supplied arbitrary URL or spreadsheet ID from a request body/query string. The connector must not become an SSRF-capable URL fetch proxy.

---

# 6. Download Contract

Adapt naming and file placement to the actual repository conventions. The following is a semantic contract, not a command to create an oversized abstraction.

## 6.1 Suggested source result

The connector should return a typed result equivalent to:

```ts
interface WorkbookSourceMetadata {
  source: 'google-sheets-public-export';
  spreadsheetId: string;
  fetchedAt: string;
  contentType: string | null;
  contentLength: number;
  etag: string | null;
  lastModified: string | null;
  sha256: string;
}

interface DownloadedWorkbook {
  bytes: Uint8Array;
  metadata: WorkbookSourceMetadata;
}
```

Requirements:
- `fetchedAt` is the time this server successfully downloaded the bytes, represented as ISO 8601.
- `lastModified` is only an optional HTTP response header. It is not guaranteed to represent the tracking job's completion time.
- `etag` is an opaque upstream validator. Do not assume it is present or stable.
- `contentLength` is the actual byte count received, not blindly trusted from a header.
- `sha256` is a deterministic fingerprint of the downloaded bytes. Use Node's built-in crypto API if useful; do not add a hashing dependency.
- Do not use the cover sheet's displayed update date as `fetchedAt`.
- Do not infer that the external tracking job has completed from the fetch timestamp.
- Do not expose raw bytes or internal response metadata to client components.

If the Phase 02 data contract already has a suitable source metadata type, reuse it rather than creating a duplicate.

## 6.2 Suggested public function shape

Use a small function equivalent to:

```ts
downloadLatestTravelWorkbook(): Promise<DownloadedWorkbook>
```

Do not expose low-level HTTP options to arbitrary callers. Keep the spreadsheet ID and export URL internal to the source adapter.

## 6.3 Timeout

Use a bounded request timeout (initial recommendation: 30 seconds) and an abort signal supported by the repository's Node.js runtime.

- Classify timeout separately from generic upstream failure.
- Ensure abort resources are cleaned up if the implementation creates its own timer/controller.
- Do not set an excessive Vercel function duration.
- Do not add a `maxDuration` override unless real measurements show it is necessary and the reason is documented.

## 6.4 Download size protection

The inspected workbook snapshot was approximately 196 KB. Use a conservative upper bound that comfortably accommodates future workbook growth (initial recommendation: 10 MB), and make the limit easy to review.

Requirements:
- Check `Content-Length` when present.
- Do not rely on `Content-Length` alone.
- Enforce the limit while reading the response stream so a missing or dishonest header cannot cause an unbounded download.
- Reject zero-byte responses.
- Cancel/stop reading once the limit is exceeded.
- Do not set an arbitrary tiny limit that rejects the known workbook.
- Do not write the XLSX to a persistent disk path; keep it in memory for the parser.

## 6.5 Redirect handling

Google may redirect export requests to a download host.

Requirements:
- Use normal HTTP redirect handling for the fixed Google export request.
- Validate the final response URL host against a narrow, documented Google host allowlist appropriate to the actual redirect observed during the smoke test (for example, exact `google.com` / `googleusercontent.com` domains and their legitimate subdomains).
- Do not accept arbitrary redirect hosts.
- Do not log signed redirect URLs or query tokens.
- If the actual Google redirect host differs from the allowlist, inspect it and update the allowlist only with evidence; do not broadly allow every hostname.
- If redirects cannot be safely validated with the current runtime API, explain the limitation and propose the smallest safe alternative.

---

# 7. HTTP Response Validation

The connector must not treat every HTTP 200 response as an XLSX file. Google may return an HTML sign-in page, access-denied page, quota page, or error page.

Validate in this order:

1. The request completed before timeout.
2. The HTTP status is exactly `200 OK`.
3. The final response URL is an allowed Google host.
4. The response is not empty.
5. If `Content-Type` is present, it is compatible with XLSX or a known generic binary type. Accept the official XLSX MIME type:
   `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
6. Reject `text/html`, `text/plain`, JSON error bodies, and other clearly incompatible response types.
7. Read the body with the byte-size guard.
8. Verify the ZIP container signature used by XLSX files (the standard `PK` ZIP signatures). This is a lightweight file-type sanity check, not XLSX parsing.
9. Pass the bytes to the Phase 02 parser, which remains responsible for actual workbook structure validation.

Do not attempt to parse HTML error responses as XLSX. Do not return HTML snippets or raw Google error pages to the client.

If Google returns `application/octet-stream`, allow it only when the ZIP signature check passes.

---

# 8. Error Contract

Use the repository's established typed error/result pattern. Do not introduce a new generic error framework if the project already has one.

Suggested error codes:

| Code | Meaning | Expected handling |
|---|---|---|
| `WORKBOOK_SOURCE_TIMEOUT` | Google export request exceeded timeout | Retry may be considered by a later sync orchestrator; do not retry in a tight loop here |
| `WORKBOOK_SOURCE_NETWORK_ERROR` | DNS, TLS, connection, or fetch failure | Preserve current valid dataset in later sync phase |
| `WORKBOOK_SOURCE_ACCESS_DENIED` | Google returned 401/403 or an access-denied page | Configuration/sharing issue; no auth fallback |
| `WORKBOOK_SOURCE_NOT_FOUND` | Google returned 404 | Source ID or source resource unavailable |
| `WORKBOOK_SOURCE_RATE_LIMITED` | Google returned 429 or a clear quota response | Do not retry aggressively |
| `WORKBOOK_SOURCE_UPSTREAM_ERROR` | Google returned 5xx or unexpected upstream status | Report safe error |
| `WORKBOOK_SOURCE_REDIRECT_NOT_ALLOWED` | Final redirect host is not approved | Reject response |
| `WORKBOOK_SOURCE_INVALID_CONTENT_TYPE` | Response is HTML/text/unsupported content | Reject response |
| `WORKBOOK_SOURCE_EMPTY_FILE` | No bytes returned | Reject response |
| `WORKBOOK_SOURCE_FILE_TOO_LARGE` | Download exceeded configured size bound | Abort and reject |
| `WORKBOOK_SOURCE_INVALID_XLSX_SIGNATURE` | Bytes do not have expected ZIP signature | Reject response |
| `WORKBOOK_DATA_BUILD_FAILED` | Phase 02 parser rejects workbook structure/content | Return typed Phase 02 diagnostics internally; do not replace valid data later |

Requirements:
- Preserve HTTP status internally where useful.
- Do not leak stack traces, HTML, cookies, signed URLs, or raw response bodies.
- Do not expose internal source details to the browser.
- Keep error messages actionable but concise.
- Never convert an error into a successful empty dataset.
- Never hide a parser structural failure as a transient download failure.

A later sync orchestrator will decide retry/cooldown behavior. Phase 03 only classifies the error accurately.

---

# 9. Freshness and Source Version Semantics

The user prioritizes latest available data. The connector must therefore retrieve the current export when it is invoked.

For the connector's upstream `fetch` call:
- Explicitly use `cache: 'no-store'` so this source download does not accidentally reuse a stale Next.js Data Cache entry.
- Do not set a positive `next.revalidate` interval here.
- Do not use `force-cache`.
- Do not rely on implicit Next.js caching defaults.
- Do not implement a process-global in-memory cache.
- Do not add a CDN proxy or third-party mirror.

Important distinction:
- `cache: 'no-store'` controls the Next.js server-side fetch cache for this source request.
- It does not create a persistent dataset cache, coordinate multiple Vercel instances, prevent concurrent manual requests, or implement a cooldown.
- A later synchronization phase must decide how initial page loads and manual refreshes share/cache the normalized dataset without introducing a database.

The external tracking process overwrites the workbook about once per day, but its completion time is unknown. Therefore:
- The connector can promise only “latest export available from Google at the time of this request.”
- It cannot promise the external tracking process has completed for the current day.
- Do not use the workbook cover sheet date as a source revision.
- Do not fabricate a `sourceUpdatedAt` value if Google does not provide reliable metadata.
- Record `fetchedAt` as the connector's successful retrieval time.
- Preserve optional `etag` and `lastModified` as opaque upstream metadata only.

Official Next.js fetch documentation describes `cache: 'no-store'` as fetching the resource from the remote server on every request. Use this deliberately and document that caching/coordination belongs to a later phase.

---

# 10. Phase 02 Integration

## 10.1 Verify actual Phase 02 code first

Before implementing the composition function:
- Locate the Phase 02 parser/data-builder entry point.
- Inspect its actual input type.
- Inspect its actual success/failure result.
- Inspect its diagnostics shape.
- Confirm the module is server-only.
- Confirm it accepts in-memory bytes without requiring a filesystem path.
- Confirm the dependency approval gate was resolved and the parser is implemented.

Do not infer the implementation from the Phase 02 specification alone.

## 10.2 Composition function

If Phase 02 is ready, add one thin server-only function conceptually equivalent to:

```ts
async function fetchLatestTravelDataset() {
  const downloaded = await downloadLatestTravelWorkbook();
  const buildResult = await buildTravelDatasetFromWorkbookBytes(downloaded.bytes);

  if (buildResult is structurally invalid) {
    throw or return a typed data-build failure;
  }

  return {
    dataset: buildResult.dataset,
    diagnostics: buildResult.diagnostics,
    source: downloaded.metadata,
  };
}
```

The function names above are illustrative. Use the actual Phase 02 API.

Requirements:
- Download exactly once per invocation.
- Parse exactly once per invocation.
- Preserve Phase 02 normalization and diagnostics.
- Attach source metadata without mutating the Phase 02 dataset contract.
- Never return a partially parsed dataset as a successful full dataset if structural validation fails.
- Never cache or persist the result in Phase 03.
- Do not make this function callable from a Client Component.
- Do not add a Route Handler merely to test the function.

If Phase 02 returns warnings but a valid dataset, preserve warnings exactly. Do not make new acceptance rules that conflict with Phase 02.

## 10.3 Source data integrity

The connector must not change workbook contents. The Phase 02 parser remains responsible for:
- 14 worksheet recognition.
- 11 detail sheets and 3 supporting sheets.
- 432-record snapshot regression baseline.
- Five main categories.
- Eight canonical LOC areas.
- LOC as the canonical area/status source.
- Duplicate preservation across source sheets.
- Actual Maps hyperlink extraction.
- Rating and four-part visit-profile mapping.
- Editorial content preservation.

Phase 03 may run an integration check that downloads the current workbook and passes it to the parser, but it must not rewrite or duplicate those rules.

---

# 11. Security Requirements

- The source spreadsheet is public; no OAuth token or API key is required for the selected public-export approach.
- Do not place any credential in `NEXT_PUBLIC_*`.
- Do not add a credential.
- Do not accept a caller-supplied URL or arbitrary spreadsheet ID.
- Build the source URL from the fixed trusted spreadsheet ID.
- Validate final redirect host.
- Validate status, content type, file size, and ZIP signature.
- Treat all workbook bytes as untrusted until Phase 02 validation succeeds.
- Do not expose raw workbook bytes to the browser.
- Do not expose internal exception details, signed redirect URLs, response headers, or raw upstream HTML.
- Do not log the entire workbook or personal data.
- Do not add permissive CORS settings.
- Do not add a public endpoint in this phase.
- Do not use `dangerouslySetInnerHTML` or render source content as HTML.
- Keep secrets and user-related private information out of logs and source metadata.

Because this is a fixed public source, SSRF risk is controlled primarily by not allowing arbitrary URLs/IDs and by validating the redirect destination.

---

# 12. Performance and Vercel Considerations

The inspected workbook snapshot is approximately 196 KB. The connector should remain a small in-memory request.

Requirements:
- Use Node.js runtime.
- Stream and bound the response body rather than blindly reading an unlimited response.
- Avoid disk writes.
- Avoid repeated downloads within one invocation.
- Avoid repeated parsing within one invocation.
- Do not create a long-running process, queue, cron job, or background worker.
- Do not increase Vercel function memory/duration without evidence.
- Do not introduce a new deployment configuration solely for this connector.
- Record actual download duration and byte count in internal diagnostics only if useful; do not add an observability platform.
- Keep logs free of signed download URLs and raw response bodies.

If the actual workbook grows materially beyond the inspected snapshot, evaluate the real download and parse measurements before changing limits or Vercel configuration.

Do not assume a particular Vercel plan. Verify the repository's deployment configuration and use the plan-independent minimum required behavior. Vercel function duration and memory limits vary by plan/configuration; do not hardcode plan assumptions.

---

# 13. Testing Strategy

Automated tests must be deterministic and must not call Google over the network.

Follow the repository's Vitest conventions and place tests beside the connector under `__tests__/`.

## 13.1 Unit tests — URL and config

- Correct spreadsheet ID is used.
- Export URL is built using `/export?format=xlsx`.
- Edit URL query parameters are not reused.
- No arbitrary caller-supplied URL can be injected.
- No credential or API key is required.
- The configured source ID is validated and not blank.

## 13.2 Unit tests — successful HTTP response

Mock `fetch` and test:
- HTTP 200 with official XLSX MIME type.
- HTTP 200 with `application/octet-stream` and valid ZIP signature.
- Valid redirect to an allowed Google host.
- Optional `Content-Length` present.
- `Content-Length` absent.
- Optional `ETag` and `Last-Modified` present/absent.
- `fetchedAt` is generated by the server at successful retrieval.
- `contentLength` matches actual bytes.
- SHA-256 is deterministic for identical bytes.
- `cache: 'no-store'` is always supplied.
- Timeout signal is configured.

## 13.3 Unit tests — invalid HTTP response

Test:
- 401 and 403.
- 404.
- 429.
- 5xx.
- Unexpected non-200 status.
- HTML sign-in page with HTTP 200.
- `text/html` response.
- JSON error body.
- Unsupported content type.
- Empty body.
- Invalid ZIP signature.
- Content-Length above the limit.
- Stream exceeds limit despite missing or misleading Content-Length.
- Redirect to an unapproved host.
- Network exception.
- Timeout/abort.
- Stream read failure.

Assert that errors are mapped to the expected safe error codes and that raw upstream body content is not returned.

## 13.4 Phase 02 integration tests

Only if Phase 02 is implemented and its parser contract is available:
- Pass mocked valid XLSX bytes through the composition function.
- Assert the parser is called once.
- Assert the exact bytes are passed.
- Assert dataset and diagnostics are preserved.
- Assert source metadata is attached.
- Assert structural parser failure is not returned as a successful dataset.
- Assert parser warnings remain intact.
- Assert the connector and parser are not imported into a client entry point.

Do not duplicate the Phase 02 regression suite.

## 13.5 Live smoke test

If network access is available and allowed:
- Manually invoke the public export URL from a secure server-side development environment.
- Confirm a 200 response, allowed redirect host, non-empty bytes, expected MIME type or accepted generic binary type, and valid ZIP signature.
- Pass the downloaded bytes to the actual Phase 02 parser if available.
- Record timestamp, byte count, response content type, and safe result summary.
- Do not log the raw workbook or signed redirect URL.
- Do not put a live network request in an automated test.
- Do not run the live request during `next build`.

If the smoke test cannot run due to tool/network restrictions, report it as NOT RUN, not PASS.

---

# 14. Explicit Non-goals

Do not implement in Phase 03:

- Initial automatic workbook loading on page entry.
- Manual Update button.
- Manual update API Route Handler.
- Cooldown or rate limiting.
- Cross-instance locking or concurrency coordination.
- Cache storage, cache invalidation, `revalidateTag`, or persistent dataset caching.
- In-memory global cache.
- Scheduled daily refresh or cron.
- Background jobs, queues, workers, or workflows.
- Database or object storage.
- Google OAuth, service accounts, API keys, or Google Drive SDK.
- User authentication.
- Dashboard, Explore, Place Detail, Areas, map, charts, or itinerary UI.
- Translation namespace changes.
- Workbook parsing/mapping/normalization changes owned by Phase 02.
- Writing or modifying the source workbook.
- Deployment configuration changes without evidence and approval.

These are later-phase concerns or outside the approved product scope.

---

# 15. Implementation Workflow and Task Breakdown

Codex must maintain a task checklist and update it as work progresses.

## Task 03.1 — Repository and prerequisite audit

- Inspect branch, working tree, and applicable instructions.
- Read Phase 01 architecture audit and Phase 02 specification/report.
- Verify actual Phase 02 implementation and parser contract.
- Verify dependency approval status.
- Inspect current server-only patterns and test setup.
- Report blockers before editing.

## Task 03.2 — Source access smoke test

- Verify the exact public spreadsheet export URL.
- Confirm whether anonymous access works with `Anyone` sharing.
- Inspect redirect host and response headers.
- Verify the response is XLSX bytes rather than HTML.
- If inaccessible, stop and report; do not add OAuth.

## Task 03.3 — Connector design

- Identify the smallest suitable location in the existing architecture.
- Define source configuration.
- Define typed metadata and error contract.
- Define timeout and download-size limits.
- Define final redirect validation.
- Present the plan before implementation.

## Task 03.4 — Implement public export connector

- Build the export URL from the fixed spreadsheet ID.
- Fetch on the server with `cache: 'no-store'`.
- Apply timeout.
- Follow and validate redirects.
- Validate status and content type.
- Stream with byte-size guard.
- Verify ZIP signature.
- Generate metadata and optional SHA-256.
- Return typed bytes/metadata.
- Keep errors safe and actionable.

## Task 03.5 — Integrate Phase 02 parser

- Reuse the actual Phase 02 server-only parser.
- Add one narrow source-to-dataset composition function.
- Preserve normalized data and diagnostics.
- Do not add caching or route handlers.
- If Phase 02 is not ready, leave this task BLOCKED and explain the exact prerequisite.

## Task 03.6 — Automated tests

- Add deterministic mocked fetch tests.
- Add invalid response/error tests.
- Add parser composition tests if possible.
- Ensure no automated test uses external network.

## Task 03.7 — Verification and security review

- Run lint, format check, type check, tests, and build when appropriate.
- Inspect the production client bundle/import graph for accidental connector/parser leakage where tooling permits.
- Review logs/errors for credential, URL, HTML, and binary leakage.
- Confirm no dependency/lockfile changed.

## Task 03.8 — Final report

- Report completed/blocked tasks.
- Provide exact files changed.
- Provide live smoke-test result.
- Provide quality-check outputs.
- Provide Phase 04 readiness and remaining synchronization concerns.

---

# 16. Acceptance Criteria — DRIVE-01 to DRIVE-22

Use PASS, PARTIAL, BLOCKED, or NOT APPLICABLE with evidence.

| ID | Acceptance criterion |
|---|---|
| DRIVE-01 | Repository state and applicable instructions were inspected before editing. |
| DRIVE-02 | Phase 02 implementation readiness and actual parser contract were verified. |
| DRIVE-03 | Exact configured spreadsheet ID matches the user's confirmed workbook. |
| DRIVE-04 | Connector builds the public XLSX export URL internally. |
| DRIVE-05 | Connector uses public anonymous export and does not require OAuth/API keys. |
| DRIVE-06 | Connector does not accept arbitrary user-supplied URLs or IDs. |
| DRIVE-07 | Connector is server-only and uses Node.js runtime where required. |
| DRIVE-08 | Upstream fetch explicitly uses `cache: 'no-store'`. |
| DRIVE-09 | Request timeout is bounded and typed. |
| DRIVE-10 | Redirect destination is validated against evidence-based Google host rules. |
| DRIVE-11 | HTTP status is validated; non-200 responses are rejected safely. |
| DRIVE-12 | Content type is validated and HTML/login pages are rejected. |
| DRIVE-13 | Download size is bounded during streaming, not only by Content-Length. |
| DRIVE-14 | Empty and invalid ZIP/XLSX-signature responses are rejected. |
| DRIVE-15 | Source metadata distinguishes `fetchedAt` from optional HTTP `Last-Modified`. |
| DRIVE-16 | Source metadata does not use the workbook cover sheet's update date. |
| DRIVE-17 | Connector errors use a typed, safe error contract. |
| DRIVE-18 | Phase 02 parser is reused without duplicating mapping/normalization. |
| DRIVE-19 | Structural parser failure cannot be mistaken for a successful empty dataset. |
| DRIVE-20 | Automated tests cover success, redirects, malformed responses, timeout, and size limits without external network. |
| DRIVE-21 | No UI, sync route, cooldown, cache, database, OAuth, new backend, or unapproved dependency was introduced. |
| DRIVE-22 | Quality checks, live smoke-test status, limitations, and next-phase readiness are reported accurately. |

Phase 03 cannot be marked fully complete if the actual public source is inaccessible, the connector does not validate its response, or the Phase 02 integration is falsely claimed complete.

---

# 17. Required Verification

Follow the checked-out repository's `AGENTS.md`. At minimum, run and inspect:

```bash
pnpm lint
pnpm format:check
pnpm type-check
pnpm test
```

Run `pnpm build` because server-only imports and runtime/module boundaries can affect the Next.js build.

Do not run Storybook build unless a story/component was changed (this phase should not add UI).

Report:
- Exact command.
- Exit status.
- Actual concise output.
- Any baseline/environment failure.
- Whether a live source smoke test was run.

Do not suppress warnings or alter Biome rules to obtain a green result.

---

# 18. Final Report Format

At completion, report:

1. **Phase status:** completed, partially completed, or blocked.
2. **Repository snapshot:** branch, commit SHA, working-tree state.
3. **Prerequisite status:** Phase 01 and Phase 02 readiness.
4. **Source access result:** exact public export URL tested (do not include signed redirect URLs), status, MIME type, byte count, redirect host, and smoke-test timestamp.
5. **Connector design:** exact module/file path and responsibilities.
6. **Integration:** actual Phase 02 parser function/type reused.
7. **Error handling:** supported error codes and behavior.
8. **Security review:** server-only, redirect, size, MIME, and no-credential checks.
9. **Files created/modified:** exact paths and purpose.
10. **Dependencies:** confirm no unapproved dependency/lockfile changes.
11. **Tests:** unit/integration test results.
12. **Quality checks:** lint, format, type-check, test, build results.
13. **Acceptance checklist:** DRIVE-01–DRIVE-22 with evidence.
14. **Known limitations:** source access, Phase 02 integration, runtime or deployment concerns.
15. **Next-phase readiness:** identify what remains for initial loading, manual refresh, server-side cooldown, cache strategy, and safe dataset replacement. Do not implement those in Phase 03.

**End of Phase 03 Detailed Specification.**
