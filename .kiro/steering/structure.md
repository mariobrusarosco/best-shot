# Project Structure

## Root Level Organization
```
├── src/                    # Source code
├── docs/                   # Documentation
├── e2e/                    # End-to-end tests
├── public/                 # Static assets
├── dist/                   # Build output (generated)
├── coverage/               # Test coverage reports
├── .kiro/                  # Kiro AI assistant configuration
└── node_modules/           # Dependencies
```

## Source Code Architecture (`src/`)

### Domain-Driven Structure
The application follows a domain-driven design with clear separation of concerns:

```
src/
├── domains/                # Business domains
│   ├── authentication/     # Auth logic and components
│   ├── league/            # League management
│   ├── tournament/        # Tournament features
│   ├── match/             # Match-related functionality
│   ├── guess/             # Prediction/guessing game
│   ├── dashboard/         # User dashboard
│   ├── ui-system/         # Design system components
│   └── global/            # Shared domain components
├── routes/                # TanStack Router route definitions
├── api/                   # API client and schemas
├── configuration/         # App-wide configuration
├── stores/                # Global state management
├── hooks/                 # Shared React hooks
├── utils/                 # Utility functions
├── theming/               # Theme and styling configuration
├── assets/                # Static assets (icons, images)
└── test-utils/            # Testing utilities and helpers
```

## Key Architectural Patterns

### Route Organization
- **Protected Routes**: `_auth.*` prefix for authenticated routes
- **Lazy Loading**: `.lazy.tsx` suffix for code-split routes
- **Route Tree**: Auto-generated via TanStack Router plugin

### Domain Structure
Each domain typically contains:
- `components/` - Domain-specific React components
- `hooks/` - Domain-specific custom hooks
- `types/` - TypeScript type definitions
- `api/` - Domain API calls and schemas
- `utils/` - Domain utility functions

### Import Aliases
- `@/*` - Maps to `src/*`
- `@settings` - Maps to `settings/*`
- `@tabler/icons-react/*` - Direct icon imports

## Configuration Files

### Build & Development
- `vite.config.ts` - Vite build configuration
- `vitest.config.ts` - Test runner configuration
- `playwright.config.ts` - E2E test configuration
- `tsconfig.json` - TypeScript compiler options
- `biome.json` - Code formatting and linting rules

### Environment Files
- `.env` - Local development variables
- `.env.staging` - Staging environment
- `.env.production` - Production environment
- `.env.demo` - Demo/showcase environment

## File Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useUserData.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Types**: PascalCase (e.g., `UserTypes.ts`)
- **Routes**: kebab-case with special prefixes (`_auth.dashboard.tsx`)
- **Tests**: Same as source file with `.test.tsx` or `.spec.ts` suffix

## Documentation Structure (`docs/`)
- `guides/` - Development guides and tutorials
- `adr/` - Architecture Decision Records
- `testing/` - Testing strategies and patterns
- `plans/` - Project planning documents

## Testing Organization
- **Unit Tests**: Co-located with source files (`*.test.tsx`)
- **E2E Tests**: Separate `e2e/` directory
- **Test Utils**: Centralized in `src/test-utils/`
- **Coverage**: Generated in `coverage/` directory