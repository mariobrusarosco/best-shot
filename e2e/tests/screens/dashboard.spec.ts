import { test, expect, Page } from '@playwright/test';
import { AuthenticationHelper } from '../../page-objects/auth/AuthenticationHelper';

const getScreenHeading = (page: Page) => {
  return page.locator('[data-ui="screen-heading"]');
}

test.describe('Dashboard Screen', () => {
  test.beforeEach(async ({ page }) => {
    const authHelper = new AuthenticationHelper(page);
    await authHelper.ensureAuthenticated();
    await page.goto('/dashboard');
  });

  test('should render the screen heading correctly', async ({ page }) => {
    // Verify we're on the dashboard page
    await expect(page).toHaveURL(/.*dashboard/);

    // Check for the screen heading
    await expect(getScreenHeading(page)).toBeVisible();
    
    const title = page.locator('[data-ui="title"]');
    const subtitle = page.locator('[data-ui="subtitle"]');
    await expect(title).toContainText("Hello,");
    await expect(subtitle).toContainText("mariobrusarosco");
  });

  test("should render the screen matchday section correctly", async ({ page }) => {
    const matchdaySection = page.locator('[data-ui="matchday"]');

    await expect(matchdaySection).toContainText(/matchday/i);
  });

  test("should render the screen tournaments performance section correctly", async ({ page }) => {
    const tournamentsPerformanceSection = page.locator('[data-ui="tournaments-perf"]');

    await expect(tournamentsPerformanceSection).toContainText(/tournaments/i);
  });
  

  test("should render the best ranked section correctly", async ({ page }) => {
    const tournamentsPerformanceSection = page.locator('[data-ui="tournaments-perf"]');
    const bestRankedSection = tournamentsPerformanceSection.locator('text=best ranked');
    const matchesButton = bestRankedSection.locator(':scope + button>[href]');
    
    await matchesButton.click();

    await expect(matchesButton).toHaveAttribute('href', /\/tournaments\/[a-zA-Z0-9-]+\/matches/);       
    await expect(matchesButton).toBeVisible();
    await expect(bestRankedSection).toContainText(/best ranked/i);
    await expect(page).toHaveURL(/\/tournaments\/[a-zA-Z0-9-]+\/matches/);
  });

  test("should render the screen worst performance section correctly", async ({ page }) => {
    const tournamentsPerformanceSection = page.locator('[data-ui="tournaments-perf"]');
    const worstPerformanceSection = tournamentsPerformanceSection.locator('text=worst ranked');
    const matchesButton = worstPerformanceSection.locator(':scope + button>[href]');
    
    await matchesButton.click();

    await expect(matchesButton).toHaveAttribute('href', /\/tournaments\/[a-zA-Z0-9-]+\/matches/);       
    await expect(matchesButton).toBeVisible();
    await expect(worstPerformanceSection).toContainText(/worst ranked/i);
    await expect(page).toHaveURL(/\/tournaments\/[a-zA-Z0-9-]+\/matches/);
  });
});
