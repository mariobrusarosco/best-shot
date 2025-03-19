import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });
        
  test('should load the home page correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Best Shot/);

    await expect(page).toHaveURL(/.*dashboard/);

    // Checking for text options
    
    //#1 
    // await expect(page.locator('menu a span')).toHaveText(/best shot/);
    //#2
    await expect(page.locator('menu')).toContainText(/best shot/);
  });

  test('should have the correct menu items', async ({ page }) => {
    await expect(page.locator('menu a[href="/"]')).toBeVisible();
    await expect(page.locator('menu a[href="/dashboard"]')).toBeVisible();
    await expect(page.locator('menu a[href="/tournaments"]')).toBeVisible();
    await expect(page.locator('menu a[href="/leagues"]')).toBeVisible();
    await expect(page.locator('menu a[href="/my-account"]')).toBeVisible();
    await expect(page.locator('menu a')).toHaveCount(5);
  });
});
