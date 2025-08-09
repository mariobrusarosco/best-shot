import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { TestConfig } from '../../config/TestConfig';

/**
 * Dashboard page object providing methods to interact with dashboard elements
 * and verify dashboard functionality
 */
export class DashboardPage extends BasePage {
	private readonly dashboardUrl: string;

	// Element selectors
	private readonly screenHeading: string = '[data-ui="screen-heading"]';
	private readonly title: string = '[data-ui="title"]';
	private readonly subtitle: string = '[data-ui="subtitle"]';
	private readonly matchdaySection: string = '[data-ui="matchday"]';
	private readonly tournamentsPerformanceSection: string = '[data-ui="tournaments-perf"]';

	constructor(page: Page, config: TestConfig) {
		super(page, config);
		this.dashboardUrl = `${this.baseURL}/dashboard`;
	}

	/**
	 * Navigate to the dashboard page
	 */
	async navigate(): Promise<void> {
		try {
			await this.page.goto(this.dashboardUrl);
			await this.waitForLoad();
		} catch (error) {
			await this.handleError(error as Error, 'navigating-to-dashboard');
		}
	}

	/**
	 * Wait for the dashboard page to fully load
	 */
	async waitForLoad(): Promise<void> {
		try {
			await this.waitForPageReady();
			// Wait for the screen heading to be visible as an indicator the page is ready
			await this.waitForElement(this.screenHeading, { timeout: 15000 });
		} catch (error) {
			await this.handleError(error as Error, 'waiting-for-dashboard-load');
		}
	}

	/**
	 * Get the screen heading element
	 */
	getScreenHeading(): Locator {
		return this.page.locator(this.screenHeading);
	}

	/**
	 * Get the title element
	 */
	getTitle(): Locator {
		return this.page.locator(this.title);
	}

	/**
	 * Get the subtitle element
	 */
	getSubtitle(): Locator {
		return this.page.locator(this.subtitle);
	}

	/**
	 * Get the matchday section element
	 */
	getMatchdaySection(): Locator {
		return this.page.locator(this.matchdaySection);
	}

	/**
	 * Get the tournaments performance section element
	 */
	getTournamentsPerformanceSection(): Locator {
		return this.page.locator(this.tournamentsPerformanceSection);
	}

	/**
	 * Verify that all dashboard elements are present and visible
	 */
	async verifyDashboardElements(): Promise<void> {
		try {
			// Verify screen heading is visible
			await expect(this.getScreenHeading()).toBeVisible();
			
			// Verify title contains expected text
			await expect(this.getTitle()).toContainText("Hello,");
			
			// Verify subtitle contains username
			await expect(this.getSubtitle()).toContainText("mariobrusarosco");
			
			// Verify matchday section is present
			await expect(this.getMatchdaySection()).toContainText(/matchday/i);
			
			// Verify tournaments performance section is present
			await expect(this.getTournamentsPerformanceSection()).toContainText(/tournaments/i);
			
		} catch (error) {
			await this.handleError(error as Error, 'verifying-dashboard-elements');
		}
	}

	/**
	 * Navigate to tournament matches from the performance section
	 * @param type - 'best' for best ranked or 'worst' for worst performance
	 */
	async navigateToTournamentMatches(type: 'best' | 'worst'): Promise<void> {
		try {
			const tournamentsSection = this.getTournamentsPerformanceSection();
			
			// Find the appropriate section based on type
			const sectionText = type === 'best' ? 'best ranked' : 'worst ranked';
			const section = tournamentsSection.locator(`text=${sectionText}`);
			
			// Find the matches button next to the section
			const matchesButton = section.locator(':scope + button>[href]');
			
			// Verify the button is visible and has the correct href pattern
			await expect(matchesButton).toBeVisible();
			await expect(matchesButton).toHaveAttribute('href', /\/tournaments\/[a-zA-Z0-9-]+\/matches/);
			
			// Click the button to navigate
			await matchesButton.click();
			
			// Wait for navigation to complete
			await this.page.waitForURL(/\/tournaments\/[a-zA-Z0-9-]+\/matches/);
			
		} catch (error) {
			await this.handleError(error as Error, `navigating-to-${type}-tournament-matches`);
		}
	}

	/**
	 * Get the best ranked section element
	 */
	getBestRankedSection(): Locator {
		return this.getTournamentsPerformanceSection().locator('text=best ranked');
	}

	/**
	 * Get the worst performance section element
	 */
	getWorstPerformanceSection(): Locator {
		return this.getTournamentsPerformanceSection().locator('text=worst ranked');
	}

	/**
	 * Get the matches button for a specific performance section
	 * @param type - 'best' for best ranked or 'worst' for worst performance
	 */
	getMatchesButton(type: 'best' | 'worst'): Locator {
		const section = type === 'best' ? this.getBestRankedSection() : this.getWorstPerformanceSection();
		return section.locator(':scope + button>[href]');
	}

	/**
	 * Verify the best ranked section functionality
	 */
	async verifyBestRankedSection(): Promise<void> {
		try {
			const bestRankedSection = this.getBestRankedSection();
			const matchesButton = this.getMatchesButton('best');
			
			// Verify section text
			await expect(bestRankedSection).toContainText(/best ranked/i);
			
			// Verify button is visible and has correct href
			await expect(matchesButton).toBeVisible();
			await expect(matchesButton).toHaveAttribute('href', /\/tournaments\/[a-zA-Z0-9-]+\/matches/);
			
		} catch (error) {
			await this.handleError(error as Error, 'verifying-best-ranked-section');
		}
	}

	/**
	 * Verify the worst performance section functionality
	 */
	async verifyWorstPerformanceSection(): Promise<void> {
		try {
			const worstPerformanceSection = this.getWorstPerformanceSection();
			const matchesButton = this.getMatchesButton('worst');
			
			// Verify section text
			await expect(worstPerformanceSection).toContainText(/worst ranked/i);
			
			// Verify button is visible and has correct href
			await expect(matchesButton).toBeVisible();
			await expect(matchesButton).toHaveAttribute('href', /\/tournaments\/[a-zA-Z0-9-]+\/matches/);
			
		} catch (error) {
			await this.handleError(error as Error, 'verifying-worst-performance-section');
		}
	}

	/**
	 * Verify that the dashboard URL is correct
	 */
	async verifyUrl(): Promise<void> {
		try {
			await this.verifyUrl(/.*dashboard/);
		} catch (error) {
			await this.handleError(error as Error, 'verifying-dashboard-url');
		}
	}

	/**
	 * Get the current user's display name from the subtitle
	 */
	async getUserDisplayName(): Promise<string> {
		try {
			return await this.getElementText(this.subtitle);
		} catch (error) {
			await this.handleError(error as Error, 'getting-user-display-name');
			return '';
		}
	}

	/**
	 * Check if the matchday section is visible
	 */
	async isMatchdaySectionVisible(): Promise<boolean> {
		return await this.isElementVisible(this.matchdaySection);
	}

	/**
	 * Check if the tournaments performance section is visible
	 */
	async isTournamentsPerformanceSectionVisible(): Promise<boolean> {
		return await this.isElementVisible(this.tournamentsPerformanceSection);
	}

	/**
	 * Perform a complete dashboard verification
	 * This method combines all verification steps for comprehensive testing
	 */
	async performCompleteVerification(): Promise<void> {
		try {
			// Verify URL
			await this.verifyUrl();
			
			// Verify all dashboard elements
			await this.verifyDashboardElements();
			
			// Verify performance sections
			await this.verifyBestRankedSection();
			await this.verifyWorstPerformanceSection();
			
		} catch (error) {
			await this.handleError(error as Error, 'performing-complete-dashboard-verification');
		}
	}
}