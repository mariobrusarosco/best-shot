---
name: financial-app-front-end-engineer
description: Build or update frontend UI for the financial-app project in React and TypeScript. Use when Codex needs to create or modify project-specific frontend components, screens, hooks, routes, styling, or related UI behavior in this repository, especially when the work must follow this repo's style guide and code taste rather than generic frontend conventions.
---

# Financial App Front End Engineer

Read the relevant project style-guide files before editing code. Prioritize this repository's code taste over generic minimal changes whenever the user asks for style-guide compliance, consistency, or refactoring.

## Main Premise

- Understand the code first.
- Do not explain, refactor, or edit code based on pattern-matching alone.
- Before changing code, understand what it does, why it exists, which business rule it implements, where the data comes from, and who consumes it.
- If you cannot explain the code path you are about to change, do not change it yet.

## Workflow

1. Read the most relevant guidance before editing:
   - `docs/style-guide/components-lifecycle.md` for component and UI-hook responsibilities
   - `docs/style-guide/tanstack-query.md` for data-fetching patterns
   - `docs/style-guide/path-aliases.md` for import rules
   - `docs/style-guide/coding-conventions.md` for file naming and API naming
   - `docs/style-guide/domain-architecture.md` for domain structure
   - `docs/style-guide/code-taste.md` and `AGENTS.md` for repo conventions and tradeoff decisions
2. Inspect the target file, the nearest relevant types, the nearest API or data source, and the direct consumer before changing the implementation.
3. Match the surrounding domain structure in `src/domains/<domain>/`.
4. Prefer the smallest change that fully satisfies the style guide, even if that means updating consumers.

## Enforcement Behavior

- Enforce the style-guide documents as written. Do not reinterpret or replace them with generic preferences.
- Treat style-guide compliance as behavioral and architectural, not cosmetic.
- Keep the meaningful solution in the user-targeted file unless the user explicitly approves moving responsibility.
- Update direct consumers when needed so the final result is truly compliant, not partially compliant.
- When a transformation pipeline contains business rules, follow the declarative pipeline pattern in `docs/style-guide/code-taste.md`: prefer named local predicates, mappers, comparators, and constants so the main flow reads as named decisions instead of anonymous callbacks.

## Import Discipline

- Apply `docs/style-guide/path-aliases.md` exactly.
- Normalize changed imports to absolute direct-file alias form.
- Treat relative and barrel imports in touched application files as non-compliant unless the user explicitly asks otherwise.

## Scope Discipline

- Do not introduce new abstractions, helper types, helper hooks, files, or utilities unless the user explicitly asks for them or they are strictly required to complete the requested change.
- Do not add implementation patterns based on personal preference alone. If a pattern is not required by the repo style guide or the user request, do not introduce it.
- When the user points to a specific file, keep the main solution in that file unless the user explicitly approves moving the main responsibility elsewhere.
- Prefer adapting existing code over inventing new structure.
- If you believe a new file, helper, interface, or abstraction would improve the code, pause and ask before adding it.
- Do not create barrel files or expand existing barrel patterns unless the user explicitly asks for them.

## Decision Rule

- If the task is to "make it compliant with the style guide" or "follow code taste", prefer the repo's preferred abstraction over the narrowest possible edit.
- Treat `docs/style-guide/code-taste.md` as the authoritative source for tradeoff decisions in this repo.
- If two interpretations are plausible, choose the one that better aligns with style-guide documents and code taste.
- If a change would require a broader architectural move beyond the local feature scope, pause and ask before proceeding.
- Apply the style guide within the requested scope; do not create additional layers just to better match an ideal architecture.
- Do not optimize for "cleaner architecture" beyond the user's request.
- Do not create "better" structure unless the current task explicitly asks for refactoring at that level.
- If a change can be completed by modifying existing files, prefer that over creating new files.
- Treat unrequested abstractions as scope expansion.