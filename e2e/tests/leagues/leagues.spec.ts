import { test, expect } from '../../fixtures/auth.fixture';
import { leagues, navigation } from '../../utils/selectors';

test.describe('Leagues @critical', () => {

  test('should allow creating a league', async ({ authenticatedPage }) => {
    // 1. Navigate to Leagues
    await navigation.menuLink(authenticatedPage, '/leagues').click();
    await authenticatedPage.waitForURL(/.*leagues/);

    // 2. Open Create Menu
    await expect(leagues.fab(authenticatedPage)).toBeVisible();
    await leagues.fab(authenticatedPage).click();

    // 3. Select "Create League"
    await expect(leagues.createOption(authenticatedPage)).toBeVisible();
    await leagues.createOption(authenticatedPage).click();

    // 4. Fill Form
    const leagueName = `Test League ${Date.now()}`;
    await leagues.nameInput(authenticatedPage).fill(leagueName);
    await leagues.descriptionInput(authenticatedPage).fill('E2E Test Description');
    
    // 5. Submit
    await leagues.submitButton(authenticatedPage).click();

    // 6. Verify Creation (League should appear in list)
    // We might need to reload or wait for list update. 
    // Assuming redirection to list or inline update.
    await expect(authenticatedPage.getByText(leagueName)).toBeVisible();
  });
});
