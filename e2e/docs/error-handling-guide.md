# Enhanced Error Handling and Reporting Guide

This guide explains the comprehensive error handling and reporting system implemented for the Best Shot E2E test suite.

## Overview

The enhanced error handling system provides:

- **Automatic screenshot capture** on test failures
- **Video recording** for complex workflow failures
- **Structured error logging** with comprehensive context information
- **Retry logic** for handling flaky tests
- **Performance metrics** capture
- **Console log** and **network request** monitoring
- **Browser information** capture for debugging

## Components

### 1. ErrorHandler (`e2e/utils/ErrorHandler.ts`)

The `ErrorHandler` class provides comprehensive error context capture and reporting.

#### Features:
- Automatic screenshot capture with timestamped filenames
- Console log monitoring and capture
- Network request tracking
- Performance metrics collection
- Browser information capture
- Structured error context saving to JSON files

#### Usage:
```typescript
import { ErrorHandler } from '../utils/ErrorHandler';

const errorHandler = new ErrorHandler(page, testConfig, testInfo);

try {
  // Your test code here
} catch (error) {
  await errorHandler.handleTestFailure(error, 'test-context');
  throw error;
}
```

### 2. RetryHandler (`e2e/utils/RetryHandler.ts`)

The `RetryHandler` class provides intelligent retry logic for flaky operations.

#### Features:
- Configurable retry attempts with exponential backoff
- Custom retry conditions
- Before/after retry callbacks
- Detailed attempt tracking
- Specialized retry methods for common operations

#### Usage:
```typescript
import { RetryHandler } from '../utils/RetryHandler';

const retryHandler = new RetryHandler(page, testConfig, testInfo);

// Retry a general operation
const result = await retryHandler.executeWithRetry(
  async () => {
    // Your operation here
    return await someFlaky Operation();
  },
  {
    maxRetries: 3,
    retryDelay: 1000,
    exponentialBackoff: true
  },
  'operation-context'
);

// Retry element interaction
await retryHandler.retryElementInteraction('button', 'click');

// Retry navigation
await retryHandler.retryNavigation('/dashboard');
```

### 3. Enhanced Test Fixtures (`e2e/fixtures/EnhancedTestFixture.ts`)

Provides pre-configured test fixtures with error handling and retry capabilities.

#### Available Fixtures:
- `test` - Basic enhanced test with error handling
- `enhancedTest` - Test with automatic error capture
- `retryTest` - Test with built-in retry logic for page operations

#### Usage:
```typescript
import { enhancedTest as test, expect } from '../fixtures/EnhancedTestFixture';

test('my test', async ({ page, errorHandler, retryHandler, testConfig }) => {
  // Test code with automatic error handling
});
```

### 4. Enhanced BasePage (`e2e/page-objects/base/BasePage.ts`)

The base page object class now includes integrated error handling and retry logic.

#### Features:
- Automatic retry for element interactions
- Enhanced error context capture
- Integrated screenshot capture
- Network request monitoring

## Configuration

### Test Configuration (`e2e/config/TestConfig.ts`)

Error handling behavior is configured through the test configuration:

```typescript
export interface TestConfig {
  // ... other config
  screenshots: {
    enabled: boolean;
    onFailure: boolean;
    directory: string;
  };
  reporting: {
    htmlReport: boolean;
    junitReport: boolean;
    videoOnFailure: boolean;
  };
  retries: number;
}
```

### Playwright Configuration (`playwright.config.ts`)

Enhanced reporter configuration includes:
- HTML reports with attachments
- JUnit reports for CI integration
- JSON reports for programmatic analysis
- Video recording on failure
- Trace collection for debugging

## Error Context Information

When an error occurs, the system captures comprehensive context:

```typescript
interface EnhancedErrorContext {
  timestamp: string;
  testName: string;
  testFile: string;
  url: string;
  title: string;
  viewport: { width: number; height: number } | null;
  userAgent: string;
  screenshotPath: string;
  videoPath?: string;
  consoleLogs: ConsoleMessage[];
  networkRequests: NetworkRequest[];
  performanceMetrics: PerformanceMetrics;
  browserInfo: BrowserInfo;
  errorStack: string;
  retryAttempt: number;
}
```

## Directory Structure

The error handling system creates the following directory structure:

```
e2e/
├── screenshots/
│   ├── error-contexts/          # JSON error context files
│   └── *.png                    # Screenshot files
├── test-results/
│   ├── videos/                  # Video recordings
│   ├── junit-results.xml        # JUnit test results
│   └── test-results.json        # JSON test results
└── playwright-report/           # HTML test reports
```

## Best Practices

### 1. Use Enhanced Fixtures

Always use the enhanced test fixtures for automatic error handling:

```typescript
import { enhancedTest as test } from '../fixtures/EnhancedTestFixture';
```

### 2. Implement Proper Cleanup

Always clean up page objects to prevent memory leaks:

```typescript
test.afterEach(async () => {
  dashboardPage.cleanup();
});
```

### 3. Use Retry Logic for Flaky Operations

For operations that might be flaky, use the retry handler:

```typescript
const result = await retryHandler.executeWithRetry(
  async () => {
    // Potentially flaky operation
  },
  { maxRetries: 3 },
  'operation-description'
);
```

### 4. Provide Context for Errors

Always provide meaningful context when handling errors:

```typescript
await errorHandler.handleTestFailure(error, 'specific-operation-context');
```

### 5. Configure Appropriate Timeouts

Set reasonable timeouts for different types of operations:

```typescript
// Quick operations
{ timeout: 5000 }

// Network operations
{ timeout: 15000 }

// Page navigation
{ timeout: 30000 }
```

## Debugging Failed Tests

When a test fails, the error handling system provides multiple debugging resources:

### 1. Screenshots
- Automatically captured on failure
- Timestamped for easy identification
- Full-page screenshots for complete context

### 2. Error Context Files
- JSON files with comprehensive error information
- Located in `e2e/screenshots/error-contexts/`
- Include console logs, network requests, and performance metrics

### 3. Video Recordings
- Captured for complex workflow failures
- Available in `test-results/videos/`
- Show the complete test execution leading to failure

### 4. Console Logs
- Captured automatically during test execution
- Include all console messages (log, warn, error, info, debug)
- Filtered to show recent errors and warnings

### 5. Network Requests
- All network requests are monitored and logged
- Failed requests are highlighted in error reports
- Include timing and response information

## CI/CD Integration

The error handling system is designed for CI/CD environments:

### Artifacts Preservation
- Screenshots are automatically preserved as CI artifacts
- Video recordings are retained for failed tests
- Error context files provide detailed debugging information

### Reporting Integration
- JUnit XML reports for test result integration
- JSON reports for programmatic analysis
- HTML reports with embedded screenshots and videos

### Environment-Specific Configuration
- Different retry counts for different environments
- Configurable screenshot and video capture
- Environment-specific timeout values

## Troubleshooting

### Common Issues

1. **Screenshots not being captured**
   - Check that the screenshots directory exists and is writable
   - Verify `screenshots.enabled` is true in test configuration
   - Ensure sufficient disk space

2. **Retry logic not working**
   - Verify retry conditions match the error types
   - Check that `maxRetries` is greater than 0
   - Ensure retry delays are appropriate for the operation

3. **Video recordings missing**
   - Confirm `videoOnFailure` is enabled in configuration
   - Check that the test actually failed (videos only recorded on failure)
   - Verify video directory permissions

4. **Error context files not created**
   - Check error-contexts directory permissions
   - Verify JSON serialization is working (no circular references)
   - Ensure sufficient disk space

### Performance Considerations

- Console log capture is limited to the last 50 messages
- Network request tracking is limited to the last 100 requests
- Screenshots are compressed to balance quality and file size
- Error context files are cleaned up periodically in CI environments

## Examples

See `e2e/tests/enhanced-error-handling.spec.ts` for comprehensive examples of:
- Automatic screenshot capture
- Retry logic demonstration
- Error context capture
- Performance metrics collection
- Console log monitoring
- Network request tracking

## Migration Guide

To migrate existing tests to use the enhanced error handling:

1. Update test imports:
   ```typescript
   // Old
   import { test, expect } from '@playwright/test';
   
   // New
   import { enhancedTest as test, expect } from '../fixtures/EnhancedTestFixture';
   ```

2. Update page object constructors:
   ```typescript
   // Old
   const dashboardPage = new DashboardPage(page, testConfig);
   
   // New
   const dashboardPage = new DashboardPage(page, testConfig, testInfo);
   ```

3. Add cleanup in afterEach:
   ```typescript
   test.afterEach(async () => {
     dashboardPage.cleanup();
   });
   ```

4. Use enhanced fixtures:
   ```typescript
   test('my test', async ({ page, errorHandler, retryHandler }) => {
     // Test code
   });
   ```

This enhanced error handling system significantly improves the debugging experience and test reliability for the Best Shot E2E test suite.