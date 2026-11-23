# Repository audit

## Audited snapshot

Verified on **2026-11-23 17:27:22 ICT (UTC+07:00)**. The local product checkout is `PhanHoangQuocTu/danang-explorer`, on branch `main` tracking `origin/main`, commit `c5d73bd2a57e5e941ac850bb0d5268387f3f1dd6`. GitHub reported `main` as the default branch for both repositories. The named upstream boilerplate's audited `main` was `49d111f12cf8a1356f1d085cd47b7793f77ba9ef`. Those commits have the identical tree `b1d8ce95c0a28226a985e159bf1719cb83922d03`, so the 301 tracked paths in the local checkout supplied the source evidence for the upstream snapshot. [Product repository](https://github.com/PhanHoangQuocTu/danang-explorer) · [Audited upstream commit](https://github.com/PhanHoangQuocTu/nextjs-frontend-boilerplate/commit/49d111f12cf8a1356f1d085cd47b7793f77ba9ef)

Initial Git status showed no staged or modified tracked files and pre-existing untracked `.agents/`, `.codex/` and `docs/`. The only existing project doc under `docs/` was the Phase 01 specification. Root [AGENTS.md](../../AGENTS.md) governs the code and quality gates. [CLAUDE.md](../../CLAUDE.md) imports it and adds Claude-specific planning, search and UI verification guidance. The nested instruction search found no applicable `AGENTS.md`, `AGENTS.override.md` or `CLAUDE.md` below those roots. The [Claude search role](../../.claude/agents/search.md) is a read-only helper. The user-supplied RTK instruction requires the RTK command prefix.

Verified findings below are grounded in source and configuration. Proposed extension points are in the [architecture map](project-architecture.md). Workbook contents, live upstream data and deployment project settings remain unverified.

## Stack and repository tree

Node 22 is the repository pin, with manifest engine `>=22`. pnpm is pinned to 12.14.0, and the v9.0 multi-document lock records both the engine and workspace dependency graph. Verified core resolutions include Next 16.4.2, React and React DOM 19.3.1, TypeScript 7.0.2, Tailwind 4.3.3, next-intl 4.14.9, TanStack Query 5.104.5, Zustand 5.0.15, Axios 1.20.0, Zod 4.6.7, Recharts 3.10.1, Vitest 5.0.5, Storybook 10.6.2 and Biome 2.5.15. The [dependency inventory](coding-rules-and-dependencies.md#declared-and-resolved-versions) gives declared ranges and all direct resolutions. [Manifest](../../package.json) · [Lockfile](../../pnpm-lock.yaml) · [Workspace policy](../../pnpm-workspace.yaml)

| Location | Verified responsibility |
| --- | --- |
| [`src/app`](../../src/app) | Locale layout, home, Health, catch-all and error/not-found files. API Health and Posts, manifest, robots, sitemap, icons and social images live at the app root outside the locale segment. |
| [`src/modules`](../../src/modules) | Health is the only page-level module and demonstrates server composition and client query cards. |
| [`src/components`](../../src/components) | `ui` contains generated primitives and colocated stories. `common`, `form-field`, `layouts`, `providers`, `seo` and `utilities` cover application wrappers and shared behavior. |
| [`src/api`](../../src/api) | Axios configuration, interceptors and Health/Posts domains. |
| [`src/constants`](../../src/constants) · [`src/enums`](../../src/enums) · [`src/types`](../../src/types) | Environment, routes and shared constants, enums and types. |
| [`src/hooks`](../../src/hooks) · [`src/i18n`](../../src/i18n) · [`src/messages`](../../src/messages) | Hooks, locale routing/request/navigation and typed message registry. |
| [`src/lib`](../../src/lib) · [`src/utils`](../../src/utils) · [`src/stores`](../../src/stores) | Shared SEO, cookie, theme, validation and formatting helpers, plus session and modal stores. |
| [`src/styles`](../../src/styles) · [`src/config`](../../src/config) · [`src/assets/fonts`](../../src/assets/fonts) · [`public`](../../public) | Global theme CSS, site/font config, bundled Geist fonts and placeholder-only public assets. |
| [`tests`](../../tests) · [`.storybook`](../../.storybook) | Vitest setup and Storybook configuration. Actual tests are colocated in source. Package scripts are in the manifest. |
| [GitHub CI](../../.github/workflows/ci.yml) · [GitLab CI](../../.gitlab-ci.yml) · [Docker](../../docker) · [Compose](../../docker-compose.yml) · [Husky](../../.husky) | Quality automation, image builds, local deployment templates and Git hooks. |

## Scripts and quality gates

| Script | Actual command |
| --- | --- |
| `dev`, `build`, `start` | `next dev`, `next build`, `next start` |
| `lint`, `lint:fix` | `biome lint .`, `biome lint . --write` |
| `format:check`, `format:fix` | `biome format .`, `biome format . --write` |
| `type-check` | `next typegen && tsc --noEmit --incremental false` |
| `test`, `test:watch`, `test:coverage` | `vitest run`, `vitest`, `vitest run --coverage` |
| `check` | `pnpm lint && pnpm type-check && pnpm test` |
| `storybook`, `build-storybook` | `storybook dev -p 6006`, `storybook build` |
| `postinstall` | `husky` |

Run lint, format, type-check and tests for every change. Build for routes, config, metadata or env changes, build Storybook for component or story changes, and check the affected UI and browser console for UI changes. The combined `check` script omits format. Husky pre-commit runs lint-staged, which invokes the Biome fix scripts on applicable files, and commit-msg runs commitlint. [Manifest](../../package.json) · [Agent rules](../../AGENTS.md) · [Pre-commit](../../.husky/pre-commit) · [Commit-msg](../../.husky/commit-msg)

Vitest uses the React Vite plugin, jsdom, globals, the `@` alias, CSS disabled and `src/**/*.{test,spec}.{ts,tsx}`. Setup adds jest-dom and calls Testing Library cleanup between tests. V8 coverage includes source TS/TSX with generated UI, stories, declarations, app and messages excluded. Tests mock framework boundaries with `vi.mock` where needed and cover message parity and type contracts. Storybook uses Next.js/Vite with docs, a11y and theme addons, plus an app-style locale/Query/tooltip decorator. The preview enables autodocs and sets a11y tests to `todo`. [Vitest config](../../vitest.config.mts) · [Setup](../../tests/setup.ts) · [Request tests](../../src/i18n/__tests__/request.test.ts) · [Storybook](../../.storybook)

GitHub Actions runs on main pushes and PRs with Node from `.nvmrc`, frozen install, lint, format, types, coverage, production app build, Storybook and a dependent Docker image build with pushing disabled. GitLab uses Node 22 Alpine and frozen install, runs the same quality/build checks with example env for the app build, and configures a Kaniko registry push on the default branch and tags. Docker performs a frozen install with scripts disabled, builds a standalone Next artifact in stages, runs as non-root and health checks `/api/health`. Compose runs behind nginx on 8080 with static asset caching. [GitHub CI](../../.github/workflows/ci.yml) · [GitLab CI](../../.gitlab-ci.yml) · [Dockerfile](../../docker/Dockerfile) · [nginx](../../docker/nginx/nginx.conf)

## Configuration, security and deployment

- The three public inputs are `NEXT_PUBLIC_APP_ENV` (development/staging/production, defaults to development), `NEXT_PUBLIC_APP_URL` (defaults to localhost:3000) and `NEXT_PUBLIC_API_URL` (defaults to JSONPlaceholder). Zod validates the environment enum and treats URLs as strings, with blank values defaulted and trailing slashes stripped by preprocessing. Supply valid absolute URLs. Next injects public package `APP_VERSION` at build time. These public values can reach browser bundles. Keep secrets and private data server-only. [Env example](../../.env.example) · [Schema](../../src/constants/env.ts) · [Next config](../../next.config.ts)
- Next enables strict mode, standalone output, compression and global not-found, disables the powered-by header, and configures next-intl. Headers include nosniff, SAMEORIGIN, strict-origin-when-cross-origin and disabled camera, microphone and geolocation. Non-production adds `X-Robots-Tag`, robots disallow rules and metadata noindex. Images accept any HTTPS host today. The demo rewrite forwards `/proxy/*` to the public upstream origin. [Next config](../../next.config.ts) · [Robots](../../src/app/robots.ts) · [SEO](../../src/lib/seo.ts)
- Session persistence is a browser-readable js-cookie example with seven-day lifetime, `SameSite=Lax`, root path and Secure in production Node mode. Refresh is opt-in and the proxy auth guard is commented out. Treat the session example as scaffolding. [Session store](../../src/stores/sessionStore.ts) · [Cookie adapter](../../src/lib/cookie-storage.ts) · [Locale proxy](../../src/proxy.ts)
- **Inferred:** App Router Server Components and Route Handlers provide a plausible Vercel deployment shape. The tracked tree has no `vercel.json` or Vercel deploy workflow. Inspected application handlers leave runtime and duration at framework defaults. Docker config demonstrates a separate way to run the boilerplate. Vercel deployment, project plan, region, Fluid Compute, function settings and cache behavior remain unverified. The connector and sync phases must measure workbook size, expansion, execution time, memory and serialized response size against the chosen plan. Current platform guidance distinguishes request limits, including an opt-in beta, from the 4.5 MB response body limit. Server-to-Drive fetching is a separate path from an inbound upload. [Vercel functions configuration](https://vercel.com/docs/functions/configuring-functions) · [Response payload limit](https://vercel.com/docs/errors/function_response_payload_too_large) · [Inbound payload limit](https://vercel.com/docs/errors/function_payload_too_large)

## Baseline verification

The default shell had Node 26.13.0 and pnpm 12.16.1, whose automatic pin resolution hit a read-only store. The checks used existing Node **22.22.3** and cached pnpm **12.14.0** via PATH. Installed dependencies were already available.

| Command | Exit | Observed result |
| --- | --- | --- |
| `pnpm lint` | 0 | 276 files checked, no diagnostics. |
| `pnpm format:check` | 1 | Three files in pre-existing untracked `.agents/skills/ui-ux-pro-max/data/` failed formatting: `data-provenance.json`, `google-font-licenses.json` and `phosphor-icons-upstream.json`. |
| `pnpm type-check` | 1 | `next typegen` stopped in SWC native binding setup with `ERR_SWC_NATIVE_CACHE`. Default and temporary cache locations were rejected by cache permission validation. `tsc` never ran. |
| `pnpm test` | 0 | 16 test files and 56 tests passed. |

The baseline ran before any deliverable edits. Build, Storybook build and browser checks were outside the conditional gates for this Markdown-only change. GitHub was used to establish repository identity and tree equivalence. CodeGraph and direct file inspection established code and configuration evidence.
