/**
 * Screen page objects index file
 * Exports all screen-specific page objects for easy importing
 */

export { DashboardPage } from './DashboardPage';
export { TournamentPage } from './TournamentPage';
export { LeaguePage } from './LeaguePage';
export { NavigationHelper } from './NavigationHelper';

// Type definitions for page object factory
export interface ScreenPageObjects {
	dashboard: DashboardPage;
	tournaments: TournamentPage;
	leagues: LeaguePage;
	navigation: NavigationHelper;
}

// Screen page object factory function
import { Page } from '@playwright/test';
import { TestConfig } from '../../config/TestConfig';

/**
 * Factory function to create all screen page objects
 * @param page - Playwright page instance
 * @param config - Test configuration
 * @returns Object containing all screen page objects
 */
export function createScreenPageObjects(page: Page, config: TestConfig): ScreenPageObjects {
	return {
		dashboard: new DashboardPage(page, config),
		tournaments: new TournamentPage(page, config),
		leagues: new LeaguePage(page, config),
		navigation: new NavigationHelper(page, config)
	};
}