# Contributing

Thank you for helping improve Cẩm nang Đà Nẵng. For a substantial change, open an issue first to discuss its scope and compatibility. Please keep pull requests focused and describe the problem, change, and verification.

## Get started

1. Install the Node.js version in `.nvmrc`. Install Corepack with `npm install --global corepack@0.36.0`, then run `corepack enable`. The pnpm version is pinned in `package.json`.
2. Fork and clone the repository, then run `pnpm install --frozen-lockfile`.
3. Copy `.env.example` to `.env.local` and run `pnpm dev`. Run `pnpm storybook` for component work.
4. Create a branch, make your changes, and add tests or stories where appropriate.

The [README](README.md) describes the architecture, commands, translations, API layer, and deployment setup. [AGENTS.md](AGENTS.md) records the project conventions and verification requirements.

## Verify your changes

Run these commands before opening a pull request:

```bash
pnpm lint
pnpm format:check
pnpm type-check
pnpm test
```

Also run `pnpm build` for route, configuration, metadata, or environment changes, and `pnpm build-storybook` for component or story changes. Check affected UI and its console in both locales. Changes to translations must update every supported locale and preserve matching ICU placeholders. Mock the workbook boundary or use the offline fixture in automated tests.

Commits use the Conventional Commits format described in [commit-message-instructions.md](commit-message-instructions.md). Husky runs the configured hooks on commit. Do not commit secrets or local `.env` files.

## Reporting problems

Use the issue templates for reproducible bugs and feature proposals. Do not include credentials, tokens, private customer data, or undisclosed security vulnerabilities in public issues. If GitHub private vulnerability reporting is enabled, use the repository's Security tab; otherwise ask the maintainers for a private reporting channel without publishing sensitive details.
