import { test, expect } from '@playwright/test';

test.describe('Menu Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have clickable menu links that navigate to correct pages', async ({ page }) => {
    const menuLinks = [
      { href: '/', expectedUrl: '/dashboard' },
      { href: '/dashboard', expectedUrl: '/dashboard' },
      { href: '/tournaments', expectedUrl: '/tournaments' },
      { href: '/leagues', expectedUrl: '/leagues' },
      { href: '/my-account', expectedUrl: '/my-account' }
    ];

    const links = page.locator('menu a');
    await expect(links).toHaveCount(5);

    for (const link of menuLinks) {
      const menuLink = page.locator(`menu a[href="${link.href}"]`);
      await expect(menuLink).toBeVisible();
      
      await menuLink.click();
      await expect(page).toHaveURL(link.expectedUrl);
    }
  });
});
