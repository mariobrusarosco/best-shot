import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { TestConfig } from '../../config/TestConfig';

/**
 * Tournament page object providing methods to interact with tournament elements
 * and verify tournament functionality
 */
export class TournamentPage extends BasePage {
	private readonly tournamentsUrl: string;

	// Element selectors
	private readonly screenHeading: string = '[data-ui="screen-heading"]';
	private readonly tournamentList: string = '[data-testid="tournament-list"]';
	private readonly tournamentCard: string = '[data-testid="tournament-card"]';
	private readonly tournamentTitle: string = '[data-testid="tournament-title"]';
	private readonly tournamentStatus: string = '[data-testid="tournament-status"]';

	constructor(page: Page, config: TestConfig) {
		super(page, config);
		this.tournamentsUrl = `${this.baseURL}/tournaments`;
	}

	/**
	 * Navigate to the tournaments page
	 */
	async navigate(): Promise<void> {
		try {
			await this.page.goto(this.tournamentsUrl);
			await this.waitForLoad();
		} catch (error) {
			await this.handleError(error as Error, 'navigating-to-tournaments');
		}
	}

	/**
	 * Wait for the tournaments page to fully load
	 */
	async waitForLoad(): Promise<void> {
		try {
			await this.waitForPageReady();
			// Wait for either the screen heading or tournament content to be visible
			await this.waitForAnyElement([this.screenHeading, this.tournamentList], 15000);
		} catch (error) {
			await this.handleError(error as Error, 'waiting-for-tournaments-load');
		}
	}

	/**
	 * Navigate to a specific tournament by ID
	 * @param tournamentId - The ID of the tournament to navigate to
	 */
	async navigateToTournament(tournamentId: string): Promise<void> {
		try {
			const tournamentUrl = `${this.tournamentsUrl}/${tournamentId}`;
			await this.page.goto(tournamentUrl);
			await this.waitForLoad();
		} catch (error) {
			await this.handleError(error as Error, `navigating-to-tournament-${tournamentId}`);
		}
	}

	/**
	 * Navigate to tournament matches page
	 * @param tournamentId - The ID of the tournament
	 */
	async navigateToTournamentMatches(tournamentId: string): Promise<void> {
		try {
			const matchesUrl = `${this.tournamentsUrl}/${tournamentId}/matches`;
			await this.page.goto(matchesUrl);
			await this.waitForLoad();
		} catch (error) {
			await this.handleError(error as Error, `navigating-to-tournament-matches-${tournamentId}`);
		}
	}

	/**
	 * Get the screen heading element
	 */
	getScreenHeading(): Locator {
		return this.page.locator(this.screenHeading);
	}

	/**
	 * Get the tournament list element
	 */
	getTournamentList(): Locator {
		return this.page.locator(this.tournamentList);
	}

	/**
	 * Get all tournament cards
	 */
	getTournamentCards(): Locator {
		return this.page.locator(this.tournamentCard);
	}

	/**
	 * Get a specific tournament card by index
	 * @param index - The index of the tournament card (0-based)
	 */
	getTournamentCard(index: number): Locator {
		return this.getTournamentCards().nth(index);
	}

	/**
	 * Get tournament card by title
	 * @param title - The title of the tournament to find
	 */
	getTournamentCardByTitle(title: string): Locator {
		return this.page.locator(this.tournamentCard).filter({ hasText: title });
	}

	/**
	 * Verify that the tournaments page has loaded correctly
	 */
	async verifyTournamentsPageLoad(): Promise<void> {
		try {
			// Verify URL
			await this.verifyUrl(/.*tournaments/);
			
			// Check if we have either a screen heading or tournament content
			const hasScreenHeading = await this.isElementVisible(this.screenHeading);
			const hasTournamentList = await this.isElementVisible(this.tournamentList);
			
			if (!hasScreenHeading && !hasTournamentList) {
				throw new Error('Tournaments page does not have expected content elements');
			}
			
		} catch (error) {
			await this.handleError(error as Error, 'verifying-tournaments-page-load');
		}
	}

	/**
	 * Verify that tournament cards are displayed
	 */
	async verifyTournamentCardsDisplay(): Promise<void> {
		try {
			const tournamentCards = this.getTournamentCards();
			
			// Check if tournament cards are present
			const cardCount = await tournamentCards.count();
			
			if (cardCount === 0) {
				// If no cards, check if there's an empty state message
				const hasEmptyState = await this.isElementVisible('[data-testid="empty-tournaments"]');
				if (!hasEmptyState) {
					throw new Error('No tournament cards found and no empty state displayed');
				}
			} else {
				// Verify first card has expected structure
				const firstCard = this.getTournamentCard(0);
				await expect(firstCard).toBeVisible();
			}
			
		} catch (error) {
			await this.handleError(error as Error, 'verifying-tournament-cards-display');
		}
	}

	/**
	 * Click on a tournament card to navigate to tournament details
	 * @param index - The index of the tournament card to click (0-based)
	 */
	async clickTournamentCard(index: number): Promise<void> {
		try {
			const card = this.getTournamentCard(index);
			await expect(card).toBeVisible();
			await card.click();
			
			// Wait for navigation to complete
			await this.waitForPageReady();
			
		} catch (error) {
			await this.handleError(error as Error, `clicking-tournament-card-${index}`);
		}
	}

	/**
	 * Click on a tournament card by title
	 * @param title - The title of the tournament to click
	 */
	async clickTournamentCardByTitle(title: string): Promise<void> {
		try {
			const card = this.getTournamentCardByTitle(title);
			await expect(card).toBeVisible();
			await card.click();
			
			// Wait for navigation to complete
			await this.waitForPageReady();
			
		} catch (error) {
			await this.handleError(error as Error, `clicking-tournament-card-${title}`);
		}
	}

	/**
	 * Get the count of tournament cards
	 */
	async getTournamentCardCount(): Promise<number> {
		try {
			return await this.getTournamentCards().count();
		} catch (error) {
			await this.handleError(error as Error, 'getting-tournament-card-count');
			return 0;
		}
	}

	/**
	 * Get tournament titles from all visible cards
	 */
	async getTournamentTitles(): Promise<string[]> {
		try {
			const cards = this.getTournamentCards();
			const count = await cards.count();
			const titles: string[] = [];
			
			for (let i = 0; i < count; i++) {
				const titleElement = cards.nth(i).locator(this.tournamentTitle);
				const title = await titleElement.textContent();
				if (title) {
					titles.push(title.trim());
				}
			}
			
			return titles;
		} catch (error) {
			await this.handleError(error as Error, 'getting-tournament-titles');
			return [];
		}
	}

	/**
	 * Verify that a specific tournament is present in the list
	 * @param tournamentTitle - The title of the tournament to verify
	 */
	async verifyTournamentPresent(tournamentTitle: string): Promise<void> {
		try {
			const card = this.getTournamentCardByTitle(tournamentTitle);
			await expect(card).toBeVisible();
		} catch (error) {
			await this.handleError(error as Error, `verifying-tournament-present-${tournamentTitle}`);
		}
	}

	/**
	 * Check if tournaments page is empty (no tournaments available)
	 */
	async isTournamentsPageEmpty(): Promise<boolean> {
		try {
			const cardCount = await this.getTournamentCardCount();
			return cardCount === 0;
		} catch (error) {
			await this.handleError(error as Error, 'checking-tournaments-page-empty');
			return true;
		}
	}

	/**
	 * Verify the tournaments page URL is correct
	 */
	async verifyUrl(): Promise<void> {
		try {
			await this.verifyUrl(/.*tournaments/);
		} catch (error) {
			await this.handleError(error as Error, 'verifying-tournaments-url');
		}
	}

	/**
	 * Search for a tournament (if search functionality exists)
	 * @param searchTerm - The term to search for
	 */
	async searchTournament(searchTerm: string): Promise<void> {
		try {
			const searchInput = '[data-testid="tournament-search"]';
			const hasSearchInput = await this.isElementVisible(searchInput);
			
			if (hasSearchInput) {
				await this.fillElement(searchInput, searchTerm);
				await this.page.keyboard.press('Enter');
				await this.waitForPageReady();
			} else {
				console.warn('Tournament search functionality not available');
			}
		} catch (error) {
			await this.handleError(error as Error, `searching-tournament-${searchTerm}`);
		}
	}

	/**
	 * Perform complete tournaments page verification
	 */
	async performCompleteVerification(): Promise<void> {
		try {
			// Verify page load
			await this.verifyTournamentsPageLoad();
			
			// Verify tournament cards display
			await this.verifyTournamentCardsDisplay();
			
			// Verify URL
			await this.verifyUrl();
			
		} catch (error) {
			await this.handleError(error as Error, 'performing-complete-tournaments-verification');
		}
	}
}