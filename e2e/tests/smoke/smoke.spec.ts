import { test, expect } from '@playwright/test';

test.describe('Smoke Check @smoke', () => {
  test('should load application', async ({ page }) => {
    // Navigate to base URL
    await page.goto('/');
    
    // Verify page title contains "Best Shot"
    await expect(page).toHaveTitle(/Best Shot/);
  });
});
