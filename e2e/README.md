# E2E Testing Framework

This directory contains the enhanced end-to-end testing framework for the Best Shot application, specifically targeting the demo environment at https://best-shot-demo.mariobrusarosco.com.

## Directory Structure

```
e2e/
├── config/                     # Configuration files and interfaces
│   ├── TestConfig.ts          # Environment-specific test configurations
│   ├── PlaywrightConfig.ts    # Enhanced Playwright configuration
│   ├── GlobalSetup.ts         # Global test setup and environment validation
│   ├── GlobalTeardown.ts      # Global test cleanup
│   └── index.ts               # Configuration exports
├── page-objects/              # Page Object Model classes
│   ├── base/                  # Base page class and common utilities
│   │   └── BasePage.ts        # Abstract base page with common functionality
│   ├── auth/                  # Authentication-related page objects
│   └── screens/               # Application screen page objects
├── tests/                     # Test files organized by category
│   ├── auth/                  # Authentication flow tests
│   ├── screens/               # Screen-specific tests (existing)
│   ├── workflows/             # End-to-end user journey tests
│   └── api/                   # API integration tests
├── fixtures/                  # Test data and fixtures
│   └── TestData.ts           # Centralized test data and scenarios
├── utils/                     # Test utilities and helpers
│   └── TestHelpers.ts        # Common test utility functions
├── screenshots/               # Screenshot storage for failures and debugging
└── README.md                  # This documentation file
```

## Key Features

### Environment Configuration
- **Multi-environment support**: Demo, staging, and production configurations
- **Environment-specific settings**: URLs, timeouts, retry logic, and feature flags
- **Automatic environment validation**: Health checks before test execution

### Page Object Model
- **BasePage class**: Abstract base class with common utilities and error handling
- **Structured organization**: Separate directories for different page types
- **Error handling**: Automatic screenshot capture and context logging
- **Smart waiting strategies**: Network idle, element visibility, and custom timeouts

### Test Organization
- **Category-based structure**: Tests organized by functionality (auth, screens, workflows, api)
- **Reusable test data**: Centralized fixtures and test scenarios
- **Helper utilities**: Common test operations and assertions

### Enhanced Reporting
- **Multiple report formats**: HTML reports with screenshots, JUnit XML for CI/CD
- **Failure artifacts**: Automatic screenshot and video capture on test failures
- **Performance monitoring**: Test duration tracking and performance metrics

## Configuration

### Environment Variables
- `TEST_ENV`: Target environment (demo, staging, production) - defaults to 'demo'

### Test Configuration
The framework supports environment-specific configurations:

```typescript
// Demo environment (default)
const config = getTestConfig('demo');

// Staging environment
const config = getTestConfig('staging');

// Production environment
const config = getTestConfig('production');
```

### Protected Routes
The framework is configured to test the following protected routes:
- `/dashboard`
- `/tournaments`
- `/leagues`
- `/my-account`

## Usage

### Running Tests
```bash
# Run all E2E tests against demo environment
npx playwright test

# Run tests against specific environment
TEST_ENV=staging npx playwright test

# Run specific test category
npx playwright test tests/screens/

# Run tests with UI mode
npx playwright test --ui
```

### Creating New Tests
1. **Screen tests**: Add to `tests/screens/` directory
2. **Authentication tests**: Add to `tests/auth/` directory
3. **Workflow tests**: Add to `tests/workflows/` directory
4. **API tests**: Add to `tests/api/` directory

### Creating Page Objects
1. Extend the `BasePage` class
2. Implement required abstract methods (`navigate()`, `waitForLoad()`)
3. Use provided utilities for element interaction and error handling

Example:
```typescript
import { BasePage } from '../base/BasePage';

export class DashboardPage extends BasePage {
  async navigate(): Promise<void> {
    await this.page.goto('/dashboard');
  }

  async waitForLoad(): Promise<void> {
    await this.waitForElement('[data-ui="screen-heading"]');
  }
}
```

## Current Implementation Status

### ✅ Completed
- Enhanced directory structure and organization
- Base configuration classes and interfaces
- Environment-specific settings for demo environment
- Page Object Model foundation with BasePage class
- Test utilities and helper functions
- Centralized test data and fixtures
- Enhanced Playwright configuration with reporting
- Global setup and teardown with environment validation

### 🔄 Next Steps (Future Tasks)
- Authentication page objects and utilities
- Screen-specific page objects (dashboard, tournaments, leagues)
- Smoke test suite implementation
- Protected route access testing
- Comprehensive error handling and reporting
- Parallel execution optimization
- CI/CD integration and reporting

## Best Practices

1. **Use Page Object Model**: Always create page objects for reusable screen interactions
2. **Leverage BasePage utilities**: Use provided error handling and waiting strategies
3. **Environment configuration**: Use environment-specific configurations for different targets
4. **Test data management**: Use centralized fixtures for consistent test data
5. **Error handling**: Let the framework handle screenshots and error logging automatically
6. **Test isolation**: Ensure tests can run independently and in parallel