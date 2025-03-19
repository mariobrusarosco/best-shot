import { test, expect } from '@playwright/test';

test('Home page has title and loads correctly', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Best Shot/);

  await expect(page).toHaveURL(/.*dashboard!/);

  await expect(page.locator('menu')).toBeVisible();
});