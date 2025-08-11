import { test, expect } from '@playwright/test';
import { AuthenticationHelper } from '../page-objects/auth/AuthenticationHelper';

test.describe('Smoke Tests - Critical User Journeys', () => {
  test('should complete end-to-end authentication flow without localStorage errors', async ({ page }) => {
    const authHelper = new AuthenticationHelper(page);
    
    // Setup demo environment
    await authHelper.setupDemoEnvironment();
    
    // Simulate authentication
    await authHelper.simulateAuthenticatedState('smoke-test-user');
    
    // Navigate to dashboard
    await page.goto('/dashboard');
    
    // Verify we're authenticated and on dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Check for authenticated content
    const screenHeading = page.locator('[data-ui="screen-heading"]');
    await expect(screenHeading).toBeVisible({ timeout: 10000 });
    
    // Check menu is visible (indicating successful authentication)
    const menu = page.locator('menu');
    await expect(menu).toBeVisible();
    
    // Verify menu contains expected navigation items
    await expect(menu).toContainText(/best shot/i);
    
    console.log('✅ Smoke test passed - Authentication flow working correctly');
  });

  test('should handle localStorage access errors gracefully during critical flows', async ({ page }) => {
    // Block localStorage access to simulate the SecurityError
    await page.addInitScript(() => {
      const originalLocalStorage = window.localStorage;
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new Error('SecurityError: Failed to read the localStorage property from Window: Access is denied for this document.');
        },
        set() {
          throw new Error('SecurityError: Failed to write to localStorage property from Window: Access is denied for this document.');
        }
      });
    });

    const authHelper = new AuthenticationHelper(page);
    
    // These should not throw errors even with localStorage blocked
    await authHelper.setupDemoEnvironment();
    await authHelper.simulateAuthenticatedState('smoke-test-user-blocked');
    
    // Navigate to dashboard
    await page.goto('/dashboard');
    
    // Should still work with sessionStorage and DOM-based checks
    await expect(page).toHaveURL(/.*dashboard/);
    
    console.log('✅ Smoke test passed - localStorage errors handled gracefully');
  });

  test('should verify all critical pages are accessible', async ({ page }) => {
    const authHelper = new AuthenticationHelper(page);
    await authHelper.ensureAuthenticated();
    
    // Test critical navigation paths
    const criticalPaths = [
      '/dashboard',
      '/tournaments', 
      '/leagues',
      '/my-account'
    ];

    for (const path of criticalPaths) {
      await page.goto(path);
      
      // Should not be redirected to login
      await expect(page).not.toHaveURL(/.*login/);
      
      // Should load within reasonable time
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      
      console.log(`✅ ${path} accessible and loading correctly`);
    }
  });

  test('should maintain authentication state across page reloads', async ({ page }) => {
    const authHelper = new AuthenticationHelper(page);
    
    await authHelper.setupDemoEnvironment();
    await authHelper.simulateAuthenticatedState('persistent-user');
    
    // Navigate to dashboard
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Reload page
    await page.reload({ waitUntil: 'networkidle' });
    
    // Should still be authenticated
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Should still show authenticated content
    const menu = page.locator('menu');
    await expect(menu).toBeVisible({ timeout: 5000 });
    
    console.log('✅ Authentication state persisted across reload');
  });
});