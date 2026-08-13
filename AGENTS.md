# AGENTS.md

This repository is MediLens AI, a Next.js 16 medical imaging and health intelligence application.

## Project context
- Stack: Next.js 16, React 19, TypeScript, Tailwind CSS.
- App structure follows the Next.js App Router under `src/app`.
- Reusable UI lives in `src/components`, while data access and mock services live in `src/lib`.
- Keep changes aligned with the current medical dashboard, clinical analysis, and assistant UX patterns.

## Working rules for coding agents
- Read the relevant files before making a change and prefer small, surgical edits.
- Follow existing naming, folder placement, and component conventions in the repo.
- Use TypeScript and keep code typed, readable, and accessible.
- Prefer Tailwind classes and existing patterns instead of introducing ad hoc styling or extra dependencies.
- Preserve the polished healthcare/product tone in user-facing text and UI.
- Validate with the smallest relevant command; for frontend code, `npm run lint` is typically the right check.

## Repo-specific notes
- Source files are organized under `src/app`, `src/components`, `src/lib`, and `src/types`.
- Keep mock API patterns and query-hook usage consistent when editing data access logic.
- Avoid broad refactors unless the task clearly requires them.
- Favor reusable component composition over duplication.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
