import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../page-objects/screens/DashboardPage';
import { TournamentPage } from '../../page-objects/screens/TournamentPage';
import { LeaguePage } from '../../page-objects/screens/LeaguePage';
import { NavigationHelper } from '../../page-objects/screens/NavigationHelper';
import { TestConfig } from '../../config/TestConfig';

test.describe('Cross-Screen Navigation - Comprehensive Tests', () => {
  let dashboardPage: DashboardPage;
  let tournamentPage: TournamentPage;
  let leaguePage: LeaguePage;
  let navigationHelper: NavigationHelper;
  let testConfig: TestConfig;

  test.beforeEach(async ({ page }) => {
    testConfig = new TestConfig();
    dashboardPage = new DashboardPage(page, testConfig);
    tournamentPage = new TournamentPage(page, testConfig);
    leaguePage = new LeaguePage(page, testConfig);
    navigationHelper = new NavigationHelper(page, testConfig);
    
    // Start from dashboard
    await dashboardPage.navigate();
  });

  test.describe('Sequential Navigation Tests', () => {
    test('should navigate through all main screens in sequence', async () => {
      // Start at dashboard
      await expect(dashboardPage.page).toHaveURL(/.*dashboard/);
      await dashboardPage.verifyDashboardElements();
      
      // Navigate to tournaments
      await navigationHelper.navigateToTournaments();
      await expect(tournamentPage.page).toHaveURL(/.*tournaments/);
      await tournamentPage.verifyTournamentsPageLoad();
      
      // Navigate to leagues
      await navigationHelper.navigateToLeagues();
      await expect(leaguePage.page).toHaveURL(/.*leagues/);
      await leaguePage.verifyLeaguesPageLoad();
      
      // Navigate to my account
      await navigationHelper.navigateToMyAccount();
      await expect(dashboardPage.page).toHaveURL(/.*my-account/);
      
      // Return to dashboard
      await navigationHelper.navigateToDashboard();
      await expect(dashboardPage.page).toHaveURL(/.*dashboard/);
      await dashboardPage.verifyDashboardElements();
    });

    test('should maintain functionality after multiple navigation cycles', async () => {
      // Perform multiple navigation cycles
      for (let i = 0; i < 3; i++) {
        // Dashboard -> Tournaments -> Leagues -> My Account -> Dashboard
        await navigationHelper.navigateToTournaments();
        await tournamentPage.verifyTournamentsPageLoad();
        
        await navigationHelper.navigateToLeagues();
        await leaguePage.verifyLeaguesPageLoad();
        
        await navigationHelper.navigateToMyAccount();
        await expect(dashboardPage.page).toHaveURL(/.*my-account/);
        
        await navigationHelper.navigateToDashboard();
        await dashboardPage.verifyDashboardElements();
      }
    });

    test('should handle reverse navigation flow', async () => {
      // Navigate in reverse order: Dashboard -> My Account -> Leagues -> Tournaments -> Dashboard
      await navigationHelper.navigateToMyAccount();
      await expect(dashboardPage.page).toHaveURL(/.*my-account/);
      
      await navigationHelper.navigateToLeagues();
      await expect(leaguePage.page).toHaveURL(/.*leagues/);
      await leaguePage.verifyLeaguesPageLoad();
      
      await navigationHelper.navigateToTournaments();
      await expect(tournamentPage.page).toHaveURL(/.*tournaments/);
      await tournamentPage.verifyTournamentsPageLoad();
      
      await navigationHelper.navigateToDashboard();
      await expect(dashboardPage.page).toHaveURL(/.*dashboard/);
      await dashboardPage.verifyDashboardElements();
    });
  });

  test.describe('Direct Navigation Tests', () => {
    test('should support direct URL navigation to all screens', async () => {
      const routes = [
        { path: '/dashboard', verifyMethod: () => dashboardPage.verifyDashboardElements() },
        { path: '/tournaments', verifyMethod: () => tournamentPage.verifyTournamentsPageLoad() },
        { path: '/leagues', verifyMethod: () => leaguePage.verifyLeaguesPageLoad() },
        { path: '/my-account', verifyMethod: () => expect(dashboardPage.page).toHaveURL(/.*my-account/) }
      ];

      for (const route of routes) {
        await navigationHelper.navigateToRoute(route.path);
        await expect(dashboardPage.page).toHaveURL(new RegExp(`.*${route.path.replace('/', '')}`));
        await route.verifyMethod();
      }
    });

    test('should handle browser back and forward navigation', async () => {
      // Navigate through screens
      await navigationHelper.navigateToTournaments();
      await navigationHelper.navigateToLeagues();
      await navigationHelper.navigateToMyAccount();
      
      // Use browser back button
      await dashboardPage.page.goBack();
      await expect(dashboardPage.page).toHaveURL(/.*leagues/);
      
      await dashboardPage.page.goBack();
      await expect(dashboardPage.page).toHaveURL(/.*tournaments/);
      
      await dashboardPage.page.goBack();
      await expect(dashboardPage.page).toHaveURL(/.*dashboard/);
      
      // Use browser forward button
      await dashboardPage.page.goForward();
      await expect(dashboardPage.page).toHaveURL(/.*tournaments/);
      
      await dashboardPage.page.goForward();
      await expect(dashboardPage.page).toHaveURL(/.*leagues/);
    });

    test('should handle page refresh on different screens', async () => {
      const screens = [
        { navigate: () => navigationHelper.navigateToDashboard(), verify: () => dashboardPage.verifyDashboardElements() },
        { navigate: () => navigationHelper.navigateToTournaments(), verify: () => tournamentPage.verifyTournamentsPageLoad() },
        { navigate: () => navigationHelper.navigateToLeagues(), verify: () => leaguePage.verifyLeaguesPageLoad() },
        { navigate: () => navigationHelper.navigateToMyAccount(), verify: () => expect(dashboardPage.page).toHaveURL(/.*my-account/) }
      ];

      for (const screen of screens) {
        await screen.navigate();
        await dashboardPage.page.reload();
        await screen.verify();
      }
    });
  });

  test.describe('Navigation Performance Tests', () => {
    test('should navigate between screens within acceptable time limits', async () => {
      const performanceResults = await navigationHelper.testNavigationPerformance();
      
      // Verify all navigation times are reasonable (less than 5 seconds each)
      Object.entries(performanceResults).forEach(([screen, time]) => {
        expect(time).toBeLessThan(5000);
        console.log(`${screen} navigation time: ${time}ms`);
      });
    });

    test('should maintain consistent navigation performance', async () => {
      const iterations = 3;
      const performanceData: { [key: string]: number[] } = {};
      
      // Run multiple performance tests
      for (let i = 0; i < iterations; i++) {
        const results = await navigationHelper.testNavigationPerformance();
        
        Object.entries(results).forEach(([screen, time]) => {
          if (!performanceData[screen]) {
            performanceData[screen] = [];
          }
          performanceData[screen].push(time);
        });
      }
      
      // Verify performance consistency (standard deviation should be reasonable)
      Object.entries(performanceData).forEach(([screen, times]) => {
        const average = times.reduce((a, b) => a + b, 0) / times.length;
        const variance = times.reduce((a, b) => a + Math.pow(b - average, 2), 0) / times.length;
        const stdDev = Math.sqrt(variance);
        
        // Standard deviation should be less than 50% of average time
        expect(stdDev).toBeLessThan(average * 0.5);
        console.log(`${screen} average: ${average.toFixed(2)}ms, std dev: ${stdDev.toFixed(2)}ms`);
      });
    });
  });

  test.describe('Navigation State Management', () => {
    test('should preserve application state during navigation', async () => {
      // Navigate to dashboard and verify initial state
      await dashboardPage.verifyDashboardElements();
      const initialUserName = await dashboardPage.getUserDisplayName();
      
      // Navigate through other screens
      await navigationHelper.navigateToTournaments();
      await navigationHelper.navigateToLeagues();
      await navigationHelper.navigateToMyAccount();
      
      // Return to dashboard and verify state is preserved
      await navigationHelper.navigateToDashboard();
      await dashboardPage.verifyDashboardElements();
      const finalUserName = await dashboardPage.getUserDisplayName();
      
      expect(finalUserName).toBe(initialUserName);
    });

    test('should handle navigation with data interactions', async () => {
      // Start at dashboard
      await dashboardPage.verifyDashboardElements();
      
      // Navigate to tournaments and interact with data if available
      await navigationHelper.navigateToTournaments();
      const tournamentCount = await tournamentPage.getTournamentCardCount();
      
      if (tournamentCount > 0) {
        // Click on a tournament card
        await tournamentPage.clickTournamentCard(0);
        
        // Navigate back to tournaments
        await navigationHelper.navigateToTournaments();
        
        // Verify tournaments page still works
        await tournamentPage.verifyTournamentsPageLoad();
      }
      
      // Navigate to leagues and interact with data if available
      await navigationHelper.navigateToLeagues();
      const leagueCount = await leaguePage.getLeagueCardCount();
      
      if (leagueCount > 0) {
        // Click on a league card
        await leaguePage.clickLeagueCard(0);
        
        // Navigate back to leagues
        await navigationHelper.navigateToLeagues();
        
        // Verify leagues page still works
        await leaguePage.verifyLeaguesPageLoad();
      }
      
      // Return to dashboard and verify it still works
      await navigationHelper.navigateToDashboard();
      await dashboardPage.verifyDashboardElements();
    });
  });

  test.describe('Responsive Navigation Tests', () => {
    test('should maintain navigation functionality across different viewport sizes', async () => {
      const viewports = [
        { width: 1920, height: 1080 }, // Desktop
        { width: 1024, height: 768 },  // Tablet
        { width: 375, height: 667 }    // Mobile
      ];

      for (const viewport of viewports) {
        await dashboardPage.page.setViewportSize(viewport);
        await dashboardPage.page.waitForTimeout(500);
        
        // Test navigation at this viewport size
        await navigationHelper.verifyResponsiveNavigation([viewport]);
        
        // Verify all screens are accessible
        await navigationHelper.navigateToTournaments();
        await tournamentPage.verifyTournamentsPageLoad();
        
        await navigationHelper.navigateToLeagues();
        await leaguePage.verifyLeaguesPageLoad();
        
        await navigationHelper.navigateToMyAccount();
        await expect(dashboardPage.page).toHaveURL(/.*my-account/);
        
        await navigationHelper.navigateToDashboard();
        await dashboardPage.verifyDashboardElements();
      }
    });

    test('should handle viewport changes during navigation', async () => {
      // Start with desktop viewport
      await dashboardPage.page.setViewportSize({ width: 1920, height: 1080 });
      await navigationHelper.navigateToTournaments();
      
      // Change to tablet during navigation
      await dashboardPage.page.setViewportSize({ width: 1024, height: 768 });
      await navigationHelper.navigateToLeagues();
      
      // Change to mobile during navigation
      await dashboardPage.page.setViewportSize({ width: 375, height: 667 });
      await navigationHelper.navigateToMyAccount();
      
      // Verify navigation still works
      await navigationHelper.navigateToDashboard();
      await dashboardPage.verifyDashboardElements();
    });
  });

  test.describe('Error Handling During Navigation', () => {
    test('should handle network issues during navigation gracefully', async () => {
      // Simulate intermittent network issues
      let requestCount = 0;
      await dashboardPage.page.route('**/*', route => {
        requestCount++;
        if (requestCount % 3 === 0) {
          // Delay every third request
          setTimeout(() => route.continue(), 200);
        } else {
          route.continue();
        }
      });
      
      // Test navigation with network delays
      await navigationHelper.navigateToTournaments();
      await tournamentPage.verifyTournamentsPageLoad();
      
      await navigationHelper.navigateToLeagues();
      await leaguePage.verifyLeaguesPageLoad();
      
      await navigationHelper.navigateToDashboard();
      await dashboardPage.verifyDashboardElements();
    });

    test('should recover from navigation errors', async () => {
      // Navigate to a potentially problematic route
      await navigationHelper.navigateToRoute('/non-existent-route');
      
      // Verify we can still navigate to valid routes
      await navigationHelper.navigateToDashboard();
      await expect(dashboardPage.page).toHaveURL(/.*dashboard/);
      await dashboardPage.verifyDashboardElements();
      
      // Test other navigation still works
      await navigationHelper.navigateToTournaments();
      await tournamentPage.verifyTournamentsPageLoad();
    });
  });

  test.describe('Complete Cross-Screen Navigation Verification', () => {
    test('should pass comprehensive navigation verification', async () => {
      await navigationHelper.performCompleteNavigationVerification();
    });

    test('should maintain all screen functionality after extensive navigation', async () => {
      // Perform extensive navigation testing
      const navigationSequences = [
        ['dashboard', 'tournaments', 'leagues', 'myAccount'],
        ['tournaments', 'dashboard', 'myAccount', 'leagues'],
        ['leagues', 'myAccount', 'dashboard', 'tournaments'],
        ['myAccount', 'leagues', 'tournaments', 'dashboard']
      ];

      for (const sequence of navigationSequences) {
        for (const screen of sequence) {
          switch (screen) {
            case 'dashboard':
              await navigationHelper.navigateToDashboard();
              await dashboardPage.verifyDashboardElements();
              break;
            case 'tournaments':
              await navigationHelper.navigateToTournaments();
              await tournamentPage.verifyTournamentsPageLoad();
              break;
            case 'leagues':
              await navigationHelper.navigateToLeagues();
              await leaguePage.verifyLeaguesPageLoad();
              break;
            case 'myAccount':
              await navigationHelper.navigateToMyAccount();
              await expect(dashboardPage.page).toHaveURL(/.*my-account/);
              break;
          }
        }
      }
      
      // Final verification - return to dashboard
      await navigationHelper.navigateToDashboard();
      await dashboardPage.verifyDashboardElements();
    });
  });
});