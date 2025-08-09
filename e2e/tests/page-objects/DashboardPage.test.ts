import { test, expect, Page } from '@playwright/test';
import { DashboardPage } from '../../page-objects/screens/DashboardPage';
import { demoConfig } from '../../config/TestConfig';

test.describe('DashboardPage Page Object', () => {
	let dashboardPage: DashboardPage;

	test.beforeEach(async ({ page }) => {
		dashboardPage = new DashboardPage(page, demoConfig);
	});

	test('should navigate to dashboard page correctly', async ({ page }) => {
		await dashboardPage.navigate();
		
		// Verify URL
		await expect(page).toHaveURL(/.*dashboard/);
	});

	test('should wait for dashboard page to load', async ({ page }) => {
		await dashboardPage.navigate();
		
		// Verify screen heading is visible after load
		const screenHeading = dashboardPage.getScreenHeading();
		await expect(screenHeading).toBeVisible();
	});

	test('should get dashboard elements correctly', async ({ page }) => {
		await dashboardPage.navigate();
		
		// Test element getters
		const screenHeading = dashboardPage.getScreenHeading();
		const title = dashboardPage.getTitle();
		const subtitle = dashboardPage.getSubtitle();
		const matchdaySection = dashboardPage.getMatchdaySection();
		const tournamentsSection = dashboardPage.getTournamentsPerformanceSection();
		
		// Verify elements are accessible
		await expect(screenHeading).toBeVisible();
		await expect(title).toBeVisible();
		await expect(subtitle).toBeVisible();
		await expect(matchdaySection).toBeVisible();
		await expect(tournamentsSection).toBeVisible();
	});

	test('should verify dashboard elements correctly', async ({ page }) => {
		await dashboardPage.navigate();
		
		// This should not throw an error if elements are present
		await dashboardPage.verifyDashboardElements();
		
		// Verify specific content
		await expect(dashboardPage.getTitle()).toContainText("Hello,");
		await expect(dashboardPage.getSubtitle()).toContainText("mariobrusarosco");
	});

	test('should get performance section elements correctly', async ({ page }) => {
		await dashboardPage.navigate();
		
		const bestRankedSection = dashboardPage.getBestRankedSection();
		const worstPerformanceSection = dashboardPage.getWorstPerformanceSection();
		
		// Verify sections are accessible
		await expect(bestRankedSection).toBeVisible();
		await expect(worstPerformanceSection).toBeVisible();
	});

	test('should get matches buttons correctly', async ({ page }) => {
		await dashboardPage.navigate();
		
		const bestMatchesButton = dashboardPage.getMatchesButton('best');
		const worstMatchesButton = dashboardPage.getMatchesButton('worst');
		
		// Verify buttons are accessible and have correct href pattern
		await expect(bestMatchesButton).toBeVisible();
		await expect(worstMatchesButton).toBeVisible();
		await expect(bestMatchesButton).toHaveAttribute('href', /\/tournaments\/[a-zA-Z0-9-]+\/matches/);
		await expect(worstMatchesButton).toHaveAttribute('href', /\/tournaments\/[a-zA-Z0-9-]+\/matches/);
	});

	test('should verify best ranked section correctly', async ({ page }) => {
		await dashboardPage.navigate();
		
		// This should not throw an error if section is properly structured
		await dashboardPage.verifyBestRankedSection();
	});

	test('should verify worst performance section correctly', async ({ page }) => {
		await dashboardPage.navigate();
		
		// This should not throw an error if section is properly structured
		await dashboardPage.verifyWorstPerformanceSection();
	});

	test('should navigate to tournament matches correctly', async ({ page }) => {
		await dashboardPage.navigate();
		
		// Test navigation to best tournament matches
		await dashboardPage.navigateToTournamentMatches('best');
		await expect(page).toHaveURL(/\/tournaments\/[a-zA-Z0-9-]+\/matches/);
		
		// Go back to dashboard
		await dashboardPage.navigate();
		
		// Test navigation to worst tournament matches
		await dashboardPage.navigateToTournamentMatches('worst');
		await expect(page).toHaveURL(/\/tournaments\/[a-zA-Z0-9-]+\/matches/);
	});

	test('should verify URL correctly', async ({ page }) => {
		await dashboardPage.navigate();
		
		// This should not throw an error if URL is correct
		await dashboardPage.verifyUrl();
	});

	test('should get user display name', async ({ page }) => {
		await dashboardPage.navigate();
		
		const displayName = await dashboardPage.getUserDisplayName();
		expect(displayName).toBeTruthy();
		expect(displayName).toContain('mariobrusarosco');
	});

	test('should check section visibility correctly', async ({ page }) => {
		await dashboardPage.navigate();
		
		const isMatchdayVisible = await dashboardPage.isMatchdaySectionVisible();
		const isTournamentsVisible = await dashboardPage.isTournamentsPerformanceSectionVisible();
		
		expect(isMatchdayVisible).toBe(true);
		expect(isTournamentsVisible).toBe(true);
	});

	test('should perform complete verification successfully', async ({ page }) => {
		await dashboardPage.navigate();
		
		// This should complete without throwing errors
		await dashboardPage.performCompleteVerification();
	});

	test('should handle navigation errors gracefully', async ({ page }) => {
		// Test with invalid URL to verify error handling
		const invalidDashboard = new DashboardPage(page, {
			...demoConfig,
			baseURL: 'https://invalid-url-that-does-not-exist.com'
		});
		
		// This should handle the error gracefully
		await expect(invalidDashboard.navigate()).rejects.toThrow();
	});

	test('should handle missing elements gracefully', async ({ page }) => {
		// Navigate to a page that doesn't have dashboard elements
		await page.goto(`${demoConfig.baseURL}/tournaments`);
		
		// These should handle missing elements gracefully
		const isMatchdayVisible = await dashboardPage.isMatchdaySectionVisible();
		const isTournamentsVisible = await dashboardPage.isTournamentsPerformanceSectionVisible();
		
		expect(isMatchdayVisible).toBe(false);
		expect(isTournamentsVisible).toBe(false);
	});
});