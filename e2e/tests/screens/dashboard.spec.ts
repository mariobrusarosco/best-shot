import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../page-objects/screens/DashboardPage';
import { NavigationHelper } from '../../page-objects/screens/NavigationHelper';
import { TestConfig } from '../../config/TestConfig';
import { ResponsiveTestHelper } from '../../utils/ResponsiveTestHelper';
import { dashboardTestData } from '../../fixtures/TestData';

test.describe('Dashboard Screen - Comprehensive Functionality Tests', () => {
  let dashboardPage: DashboardPage;
  let navigationHelper: NavigationHelper;
  let testConfig: TestConfig;

  test.beforeEach(async ({ page }) => {
    testConfig = new TestConfig();
    dashboardPage = new DashboardPage(page, testConfig);
    navigationHelper = new NavigationHelper(page, testConfig);
    
    await dashboardPage.navigate();
  });

  test.describe('Basic Dashboard Elements', () => {
    test('should render all dashboard elements correctly', async () => {
      await dashboardPage.verifyDashboardElements();
    });

    test('should display correct user information', async () => {
      // Verify title contains greeting
      await expect(dashboardPage.getTitle()).toContainText("Hello,");
      
      // Verify subtitle contains username
      await expect(dashboardPage.getSubtitle()).toContainText("mariobrusarosco");
      
      // Verify user display name can be retrieved
      const displayName = await dashboardPage.getUserDisplayName();
      expect(displayName).toBeTruthy();
    });

    test('should have visible and accessible screen sections', async () => {
      // Verify matchday section visibility
      const isMatchdayVisible = await dashboardPage.isMatchdaySectionVisible();
      expect(isMatchdayVisible).toBe(true);
      
      // Verify tournaments performance section visibility
      const isTournamentsVisible = await dashboardPage.isTournamentsPerformanceSectionVisible();
      expect(isTournamentsVisible).toBe(true);
    });
  });

  test.describe('Data Loading and Display Validation', () => {
    test('should load dashboard data within acceptable time', async () => {
      // Navigate to dashboard and measure load time
      const startTime = Date.now();
      await dashboardPage.navigate();
      await dashboardPage.waitForLoad();
      const loadTime = Date.now() - startTime;
      
      // Verify load time is reasonable (less than 10 seconds)
      expect(loadTime).toBeLessThan(10000);
    });

    test('should display matchday section with content', async () => {
      const matchdaySection = dashboardPage.getMatchdaySection();
      
      // Verify section is visible
      await expect(matchdaySection).toBeVisible();
      
      // Verify section contains matchday-related content
      await expect(matchdaySection).toContainText(/matchday/i);
    });

    test('should display tournaments performance section with data', async () => {
      const tournamentsSection = dashboardPage.getTournamentsPerformanceSection();
      
      // Verify section is visible
      await expect(tournamentsSection).toBeVisible();
      
      // Verify section contains tournaments-related content
      await expect(tournamentsSection).toContainText(/tournaments/i);
      
      // Verify performance sections are present
      await dashboardPage.verifyBestRankedSection();
      await dashboardPage.verifyWorstPerformanceSection();
    });

    test('should handle data loading states gracefully', async () => {
      // Refresh page to test loading states
      await dashboardPage.navigate();
      
      // Verify page loads without errors
      await dashboardPage.waitForLoad();
      await dashboardPage.verifyDashboardElements();
    });
  });

  test.describe('User Interactions and Controls', () => {
    test('should navigate to best tournament matches when clicked', async () => {
      // Click on best ranked matches button
      await dashboardPage.navigateToTournamentMatches('best');
      
      // Verify navigation occurred
      await expect(dashboardPage.page).toHaveURL(/\/tournaments\/[a-zA-Z0-9-]+\/matches/);
    });

    test('should navigate to worst tournament matches when clicked', async () => {
      // Click on worst ranked matches button
      await dashboardPage.navigateToTournamentMatches('worst');
      
      // Verify navigation occurred
      await expect(dashboardPage.page).toHaveURL(/\/tournaments\/[a-zA-Z0-9-]+\/matches/);
    });

    test('should have functional tournament performance buttons', async () => {
      // Test best ranked button
      const bestButton = dashboardPage.getMatchesButton('best');
      await expect(bestButton).toBeVisible();
      await expect(bestButton).toHaveAttribute('href', /\/tournaments\/[a-zA-Z0-9-]+\/matches/);
      
      // Test worst performance button
      const worstButton = dashboardPage.getMatchesButton('worst');
      await expect(worstButton).toBeVisible();
      await expect(worstButton).toHaveAttribute('href', /\/tournaments\/[a-zA-Z0-9-]+\/matches/);
    });

    test('should maintain state after user interactions', async () => {
      // Navigate to tournament matches and back
      await dashboardPage.navigateToTournamentMatches('best');
      await navigationHelper.navigateToDashboard();
      
      // Verify dashboard state is maintained
      await dashboardPage.verifyDashboardElements();
    });
  });

  test.describe('Navigation Between Screens', () => {
    test('should navigate to tournaments page from dashboard', async () => {
      await navigationHelper.navigateToTournaments();
      await expect(dashboardPage.page).toHaveURL(/.*tournaments/);
    });

    test('should navigate to leagues page from dashboard', async () => {
      await navigationHelper.navigateToLeagues();
      await expect(dashboardPage.page).toHaveURL(/.*leagues/);
    });

    test('should navigate to my account page from dashboard', async () => {
      await navigationHelper.navigateToMyAccount();
      await expect(dashboardPage.page).toHaveURL(/.*my-account/);
    });

    test('should return to dashboard from other pages', async () => {
      // Navigate away and back
      await navigationHelper.navigateToTournaments();
      await navigationHelper.navigateToDashboard();
      
      // Verify we're back on dashboard
      await expect(dashboardPage.page).toHaveURL(/.*dashboard/);
      await dashboardPage.verifyDashboardElements();
    });

    test('should maintain navigation state across page transitions', async () => {
      // Test navigation sequence
      await navigationHelper.navigateAllPages();
      
      // Verify we end up back on dashboard
      await expect(dashboardPage.page).toHaveURL(/.*dashboard/);
    });
  });

  test.describe('Responsive Design and Cross-Browser Compatibility', () => {
    let responsiveHelper: ResponsiveTestHelper;

    test.beforeEach(async () => {
      const { ResponsiveTestHelper, RESPONSIVE_VIEWPORTS } = await import('../../utils/ResponsiveTestHelper');
      responsiveHelper = new ResponsiveTestHelper(dashboardPage.page);
    });

    test('should display correctly on different viewport sizes', async () => {
      const { RESPONSIVE_VIEWPORTS } = await import('../../utils/ResponsiveTestHelper');
      const criticalElements = [
        dashboardTestData.selectors.screenHeading,
        dashboardTestData.selectors.matchdaySection,
        dashboardTestData.selectors.tournamentsPerformanceSection
      ];

      await responsiveHelper.verifyLayoutConsistency(criticalElements, RESPONSIVE_VIEWPORTS);
    });

    test('should handle window resize gracefully', async () => {
      const { RESPONSIVE_VIEWPORTS } = await import('../../utils/ResponsiveTestHelper');
      const desktopViewport = RESPONSIVE_VIEWPORTS.find(v => v.name === 'desktop-large')!;
      const mobileViewport = RESPONSIVE_VIEWPORTS.find(v => v.name === 'mobile-standard')!;

      await responsiveHelper.testWindowResize(
        desktopViewport,
        mobileViewport,
        async () => {
          await dashboardPage.verifyDashboardElements();
        }
      );
    });

    test('should maintain element accessibility across viewports', async () => {
      const { RESPONSIVE_VIEWPORTS } = await import('../../utils/ResponsiveTestHelper');
      
      await responsiveHelper.verifyElementAccessibility(
        dashboardTestData.selectors.screenHeading,
        RESPONSIVE_VIEWPORTS
      );

      await responsiveHelper.verifyElementAccessibility(
        dashboardTestData.selectors.matchdaySection,
        RESPONSIVE_VIEWPORTS
      );
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('should handle page refresh gracefully', async () => {
      // Refresh the page
      await dashboardPage.page.reload();
      await dashboardPage.waitForLoad();
      
      // Verify dashboard loads correctly after refresh
      await dashboardPage.verifyDashboardElements();
    });

    test('should handle network delays gracefully', async () => {
      // Simulate slow network
      await dashboardPage.page.route('**/*', route => {
        setTimeout(() => route.continue(), 100);
      });
      
      // Navigate and verify it still works
      await dashboardPage.navigate();
      await dashboardPage.verifyDashboardElements();
    });

    test('should display appropriate content when data is unavailable', async () => {
      // This test would verify graceful handling of missing data
      // For now, we verify the page structure is maintained
      await dashboardPage.verifyDashboardElements();
    });
  });

  test.describe('Performance and Accessibility', () => {
    test('should meet basic accessibility requirements', async () => {
      // Verify screen heading has proper structure
      const screenHeading = dashboardPage.getScreenHeading();
      await expect(screenHeading).toBeVisible();
      
      // Verify interactive elements are accessible
      const bestButton = dashboardPage.getMatchesButton('best');
      const worstButton = dashboardPage.getMatchesButton('worst');
      
      await expect(bestButton).toBeVisible();
      await expect(worstButton).toBeVisible();
    });

    test('should load dashboard content efficiently', async () => {
      // Measure performance of dashboard operations
      const performanceResults = await navigationHelper.testNavigationPerformance();
      
      // Verify dashboard navigation is reasonably fast (less than 5 seconds)
      expect(performanceResults.dashboard).toBeLessThan(5000);
    });
  });

  test.describe('Complete Dashboard Verification', () => {
    test('should pass comprehensive dashboard verification', async () => {
      await dashboardPage.performCompleteVerification();
    });

    test('should maintain functionality across multiple interactions', async () => {
      // Perform multiple dashboard operations
      await dashboardPage.verifyDashboardElements();
      await dashboardPage.navigateToTournamentMatches('best');
      await navigationHelper.navigateToDashboard();
      await dashboardPage.navigateToTournamentMatches('worst');
      await navigationHelper.navigateToDashboard();
      
      // Verify dashboard is still functional
      await dashboardPage.verifyDashboardElements();
    });
  });
});
