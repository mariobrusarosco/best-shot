# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

*IMPORTANT*

Custom Commands you need to watch:

* "Brace for Compact" - Refer to section "Pre and Post Auto-Compact"
* "Write a Topic" - Refer to section "Create a Garden Topic"

## Pre and Post Auto-Compact
Claude Code CLI auto-compacts conversations due context limitations, it generates a summary that's not the same.
We kind of lose the most crucial converation parts. 

Your job is to: 
1. Summarize the WHOLE conversation 
2. Add the summary as a new entry on the `CLAUDE_COMPACTED_HISTORY.md` 

## Create a Garden Topic
To create a Garnde Topic, you need to access the project named `garden`.
You should have context to it because the engineer must have already added the project via Claude's `/add-dir` command.
Your job is to understand how to create a new topic via .mdx file over there. 
Ask me which part of our work should you focus with. I'll tell you what the name of the topic.
No need to do anything else on that project. 



## Development Commands

**Package Manager**: Use `yarn` for all package management (not npm)

### Core Development
- `yarn dev` - Start development server in local-dev mode
- `yarn dev-demo` - Start development server in demo mode
- `yarn dev-staging` - Start development server in staging mode
- `yarn dev-prod` - Start development server in production mode
- `yarn start` - Start both frontend and backend servers concurrently
- `yarn build` - TypeScript compilation and production build

### Code Quality (Biome.js + TypeScript)
- `yarn lint` - Run Biome linting
- `yarn lint:fix` - Run Biome linting with auto-fix
- `yarn format` - Run Biome formatting
- `yarn format:fix` - Run Biome formatting with auto-fix
- `yarn typecheck` - Run TypeScript type checking only
- `yarn check` - Run both linting/formatting AND TypeScript type checking
- `yarn check:fix` - Auto-fix linting/formatting issues AND run type checking

**IMPORTANT**: Always run `yarn check` before considering any development task complete. This ensures both code quality and TypeScript type safety.

### Testing
- `yarn test` - Run tests with coverage using Vitest
- `yarn test:dev` - Run tests in watch mode

### Package Management
- `yarn add <package>` - Add dependencies
- `yarn add -D <package>` - Add dev dependencies

## Architecture Overview

### Tech Stack
- **Frontend**: React 18 with TypeScript
- **Routing**: TanStack Router with file-based routing
- **State Management**: TanStack Query for server state, React context for app state
- **Styling**: Material-UI v7 with custom theme and styled components
- **Testing**: Vitest with Testing Library and Playwright for E2E
- **Build Tool**: Vite with custom plugins

### Project Structure
The codebase follows a domain-driven structure under `src/domains/`:

- `authentication/` - Auth0 and bypass authentication adapters
- `dashboard/` - Main dashboard with cards and performance metrics
- `tournament/` - Tournament management, standings, and match handling
- `league/` - League creation, customization, and participant management  
- `match/` - Match cards, scoring, and guess functionality
- `member/` - User profile and account management
- `guess/` - Prediction/guessing system with validation
- `ui-system/` - Reusable UI components and design system

### Key Patterns

**Environment-based Configuration**: The app uses environment modes (`local-dev`, `demo`, `staging`, `production`) to switch between Auth0 and bypass authentication via the adapter pattern in `src/domains/authentication/index.ts`.

**Domain Isolation**: Each domain has its own structure:
- `components/` - React components
- `hooks/` - Domain-specific React hooks  
- `server-side/` - API fetchers and mutations
- `typing.ts` - TypeScript interfaces and types

**Routing**: Uses TanStack Router with:
- File-based routing in `src/routes/`
- Auth-protected routes under `_auth/`
- Layout-based nesting for complex pages

**Styling**: Material-UI with custom theme at `src/theming/theme.ts` defining:
- Custom color palette (teal, black, neutral, etc.)
- Typography using Poppins/Montserrat fonts
- Responsive breakpoints (mobile: 768px, tablet: 769px, laptop: 1024px, desktop: 1440px)

**State Management**: 
- TanStack Query for server state with custom configuration
- React Router context for auth state
- No global state management library - uses React patterns

**Import Aliases**:
- Always use absolute imports with aliases like `@domains`, `@components`, etc.

### Form Handling
- **Forms**: React Hook Form with TypeScript integration for form state and validation
- **Components**: Reusable form components in `src/domains/ui-system/components/form/`
  - `AppFormInput` - Text inputs with custom styling and validation
  - `AppFormSelect` - Dropdown selects with options
  - `AppFormCheckbox` - Checkbox inputs with custom styling
  - `AppFormFieldArray` - Dynamic arrays of form fields
  - `AppFormScoreInput` - Sports-specific dual score inputs
- **Validation**: Zod schemas with `@hookform/resolvers/zod` for runtime validation
- **Patterns**: See guides 0005 (React Hook Form) and 0006 (Zod Validation) for implementation details

### Validation
Uses Zod schemas extensively for runtime validation, particularly in tournament and API layers.

### Testing
- Unit tests: Vitest with jsdom environment
- E2E tests: Playwright with tests in `e2e/` directory
- Test setup in `vitest.setup.ts`

### ADR 

- ADRs (Architectural Decision Records) are stored in `docs/adr/` directory, documenting key decisions like:
  - Use of TanStack Router
  - Choice of Material-UI for styling
  - Domain-driven structure

- ADRs are written in Markdown format and start with a unique ID (e.g., `0001-use-tanstack-router.md`).

### Plans
- Plans are stored in `docs/plans/` directory, outlining future features and improvements.
- Each plan is a Markdown file with a unique ID (e.g., `0001-add-league-management.md`).
- Use Decision Matrix to evaluate options.

### Guides
- Guides are stored in `docs/guides/` directory, providing best practices and usage examples
- Guide are made to help other developers understand how to use the codebase effectively.
- Each guide is a Markdown file with a unique ID (e.g., `0001-creating-a-screen.md`).
- Use Decision Matrix to explain when and how to use specific features or components.