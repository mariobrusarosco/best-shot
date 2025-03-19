# Lesson 1.3: Your First E2E Test

Welcome to Lesson 1.3! Now that we have our environment set up, let's write our first meaningful E2E test for the Best Shot demo application. In this lesson, we'll explore the structure of a test, how to interact with elements, and how to make assertions.

## Understanding Test Structure

A Playwright test follows this basic structure:

```typescript
import { test, expect } from '@playwright/test';

test('test name', async ({ page }) => {
  // 1. Navigate to a page
  await page.goto('/some-path');
  
  // 2. Perform actions (click buttons, fill forms, etc.)
  await page.click('button');
  await page.fill('input', 'some text');
  
  // 3. Assert that the expected results are present
  await expect(page.locator('.result')).toBeVisible();
});
```

This pattern of **Arrange-Act-Assert** (or **Given-When-Then** in BDD terms) is common in testing:

1. **Arrange/Given**: Set up the test conditions (navigate to a page)
2. **Act/When**: Perform the actions being tested
3. **Assert/Then**: Verify the expected outcomes

## Creating Our First Test File

Let's create a test that verifies core functionality of the Best Shot demo app:

1. Create a new file `tests/homepage.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Homepage Tests', () => {
  test('should load the homepage correctly', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Verify that the page title is correct
    await expect(page).toHaveTitle(/Best Shot/);
    
    // Verify that key elements are visible
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });
});
```

The `test.describe` block allows us to group related tests together.

## Running Your Test

Let's run this test:

```bash
npx playwright test homepage
```

This command runs any test files with "homepage" in their name.

## Selecting Elements

To interact with elements on a page, you need to select them. Playwright provides several ways to select elements:

1. **Text content**: `page.locator('text=Click me')`
2. **CSS selectors**: `page.locator('.button-class')`
3. **Element attributes**: `page.locator('[data-testid="submit-button"]')`
4. **Combinations**: `page.locator('button:has-text("Submit")')`
5. **XPath**: `page.locator('//button[contains(text(), "Submit")]')`

Let's add a test that uses these selectors:

```typescript
test('should have working navigation', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('/');
  
  // Find and click the navigation link (assuming there's a Dashboard link)
  await page.locator('text=Dashboard').click();
  
  // Verify we navigated to the dashboard page
  await expect(page).toHaveURL(/.*dashboard/);
  
  // Verify dashboard content is visible
  await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
});
```

## Common Interactions

Playwright provides methods to simulate user interactions:

1. **Clicking**: `await page.click('button')`
2. **Filling forms**: `await page.fill('input[name="username"]', 'testuser')`
3. **Pressing keys**: `await page.press('input', 'Enter')`
4. **Hovering**: `await page.hover('.dropdown')`
5. **Selecting options**: `await page.selectOption('select', 'Option 1')`

Let's test a form interaction if the demo app has one:

```typescript
test('should allow searching', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('/');
  
  // Find the search input and type a query
  await page.fill('[placeholder="Search"]', 'test query');
  
  // Press Enter to submit the search
  await page.press('[placeholder="Search"]', 'Enter');
  
  // Verify search results appear
  await expect(page.locator('.search-results')).toBeVisible();
  
  // Verify our query appears in the results
  await expect(page.locator('.search-results')).toContainText('test query');
});
```

## Making Assertions

Playwright's `expect` API provides many ways to verify your application's behavior:

1. **Visibility**: `await expect(locator).toBeVisible()`
2. **Text content**: `await expect(locator).toContainText('expected text')`
3. **Attribute values**: `await expect(locator).toHaveAttribute('href', '/dashboard')`
4. **Element count**: `await expect(locator).toHaveCount(5)`
5. **URL checks**: `await expect(page).toHaveURL('/dashboard')`
6. **Title checks**: `await expect(page).toHaveTitle('Dashboard')`
7. **Element state**: `await expect(locator).toBeEnabled()`, `await expect(locator).toBeChecked()`

Let's create a test with multiple assertions:

```typescript
test('should display correct content on homepage', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('/');
  
  // Check if the logo is visible
  const logo = page.locator('.logo');
  await expect(logo).toBeVisible();
  
  // Check if the navigation has the expected number of links
  const navLinks = page.locator('nav a');
  await expect(navLinks).toHaveCount(await navLinks.count());
  
  // Check if the footer contains copyright text
  const footer = page.locator('footer');
  await expect(footer).toContainText('Copyright');
  
  // Verify a button is enabled
  const button = page.locator('button:has-text("Get Started")');
  if (await button.isVisible()) {
    await expect(button).toBeEnabled();
  }
});
```

## Adding Wait Strategies

Sometimes elements take time to appear due to animations, API calls, or other asynchronous operations. Playwright has built-in auto-waiting for most operations, but you can also explicitly wait when needed:

```typescript
// Wait for a selector to appear
await page.waitForSelector('.results', { state: 'visible', timeout: 5000 });

// Wait for a specific condition
await expect(page.locator('.loading')).toHaveCount(0, { timeout: 10000 });

// Wait for a network request to complete
await page.waitForResponse('**/api/data');
```

## Debugging Tests

When tests fail, you need ways to debug them:

1. **Using the UI mode**:
   ```bash
   npx playwright test --ui
   ```

2. **Taking screenshots**:
   ```typescript
   await page.screenshot({ path: 'screenshot.png' });
   ```

3. **Recording videos**:
   Update your config to include:
   ```typescript
   use: {
     video: 'on-first-retry',
   },
   ```

4. **Using debug mode**:
   ```bash
   # Set debug environment variable
   $env:PWDEBUG=1
   # For Mac/Linux
   # PWDEBUG=1 npx playwright test
   npx playwright test
   ```

## Complete Example

Let's put everything together in a complete test file for the Best Shot demo application:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Best Shot Demo App Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Before each test, navigate to the homepage
    await page.goto('/');
  });

  test('should load the homepage correctly', async ({ page }) => {
    // Verify that the page title is correct
    await expect(page).toHaveTitle(/Best Shot/);
    
    // Verify that key elements are visible
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    // Find all navigation links
    const navLinks = page.locator('nav a');
    const count = await navLinks.count();
    
    // If there are navigation links, click the first one
    if (count > 0) {
      // Get the href to know where we expect to navigate to
      const href = await navLinks.first().getAttribute('href') || '';
      await navLinks.first().click();
      
      // Verify we navigated to the expected page
      await expect(page).toHaveURL(new RegExp(href.replace('/', '\\/') + '$'));
    }
  });

  test('should display correct content on homepage', async ({ page }) => {
    // Check if the logo or brand name is visible
    const logo = page.locator('.logo, .brand');
    await expect(logo).toBeVisible();
    
    // Check if the footer contains expected text
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    // Verify a common UI element is present (buttons, headings, etc.)
    const commonElement = page.locator('h1, h2, .main-title');
    await expect(commonElement).toBeVisible();
  });
});
```

This test suite:
1. Uses `beforeEach` to navigate to the homepage before each test
2. Checks if the homepage loads correctly
3. Tests the navigation if it exists
4. Verifies the content on the homepage

## Next Steps

Congratulations! You've written your first meaningful E2E tests for the Best Shot demo application. In the next module, we'll dive deeper into more advanced techniques for element selection and interaction.

## Exercise

Before moving on, expand the test suite to:

1. Test any forms on the homepage (search, contact, etc.)
2. Check if any buttons or interactive elements work correctly
3. Verify that images load properly
4. Add a test for any error states you can find (e.g., a 404 page)

Try running your tests in all three browser engines (Chromium, Firefox, WebKit) to ensure cross-browser compatibility.

Remember, E2E testing is about verifying the user experience, so think about what a real user would do on the site! 