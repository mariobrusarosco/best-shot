import { test, expect } from '../../fixtures/auth.fixture';
import { dashboard, navigation } from '../../utils/selectors';

test.describe('Dashboard @critical', () => {
  
  // Use the custom fixture which handles login automatically
  test('should display core dashboard elements', async ({ authenticatedPage }) => {
    
    // 1. Verify Greetings
    // Note: The specific text depends on the demo user state, 
    // but we check for general visibility or partial text if known.
    // 'Hello,' is standard.
    await expect(dashboard.screenHeading(authenticatedPage)).toBeVisible();
    await expect(dashboard.screenHeading(authenticatedPage)).toContainText(/Hello,/i);
    
    // 2. Verify Navigation is present
    await expect(navigation.menu(authenticatedPage)).toBeVisible();
    
    // 3. Verify key sections
    await expect(dashboard.matchdaySection(authenticatedPage)).toBeVisible();
  });
});
