# Guide 0007: CI/CD and Deployment

## Overview

This guide explains the CI/CD pipeline and deployment strategy for the Best Shot application. The project uses GitHub Actions for CI/CD with AWS infrastructure for hosting.

## Architecture Summary

- **CI/CD Platform**: GitHub Actions
- **Hosting**: AWS S3 + CloudFront CDN
- **Build Tool**: Vite
- **Environments**: Demo, Staging, Production

## GitHub Actions Workflows

### Main Workflow (.github/workflows/main.yaml)

The primary deployment workflow handles three environments:

#### 1. Demo Environment

- **Trigger**: Push to `main` branch
- **Environment**: `demo`
- **Build Mode**: `yarn build --mode demo`
- **Deployment**: AWS S3 + CloudFront invalidation

#### 2. Staging Environment

- **Trigger**: Push to `staging` branch
- **Environment**: `staging`
- **Build Mode**: `yarn build --mode staging`
- **Deployment**: AWS S3 + CloudFront invalidation

#### 3. Production Environment

- **Trigger**: Push to `main` branch
- **Environment**: `production`
- **Build Mode**: `yarn build --mode production`
- **Deployment**: AWS S3 + CloudFront invalidation

### PR Validation Workflow (.github/workflows/pr-validation.yml)

- **Trigger**: Pull requests and pushes to `main` and `staging` branches
- **Purpose**: Validates code quality and build integrity before deployment
- **Steps**:
  - Runs `yarn check` (Biome linting + TypeScript validation)
  - Tests build
  - Prevents merging if validation fails

### E2E Testing Workflow (.github/workflows/playwright.yml)

- **Trigger**:
  - Scheduled daily at 2:00 AM UTC via cron
  - Manual dispatch with environment selection (staging/production)
- **Purpose**: Runs Playwright end-to-end tests against live environments
- **Environments**: Configurable (staging by default, production optional)
- **Artifacts**:
  - Test reports stored for 30 days
  - Test videos on failure stored for 7 days
- **Features**:
  - Dependency caching for faster runs
  - Environment-specific base URLs
  - Manual trigger capability for on-demand testing

## AWS Infrastructure

### Components

- **S3 Bucket**: Static website hosting (not a server-based deployment)
- **CloudFront**: CDN for global content delivery
- **Route 53**: DNS management (mentioned in README)

### Important Note: Static Site Deployment

This is a **static site deployment** - the application is built into static files and served from S3/CloudFront. Environment variables are **build-time only** and get compiled into the JavaScript bundles during the GitHub Actions build process. They are not runtime environment variables on a server.

### Required Secrets

The following GitHub repository secrets must be configured:

```
AWS_ACCESS_KEY_ID              # AWS access key
AWS_SECRET_ACCESS_KEY          # AWS secret key
AWS_BUCKET_ID                  # S3 bucket name
AWS_CLOUDFRONT_ID              # CloudFront distribution ID
SLACK_DEPLOYMENTS_WEBHOOK      # Slack webhook URL for deployment notifications
```

**To configure these secrets:**

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with its corresponding value

**Note:** The `SLACK_DEPLOYMENTS_WEBHOOK` is required for deployment notifications. See the [Slack Deployment Notifications Guide](./slack-deployment-notifications.md) for setup instructions.

## Environment Variables and Configuration

### Environment Files Structure

The project uses Vite's environment variable system with separate `.env` files for each environment:

```
.env                    # Local development (default)
.env.demo              # Demo environment
.env.staging           # Staging environment
.env.production        # Production environment
```

### Required Environment Variables

#### Core API Configuration

- `VITE_BEST_SHOT_API`: Backend API v1 endpoint
- `VITE_BEST_SHOT_API_V2`: Backend API v2 endpoint

#### Authentication (Auth0)

- `VITE_AUTH_DOMAIN`: Auth0 domain
- `VITE_AUTH_CLIENT_ID`: Auth0 application client ID

#### Feature Flags & Analytics

- `VITE_LAUNCHDARKLY_CLIENT_KEY`: LaunchDarkly client SDK key
- `VITE_DEMO_VERSION`: Boolean flag for demo mode features
- `VITE_MOCKED_MEMBER_PUBLIC_ID`: User ID for testing/demo purposes

#### Development Tools

- `SENTRY_AUTH_TOKEN`: Sentry authentication token (build-time only)

### Environment-Specific Configuration

#### Local Development (.env)

```bash
VITE_AUTH_DOMAIN="<your-auth0-domain>"
VITE_AUTH_CLIENT_ID="<your-auth0-client-id>"
VITE_BEST_SHOT_API="http://localhost:9090/api/v1"
VITE_BEST_SHOT_API_V2="http://localhost:9090/api/v2"
VITE_MOCKED_MEMBER_PUBLIC_ID="<local-test-user-id>"
VITE_LAUNCHDARKLY_CLIENT_KEY="<your-launchdarkly-client-key>"
```

**Note:** See `.env.example` for a template with placeholder values.

#### Demo Environment (.env.demo)

```bash
VITE_AUTH_DOMAIN="<your-auth0-domain>"
VITE_AUTH_CLIENT_ID="<your-auth0-client-id>"
VITE_BEST_SHOT_API="https://api-best-shot-demo.mariobrusarosco.com/api/v1"
VITE_BEST_SHOT_API_V2="https://api-best-shot-demo.mariobrusarosco.com/api/v2"
VITE_MOCKED_MEMBER_PUBLIC_ID="<demo-test-user-id>"
VITE_DEMO_VERSION=true
VITE_LAUNCHDARKLY_CLIENT_KEY="<your-launchdarkly-demo-key>"
```

**Note:** See `.env.demo.example` for a template with placeholder values.

#### Staging Environment (.env.staging)

```bash
VITE_AUTH_DOMAIN="<your-auth0-domain>"
VITE_AUTH_CLIENT_ID="<your-auth0-client-id>"
VITE_BEST_SHOT_API="https://api-best-shot-staging.mariobrusarosco.com/api/v1"
VITE_BEST_SHOT_API_V2="https://api-best-shot-staging.mariobrusarosco.com/api/v2"
VITE_MOCKED_MEMBER_PUBLIC_ID="<staging-test-user-id>"
VITE_LAUNCHDARKLY_CLIENT_KEY="<your-launchdarkly-staging-key>"
```

**Note:** See `.env.staging.example` for a template with placeholder values.

#### Production Environment (.env.production)

```bash
VITE_AUTH_DOMAIN="<your-auth0-domain>"
VITE_AUTH_CLIENT_ID="<your-auth0-client-id>"
VITE_BEST_SHOT_API="https://api.bestshot.app/api/v1"
VITE_BEST_SHOT_API_V2="https://api.bestshot.app/api/v2"
VITE_LAUNCHDARKLY_CLIENT_KEY="<your-launchdarkly-production-key>"
```

**Note:** See `.env.production.example` for a template with placeholder values.

### Environment Access in Code

Environment variables are accessed via `import.meta.env`:

```typescript
// Get current environment mode
const APP_MODE = import.meta.env.MODE as APP_MODES;

// Access environment variables
const apiUrl = import.meta.env.VITE_BEST_SHOT_API;
const authDomain = import.meta.env.VITE_AUTH_DOMAIN;
```

### Setting Up New Environments

1. Create new `.env.[environment]` file
2. Configure all required `VITE_*` variables
3. Update build scripts in `package.json` if needed
4. Add corresponding GitHub Actions job if automated deployment is required
5. Configure AWS secrets for new environment

## Deployment Process

### Automatic Deployment

1. Developer pushes code to target branch (`main` for demo/production, `staging` for staging)
2. GitHub Actions workflow triggers
3. Dependencies are installed with yarn cache optimization
4. Application builds for target environment
5. Build artifacts sync to S3 bucket
6. CloudFront cache invalidation ensures fresh content

### Manual Deployment Commands

For local testing of deployment process:

```bash
# Build for specific environment
yarn build --mode demo
yarn build --mode staging
yarn build --mode production

# Preview build locally
yarn preview
```

## Branch Strategy

- **`main`**: Deploys to both demo and production environments
- **`staging`**: Deploys to staging environment
- **Feature branches**: No automated testing or deployment

## Development Workflow

1. **Feature Development**: Work on feature branches
2. **Pull Request**: Create PR to `staging` or `main` branch
   - Triggers automatic validation (code quality + build tests)
   - PR can only be merged if all validations pass
3. **Staging**: Merge to `staging` branch for staging deployment
   - Runs validation checks before deployment
   - Deploys to staging environment if all checks pass
4. **Production**: Merge to `main` branch for production deployment
   - Runs validation checks before deployment
   - Deploys to demo and production environments if all checks pass
5. **E2E Testing**: Automated daily tests run against live environments via scheduled workflow

### E2E Testing Strategy

E2E tests are **decoupled from the CI/CD pipeline** and run on a separate schedule:

- **Scheduled Runs**: Daily at 2:00 AM UTC against staging environment
- **Manual Runs**: Can be triggered manually via GitHub Actions UI with environment selection
- **Environment Testing**: Tests run against live deployed environments (not during build process)
- **Failure Handling**: Test failures don't block deployments but provide monitoring feedback

## Build Validation Strategy

The project implements a **fail-fast** approach to prevent TypeScript errors and code quality issues from reaching production:

### Pre-Deployment Validation

- **All deployment workflows** run `yarn check` before building
- **`yarn check`** combines Biome linting + TypeScript type checking
- **Deployment fails** if any validation errors are found

### Pull Request Validation

- **PR Validation workflow** runs on all PRs to `main` and `staging`
- **Tests builds** for all environments (demo, staging, production)
- **Prevents merging** if code doesn't build successfully
- **Catches issues early** before they reach deployment branches

### Local Pre-Commit Hooks

- **Husky + lint-staged**: Automatically runs quality checks before commits
- **Cross-platform compatibility**: Simple shell scripts work across Windows/Mac/Linux
- **Staged file processing**: Only checks files being committed (faster execution)
- **Auto-fixing**: Automatically fixes formatting and linting issues when possible
- **Test exclusion**: Configured to skip `.test` and `.spec` files via biome.json

### Benefits

- **No broken builds in production**: TypeScript errors caught before deployment
- **Code quality enforcement**: Biome linting prevents style/quality issues
- **Multi-environment testing**: Ensures code works across all build modes
- **Fast feedback**: Developers get immediate feedback on PRs and commits
- **Consistent formatting**: Pre-commit hooks ensure consistent code style

## Developer Setup

### First-Time Setup

When cloning the repository, developers need to install dependencies to enable pre-commit hooks:

```bash
# Install dependencies (this automatically sets up Husky hooks)
yarn install

# Verify hooks are installed
ls .husky/
```

### Working with Pre-Commit Hooks

Pre-commit hooks run automatically on `git commit` and will:

1. Run `yarn check:fix` on staged TypeScript/JavaScript files
2. Run `yarn format:fix` on staged JSON/Markdown files
3. Prevent commit if TypeScript errors are found
4. Auto-fix formatting issues when possible

### Bypassing Hooks (When Necessary)

```bash
# Skip pre-commit hooks for emergency commits
git commit --no-verify -m "emergency fix"

# Temporarily disable hooks for bulk operations
HUSKY=0 git commit -m "bulk update"
```

### Troubleshooting

- **Hooks not running**: Ensure you ran `yarn install` after cloning
- **Permission issues**: Run `chmod +x .husky/pre-commit` if needed
- **CI failing but local passing**: Make sure to run `yarn check` locally before pushing

For detailed information about code quality tools and configuration, see [Guide 0008: Code Quality and Validation](./0008-code-quality-validation.md).

## Monitoring and Debugging

### Build Artifacts

- Source maps are enabled in production builds
- Playwright test reports are stored as GitHub artifacts

### Cache Strategy

- Yarn dependencies are cached between builds
- CloudFront CDN provides global caching

### Performance Optimizations

- Tree shaking enabled via esbuild
- Bundle analysis available via rollup-plugin-visualizer (commented out)
- Sentry integration available (commented out)

## Security Considerations

- AWS credentials stored as GitHub secrets
- CORS configured for development (`origin: "*"`)
- TypeScript type checking in CI pipeline
- Biome linting enforced

## Troubleshooting

### Common Issues

1. **Deployment Failures**

   - Check AWS credentials in GitHub secrets
   - Verify S3 bucket permissions
   - Confirm CloudFront distribution ID

2. **Build Failures**

   - Run `yarn check` locally to catch TypeScript/linting issues
   - Check for missing dependencies in package.json

3. **Cache Issues**
   - CloudFront invalidation clears CDN cache
   - GitHub Actions caches yarn dependencies

### Debug Commands

```bash
# Type check without building
yarn typecheck

# Run all quality checks
yarn check

# Test build locally
yarn build --mode production
yarn preview
```

## Future Improvements

Based on TODOs in the workflow:

- Implement dependency caching for staging/production jobs
- Consider adding automated testing before production deployment
- Add deployment notifications/monitoring
- Implement blue-green deployment strategy

## Related Documentation

- [AWS S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [CloudFront CDN Setup](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Build Modes](https://vitejs.dev/guide/env-and-mode.html)
