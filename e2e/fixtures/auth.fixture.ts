import { test as base, Page } from '@playwright/test';
import { auth as authSelectors } from '../utils/selectors';
import { testData } from '../utils/test-data';

// Define the custom fixtures
type AuthFixtures = {
  authenticatedPage: Page;
  authUser: { email: string }; // Stub for now
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // 1. Navigate to login
    await page.goto(testData.urls.login);
    
    // 2. Perform Login Action (Demo Mode)
    // In Demo mode, we might just need to click "Login" without credentials, 
    // or the "Demo" button if it exists. 
    // For now, implementing the generic "Login" click flow.
    // We add a check: if we are already on dashboard, skip.
    if (!page.url().includes(testData.urls.dashboard)) {
         await authSelectors.loginButton(page).click();
         await page.waitForURL(/.*dashboard/);
    }
    
    // 3. Ensure we are stable
    await page.waitForLoadState('networkidle');
    
    // 4. Pass the authenticated page to the test
    await use(page);
  },
  
  authUser: async ({}, use) => {
    // Stub user for demo mode
    await use({ email: 'demo@example.com' });
  },
});

export { expect } from '@playwright/test';
