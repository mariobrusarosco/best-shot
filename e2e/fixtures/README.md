# Test Data Management System

This directory contains a comprehensive test data management system for E2E tests, providing centralized data configuration, environment-specific fixtures, and automated cleanup utilities.

## Overview

The test data management system provides:

- **Centralized Data Management**: Single source of truth for all test data
- **Environment-Specific Fixtures**: Customized data for demo, staging, and production
- **Automated Cleanup**: Intelligent cleanup of test data and artifacts
- **Dynamic Data Generation**: Factory pattern for generating test data on-demand
- **Data Validation**: Built-in validation for test data integrity
- **Integration Utilities**: Easy integration with existing test suites

## Core Components

### 1. TestDataManager (`TestDataManager.ts`)

Central manager for all test data operations:

```typescript
import { TestDataManager } from './fixtures/TestDataManager';
import { getTestConfig } from './config/TestConfig';

const config = getTestConfig('demo');
const dataManager = TestDataManager.getInstance(config);

// Load test data for environment
await dataManager.loadTestData('demo');

// Get specific test data
const users = dataManager.getTestData('demo', 'users');
const scenarios = dataManager.getTestScenarios('demo', 'smoke', 'critical');
```

### 2. Environment Fixtures (`EnvironmentFixtures.ts`)

Environment-specific test data and configurations:

```typescript
import { getEnvironmentFixtures } from './fixtures/EnvironmentFixtures';
import { getTestConfig } from './config/TestConfig';

const config = getTestConfig('demo');
const fixtures = getEnvironmentFixtures('demo', config);

// Get demo-specific data
const demoUsers = fixtures.getDemoUsers();
const demoNavigation = fixtures.getDemoNavigationData();
const demoDashboard = fixtures.getDemoDashboardData();
```

### 3. Test Data Cleanup (`TestDataCleanup.ts`)

Automated cleanup utilities for test data lifecycle management:

```typescript
import { TestDataCleanup } from './fixtures/TestDataCleanup';

const cleanup = new TestDataCleanup(config);

// Perform specific cleanup operations
await cleanup.performCleanup('demo', ['clear_cache', 'cleanup_artifacts']);

// Complete cleanup
await cleanup.performCompleteCleanup('demo');
```

### 4. Test Data Factory (`TestDataFactory.ts`)

Dynamic test data generation:

```typescript
import { TestDataFactory } from './fixtures/TestDataFactory';

const factory = TestDataFactory.getInstance();

// Generate test users
const users = factory.generateTestUsers(5, { environment: 'demo' });

// Generate test scenarios
const scenario = factory.generateTestScenario({
  category: 'smoke',
  priority: 'critical'
});
```

### 5. Integration Utilities (`TestDataIntegration.ts`)

Helper utilities for integrating with existing tests:

```typescript
import { TestDataHelpers } from '../utils/TestDataIntegration';

// Setup for page object tests
const { integration, user, fixtures } = await TestDataHelpers.setupForPageObject(
  page, 
  config, 
  'demo'
);

// Setup for authentication tests
const { standardUser, adminUser, guestUser } = await TestDataHelpers.setupForAuthTests(
  config, 
  'demo'
);
```

## Usage Examples

### Basic Usage

```typescript
import { initializeTestData, getAllTestData, cleanupAfterTests } from './fixtures';

test.describe('My Test Suite', () => {
  test.beforeAll(async () => {
    await initializeTestData('demo');
  });

  test.afterAll(async () => {
    await cleanupAfterTests('demo');
  });

  test('should use test data', async ({ page }) => {
    const testData = await getAllTestData('demo');
    const user = testData.users?.[0];
    
    // Use test data in your test
    expect(user?.email).toBeDefined();
  });
});
```

### Environment-Specific Testing

```typescript
import { getEnvironmentFixtures } from './fixtures/EnvironmentFixtures';
import { getTestConfig } from './config/TestConfig';

test('should test demo environment', async ({ page }) => {
  const config = getTestConfig('demo');
  const fixtures = getEnvironmentFixtures('demo', config);
  
  const demoUsers = fixtures.getDemoUsers();
  const standardUser = demoUsers.find(user => user.role === 'standard');
  
  // Test with demo-specific data
  expect(standardUser?.profile.username).toBe('mariobrusarosco');
});
```

### Dynamic Data Generation

```typescript
import { TestDataFactory } from './fixtures/TestDataFactory';

test('should generate dynamic test data', async ({ page }) => {
  const factory = TestDataFactory.getInstance();
  
  // Generate users for testing
  const testUsers = factory.generateTestUsers(3, {
    environment: 'demo',
    role: 'standard'
  });
  
  // Use generated data
  for (const user of testUsers) {
    // Test with each user
    expect(user.email).toMatch(/^test\.user\.\d+@example\.com$/);
  }
});
```

## Data Structure

### Test User Data

```typescript
interface TestUserData {
  id: string;
  email: string;
  password: string;
  role: 'standard' | 'admin' | 'guest';
  environment: 'demo' | 'staging' | 'production';
  profile: {
    username: string;
    displayName: string;
    preferences: Record<string, any>;
  };
  expectedData: {
    dashboardTournaments: string[];
    leagues: string[];
    permissions: string[];
  };
  metadata: {
    createdAt: string;
    lastUsed?: string;
    isActive: boolean;
  };
}
```

### Test Scenario Data

```typescript
interface TestScenarioData {
  id: string;
  name: string;
  description: string;
  category: 'smoke' | 'regression' | 'integration' | 'performance';
  priority: 'critical' | 'high' | 'medium' | 'low';
  environment: string[];
  preconditions: string[];
  steps: Array<{
    stepNumber: number;
    action: string;
    target: string;
    data?: any;
    expectedResult: string;
    timeout?: number;
  }>;
  expectedResults: string[];
  tags: string[];
  metadata: {
    estimatedDuration: number;
    lastUpdated: string;
    author: string;
  };
}
```

## Configuration

### Environment Configuration

Test data behavior can be configured per environment in `TestDataConfig.ts`:

```typescript
export const demoTestDataConfig: TestDataConfig = {
  environment: 'demo',
  dataRefreshInterval: 60, // minutes
  maxCacheSize: 10,
  cleanupSchedule: {
    enabled: true,
    intervalMinutes: 30,
    operations: ['cleanup_artifacts', 'clear_cache']
  },
  validation: {
    enabled: true,
    strictMode: false,
    requiredFields: ['id', 'email', 'role', 'environment']
  }
};
```

### Data Limits

Environment-specific limits prevent resource exhaustion:

```typescript
export const environmentDataLimits = {
  demo: {
    maxUsers: 50,
    maxScenarios: 100,
    maxTestDuration: 60,
    allowedOperations: ['all']
  },
  production: {
    maxUsers: 5,
    maxScenarios: 10,
    maxTestDuration: 15,
    allowedOperations: ['cleanup_artifacts']
  }
};
```

## Best Practices

### 1. Use Environment-Specific Data

Always use environment-appropriate test data:

```typescript
// Good
const fixtures = getEnvironmentFixtures(process.env.TEST_ENV || 'demo', config);

// Avoid hardcoding environment
const fixtures = getEnvironmentFixtures('demo', config);
```

### 2. Clean Up After Tests

Always clean up test data to prevent resource leaks:

```typescript
test.afterEach(async ({}, testInfo) => {
  await TestDataHelpers.performTestCleanup(config, environment, testInfo);
});
```

### 3. Validate Test Data

Validate test data before use to catch issues early:

```typescript
const validation = integration.validateTestData(user);
if (!validation.valid) {
  throw new Error(`Invalid test data: ${validation.errors.join(', ')}`);
}
```

### 4. Use Appropriate Data Scope

Use the minimum required data scope for tests:

```typescript
// For smoke tests - use minimal data
const smokeScenarios = integration.getTestScenarios('demo', 'smoke', 'critical');

// For comprehensive tests - use full data set
const allScenarios = integration.getTestScenarios('demo');
```

## Migration from Legacy System

The system maintains backward compatibility with existing tests:

```typescript
// Legacy usage (still works)
import { navigationTestData, dashboardTestData } from './fixtures/TestData';

// New usage (recommended)
import { getAllTestData } from './fixtures';
const testData = await getAllTestData('demo');
```

## Troubleshooting

### Common Issues

1. **Data Not Loading**: Ensure `initializeTestData()` is called before using test data
2. **Validation Errors**: Check that test data meets validation requirements
3. **Cleanup Failures**: Verify cleanup operations are appropriate for the environment
4. **Memory Issues**: Use cleanup utilities to prevent data accumulation

### Debug Information

Enable debug logging to troubleshoot issues:

```typescript
const integration = TestDataHelpers.createIntegration(config, 'demo');
const summary = integration.getTestDataSummary();
console.log('Test Data Summary:', summary);
```

## Contributing

When adding new test data:

1. Follow the established data structure patterns
2. Add appropriate validation rules
3. Include cleanup operations
4. Update environment-specific fixtures
5. Add examples and documentation

## Files Overview

- `TestDataManager.ts` - Core data management functionality
- `EnvironmentFixtures.ts` - Environment-specific test data
- `TestDataCleanup.ts` - Cleanup utilities and operations
- `TestDataFactory.ts` - Dynamic data generation
- `TestData.ts` - Legacy compatibility layer
- `EnhancedTestFixture.ts` - Enhanced Playwright fixtures
- `index.ts` - Main exports and convenience functions
- `README.md` - This documentation file