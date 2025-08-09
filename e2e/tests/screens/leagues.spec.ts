import { test, expect } from '@playwright/test';
import { LeaguePage } from '../../page-objects/screens/LeaguePage';
import { NavigationHelper } from '../../page-objects/screens/NavigationHelper';
import { TestConfig } from '../../config/TestConfig';

test.describe('Leagues Screen - Comprehensive Functionality Tests', () => {
  let leaguePage: LeaguePage;
  let navigationHelper: NavigationHelper;
  let testConfig: TestConfig;

  test.beforeEach(async ({ page }) => {
    testConfig = new TestConfig();
    leaguePage = new LeaguePage(page, testConfig);
    navigationHelper = new NavigationHelper(page, testConfig);
    
    await leaguePage.navigate();
  });

  test.describe('Basic League Page Elements', () => {
    test('should load leagues page correctly', async () => {
      await leaguePage.verifyLeaguesPageLoad();
    });

    test('should display league cards or empty state', async () => {
      await leaguePage.verifyLeagueCardsDisplay();
    });

    test('should have correct page URL', async () => {
      await expect(leaguePage.page).toHaveURL(/.*leagues/);
    });
  });

  test.describe('Data Loading and Display Validation', () => {
    test('should load league data within acceptable time', async () => {
      const startTime = Date.now();
      await leaguePage.navigate();
      await leaguePage.waitForLoad();
      const loadTime = Date.now() - startTime;
      
      // Verify load time is reasonable (less than 10 seconds)
      expect(loadTime).toBeLessThan(10000);
    });

    test('should display league cards with proper structure', async () => {
      const cardCount = await leaguePage.getLeagueCardCount();
      
      if (cardCount > 0) {
        // Verify first league card is visible and has content
        const firstCard = leaguePage.getLeagueCard(0);
        await expect(firstCard).toBeVisible();
        
        // Get league titles to verify data is loaded
        const titles = await leaguePage.getLeagueTitles();
        expect(titles.length).toBeGreaterThan(0);
        expect(titles[0]).toBeTruthy();
      } else {
        // Verify empty state is handled properly
        const isEmpty = await leaguePage.isLeaguesPageEmpty();
        expect(isEmpty).toBe(true);
      }
    });

    test('should display league metadata when available', async () => {
      const cardCount = await leaguePage.getLeagueCardCount();
      
      if (cardCount > 0) {
        // Test getting league participants count
        const participantsCount = await leaguePage.getLeagueParticipantsCount(0);
        // Participants count might be empty, but should not throw error
        expect(typeof participantsCount).toBe('string');
        
        // Test getting league status
        const status = await leaguePage.getLeagueStatus(0);
        // Status might be empty, but should not throw error
        expect(typeof status).toBe('string');
      }
    });

    test('should handle empty leagues state gracefully', async () => {
      const isEmpty = await leaguePage.isLeaguesPageEmpty();
      
      if (isEmpty) {
        // Verify appropriate empty state messaging or handling
        console.log('Leagues page is empty - this is acceptable for demo environment');
      } else {
        // Verify leagues are displayed properly
        await leaguePage.verifyLeagueCardsDisplay();
      }
    });
  });

  test.describe('User Interactions and Controls', () => {
    test('should allow clicking on league cards when available', async () => {
      const cardCount = await leaguePage.getLeagueCardCount();
      
      if (cardCount > 0) {
        // Test clicking on first league card
        await leaguePage.clickLeagueCard(0);
        
        // Verify navigation occurred (URL should change)
        await expect(leaguePage.page).not.toHaveURL(/^.*\/leagues$/);
      } else {
        console.log('No league cards available to test clicking');
      }
    });

    test('should support league search if available', async () => {
      // Test search functionality if it exists
      await leaguePage.searchLeague('test');
      
      // Verify page still loads correctly after search
      await leaguePage.verifyLeaguesPageLoad();
    });

    test('should handle league card interactions properly', async () => {
      const cardCount = await leaguePage.getLeagueCardCount();
      
      if (cardCount > 0) {
        const titles = await leaguePage.getLeagueTitles();
        
        if (titles.length > 0) {
          // Test clicking by title
          await leaguePage.clickLeagueCardByTitle(titles[0]);
          
          // Verify navigation occurred
          await expect(leaguePage.page).not.toHaveURL(/^.*\/leagues$/);
        }
      }
    });

    test('should support joining leagues if functionality exists', async () => {
      const cardCount = await leaguePage.getLeagueCardCount();
      
      if (cardCount > 0) {
        // Test join league functionality (if available)
        await leaguePage.joinLeague(0);
        
        // Verify page is still functional after join attempt
        await leaguePage.verifyLeaguesPageLoad();
      }
    });

    test('should support creating new leagues if functionality exists', async () => {
      // Test create league functionality (if available)
      await leaguePage.createLeague('Test League');
      
      // Verify page is still functional after create attempt
      await leaguePage.verifyLeaguesPageLoad();
    });
  });

  test.describe('Navigation Between Screens', () => {
    test('should navigate back to dashboard from leagues', async () => {
      await navigationHelper.navigateToDashboard();
      await expect(leaguePage.page).toHaveURL(/.*dashboard/);
    });

    test('should navigate to tournaments from leagues', async () => {
      await navigationHelper.navigateToTournaments();
      await expect(leaguePage.page).toHaveURL(/.*tournaments/);
    });

    test('should navigate to my account from leagues', async () => {
      await navigationHelper.navigateToMyAccount();
      await expect(leaguePage.page).toHaveURL(/.*my-account/);
    });

    test('should maintain league page state after navigation', async () => {
      // Navigate away and back
      await navigationHelper.navigateToDashboard();
      await navigationHelper.navigateToLeagues();
      
      // Verify leagues page loads correctly
      await leaguePage.verifyLeaguesPageLoad();
    });
  });

  test.describe('League-Specific Navigation', () => {
    test('should navigate to specific league when ID is provided', async () => {
      // Test navigation to a specific league (using a mock ID)
      const mockLeagueId = 'test-league-123';
      await leaguePage.navigateToLeague(mockLeagueId);
      
      // Verify URL contains league ID (even if league doesn't exist)
      await expect(leaguePage.page).toHaveURL(new RegExp(`leagues/${mockLeagueId}`));
    });

    test('should navigate to league standings when ID is provided', async () => {
      // Test navigation to league standings
      const mockLeagueId = 'test-league-123';
      await leaguePage.navigateToLeagueStandings(mockLeagueId);
      
      // Verify URL contains standings path
      await expect(leaguePage.page).toHaveURL(new RegExp(`leagues/${mockLeagueId}/standings`));
    });
  });

  test.describe('League Data Verification', () => {
    test('should verify league presence when leagues exist', async () => {
      const cardCount = await leaguePage.getLeagueCardCount();
      
      if (cardCount > 0) {
        const titles = await leaguePage.getLeagueTitles();
        
        if (titles.length > 0) {
          // Test verifying league presence
          await leaguePage.verifyLeaguePresent(titles[0]);
        }
      }
    });

    test('should handle league data retrieval correctly', async () => {
      const cardCount = await leaguePage.getLeagueCardCount();
      
      if (cardCount > 0) {
        // Test getting all league titles
        const titles = await leaguePage.getLeagueTitles();
        expect(titles).toBeInstanceOf(Array);
        
        // Verify titles are strings
        titles.forEach(title => {
          expect(typeof title).toBe('string');
          expect(title.length).toBeGreaterThan(0);
        });
      }
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
        await leaguePage.page.setViewportSize(viewport);
        await leaguePage.page.waitForTimeout(500); // Allow responsive changes
        
        // Verify leagues page elements are still accessible
        await leaguePage.verifyLeaguesPageLoad();
      }
    });

    test('should handle window resize gracefully', async () => {
      // Start with desktop size
      await leaguePage.page.setViewportSize({ width: 1920, height: 1080 });
      await leaguePage.verifyLeaguesPageLoad();
      
      // Resize to mobile
      await leaguePage.page.setViewportSize({ width: 375, height: 667 });
      await leaguePage.page.waitForTimeout(500);
      
      // Verify page is still functional
      await leaguePage.verifyLeaguesPageLoad();
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('should handle page refresh gracefully', async () => {
      // Refresh the page
      await leaguePage.page.reload();
      await leaguePage.waitForLoad();
      
      // Verify leagues page loads correctly after refresh
      await leaguePage.verifyLeaguesPageLoad();
    });

    test('should handle network delays gracefully', async () => {
      // Simulate slow network
      await leaguePage.page.route('**/*', route => {
        setTimeout(() => route.continue(), 100);
      });
      
      // Navigate and verify it still works
      await leaguePage.navigate();
      await leaguePage.verifyLeaguesPageLoad();
    });

    test('should handle invalid league IDs gracefully', async () => {
      // Navigate to non-existent league
      const invalidId = 'non-existent-league-999';
      await leaguePage.navigateToLeague(invalidId);
      
      // Verify page handles invalid ID (should not crash)
      // The exact behavior depends on the application's error handling
      await expect(leaguePage.page).toHaveURL(new RegExp(`leagues/${invalidId}`));
    });
  });

  test.describe('Performance and Accessibility', () => {
    test('should meet basic accessibility requirements', async () => {
      // Verify page has proper heading structure
      const hasScreenHeading = await leaguePage.page.locator('[data-ui="screen-heading"]').isVisible();
      const hasLeagueList = await leaguePage.page.locator('[data-testid="league-list"]').isVisible();
      
      // At least one of these should be present for accessibility
      expect(hasScreenHeading || hasLeagueList).toBe(true);
    });

    test('should load league content efficiently', async () => {
      // Measure performance of league operations
      const performanceResults = await navigationHelper.testNavigationPerformance();
      
      // Verify leagues navigation is reasonably fast (less than 5 seconds)
      expect(performanceResults.leagues).toBeLessThan(5000);
    });
  });

  test.describe('Complete League Verification', () => {
    test('should pass comprehensive league verification', async () => {
      await leaguePage.performCompleteVerification();
    });

    test('should maintain functionality across multiple interactions', async () => {
      // Perform multiple league operations
      await leaguePage.verifyLeaguesPageLoad();
      await leaguePage.verifyLeagueCardsDisplay();
      
      // Test navigation if leagues are available
      const cardCount = await leaguePage.getLeagueCardCount();
      if (cardCount > 0) {
        await leaguePage.clickLeagueCard(0);
        await navigationHelper.navigateToLeagues();
      }
      
      // Verify leagues page is still functional
      await leaguePage.verifyLeaguesPageLoad();
    });
  });
});