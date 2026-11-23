# Coding rules and dependencies

The dependency inventory below records the Phase 01 baseline. Use [AGENTS.md](../../AGENTS.md), [package.json](../../package.json), and [pnpm-lock.yaml](../../pnpm-lock.yaml) for current rules and versions.

[Repository audit](repository-audit.md) · [Architecture](project-architecture.md) · [Decisions and risks](decisions-and-risks.md) · [Phase map](../implementation/phase-map.md)

## Repository rules

| Area | Rule and evidence |
| --- | --- |
| Runtime and package manager | Use Node 22 (`.nvmrc`, `engines.node >=22`) and pnpm 12.14.0 (`packageManager`). CI installs with the frozen lock. pnpm 12 has a release-age guard, and the workspace declares no override. Builds are gated by `allowBuilds`, where the reviewed watcher, SWC and esbuild entries are all `false`. Keep `@types/node` on major 22. [Runtime pin](../../.nvmrc) · [Manifest](../../package.json) · [Workspace](../../pnpm-workspace.yaml) |
| TypeScript and naming | Strict mode, bundler module resolution and `@/*` → `src/*`. Use `type.ts`, `enum.ts`, `const.ts`, PascalCase app components, `useCamelCase` hooks, lowercase utils and colocated `__tests__`. Feature-local files can follow the examples. Use explicit type imports, avoid debug/commented-out code and justify any `any`. Run typegen before `tsc --noEmit --incremental false` to materialize root params and check translation JSON changes. Preserve the tracked Next TypeScript config if Next rewrites it. [TypeScript](../../tsconfig.json) · [Agent rules](../../AGENTS.md) |
| Biome | Use two spaces, LF, 120 columns, single JS/JSX quotes, JS semicolons and ES5 trailing commas. Next/React recommended domains, restricted translation imports, sorted classes and targeted overrides are in config. Markdown is excluded, so review doc links separately. [Biome](../../biome.json) |
| Rendering and UI | Prefer Server Components. Use client entry points for hooks, effects and browser APIs. Keep pages thin and place page UI in modules. Compose shared wrappers in `src/components`. Add primitives through the instructed shadcn CLI and apply the Biome fixes. Preserve the first-party theme import in Sonner and use `@/lib/utils` for `cn`. Add an adjacent story for each new component. Extract a synchronous presentational view from async server UI for stories. [Agent rules](../../AGENTS.md) · [shadcn config](../../components.json) · [Language switcher](../../src/components/layouts/LanguageSwitcher.tsx) |
| UI strings and navigation | Use the project client hook from `@/hooks` and the server helper directly. Keep the latter out of the barrel. Supply locale in metadata, handlers and Server Actions. Add matching keys and ICU placeholders to every locale and register new namespaces. A future locale also needs `LOCALES`, `LOCALE_LABELS` and `LOCALE_OG`. Use project `Link`, `useRouter` and `usePathname`. Preserve the full-page language switch. [Agent rules](../../AGENTS.md) · [Registry](../../src/messages/index.ts) · [Server hook](../../src/hooks/useTranslationsServer.ts) · [Navigation](../../src/i18n/navigation.ts) |
| API and state | Follow domain `keys.ts`, `requests.ts`, `queries.ts`, `mutations.ts` where applicable, `type.ts`, `index.ts` and matching handlers for BFF paths. Use a domain root key plus list/detail parameters, and invalidate the domain root when a write affects it. Browser requests use the same-origin client and direct upstream requests run on the server. Normalize Axios failures as `IApiError`. Reuse React Query for remote query state when appropriate. Keep local interaction state local and reserve Zustand for genuinely shared state. [Posts](../../src/api/posts) · [Axios](../../src/api/axios.ts) · [Errors](../../src/api/interceptors.ts) · [Stores](../../src/stores) |
| Validation and arithmetic | Use Zod where runtime validation is required, following the validated env boundary. Workbook schema validation is a Phase 02 recommendation. Use `BigNumber` constructed from strings for precision-sensitive arithmetic, with domain-local rounding and explicit validation for division. [Env schema](../../src/constants/env.ts) · [Agent rules](../../AGENTS.md) |
| Testing and SEO | Test pure logic and type contracts in colocated tests. Run the full unconditional gates and the relevant conditional checks from the audit. Generate metadata through `buildMetadata`, register indexable routes and opt operational pages out with `noIndex`. [Vitest](../../vitest.config.mts) · [Translation type tests](../../src/hooks/__tests__/useTranslations.types.test.ts) · [SEO helper](../../src/lib/seo.ts) · [Indexable routes](../../src/constants/routes.ts) |
| Environment and Git | Read app values through `env`. Use public variables only for public values. Keep secrets server-only and do not commit local env files. Make Git history changes only when requested. Use lowercase imperative English Conventional Commits under 100 characters with no trailing period, AI attribution or `Co-Authored-By`. Keep Husky hooks active. [Agent rules](../../AGENTS.md) · [Commitlint](../../commitlint.config.js) · [Husky](../../.husky) |

## Capability inventory

| Classification | Capability and phase |
| --- | --- |
| Already available | Next/React, Tailwind/shadcn primitives and wrappers, Lucide, Framer Motion, next-intl, Zod, React Hook Form, Day.js, and Vitest/Testing Library/Storybook. Day.js handles app date formatting. The native URL API is already used in application code. [Date utility](../../src/utils/date.ts) · [URL state hook](../../src/hooks/useUrlSearchParams.ts) |
| Already available | Axios for JSON API requests, TanStack Query for remote client state and Zustand for shared client state. Phase 03 evaluates native server `fetch` or Axios binary options. Sync owns the server cache/freshness strategy, which is separate from client Query state. |
| Available but needs evaluation | Recharts has a themed responsive chart wrapper and story. Confirm chart scope, browser rendering and accessibility in the UI phase. [Chart wrapper](../../src/components/ui/chart.tsx) · [Chart stories](../../src/components/ui/chart.stories.tsx) |
| Missing | XLSX parsing with actual cell hyperlink extraction. No dedicated parser appears in the manifest, lockfile or app tree. Phase 02 verifies candidate behavior against the fixture and requests explicit approval before adding a package. |
| Missing | Dedicated map renderer/geospatial SDK. No such dependency or feature exists in the audited stack. The UI phase first checks whether the agreed simple map can be delivered within the existing stack using the workbook data. |
| Not needed | A separate backend, database, private Drive authentication solely to read the public workbook, a second UI framework, or another charting library for an unconfirmed need. |

Inspect first → reuse if suitable → propose only if a required capability is missing → obtain explicit user approval → install only after approval. Phase 01 made no dependency, install or lockfile changes.

## Declared and resolved versions

Verified all 59 direct dependencies against the project importer in the second document of `pnpm-lock.yaml` and the installed package manifests. The resolved column omits peer-context qualifiers. The first lock document pins the package manager itself. [Manifest](../../package.json) · [Lockfile](../../pnpm-lock.yaml)

| Package | Kind | Declared | Locked and installed |
| --- | --- | --- | --- |
| `@base-ui/react` | Runtime | `^1.9.0` | `1.9.0` |
| `@bprogress/next` | Runtime | `^3.2.12` | `3.2.12` |
| `@hookform/resolvers` | Runtime | `^6.0.0` | `6.0.0` |
| `@shadcn/react` | Runtime | `^0.3.1` | `0.3.1` |
| `@tailwindcss/postcss` | Runtime | `^4.3.3` | `4.3.3` |
| `@tanstack/react-query` | Runtime | `^5.104.5` | `5.104.5` |
| `auto-zustand-selectors-hook` | Runtime | `^3.0.1` | `3.0.1` |
| `axios` | Runtime | `^1.20.0` | `1.20.0` |
| `bignumber.js` | Runtime | `^11.1.5` | `11.1.5` |
| `class-variance-authority` | Runtime | `^0.7.1` | `0.7.1` |
| `clsx` | Runtime | `^2.1.1` | `2.1.1` |
| `cmdk` | Runtime | `^1.1.1` | `1.1.1` |
| `dayjs` | Runtime | `^1.11.23` | `1.11.23` |
| `embla-carousel-react` | Runtime | `^8.6.0` | `8.6.0` |
| `framer-motion` | Runtime | `14.4.0` | `14.4.0` |
| `input-otp` | Runtime | `^1.5.0` | `1.5.0` |
| `js-cookie` | Runtime | `^3.0.8` | `3.0.8` |
| `lucide-react` | Runtime | `1.60.0` | `1.60.0` |
| `next` | Runtime | `^16.4.2` | `16.4.2` |
| `next-intl` | Runtime | `^4.14.9` | `4.14.9` |
| `radix-ui` | Runtime | `^1.8.1` | `1.8.1` |
| `react` | Runtime | `19.3.1` | `19.3.1` |
| `react-day-picker` | Runtime | `10.0.2` | `10.0.2` |
| `react-dom` | Runtime | `19.3.1` | `19.3.1` |
| `react-hook-form` | Runtime | `^7.90.0` | `7.90.0` |
| `react-resizable-panels` | Runtime | `4.14.7` | `4.14.7` |
| `recharts` | Runtime | `^3.10.1` | `3.10.1` |
| `sharp` | Runtime | `^0.35.5` | `0.35.5` |
| `sonner` | Runtime | `^2.0.8` | `2.0.8` |
| `tailwind-merge` | Runtime | `^3.7.0` | `3.7.0` |
| `tw-animate-css` | Runtime | `^1.4.0` | `1.4.0` |
| `vaul` | Runtime | `^1.1.2` | `1.1.2` |
| `zod` | Runtime | `^4.6.7` | `4.6.7` |
| `zustand` | Runtime | `^5.0.15` | `5.0.15` |
| `@biomejs/biome` | Development | `^2.5.15` | `2.5.15` |
| `@commitlint/cli` | Development | `^21.2.4` | `21.2.4` |
| `@commitlint/config-conventional` | Development | `^21.2.4` | `21.2.4` |
| `@storybook/addon-a11y` | Development | `^10.6.2` | `10.6.2` |
| `@storybook/addon-docs` | Development | `^10.6.2` | `10.6.2` |
| `@storybook/addon-themes` | Development | `^10.6.2` | `10.6.2` |
| `@storybook/nextjs-vite` | Development | `^10.6.2` | `10.6.2` |
| `@tanstack/react-query-devtools` | Development | `^5.104.5` | `5.104.5` |
| `@testing-library/jest-dom` | Development | `^7.0.1` | `7.0.1` |
| `@testing-library/react` | Development | `^16.3.3` | `16.3.3` |
| `@testing-library/user-event` | Development | `^14.6.8` | `14.6.8` |
| `@types/js-cookie` | Development | `^3.0.6` | `3.0.6` |
| `@types/node` | Development | `^22.20.5` | `22.20.5` |
| `@types/react` | Development | `^19.3.0` | `19.3.0` |
| `@types/react-dom` | Development | `^19.3.0` | `19.3.0` |
| `@vitejs/plugin-react` | Development | `^6.1.2` | `6.1.2` |
| `@vitest/coverage-v8` | Development | `^5.0.5` | `5.0.5` |
| `husky` | Development | `^9.1.7` | `9.1.7` |
| `jsdom` | Development | `^30.1.3` | `30.1.3` |
| `lint-staged` | Development | `^17.6.0` | `17.6.0` |
| `postcss` | Development | `^8.5.31` | `8.5.31` |
| `storybook` | Development | `^10.6.2` | `10.6.2` |
| `tailwindcss` | Development | `^4.3.3` | `4.3.3` |
| `typescript` | Development | `^7.0.2` | `7.0.2` |
| `vitest` | Development | `^5.0.5` | `5.0.5` |
