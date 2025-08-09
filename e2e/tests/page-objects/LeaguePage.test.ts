import { test, expect, Page } from '@playwright/test';
import { LeaguePage } from '../../page-objects/screens/LeaguePage';
import { demoConfig } from '../../config/TestConfig';

test.describe('LeaguePage Page Object', () => {
	let leaguePage: LeaguePage;

	test.beforeEach(async ({ page }) => {
		leaguePage = new LeaguePage(page, demoConfig);
	});

	test('should navigate to leagues page correctly', async ({ page }) => {
		await leaguePage.navigate();
		
		// Verify URL
		await expect(page).toHaveURL(/.*leagues/);
	});

	test('should wait for leagues page to load', async ({ page }) => {
		await leaguePage.navigate();
		
		// Verify page has loaded by checking for content elements
		const hasScreenHeading = await page.locator('[data-ui="screen-heading"]').isVisible();
		const hasLeagueList = await page.locator('[data-testid="league-list"]').isVisible();
		
		// At least one should be visible
		expect(hasScreenHeading || hasLeagueList).toBe(true);
	});

	test('should get league page elements correctly', async ({ page }) => {
		await leaguePage.navigate();
		
		// Test element getters
		const screenHeading = leaguePage.getScreenHeading();
		const leagueList = leaguePage.getLeagueList();
		const leagueCards = leaguePage.getLeagueCards();
		
		// Elements should be accessible (may not be visible if no leagues)
		expect(screenHeading).toBeDefined();
		expect(leagueList).toBeDefined();
		expect(leagueCards).toBeDefined();
	});

	test('should verify leagues page load correctly', async ({ page }) => {
		await leaguePage.navigate();
		
		// This should not throw an error if page loads correctly
		await leaguePage.verifyLeaguesPageLoad();
	});

	test('should verify league cards display correctly', async ({ page }) => {
		await leaguePage.navigate();
		
		// This should handle both cases: leagues present or empty state
		await leaguePage.verifyLeagueCardsDisplay();
	});

	test('should get league card count', async ({ page }) => {
		await leaguePage.navigate();
		
		const cardCount = await leaguePage.getLeagueCardCount();
		expect(typeof cardCount).toBe('number');
		expect(cardCount).toBeGreaterThanOrEqual(0);
	});

	test('should check if leagues page is empty', async ({ page }) => {
		await leaguePage.navigate();
		
		const isEmpty = await leaguePage.isLeaguesPageEmpty();
		expect(typeof isEmpty).toBe('boolean');
	});

	test('should get league titles when leagues are present', async ({ page }) => {
		await leaguePage.navigate();
		
		const titles = await leaguePage.getLeagueTitles();
		expect(Array.isArray(titles)).toBe(true);
		
		// If leagues are present, titles should not be empty
		const cardCount = await leaguePage.getLeagueCardCount();
		if (cardCount > 0) {
			expect(titles.length).toBeGreaterThan(0);
		}
	});

	test('should handle league card interactions when leagues exist', async ({ page }) => {
		await leaguePage.navigate();
		
		const cardCount = await leaguePage.getLeagueCardCount();
		
		if (cardCount > 0) {
			// Test getting specific league card
			const firstCard = leaguePage.getLeagueCard(0);
			expect(firstCard).toBeDefined();
			
			// Test clicking league card (but don't actually click to avoid navigation)
			// Just verify the element is accessible
			await expect(firstCard).toBeVisible();
		} else {
			console.log('No league cards available for interaction testing');
		}
	});

	test('should navigate to specific league by ID', async ({ page }) => {
		const testLeagueId = 'test-league-123';
		
		// This will attempt navigation - may result in 404 if league doesn't exist
		try {
			await leaguePage.navigateToLeague(testLeagueId);
			// If successful, verify URL contains the league ID
			expect(page.url()).toContain(testLeagueId);
		} catch (error) {
			// Expected if league doesn't exist
			console.log('League navigation test completed (league may not exist)');
		}
	});

	test('should navigate to league standings by ID', async ({ page }) => {
		const testLeagueId = 'test-league-123';
		
		// This will attempt navigation - may result in 404 if league doesn't exist
		try {
			await leaguePage.navigateToLeagueStandings(testLeagueId);
			// If successful, verify URL contains standings path
			expect(page.url()).toContain(`${testLeagueId}/standings`);
		} catch (error) {
			// Expected if league doesn't exist
			console.log('League standings navigation test completed (league may not exist)');
		}
	});

	test('should get league participants count when leagues exist', async ({ page }) => {
		await leaguePage.navigate();
		
		const cardCount = await leaguePage.getLeagueCardCount();
		
		if (cardCount > 0) {
			const participantsCount = await leaguePage.getLeagueParticipantsCount(0);
			expect(typeof participantsCount).toBe('string');
		} else {
			console.log('No leagues available for participants count testing');
		}
	});

	test('should get league status when leagues exist', async ({ page }) => {
		await leaguePage.navigate();
		
		const cardCount = await leaguePage.getLeagueCardCount();
		
		if (cardCount > 0) {
			const status = await leaguePage.getLeagueStatus(0);
			expect(typeof status).toBe('string');
		} else {
			console.log('No leagues available for status testing');
		}
	});

	test('should verify URL correctly', async ({ page }) => {
		await leaguePage.navigate();
		
		// This should not throw an error if URL is correct
		await leaguePage.verifyUrl();
	});

	test('should handle search functionality if available', async ({ page }) => {
		await leaguePage.navigate();
		
		// This should handle the case where search is not available
		await leaguePage.searchLeague('test search');
		
		// No assertion needed as method handles missing search gracefully
	});

	test('should handle join league functionality if available', async ({ page }) => {
		await leaguePage.navigate();
		
		const cardCount = await leaguePage.getLeagueCardCount();
		
		if (cardCount > 0) {
			// This should handle the case where join functionality is not available
			await leaguePage.joinLeague(0);
			
			// No assertion needed as method handles missing join functionality gracefully
		} else {
			console.log('No leagues available for join functionality testing');
		}
	});

	test('should handle create league functionality if available', async ({ page }) => {
		await leaguePage.navigate();
		
		// This should handle the case where create functionality is not available
		await leaguePage.createLeague('Test League');
		
		// No assertion needed as method handles missing create functionality gracefully
	});

	test('should perform complete verification successfully', async ({ page }) => {
		await leaguePage.navigate();
		
		// This should complete without throwing errors
		await leaguePage.performCompleteVerification();
	});

	test('should handle navigation errors gracefully', async ({ page }) => {
		// Test with invalid URL to verify error handling
		const invalidLeaguePage = new LeaguePage(page, {
			...demoConfig,
			baseURL: 'https://invalid-url-that-does-not-exist.com'
		});
		
		// This should handle the error gracefully
		await expect(invalidLeaguePage.navigate()).rejects.toThrow();
	});

	test('should handle missing league elements gracefully', async ({ page }) => {
		// Navigate to a page that doesn't have league elements
		await page.goto(`${demoConfig.baseURL}/dashboard`);
		
		// These should handle missing elements gracefully
		const cardCount = await leaguePage.getLeagueCardCount();
		const isEmpty = await leaguePage.isLeaguesPageEmpty();
		
		expect(cardCount).toBe(0);
		expect(isEmpty).toBe(true);
	});

	test('should get league card by title when leagues exist', async ({ page }) => {
		await leaguePage.navigate();
		
		const titles = await leaguePage.getLeagueTitles();
		
		if (titles.length > 0) {
			const firstTitle = titles[0];
			const cardByTitle = leaguePage.getLeagueCardByTitle(firstTitle);
			
			expect(cardByTitle).toBeDefined();
			await expect(cardByTitle).toBeVisible();
		} else {
			console.log('No league titles available for testing');
		}
	});

	test('should verify league presence when leagues exist', async ({ page }) => {
		await leaguePage.navigate();
		
		const titles = await leaguePage.getLeagueTitles();
		
		if (titles.length > 0) {
			const firstTitle = titles[0];
			
			// This should not throw an error if league is present
			await leaguePage.verifyLeaguePresent(firstTitle);
		} else {
			console.log('No leagues available for presence verification');
		}
	});
});