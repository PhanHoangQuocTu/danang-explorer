# Cẩm nang Đà Nẵng release runbook

## Candidate

Use the `danang-explorer` Vercel project for the product checkout `PhanHoangQuocTu/danang-explorer`. Confirm the Git connection, production branch, deployment commit, domain ownership and available rollback target in the project dashboard. The baseline deployment observed during the audit was `dpl_9RAcF21RQ1kxyx6H2fn53NMq5S2X`, serving `https://dn-explorer.phanhoangquoctu.io.vn`. Recheck the alias before release.

Verify the Vercel project uses Node 26.x and the pnpm pin from `package.json` (12.23.0). The local, CI, and Docker runtime pin is 26.13.1. Inspect the region, Fluid Compute setting, function memory, maximum duration, and plan. Check that the connector's 30-second deadline plus parse and render time fits that configuration. The audit measured a 10.83 MB deployed function sample in `iad1`. One local smoke request measured a 196,057-byte workbook, 2,115 ms download, 363 ms parse, and 432 listings. Measure again in the candidate runtime.

Review the build-time public environment in each target. Use `NEXT_PUBLIC_APP_ENV=staging` for Preview and `NEXT_PUBLIC_APP_ENV=production` for an indexable production release. Verify `NEXT_PUBLIC_APP_URL=https://dn-explorer.phanhoangquoctu.io.vn` in production. `NEXT_PUBLIC_API_URL` configures the separate Health and posts demo. After a build, check the actual response headers, canonical links, and robots rules on that candidate.

## Local candidate verification

On 2026-11-24, the local production-mode candidate passed frozen install, lint, format, type-check, 197 offline tests, and the production build on Node 26.13.1 and pnpm 12.23.0. The live workbook smoke returned HTTP 200 on Home, Explore, Place Detail, Areas, Area Detail, Trip Ideas, and Insights. The checks also covered Vietnamese and English routes, the branded manifest and images, production robots and sitemap, the liveness probe, and the posts demo through the BFF and rewrite. Unknown routes and an unknown listing ID returned HTTP 404. Filtered Explore retained its base canonical and reported `noindex`.

Chrome passed at 320, 390, 768, and 1440 CSS pixels with the offline workbook fixture. The checks covered the Explore form and Clear All, locale switch with the filtered URL preserved, persisted theme, exact detail link and separate Maps URL, browser Back, 24 results per table page, chart tooltips, keyboard activation, and manual refresh with unchanged, changed, and invalid workbooks. The final browser run recorded no console errors or warnings.

Storybook 10.6.8 built successfully. It emits `DEP0205` on Node 26 because the CLI registers a TypeScript loader through `module.register()`. The Storybook dependency tree still contains the optional TypeScript peer warning from `tsconfck`. The zero-warning release gate remains open.

## Previous local verification

- The local production-mode build used process-scoped test values for `NEXT_PUBLIC_APP_ENV=production` and `NEXT_PUBLIC_APP_URL=https://dn-explorer.phanhoangquoctu.io.vn`. Home and English Insights returned indexable metadata and canonical URLs on the intended domain. The filtered Explore URL retained its base canonical and returned noindex. Production robots and the two Insights sitemap entries matched the expected domain.
- The audited production deployment returned HTTP 200 with `X-Robots-Tag: noindex, nofollow, noarchive` and canonical `http://localhost:3000`. Confirm the effective environment on the next candidate. Preview must retain its non-indexable settings.
- The last complete application suite passed 197 offline tests. Chrome checked the local production build at 320, 390, 768 and 1440 px in Vietnamese and English. It verified one export per refresh, data replacement, source error handling, preserved Explore URL and history, chart tables, keyboard operation and a clean console.
- Storybook exited 0 on Node 22 with a Vite/Rolldown `PLUGIN_TIMINGS` diagnostic. Node 26 also emitted a dependency deprecation warning. The zero-warning gate remains open. Review a tooling fix or explicitly accept the remaining diagnostic before release.
- Top Rated includes records with a valid numeric rating across all normalized statuses. Changes to that policy need a product decision.

## Historical Vercel verification

- The public alias was rechecked on 2026-11-24. Home returned HTTP 200 with `X-Robots-Tag: noindex, nofollow, noarchive` and a localhost canonical. `/en/insights` returned HTTP 404 and `/manifest.webmanifest` still reported the starter name. The new branding and route checks apply to the local candidate. Verify the built Vercel candidate after a separately authorized deployment.
- The audited Vercel project used Next.js, Node 26.x, region `iad1`, and a Git connection to `PhanHoangQuocTu/danang-explorer` with production branch `main`. A push to that branch can trigger a production build.
- Preview `dpl_v5MfUdsXxLp5CUSWARjQQo1xGX91` reached READY with pnpm 12.14.0, Next.js 16.4.6, and the dynamic Insights route. The build warned about an open-ended Node range. The local manifest now targets `26.x`. Verify that the next cloud build uses the current runtime configuration. [Preview](https://danang-explorer-mvlpbe635-phanhoangquoctus-projects.vercel.app)
- Preview redirects anonymous requests to Vercel Authentication. The authenticated runtime smoke test and in-function Google XLSX verification are pending.
- Production-scoped `NEXT_PUBLIC_APP_ENV` and `NEXT_PUBLIC_APP_URL` were added and verified by name and scope. Build-time settings take effect in the next production build.

## Quality and release sequence

1. Run `pnpm lint`, `pnpm format:check`, `pnpm type-check`, `pnpm test`, `pnpm build` and `pnpm build-storybook`. Record exit codes and warnings. Check that travel routes are dynamic and client JavaScript excludes the workbook parser. The repo requires zero errors and warnings.
2. Check Home, Explore, Place Detail, Areas, Trip Ideas and Insights in both locales. Verify search, exact IDs, Back, pagination, source text, Update, charts and Maps actions. Use the offline fixture for repeatable cases. Run a separate controlled live-source smoke test. Compare first request and manual refresh latencies, response size and export count.
3. Obtain separate approval for preview. Deploy the approved candidate through the project workflow. Record URL, deployment ID and commit. Smoke-test both locales, source fetch in the function, Update, console, network and preview robots. Inspect logs for timeouts and source failures. Treat missing previews or unverified runtime settings as release gaps.
4. Before production approval, confirm zero unresolved P0/P1 defects, approved SEO settings, acceptable runtime costs and the agreed level of rate protection. Capture the prior production deployment ID. Promote only after separate production authorization. Verify alias, metadata, robots, dynamic source data and all critical routes after promotion.

## Refresh and protection

The refresh button requests an App Router server render for the current URL. The shared loader performs a fresh XLSX export and parser validation for that request. The 60-second control cooldown is browser-local and best-effort across tabs. Independent browsers and direct requests can initiate work independently. Existing source validation and time/size limits still apply. Render failures use the existing localized source error.

Each dynamic server read can consume an upstream export plus parse and render resources. Estimate production cost using expected page visits and refresh frequency, verified per-request timings and actual project limits. Review WAF availability, quotas, pricing, shared-IP impact, request matching and rollback before adopting a rule. A path-only rule can affect normal requests to the same page. Strict multi-instance rate protection is a separate platform decision. [Vercel rate limiting](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting) · [Vercel usage and pricing](https://vercel.com/docs/vercel-firewall/vercel-waf/usage-and-pricing)

## Rollback and source recovery

If a release breaks the source path, identity, locale or critical navigation, obtain authorization and roll back to the verified previous deployment through Vercel. Confirm the rollback target is permitted by the current plan. Check the production alias, both locales and a representative detail route after the switch. Record the rollback ID and outcome. A config rollback or redeploy may require separate approval. [Vercel rollback](https://vercel.com/docs/deployments/rollback-production-deployment)

Application rollback changes the app deployment. Workbook version recovery belongs to the source owner and their version history. The connector fetches the current public export after either action. During a partial overwrite or access failure, verify the tracker and source independently and retry after the source becomes valid.
