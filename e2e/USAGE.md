# Enhanced E2E Testing Usage Guide

This guide demonstrates how to use the enhanced E2E testing structure for the Best Shot application.

## Quick Start

### Running Tests
```bash
# Run all E2E tests (demo environment)
yarn test:e2e

# Run tests with UI mode
yarn test:e2e:ui

# Run tests in debug mode
yarn test:e2e:debug

# Run specific environment
yarn test:e2e:demo
yarn test:e2e:staging
```

### Environment Configuration
```typescript
import { getTestConfig } from './config/TestConfig';

// Get demo environment config (default)
const config = getTestConfig('demo');

// Get staging environment config
const config = getTestConfig('staging');
```

## Creating Tests

### Basic Test Structure
```typescript
import { test, expect } from '@playwright/test';
import { getTestConfig } from '../config';
import { TestHelpers } from '../utils/TestHelpers';

test.describe('My Test Suite', () => {
  let testHelpers: TestHelpers;
  
  test.beforeEach(async ({ page }) => {
    const config = getTestConfig('demo');
    testHelpers = new TestHelpers(page, config);
    await testHelpers.navigateToUrl('/');
  });

  test('should test something', async ({ page }) => {
    await testHelpers.verifyPageTitle(/Best Shot/);
    await testHelpers.verifyCurrentUrl(/.*dashboard/);
  });
});
```

### Using Test Data
```typescript
import { navigationTestData, dashboardTestData } from '../config';

test('should use centralized test data', async ({ page }) => {
  // Use navigation test data
  const { menuLinks } = navigationTestData;
  
  // Use dashboard test data
  const { selectors, expectedContent } = dashboardTestData;
  
  await testHelpers.verifyElementContainsText(
    selectors.title, 
    expectedContent.titlePrefix
  );
});
```

## Creating Page Objects

### Extending BasePage
```typescript
import { BasePage } from '../base/BasePage';
import { Page } from '@playwright/test';

export class MyPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await this.page.goto('/my-page');
  }

  async waitForLoad(): Promise<void> {
    await this.waitForElement('[data-ui="page-loaded"]');
  }

  async clickButton(): Promise<void> {
    try {
      await this.waitForElement('[data-ui="my-button"]');
      await this.page.click('[data-ui="my-button"]');
    } catch (error) {
      await this.handleError(error, 'clicking-button');
    }
  }
}
```

### Using Page Objects in Tests
```typescript
import { MyPage } from '../page-objects/screens/MyPage';

test('should use page object', async ({ page }) => {
  const myPage = new MyPage(page);
  
  await myPage.navigate();
  await myPage.waitForLoad();
  await myPage.clickButton();
});
```

## Test Utilities

### TestHelpers Class
```typescript
// Navigation
await testHelpers.navigateToUrl('/dashboard');

// Element interactions
await testHelpers.clickElementWithRetry('[data-ui="button"]');
await testHelpers.waitForElementWithTimeout('[data-ui="element"]', 5000);

// Verifications
await testHelpers.verifyPageTitle(/Expected Title/);
await testHelpers.verifyCurrentUrl(/expected-url/);
await testHelpers.verifyElementCount('selector', 5);
await testHelpers.verifyElementContainsText('selector', 'expected text');

// Screenshots
await testHelpers.takeTimestampedScreenshot('test-name');

// Element checks
const exists = await testHelpers.elementExists('[data-ui="element"]');
const text = await testHelpers.getElementText('[data-ui="element"]');
```

## Configuration Options

### Test Configuration
```typescript
interface TestConfig {
  baseURL: string;           // Target environment URL
  timeout: number;           // Global test timeout
  retries: number;           // Retry attempts on failure
  browsers: string[];        // Target browsers
  viewport: { width: number; height: number }; // Default viewport
  auth: {
    protectedRoutes: string[]; // Routes requiring authentication
  };
  screenshots: {
    enabled: boolean;        // Enable screenshot capture
    onFailure: boolean;      // Capture on test failure
    directory: string;       // Screenshot storage directory
  };
  reporting: {
    htmlReport: boolean;     // Generate HTML reports
    junitReport: boolean;    // Generate JUnit XML reports
    videoOnFailure: boolean; // Record video on failure
  };
}
```

### Environment Variables
- `TEST_ENV`: Target environment (demo, staging, production)

## Best Practices

1. **Use TestHelpers**: Leverage the TestHelpers class for common operations
2. **Centralize Test Data**: Use fixtures for reusable test data
3. **Page Object Model**: Create page objects for screen interactions
4. **Error Handling**: Let BasePage handle errors and screenshots automatically
5. **Environment Configuration**: Use environment-specific configurations
6. **Test Isolation**: Ensure tests can run independently

## Directory Organization

- `tests/auth/` - Authentication-related tests
- `tests/screens/` - Screen-specific functionality tests
- `tests/workflows/` - End-to-end user journey tests
- `tests/api/` - API integration tests
- `page-objects/screens/` - Screen page objects
- `page-objects/auth/` - Authentication page objects
- `fixtures/` - Test data and scenarios
- `utils/` - Test utilities and helpers
- `config/` - Configuration files and interfaces