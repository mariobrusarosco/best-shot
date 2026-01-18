import { test, expect } from '../../fixtures/auth.fixture';
import { admin } from '../../utils/selectors';

test.describe('Admin @smoke', () => {

  test('should access admin panel', async ({ authenticatedPage }) => {
    // 1. Navigate to Admin
    await authenticatedPage.goto('/admin');
    
    // 2. Verify Critical Admin Action Button
    await expect(admin.createTournamentBtn(authenticatedPage).first()).toBeVisible();
  });
});
