# Best Shot - Project Context for Gemini

## Project Overview

**Best Shot** is a football application built with React and TypeScript. It simulates a real-world application to validate frontend patterns, tools, and frameworks. It is designed with a Domain-Driven Design (DDD) approach and uses modern tooling for a robust development experience.

**Key Goals:**

- Validate frontend architecture and patterns.
- Serve as a portfolio piece demonstrating advanced frontend skills.
- Simulate a production-grade application environment (Staging, Demo, Production).

### Core Mandates

1 - **Strict Scope Adherence:** Do not fix unrelated bugs, refactor code, or change naming conventions outside the explicit scope of the user's request, even if you find errors. If you
discover critical issues that block the requested task, report them to the user and ask for permission before proceeding
2 - **Strict Scope Adherence:** Focus exclusively on the user's request. Do not fix unrelated bugs, refactor code, or change naming conventions unless explicitly asked. If a deviation
adds significant value or is critical, ask for permission first.
3 - **Think Before You Act:** DO NOT RUSH. Analyze the request, reason through the solution, and plan your steps. If a request is vague, ask for clarification. Only proceed with
implementation when the path is clear and agreed upon.
4 - **Verify Assumptions:** Never guess APIs or library functionality. Always read documentation or search for examples before writing code. "Sloppy solutions" based on assumptions are
strictly forbidden.
5 - **Context Awareness:** Understand the project's existing architecture and conventions before making changes. Your goal is to provide high-quality, integrated code that respects the
current codebase.

#### Planner Mode

- Breakdown the feature into Phases and provide a clear plan of action.
- Breakdown Phases into small tasks and provide a clear plan of action.
- Consider break tasks into subtasks.
- Create a `.md` file for the plan. Store in the `/docs/plans` folder.
- Fprmat

```
# Phase 1

## Goal

## Tasks

### Task 1 - lorem ipsum dolor sit amet []
#### Task 1.1 - lorem ipsum dolor sit amet []
#### Task 1.2 - lorem ipsum dolor sit amet []

...


## Dependencies

## Expected Result

## Next Steps

```

- Once you finish a task, ask user to review your work.
- Wait for user's confirmation before proceeding to the next task.
- Be patient and don't rush into fixes and implementations.
- Be ready to do fixes.
- Once confirmed by the user, mark the current sub-task or task as done.
- If you need to do a fix, mark the current sub-task or task as in progress.

## Tech Stack & Architecture

### Core Technologies

- **Language:** TypeScript
- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** TanStack Router (File-based routing)
- **State Management:**
  - **Server State:** TanStack Query (`@tanstack/react-query`)
  - **UI/Global State:** `@tanstack/store` (e.g., `src/stores/ui-store.ts` for UI preferences) & React Context
- **Styling:** Material-UI (MUI) v7, Emotion, Framer Motion
- **Icons:** Tabler Icons
- **Forms:** React Hook Form + Zod (Validation)
- **Feature Flags:** LaunchDarkly

### Architecture Pattern

The project follows a **Domain-Driven Design (DDD)** structure located in `src/domains/`. Each domain is isolated and typically contains:

- `components/`: Domain-specific UI components.
- `hooks/`: Custom hooks for logic.
- `server-side/`: API interactions (Queries/Mutations).
- `schemas.ts` / `typing.ts`: Domain specific types and Zod schemas.

**Key Domains:**

- `authentication`: Auth0 integration and adapters.
- `dashboard`: Main user dashboard.
- `tournament`: Tournament logic and management.
- `league`: League management.
- `match`: Match scoring and details.
- `ui-system`: Reusable design system and theme configuration.

### Directory Structure

- `src/domains/`: Core business logic and domain features.
- `src/routes/`: File-based routing definitions (TanStack Router).
- `src/api/`: Shared API utilities and schema definitions.
- `src/stores/`: Global UI state stores.
- `src/configuration/`: App-wide config (QueryClient, Monitoring, Feature Flags).
- `docs/`: Extensive documentation (ADRs, Guides, Plans).
- `e2e/`: Playwright end-to-end tests.

## Development Workflow

### Package Management

Use **Yarn** (v3+ via Berry) for dependency management.

### Key Commands

| Command                | Description                                        |
| :--------------------- | :------------------------------------------------- |
| `yarn dev`             | Start local development server.                    |
| `yarn dev-demo`        | Start dev server in Demo mode.                     |
| `yarn build`           | Production build (TSC + Vite).                     |
| `yarn test`            | Run unit tests (Vitest).                           |
| `yarn check`           | Run Biome linting/formatting AND TypeScript check. |
| `yarn format:fix`      | Auto-format code using Biome.                      |
| `yarn generate-routes` | Generate TanStack Router route tree.               |

### Testing Strategy

- **Unit/Integration:** Vitest + React Testing Library + JSDOM.
- **E2E:** Playwright (located in `e2e/`).

### Code Quality

- **Linter/Formatter:** Biome (`biome.json`).
- **Type Safety:** Strict TypeScript configuration.
- **Validation:** Zod is used extensively for runtime validation (API responses, Forms).

## Conventions & Standards

1.  **Imports:** Use absolute path aliases (e.g., `@domains/...`, `@components/...`) where configured.
2.  **Styling:**
    - Use MUI `styled` components.
    - Avoid `theme.unstable_sx` (Refactoring target).
    - Use the custom theme defined in `src/domains/ui-system/theme`.
3.  **Routing:**
    - Create new routes in `src/routes/`.
    - Use `__root.tsx` for global layouts.
    - Use `_auth` prefix for protected routes.
4.  **Forms:**
    - Use `React Hook Form` for all form state.
    - Use `Zod` for schema validation.
    - distinct "UI" components for inputs in `ui-system/components/form`.
5.  **Environment:**
    - The app supports multiple modes: `local-dev`, `demo`, `staging`, `production`.
    - Authentication logic switches based on these modes (Auth0 vs Bypass).

## Documentation Resources

Refer to the `docs/` directory for detailed specific guides:

- `docs/guides/`: How-to guides for specific patterns (Forms, Zod, Biome).
- `docs/adr/`: Architectural Decision Records.
- `docs/fixing-log/`: Logs of complex bug fixes.
