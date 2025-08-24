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

### E2E Testing Workflow (.github/workflows/playwright.yml)

- **Trigger**: Push/PR to `main` or `master` branches
- **Purpose**: Runs Playwright end-to-end tests
- **Artifacts**: Stores test reports for 30 days

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
AWS_ACCESS_KEY_ID        # AWS access key
AWS_SECRET_ACCESS_KEY    # AWS secret key
AWS_BUCKET_ID           # S3 bucket name
AWS_CLOUDFRONT_ID       # CloudFront distribution ID
```

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
VITE_AUTH_DOMAIN="bestshot.us.auth0.com"
VITE_AUTH_CLIENT_ID="Y8ALFfSOz3hwsCeaEbh3SqUioRaGD4H0"
VITE_BEST_SHOT_API="http://localhost:9090/api/v1"
VITE_BEST_SHOT_API_V2="http://localhost:9090/api/v2"
VITE_MOCKED_MEMBER_PUBLIC_ID="26e783db-24e8-4ccb-9e7d-a5c049ddd350"
VITE_LAUNCHDARKLY_CLIENT_KEY="67e04c5971b8d4097753d9fd"
```

#### Demo Environment (.env.demo)
```bash
VITE_AUTH_DOMAIN="bestshot.us.auth0.com"
VITE_AUTH_CLIENT_ID="Y8ALFfSOz3hwsCeaEbh3SqUioRaGD4H0"
VITE_BEST_SHOT_API="https://api-best-shot-demo.mariobrusarosco.com/api/v1"
VITE_BEST_SHOT_API_V2="https://api-best-shot-demo.mariobrusarosco.com/api/v2"
VITE_MOCKED_MEMBER_PUBLIC_ID="10876016-1697-47e5-82fa-56840eb7ac42"
VITE_DEMO_VERSION=true
VITE_LAUNCHDARKLY_CLIENT_KEY="sdk-client-123456789012345678901234567890-demo"
```

#### Staging Environment (.env.staging)
```bash
VITE_AUTH_DOMAIN="bestshot.us.auth0.com"
VITE_AUTH_CLIENT_ID="Y8ALFfSOz3hwsCeaEbh3SqUioRaGD4H0"
VITE_BEST_SHOT_API="https://api-best-shot-demo.up.railway.app/api/v1"
VITE_BEST_SHOT_API_V2="https://api-best-shot-staging.mariobrusarosco.com/api/v2"
VITE_MOCKED_MEMBER_PUBLIC_ID="14e1b53a-9f54-4fe8-b639-af357cf9d52f"
```

#### Production Environment (.env.production)
```bash
VITE_AUTH_DOMAIN="bestshot.us.auth0.com"
VITE_AUTH_CLIENT_ID="Y8ALFfSOz3hwsCeaEbh3SqUioRaGD4H0"
VITE_BEST_SHOT_API="https://api.bestshot.app/api/v1"
VITE_BEST_SHOT_API_V2="https://api.bestshot.app/api/v2"
VITE_LAUNCHDARKLY_CLIENT_KEY="sdk-client-123456789012345678901234567890-production"
```

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
- **Feature branches**: Run tests only (no deployment)

## Development Workflow

1. **Feature Development**: Work on feature branches
2. **Testing**: Push triggers Playwright tests automatically
3. **Staging**: Merge to `staging` branch for staging deployment
4. **Production**: Merge to `main` branch for production deployment

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