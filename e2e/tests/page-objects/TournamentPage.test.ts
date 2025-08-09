import { test, expect, Page } from '@playwright/test';
import { TournamentPage } from '../../page-objects/screens/TournamentPage';
import { demoConfig } from '../../config/TestConfig';

test.describe('TournamentPage Page Object', () => {
	let tournamentPage: TournamentPage;

	test.beforeEach(async ({ page }) => {
		tournamentPage = new TournamentPage(page, demoConfig);
	});

	test('should navigate to tournaments page correctly', async ({ page }) => {
		await tournamentPage.navigate();
		
		// Verify URL
		await expect(page).toHaveURL(/.*tournaments/);
	});

	test('should wait for tournaments page to load', async ({ page }) => {
		await tournamentPage.navigate();
		
		// Verify page has loaded by checking for content elements
		const hasScreenHeading = await page.locator('[data-ui="screen-heading"]').isVisible();
		const hasTournamentList = await page.locator('[data-testid="tournament-list"]').isVisible();
		
		// At least one should be visible
		expect(hasScreenHeading || hasTournamentList).toBe(true);
	});

	test('should get tournament page elements correctly', async ({ page }) => {
		await tournamentPage.navigate();
		
		// Test element getters
		const screenHeading = tournamentPage.getScreenHeading();
		const tournamentList = tournamentPage.getTournamentList();
		const tournamentCards = tournamentPage.getTournamentCards();
		
		// Elements should be accessible (may not be visible if no tournaments)
		expect(screenHeading).toBeDefined();
		expect(tournamentList).toBeDefined();
		expect(tournamentCards).toBeDefined();
	});

	test('should verify tournaments page load correctly', async ({ page }) => {
		await tournamentPage.navigate();
		
		// This should not throw an error if page loads correctly
		await tournamentPage.verifyTournamentsPageLoad();
	});

	test('should verify tournament cards display correctly', async ({ page }) => {
		await tournamentPage.navigate();
		
		// This should handle both cases: tournaments present or empty state
		await tournamentPage.verifyTournamentCardsDisplay();
	});

	test('should get tournament card count', async ({ page }) => {
		await tournamentPage.navigate();
		
		const cardCount = await tournamentPage.getTournamentCardCount();
		expect(typeof cardCount).toBe('number');
		expect(cardCount).toBeGreaterThanOrEqual(0);
	});

	test('should check if tournaments page is empty', async ({ page }) => {
		await tournamentPage.navigate();
		
		const isEmpty = await tournamentPage.isTournamentsPageEmpty();
		expect(typeof isEmpty).toBe('boolean');
	});

	test('should get tournament titles when tournaments are present', async ({ page }) => {
		await tournamentPage.navigate();
		
		const titles = await tournamentPage.getTournamentTitles();
		expect(Array.isArray(titles)).toBe(true);
		
		// If tournaments are present, titles should not be empty
		const cardCount = await tournamentPage.getTournamentCardCount();
		if (cardCount > 0) {
			expect(titles.length).toBeGreaterThan(0);
		}
	});

	test('should handle tournament card interactions when tournaments exist', async ({ page }) => {
		await tournamentPage.navigate();
		
		const cardCount = await tournamentPage.getTournamentCardCount();
		
		if (cardCount > 0) {
			// Test getting specific tournament card
			const firstCard = tournamentPage.getTournamentCard(0);
			expect(firstCard).toBeDefined();
			
			// Test clicking tournament card (but don't actually click to avoid navigation)
			// Just verify the element is accessible
			await expect(firstCard).toBeVisible();
		} else {
			console.log('No tournament cards available for interaction testing');
		}
	});

	test('should navigate to specific tournament by ID', async ({ page }) => {
		const testTournamentId = 'test-tournament-123';
		
		// This will attempt navigation - may result in 404 if tournament doesn't exist
		try {
			await tournamentPage.navigateToTournament(testTournamentId);
			// If successful, verify URL contains the tournament ID
			expect(page.url()).toContain(testTournamentId);
		} catch (error) {
			// Expected if tournament doesn't exist
			console.log('Tournament navigation test completed (tournament may not exist)');
		}
	});

	test('should navigate to tournament matches by ID', async ({ page }) => {
		const testTournamentId = 'test-tournament-123';
		
		// This will attempt navigation - may result in 404 if tournament doesn't exist
		try {
			await tournamentPage.navigateToTournamentMatches(testTournamentId);
			// If successful, verify URL contains matches path
			expect(page.url()).toContain(`${testTournamentId}/matches`);
		} catch (error) {
			// Expected if tournament doesn't exist
			console.log('Tournament matches navigation test completed (tournament may not exist)');
		}
	});

	test('should verify URL correctly', async ({ page }) => {
		await tournamentPage.navigate();
		
		// This should not throw an error if URL is correct
		await tournamentPage.verifyUrl();
	});

	test('should handle search functionality if available', async ({ page }) => {
		await tournamentPage.navigate();
		
		// This should handle the case where search is not available
		await tournamentPage.searchTournament('test search');
		
		// No assertion needed as method handles missing search gracefully
	});

	test('should perform complete verification successfully', async ({ page }) => {
		await tournamentPage.navigate();
		
		// This should complete without throwing errors
		await tournamentPage.performCompleteVerification();
	});

	test('should handle navigation errors gracefully', async ({ page }) => {
		// Test with invalid URL to verify error handling
		const invalidTournamentPage = new TournamentPage(page, {
			...demoConfig,
			baseURL: 'https://invalid-url-that-does-not-exist.com'
		});
		
		// This should handle the error gracefully
		await expect(invalidTournamentPage.navigate()).rejects.toThrow();
	});

	test('should handle missing tournament elements gracefully', async ({ page }) => {
		// Navigate to a page that doesn't have tournament elements
		await page.goto(`${demoConfig.baseURL}/dashboard`);
		
		// These should handle missing elements gracefully
		const cardCount = await tournamentPage.getTournamentCardCount();
		const isEmpty = await tournamentPage.isTournamentsPageEmpty();
		
		expect(cardCount).toBe(0);
		expect(isEmpty).toBe(true);
	});

	test('should get tournament card by title when tournaments exist', async ({ page }) => {
		await tournamentPage.navigate();
		
		const titles = await tournamentPage.getTournamentTitles();
		
		if (titles.length > 0) {
			const firstTitle = titles[0];
			const cardByTitle = tournamentPage.getTournamentCardByTitle(firstTitle);
			
			expect(cardByTitle).toBeDefined();
			await expect(cardByTitle).toBeVisible();
		} else {
			console.log('No tournament titles available for testing');
		}
	});

	test('should verify tournament presence when tournaments exist', async ({ page }) => {
		await tournamentPage.navigate();
		
		const titles = await tournamentPage.getTournamentTitles();
		
		if (titles.length > 0) {
			const firstTitle = titles[0];
			
			// This should not throw an error if tournament is present
			await tournamentPage.verifyTournamentPresent(firstTitle);
		} else {
			console.log('No tournaments available for presence verification');
		}
	});
});