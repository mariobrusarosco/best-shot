import { test, expect } from '@playwright/test';
import { auth } from '../../utils/selectors';

test.describe('Authentication @critical', () => {
    
  test('should login via demo mode', async ({ page }) => {
    // 1. Navigate to /login (Assuming redirection or direct access)
    await page.goto('/login');
    
    // 2. Click the Login button
    // This assumes the button is visible and interactive
    await expect(auth.loginButton(page)).toBeVisible();
    await auth.loginButton(page).click();
    
    // 3. Assert redirection to /dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });
});
