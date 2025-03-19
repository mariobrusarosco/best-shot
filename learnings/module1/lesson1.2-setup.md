# Lesson 1.2: Setting Up Your Environment

Welcome to Lesson 1.2! Now that you understand what E2E testing is, let's set up our testing environment. By the end of this lesson, you'll have Playwright installed and configured to start writing tests.

## Prerequisites

Before we begin, ensure you have:

- Node.js (version 14 or higher) installed
- npm or yarn installed
- A code editor of your choice (VS Code recommended)

## Step 1: Create a New Project

Let's start by creating a new directory for our E2E testing project:

```bash
# Create a directory for your testing project
mkdir best-shot-e2e
cd best-shot-e2e

# Initialize a new npm project
npm init -y
```

This creates a basic `package.json` file in your project.

## Step 2: Install Playwright

Now, let's install Playwright:

```bash
# Using npm
npm init playwright@latest

# Or using yarn
yarn create playwright
```

During the installation, you'll be asked a few questions:

1. **Do you want to use TypeScript or JavaScript?** Choose TypeScript for better type safety and developer experience.
2. **Where to put your end-to-end tests?** The default `tests` or `e2e` is fine.
3. **Add a GitHub Actions workflow?** Choose yes if you plan to use GitHub.
4. **Install Playwright browsers?** Yes, to download the necessary browsers.

This installation:
- Adds Playwright as a dependency
- Creates a basic configuration
- Installs browser binaries (Chromium, Firefox, WebKit)
- Adds example tests

## Step 3: Explore the Project Structure

After installation, you'll have a structure like this:

```
best-shot-e2e/
├── .github/              # GitHub Actions workflow (if selected)
├── node_modules/         # Dependencies
├── tests/                # Your test files
│   ├── example.spec.ts   # Example test
├── playwright.config.ts  # Playwright configuration
├── package.json          # Project dependencies
└── package-lock.json     # Lock file
```

Let's understand the key files:

### `playwright.config.ts`

This is the central configuration file for Playwright. It defines:

- Which browsers to use
- Test timeouts
- Viewport sizes
- Reporter options
- And much more

Here's a basic configuration:

```typescript
import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 30000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'https://demo-best-shot.mariobrusarosco.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },
  ],
};

export default config;
```

### `tests/example.spec.ts`

Playwright creates an example test file that demonstrates basic test structure:

```typescript
import { test, expect } from '@playwright/test';

test('homepage has title and links', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
  
  // Expect a link "to be visible".
  await expect(page.locator('text=Get Started').first()).toBeVisible();
});
```

## Step 4: Customize for Our Target Application

Let's modify the configuration to target our demo application:

1. Open `playwright.config.ts`
2. Update the `baseURL` property:

```typescript
use: {
  baseURL: 'https://demo-best-shot.mariobrusarosco.com',
  // ... other properties
}
```

This sets the default URL for your tests, so you don't need to type the full URL in each test.

## Step 5: Run the Example Test

Let's modify the example test to work with our target application and run it:

1. Open `tests/example.spec.ts`
2. Update it with:

```typescript
import { test, expect } from '@playwright/test';

test('homepage has title and loads correctly', async ({ page }) => {
  await page.goto('/');
  
  // Check if the page title contains "Best Shot"
  await expect(page).toHaveTitle(/Best Shot/);
  
  // Check if the app has loaded by looking for a common element
  await expect(page.locator('header')).toBeVisible();
});
```

Now, let's run this test:

```bash
# Run the test in all browsers
npx playwright test

# Or run it in a specific browser
npx playwright test --project=chromium
```

You should see output indicating that the test has run and passed.

## Step 6: Setup VS Code Extension (Optional but Recommended)

If you're using VS Code, install the Playwright extension for a better testing experience:

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X or Cmd+Shift+X)
3. Search for "Playwright"
4. Install the official Playwright extension

This provides:
- Test running and debugging from within VS Code
- Go-to-definition for selectors
- Syntax highlighting
- And more

## Troubleshooting

If you encounter issues:

1. **Browser installation problems**: Try running `npx playwright install` separately.
2. **Test failures**: Make sure your internet connection is stable and the target site is up.
3. **TypeScript errors**: Ensure you have TypeScript installed (`npm install -D typescript`).

## Next Steps

Congratulations! You've set up your Playwright environment and run your first test. In the next lesson, [Lesson 1.3: Your First E2E Test](./lesson1.3-first-test.md), we'll dive deeper into writing more meaningful tests for our application.

## Exercise

Before moving on, try to:

1. Modify the example test to check for another element on the homepage
2. Run the test on different browsers
3. Experiment with changing the browser viewport size in the configuration

This will help reinforce what you've learned and get you comfortable with the Playwright basics. 