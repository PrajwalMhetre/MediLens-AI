# CLAUDE.md

This file stores project-specific guidance for Claude Code. See `AGENTS.md` for the main repo instructions and shared coding rules.

## Scope
- MediLens AI is a medical imaging and health intelligence app built with Next.js 16, React 19, TypeScript, and Tailwind CSS.
- Keep work aligned with the existing App Router structure in `src/app` and the UI patterns in `src/components`.
- Maintain a clinical, polished, explainable product experience.

## Rules
- Read the relevant files before editing.
- Prefer small, targeted changes over broad refactors.
- Use existing libraries and component patterns instead of introducing new dependencies.
- Preserve accessibility, strong typing, and clear maintainability.
- Validate with `npm run lint` for frontend changes when appropriate.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

