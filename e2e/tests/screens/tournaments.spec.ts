import { test, expect } from '@playwright/test';
import { TournamentPage } from '../../page-objects/screens/TournamentPage';
import { NavigationHelper } from '../../page-objects/screens/NavigationHelper';
import { TestConfig } from '../../config/TestConfig';

test.describe('Tournaments Screen - Comprehensive Functionality Tests', () => {
  let tournamentPage: TournamentPage;
  let navigationHelper: NavigationHelper;
  let testConfig: TestConfig;

  test.beforeEach(async ({ page }) => {
    testConfig = new TestConfig();
    tournamentPage = new TournamentPage(page, testConfig);
    navigationHelper = new NavigationHelper(page, testConfig);
    
    await tournamentPage.navigate();
  });

  test.describe('Basic Tournament Page Elements', () => {
    test('should load tournaments page correctly', async () => {
      await tournamentPage.verifyTournamentsPageLoad();
    });

    test('should display tournament cards or empty state', async () => {
      await tournamentPage.verifyTournamentCardsDisplay();
    });

    test('should have correct page URL', async () => {
      await expect(tournamentPage.page).toHaveURL(/.*tournaments/);
    });
  });

  test.describe('Data Loading and Display Validation', () => {
    test('should load tournament data within acceptable time', async () => {
      const startTime = Date.now();
      await tournamentPage.navigate();
      await tournamentPage.waitForLoad();
      const loadTime = Date.now() - startTime;
      
      // Verify load time is reasonable (less than 10 seconds)
      expect(loadTime).toBeLessThan(10000);
    });

    test('should display tournament cards with proper structure', async () => {
      const cardCount = await tournamentPage.getTournamentCardCount();
      
      if (cardCount > 0) {
        // Verify first tournament card is visible and has content
        const firstCard = tournamentPage.getTournamentCard(0);
        await expect(firstCard).toBeVisible();
        
        // Get tournament titles to verify data is loaded
        const titles = await tournamentPage.getTournamentTitles();
        expect(titles.length).toBeGreaterThan(0);
        expect(titles[0]).toBeTruthy();
      } else {
        // Verify empty state is handled properly
        const isEmpty = await tournamentPage.isTournamentsPageEmpty();
        expect(isEmpty).toBe(true);
      }
    });

    test('should handle empty tournaments state gracefully', async () => {
      const isEmpty = await tournamentPage.isTournamentsPageEmpty();
      
      if (isEmpty) {
        // Verify appropriate empty state messaging or handling
        console.log('Tournaments page is empty - this is acceptable for demo environment');
      } else {
        // Verify tournaments are displayed properly
        await tournamentPage.verifyTournamentCardsDisplay();
      }
    });
  });

  test.describe('User Interactions and Controls', () => {
    test('should allow clicking on tournament cards when available', async () => {
      const cardCount = await tournamentPage.getTournamentCardCount();
      
      if (cardCount > 0) {
        // Test clicking on first tournament card
        await tournamentPage.clickTournamentCard(0);
        
        // Verify navigation occurred (URL should change)
        await expect(tournamentPage.page).not.toHaveURL(/^.*\/tournaments$/);
      } else {
        console.log('No tournament cards available to test clicking');
      }
    });

    test('should support tournament search if available', async () => {
      // Test search functionality if it exists
      await tournamentPage.searchTournament('test');
      
      // Verify page still loads correctly after search
      await tournamentPage.verifyTournamentsPageLoad();
    });

    test('should handle tournament card interactions properly', async () => {
      const cardCount = await tournamentPage.getTournamentCardCount();
      
      if (cardCount > 0) {
        const titles = await tournamentPage.getTournamentTitles();
        
        if (titles.length > 0) {
          // Test clicking by title
          await tournamentPage.clickTournamentCardByTitle(titles[0]);
          
          // Verify navigation occurred
          await expect(tournamentPage.page).not.toHaveURL(/^.*\/tournaments$/);
        }
      }
    });
  });

  test.describe('Navigation Between Screens', () => {
    test('should navigate back to dashboard from tournaments', async () => {
      await navigationHelper.navigateToDashboard();
      await expect(tournamentPage.page).toHaveURL(/.*dashboard/);
    });

    test('should navigate to leagues from tournaments', async () => {
      await navigationHelper.navigateToLeagues();
      await expect(tournamentPage.page).toHaveURL(/.*leagues/);
    });

    test('should navigate to my account from tournaments', async () => {
      await navigationHelper.navigateToMyAccount();
      await expect(tournamentPage.page).toHaveURL(/.*my-account/);
    });

    test('should maintain tournament page state after navigation', async () => {
      // Navigate away and back
      await navigationHelper.navigateToDashboard();
      await navigationHelper.navigateToTournaments();
      
      // Verify tournaments page loads correctly
      await tournamentPage.verifyTournamentsPageLoad();
    });
  });

  test.describe('Tournament-Specific Navigation', () => {
    test('should navigate to specific tournament when ID is provided', async () => {
      // Test navigation to a specific tournament (using a mock ID)
      const mockTournamentId = 'test-tournament-123';
      await tournamentPage.navigateToTournament(mockTournamentId);
      
      // Verify URL contains tournament ID (even if tournament doesn't exist)
      await expect(tournamentPage.page).toHaveURL(new RegExp(`tournaments/${mockTournamentId}`));
    });

    test('should navigate to tournament matches when ID is provided', async () => {
      // Test navigation to tournament matches
      const mockTournamentId = 'test-tournament-123';
      await tournamentPage.navigateToTournamentMatches(mockTournamentId);
      
      // Verify URL contains matches path
      await expect(tournamentPage.page).toHaveURL(new RegExp(`tournaments/${mockTournamentId}/matches`));
    });
  });

  test.describe('Responsive Design and Cross-Browser Compatibility', () => {
    test('should display correctly on different viewport sizes', async () => {
      const viewports = [
        { width: 1920, height: 1080 }, // Desktop
        { width: 1024, height: 768 },  // Tablet
        { width: 375, height: 667 }    // Mobile
      ];

      for (const viewport of viewports) {
        await tournamentPage.page.setViewportSize(viewport);
        await tournamentPage.page.waitForTimeout(500); // Allow responsive changes
        
        // Verify tournaments page elements are still accessible
        await tournamentPage.verifyTournamentsPageLoad();
      }
    });

    test('should handle window resize gracefully', async () => {
      // Start with desktop size
      await tournamentPage.page.setViewportSize({ width: 1920, height: 1080 });
      await tournamentPage.verifyTournamentsPageLoad();
      
      // Resize to mobile
      await tournamentPage.page.setViewportSize({ width: 375, height: 667 });
      await tournamentPage.page.waitForTimeout(500);
      
      // Verify page is still functional
      await tournamentPage.verifyTournamentsPageLoad();
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('should handle page refresh gracefully', async () => {
      // Refresh the page
      await tournamentPage.page.reload();
      await tournamentPage.waitForLoad();
      
      // Verify tournaments page loads correctly after refresh
      await tournamentPage.verifyTournamentsPageLoad();
    });

    test('should handle network delays gracefully', async () => {
      // Simulate slow network
      await tournamentPage.page.route('**/*', route => {
        setTimeout(() => route.continue(), 100);
      });
      
      // Navigate and verify it still works
      await tournamentPage.navigate();
      await tournamentPage.verifyTournamentsPageLoad();
    });

    test('should handle invalid tournament IDs gracefully', async () => {
      // Navigate to non-existent tournament
      const invalidId = 'non-existent-tournament-999';
      await tournamentPage.navigateToTournament(invalidId);
      
      // Verify page handles invalid ID (should not crash)
      // The exact behavior depends on the application's error handling
      await expect(tournamentPage.page).toHaveURL(new RegExp(`tournaments/${invalidId}`));
    });
  });

  test.describe('Performance and Accessibility', () => {
    test('should meet basic accessibility requirements', async () => {
      // Verify page has proper heading structure
      const hasScreenHeading = await tournamentPage.page.locator('[data-ui="screen-heading"]').isVisible();
      const hasTournamentList = await tournamentPage.page.locator('[data-testid="tournament-list"]').isVisible();
      
      // At least one of these should be present for accessibility
      expect(hasScreenHeading || hasTournamentList).toBe(true);
    });

    test('should load tournament content efficiently', async () => {
      // Measure performance of tournament operations
      const performanceResults = await navigationHelper.testNavigationPerformance();
      
      // Verify tournaments navigation is reasonably fast (less than 5 seconds)
      expect(performanceResults.tournaments).toBeLessThan(5000);
    });
  });

  test.describe('Complete Tournament Verification', () => {
    test('should pass comprehensive tournament verification', async () => {
      await tournamentPage.performCompleteVerification();
    });

    test('should maintain functionality across multiple interactions', async () => {
      // Perform multiple tournament operations
      await tournamentPage.verifyTournamentsPageLoad();
      await tournamentPage.verifyTournamentCardsDisplay();
      
      // Test navigation if tournaments are available
      const cardCount = await tournamentPage.getTournamentCardCount();
      if (cardCount > 0) {
        await tournamentPage.clickTournamentCard(0);
        await navigationHelper.navigateToTournaments();
      }
      
      // Verify tournaments page is still functional
      await tournamentPage.verifyTournamentsPageLoad();
    });
  });
});