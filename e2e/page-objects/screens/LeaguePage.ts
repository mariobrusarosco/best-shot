import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { TestConfig } from '../../config/TestConfig';

/**
 * League page object providing methods to interact with league elements
 * and verify league functionality
 */
export class LeaguePage extends BasePage {
	private readonly leaguesUrl: string;

	// Element selectors
	private readonly screenHeading: string = '[data-ui="screen-heading"]';
	private readonly leagueList: string = '[data-testid="league-list"]';
	private readonly leagueCard: string = '[data-testid="league-card"]';
	private readonly leagueTitle: string = '[data-testid="league-title"]';
	private readonly leagueStatus: string = '[data-testid="league-status"]';
	private readonly leagueParticipants: string = '[data-testid="league-participants"]';

	constructor(page: Page, config: TestConfig) {
		super(page, config);
		this.leaguesUrl = `${this.baseURL}/leagues`;
	}

	/**
	 * Navigate to the leagues page
	 */
	async navigate(): Promise<void> {
		try {
			await this.page.goto(this.leaguesUrl);
			await this.waitForLoad();
		} catch (error) {
			await this.handleError(error as Error, 'navigating-to-leagues');
		}
	}

	/**
	 * Wait for the leagues page to fully load
	 */
	async waitForLoad(): Promise<void> {
		try {
			await this.waitForPageReady();
			// Wait for either the screen heading or league content to be visible
			await this.waitForAnyElement([this.screenHeading, this.leagueList], 15000);
		} catch (error) {
			await this.handleError(error as Error, 'waiting-for-leagues-load');
		}
	}

	/**
	 * Navigate to a specific league by ID
	 * @param leagueId - The ID of the league to navigate to
	 */
	async navigateToLeague(leagueId: string): Promise<void> {
		try {
			const leagueUrl = `${this.leaguesUrl}/${leagueId}`;
			await this.page.goto(leagueUrl);
			await this.waitForLoad();
		} catch (error) {
			await this.handleError(error as Error, `navigating-to-league-${leagueId}`);
		}
	}

	/**
	 * Navigate to league standings page
	 * @param leagueId - The ID of the league
	 */
	async navigateToLeagueStandings(leagueId: string): Promise<void> {
		try {
			const standingsUrl = `${this.leaguesUrl}/${leagueId}/standings`;
			await this.page.goto(standingsUrl);
			await this.waitForLoad();
		} catch (error) {
			await this.handleError(error as Error, `navigating-to-league-standings-${leagueId}`);
		}
	}

	/**
	 * Get the screen heading element
	 */
	getScreenHeading(): Locator {
		return this.page.locator(this.screenHeading);
	}

	/**
	 * Get the league list element
	 */
	getLeagueList(): Locator {
		return this.page.locator(this.leagueList);
	}

	/**
	 * Get all league cards
	 */
	getLeagueCards(): Locator {
		return this.page.locator(this.leagueCard);
	}

	/**
	 * Get a specific league card by index
	 * @param index - The index of the league card (0-based)
	 */
	getLeagueCard(index: number): Locator {
		return this.getLeagueCards().nth(index);
	}

	/**
	 * Get league card by title
	 * @param title - The title of the league to find
	 */
	getLeagueCardByTitle(title: string): Locator {
		return this.page.locator(this.leagueCard).filter({ hasText: title });
	}

	/**
	 * Verify that the leagues page has loaded correctly
	 */
	async verifyLeaguesPageLoad(): Promise<void> {
		try {
			// Verify URL
			await this.verifyUrl(/.*leagues/);
			
			// Check if we have either a screen heading or league content
			const hasScreenHeading = await this.isElementVisible(this.screenHeading);
			const hasLeagueList = await this.isElementVisible(this.leagueList);
			
			if (!hasScreenHeading && !hasLeagueList) {
				throw new Error('Leagues page does not have expected content elements');
			}
			
		} catch (error) {
			await this.handleError(error as Error, 'verifying-leagues-page-load');
		}
	}

	/**
	 * Verify that league cards are displayed
	 */
	async verifyLeagueCardsDisplay(): Promise<void> {
		try {
			const leagueCards = this.getLeagueCards();
			
			// Check if league cards are present
			const cardCount = await leagueCards.count();
			
			if (cardCount === 0) {
				// If no cards, check if there's an empty state message
				const hasEmptyState = await this.isElementVisible('[data-testid="empty-leagues"]');
				if (!hasEmptyState) {
					throw new Error('No league cards found and no empty state displayed');
				}
			} else {
				// Verify first card has expected structure
				const firstCard = this.getLeagueCard(0);
				await expect(firstCard).toBeVisible();
			}
			
		} catch (error) {
			await this.handleError(error as Error, 'verifying-league-cards-display');
		}
	}

	/**
	 * Click on a league card to navigate to league details
	 * @param index - The index of the league card to click (0-based)
	 */
	async clickLeagueCard(index: number): Promise<void> {
		try {
			const card = this.getLeagueCard(index);
			await expect(card).toBeVisible();
			await card.click();
			
			// Wait for navigation to complete
			await this.waitForPageReady();
			
		} catch (error) {
			await this.handleError(error as Error, `clicking-league-card-${index}`);
		}
	}

	/**
	 * Click on a league card by title
	 * @param title - The title of the league to click
	 */
	async clickLeagueCardByTitle(title: string): Promise<void> {
		try {
			const card = this.getLeagueCardByTitle(title);
			await expect(card).toBeVisible();
			await card.click();
			
			// Wait for navigation to complete
			await this.waitForPageReady();
			
		} catch (error) {
			await this.handleError(error as Error, `clicking-league-card-${title}`);
		}
	}

	/**
	 * Get the count of league cards
	 */
	async getLeagueCardCount(): Promise<number> {
		try {
			return await this.getLeagueCards().count();
		} catch (error) {
			await this.handleError(error as Error, 'getting-league-card-count');
			return 0;
		}
	}

	/**
	 * Get league titles from all visible cards
	 */
	async getLeagueTitles(): Promise<string[]> {
		try {
			const cards = this.getLeagueCards();
			const count = await cards.count();
			const titles: string[] = [];
			
			for (let i = 0; i < count; i++) {
				const titleElement = cards.nth(i).locator(this.leagueTitle);
				const title = await titleElement.textContent();
				if (title) {
					titles.push(title.trim());
				}
			}
			
			return titles;
		} catch (error) {
			await this.handleError(error as Error, 'getting-league-titles');
			return [];
		}
	}

	/**
	 * Verify that a specific league is present in the list
	 * @param leagueTitle - The title of the league to verify
	 */
	async verifyLeaguePresent(leagueTitle: string): Promise<void> {
		try {
			const card = this.getLeagueCardByTitle(leagueTitle);
			await expect(card).toBeVisible();
		} catch (error) {
			await this.handleError(error as Error, `verifying-league-present-${leagueTitle}`);
		}
	}

	/**
	 * Check if leagues page is empty (no leagues available)
	 */
	async isLeaguesPageEmpty(): Promise<boolean> {
		try {
			const cardCount = await this.getLeagueCardCount();
			return cardCount === 0;
		} catch (error) {
			await this.handleError(error as Error, 'checking-leagues-page-empty');
			return true;
		}
	}

	/**
	 * Get league participants count for a specific league card
	 * @param index - The index of the league card
	 */
	async getLeagueParticipantsCount(index: number): Promise<string> {
		try {
			const card = this.getLeagueCard(index);
			const participantsElement = card.locator(this.leagueParticipants);
			return await this.getElementText(participantsElement.toString());
		} catch (error) {
			await this.handleError(error as Error, `getting-league-participants-count-${index}`);
			return '';
		}
	}

	/**
	 * Get league status for a specific league card
	 * @param index - The index of the league card
	 */
	async getLeagueStatus(index: number): Promise<string> {
		try {
			const card = this.getLeagueCard(index);
			const statusElement = card.locator(this.leagueStatus);
			return await this.getElementText(statusElement.toString());
		} catch (error) {
			await this.handleError(error as Error, `getting-league-status-${index}`);
			return '';
		}
	}

	/**
	 * Verify the leagues page URL is correct
	 */
	async verifyUrl(): Promise<void> {
		try {
			await this.verifyUrl(/.*leagues/);
		} catch (error) {
			await this.handleError(error as Error, 'verifying-leagues-url');
		}
	}

	/**
	 * Search for a league (if search functionality exists)
	 * @param searchTerm - The term to search for
	 */
	async searchLeague(searchTerm: string): Promise<void> {
		try {
			const searchInput = '[data-testid="league-search"]';
			const hasSearchInput = await this.isElementVisible(searchInput);
			
			if (hasSearchInput) {
				await this.fillElement(searchInput, searchTerm);
				await this.page.keyboard.press('Enter');
				await this.waitForPageReady();
			} else {
				console.warn('League search functionality not available');
			}
		} catch (error) {
			await this.handleError(error as Error, `searching-league-${searchTerm}`);
		}
	}

	/**
	 * Join a league (if join functionality exists)
	 * @param index - The index of the league card to join
	 */
	async joinLeague(index: number): Promise<void> {
		try {
			const card = this.getLeagueCard(index);
			const joinButton = card.locator('[data-testid="join-league-button"]');
			
			const hasJoinButton = await this.isElementVisible(joinButton.toString());
			if (hasJoinButton) {
				await joinButton.click();
				await this.waitForPageReady();
			} else {
				console.warn('Join league functionality not available for this league');
			}
		} catch (error) {
			await this.handleError(error as Error, `joining-league-${index}`);
		}
	}

	/**
	 * Create a new league (if create functionality exists)
	 * @param leagueName - The name of the league to create
	 */
	async createLeague(leagueName: string): Promise<void> {
		try {
			const createButton = '[data-testid="create-league-button"]';
			const hasCreateButton = await this.isElementVisible(createButton);
			
			if (hasCreateButton) {
				await this.clickElement(createButton);
				
				// Fill in league name if form appears
				const nameInput = '[data-testid="league-name-input"]';
				const hasNameInput = await this.isElementVisible(nameInput, 5000);
				
				if (hasNameInput) {
					await this.fillElement(nameInput, leagueName);
					
					// Submit the form
					const submitButton = '[data-testid="create-league-submit"]';
					await this.clickElement(submitButton);
					await this.waitForPageReady();
				}
			} else {
				console.warn('Create league functionality not available');
			}
		} catch (error) {
			await this.handleError(error as Error, `creating-league-${leagueName}`);
		}
	}

	/**
	 * Perform complete leagues page verification
	 */
	async performCompleteVerification(): Promise<void> {
		try {
			// Verify page load
			await this.verifyLeaguesPageLoad();
			
			// Verify league cards display
			await this.verifyLeagueCardsDisplay();
			
			// Verify URL
			await this.verifyUrl();
			
		} catch (error) {
			await this.handleError(error as Error, 'performing-complete-leagues-verification');
		}
	}
}