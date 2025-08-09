# Technology Stack

## Core Technologies
- **Language**: TypeScript (strict mode enabled)
- **Framework**: React 18 with React DOM
- **Build Tool**: Vite 5.x
- **Package Manager**: Yarn with Yarn Berry (v4)

## Key Libraries & Frameworks

### UI & Styling
- **Material-UI (MUI)**: v7.2.0 - Primary component library
- **Emotion**: CSS-in-JS styling solution
- **Tabler Icons**: Icon library
- **Motion**: Animation library

### Routing & State Management
- **TanStack Router**: v1.47+ - Type-safe routing
- **TanStack Query**: v5.51+ - Server state management
- **TanStack Store**: Client state management
- **React Hook Form**: Form handling with Zod validation

### Authentication & Monitoring
- **Auth0**: Authentication provider
- **Sentry**: Error monitoring and performance tracking
- **LaunchDarkly**: Feature flag management

### Development & Testing
- **Biome**: Linting and formatting (replaces ESLint/Prettier)
- **Vitest**: Unit testing framework
- **Playwright**: End-to-end testing
- **Testing Library**: React component testing utilities

## Common Commands

### Development
```bash
yarn dev              # Start local development server
yarn dev-demo         # Start with demo environment
yarn dev-prod         # Start with production environment
yarn start            # Start with concurrent API server
```

### Building & Deployment
```bash
yarn build            # Build for production
yarn preview          # Preview production build locally
yarn compile          # Type check without emitting files
```

### Code Quality
```bash
yarn check            # Run Biome checks + TypeScript
yarn check:fix        # Auto-fix Biome issues + type check
yarn lint             # Lint source code
yarn lint:fix         # Auto-fix linting issues
yarn format           # Check code formatting
yarn format:fix       # Auto-fix formatting
yarn typecheck        # Run TypeScript compiler checks
```

### Testing
```bash
yarn test             # Run unit tests with coverage
yarn test:dev         # Run tests in watch mode
```

## Environment Configuration
- **Local**: `.env` - Development with local API
- **Staging**: `.env.staging` - Staging environment
- **Production**: `.env.production` - Production deployment
- **Demo**: `.env.demo` - Demo/showcase environment

## Code Style Standards
- **Indentation**: Tabs (width: 2)
- **Line Width**: 100 characters
- **Quotes**: Double quotes for strings
- **Semicolons**: Always required
- **Trailing Commas**: ES5 style
- **Arrow Functions**: Always use parentheses around parameters