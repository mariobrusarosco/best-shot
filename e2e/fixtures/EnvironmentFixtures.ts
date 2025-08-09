/**
 * Environment-specific test fixtures and data configurations
 */

import { TestDataManager, TestUserData, NavigationTestData, DashboardTestData, TestScenarioData } from './TestDataManager';
import { TestConfig } from '../config/TestConfig';

/**
 * Demo environment test fixtures
 */
export class DemoEnvironmentFixtures {
	private dataManager: TestDataManager;

	constructor(config: TestConfig) {
		this.dataManager = TestDataManager.getInstance(config);
	}

	/**
	 * Get demo environment users
	 */
	public getDemoUsers(): TestUserData[] {
		return [
			{
				id: 'demo-standard-user',
				email: 'demo.user@bestshot.com',
				password: 'DemoUser123!',
				role: 'standard',
				environment: 'demo',
				profile: {
					username: 'mariobrusarosco',
					displayName: 'Mario Brusarosco',
					preferences: {
						theme: 'light',
						language: 'en',
						notifications: true
					}
				},
				expectedData: {
					dashboardTournaments: [
						'Premier League 2024',
						'Champions League 2024',
						'World Cup Qualifiers'
					],
					leagues: [
						'English Premier League',
						'Spanish La Liga',
						'German Bundesliga',
						'Italian Serie A'
					],
					permissions: [
						'view_dashboard',
						'view_tournaments',
						'view_leagues',
						'make_predictions'
					]
				},
				metadata: {
					createdAt: '2024-01-01T00:00:00Z',
					isActive: true
				}
			},
			{
				id: 'demo-admin-user',
				email: 'admin@bestshot.com',
				password: 'AdminDemo123!',
				role: 'admin',
				environment: 'demo',
				profile: {
					username: 'admin',
					displayName: 'Demo Administrator',
					preferences: {
						theme: 'dark',
						language: 'en',
						notifications: true
					}
				},
				expectedData: {
					dashboardTournaments: [
						'Premier League 2024',
						'Champions League 2024',
						'World Cup Qualifiers',
						'Europa League 2024'
					],
					leagues: [
						'English Premier League',
						'Spanish La Liga',
						'German Bundesliga',
						'Italian Serie A',
						'French Ligue 1'
					],
					permissions: [
						'view_dashboard',
						'view_tournaments',
						'view_leagues',
						'make_predictions',
						'admin_panel',
						'manage_users',
						'manage_tournaments'
					]
				},
				metadata: {
					createdAt: '2024-01-01T00:00:00Z',
					isActive: true
				}
			},
			{
				id: 'demo-guest-user',
				email: 'guest@bestshot.com',
				password: 'GuestDemo123!',
				role: 'guest',
				environment: 'demo',
				profile: {
					username: 'guest',
					displayName: 'Guest User',
					preferences: {
						theme: 'light',
						language: 'en',
						notifications: false
					}
				},
				expectedData: {
					dashboardTournaments: [],
					leagues: [
						'English Premier League',
						'Spanish La Liga'
					],
					permissions: [
						'view_dashboard',
						'view_tournaments',
						'view_leagues'
					]
				},
				metadata: {
					createdAt: '2024-01-01T00:00:00Z',
					isActive: true
				}
			}
		];
	}

	/**
	 * Get demo navigation test data
	 */
	public getDemoNavigationData(): NavigationTestData {
		return {
			menuLinks: [
				{
					href: '/',
					expectedUrl: '/dashboard',
					label: 'Home',
					requiresAuth: true,
					testId: 'nav-home'
				},
				{
					href: '/dashboard',
					expectedUrl: '/dashboard',
					label: 'Dashboard',
					requiresAuth: true,
					testId: 'nav-dashboard'
				},
				{
					href: '/tournaments',
					expectedUrl: '/tournaments',
					label: 'Tournaments',
					requiresAuth: true,
					testId: 'nav-tournaments'
				},
				{
					href: '/leagues',
					expectedUrl: '/leagues',
					label: 'Leagues',
					requiresAuth: true,
					testId: 'nav-leagues'
				},
				{
					href: '/my-account',
					expectedUrl: '/my-account',
					label: 'My Account',
					requiresAuth: true,
					testId: 'nav-account'
				}
			],
			breadcrumbs: [
				{
					route: '/dashboard',
					expectedBreadcrumbs: ['Home', 'Dashboard']
				},
				{
					route: '/tournaments',
					expectedBreadcrumbs: ['Home', 'Tournaments']
				},
				{
					route: '/tournaments/premier-league',
					expectedBreadcrumbs: ['Home', 'Tournaments', 'Premier League']
				},
				{
					route: '/leagues',
					expectedBreadcrumbs: ['Home', 'Leagues']
				}
			],
			redirects: [
				{
					from: '/',
					to: '/dashboard',
					condition: 'authenticated user'
				},
				{
					from: '/login',
					to: '/dashboard',
					condition: 'already authenticated'
				}
			]
		};
	}

	/**
	 * Get demo dashboard test data
	 */
	public getDemoDashboardData(): DashboardTestData {
		return {
			selectors: {
				screenHeading: '[data-ui="screen-heading"]',
				title: '[data-ui="title"]',
				subtitle: '[data-ui="subtitle"]',
				matchdaySection: '[data-ui="matchday"]',
				tournamentsPerformanceSection: '[data-ui="tournaments-perf"]',
				userGreeting: '[data-testid="user-greeting"]',
				statsCards: [
					'[data-testid="stats-predictions"]',
					'[data-testid="stats-accuracy"]',
					'[data-testid="stats-tournaments"]',
					'[data-testid="stats-leagues"]'
				]
			},
			expectedContent: {
				titlePrefix: 'Hello,',
				subtitle: 'mariobrusarosco',
				matchdayPattern: /matchday/i,
				tournamentsPattern: /tournaments/i,
				statsLabels: [
					'Total Predictions',
					'Accuracy Rate',
					'Active Tournaments',
					'Followed Leagues'
				]
			},
			mockData: {
				userStats: {
					totalPredictions: 156,
					accuracyRate: 68.5,
					activeTournaments: 4,
					followedLeagues: 8
				},
				recentMatches: [
					{
						id: 'match-1',
						teams: ['Manchester United', 'Liverpool'],
						score: '2-1',
						date: '2024-01-15T15:00:00Z'
					},
					{
						id: 'match-2',
						teams: ['Barcelona', 'Real Madrid'],
						score: '1-3',
						date: '2024-01-14T20:00:00Z'
					},
					{
						id: 'match-3',
						teams: ['Bayern Munich', 'Borussia Dortmund'],
						score: '4-0',
						date: '2024-01-13T18:30:00Z'
					}
				]
			}
		};
	}

	/**
	 * Get demo test scenarios
	 */
	public getDemoTestScenarios(): TestScenarioData[] {
		return [
			{
				id: 'demo-smoke-001',
				name: 'Demo Application Loading',
				description: 'Verify the demo application loads correctly and displays main elements',
				category: 'smoke',
				priority: 'critical',
				environment: ['demo'],
				preconditions: [
					'Demo application is deployed and accessible',
					'User has valid demo credentials'
				],
				steps: [
					{
						stepNumber: 1,
						action: 'navigate',
						target: 'https://best-shot-demo.mariobrusarosco.com',
						expectedResult: 'Page loads successfully without errors',
						timeout: 10000
					},
					{
						stepNumber: 2,
						action: 'verify',
						target: 'page title',
						expectedResult: 'Title contains "Best Shot"'
					},
					{
						stepNumber: 3,
						action: 'verify',
						target: 'main navigation',
						expectedResult: 'Menu is visible with correct links'
					},
					{
						stepNumber: 4,
						action: 'verify',
						target: 'dashboard redirect',
						expectedResult: 'Page redirects to dashboard for authenticated users'
					}
				],
				expectedResults: [
					'Application loads without JavaScript errors',
					'Main navigation is functional and accessible',
					'Page redirects appropriately based on authentication state',
					'Core UI elements are visible and interactive'
				],
				tags: ['smoke', 'critical', 'demo'],
				metadata: {
					estimatedDuration: 30,
					lastUpdated: '2024-01-01T00:00:00Z',
					author: 'E2E Test Suite'
				}
			},
			{
				id: 'demo-navigation-001',
				name: 'Demo Navigation Flow',
				description: 'Verify navigation between main application screens in demo environment',
				category: 'smoke',
				priority: 'high',
				environment: ['demo'],
				preconditions: [
					'User is authenticated',
					'Application is loaded on dashboard'
				],
				steps: [
					{
						stepNumber: 1,
						action: 'click',
						target: 'tournaments navigation link',
						expectedResult: 'Navigate to tournaments page'
					},
					{
						stepNumber: 2,
						action: 'verify',
						target: 'tournaments page content',
						expectedResult: 'Tournaments page loads with expected content'
					},
					{
						stepNumber: 3,
						action: 'click',
						target: 'leagues navigation link',
						expectedResult: 'Navigate to leagues page'
					},
					{
						stepNumber: 4,
						action: 'verify',
						target: 'leagues page content',
						expectedResult: 'Leagues page loads with expected content'
					},
					{
						stepNumber: 5,
						action: 'click',
						target: 'dashboard navigation link',
						expectedResult: 'Return to dashboard'
					}
				],
				expectedResults: [
					'All main screens are accessible via navigation',
					'Navigation works correctly without errors',
					'URLs update appropriately for each page',
					'Page content loads correctly for each section'
				],
				tags: ['navigation', 'smoke', 'demo'],
				metadata: {
					estimatedDuration: 45,
					lastUpdated: '2024-01-01T00:00:00Z',
					author: 'E2E Test Suite'
				}
			},
			{
				id: 'demo-dashboard-001',
				name: 'Demo Dashboard Functionality',
				description: 'Verify dashboard displays correct user data and statistics in demo environment',
				category: 'regression',
				priority: 'high',
				environment: ['demo'],
				preconditions: [
					'User is authenticated as standard demo user',
					'Dashboard page is loaded'
				],
				steps: [
					{
						stepNumber: 1,
						action: 'verify',
						target: 'user greeting',
						expectedResult: 'Displays correct username in greeting'
					},
					{
						stepNumber: 2,
						action: 'verify',
						target: 'statistics cards',
						expectedResult: 'All stat cards display with valid data'
					},
					{
						stepNumber: 3,
						action: 'verify',
						target: 'recent matches section',
						expectedResult: 'Recent matches display with scores and dates'
					},
					{
						stepNumber: 4,
						action: 'verify',
						target: 'tournaments performance section',
						expectedResult: 'Performance metrics are visible and accurate'
					}
				],
				expectedResults: [
					'Dashboard displays personalized user information',
					'Statistics are accurate and up-to-date',
					'All dashboard sections load without errors',
					'Data formatting is consistent and readable'
				],
				tags: ['dashboard', 'regression', 'demo'],
				metadata: {
					estimatedDuration: 60,
					lastUpdated: '2024-01-01T00:00:00Z',
					author: 'E2E Test Suite'
				}
			}
		];
	}
}

/**
 * Staging environment test fixtures (for future implementation)
 */
export class StagingEnvironmentFixtures {
	private dataManager: TestDataManager;

	constructor(config: TestConfig) {
		this.dataManager = TestDataManager.getInstance(config);
	}

	// Staging-specific fixtures will be implemented when staging environment is available
	public getStagingUsers(): TestUserData[] {
		return [];
	}
}

/**
 * Production environment test fixtures (for future implementation)
 */
export class ProductionEnvironmentFixtures {
	private dataManager: TestDataManager;

	constructor(config: TestConfig) {
		this.dataManager = TestDataManager.getInstance(config);
	}

	// Production-specific fixtures will be implemented when production testing is required
	public getProductionUsers(): TestUserData[] {
		return [];
	}
}

/**
 * Factory function to get environment-specific fixtures
 */
export function getEnvironmentFixtures(environment: string, config: TestConfig) {
	switch (environment.toLowerCase()) {
		case 'demo':
			return new DemoEnvironmentFixtures(config);
		case 'staging':
			return new StagingEnvironmentFixtures(config);
		case 'production':
			return new ProductionEnvironmentFixtures(config);
		default:
			return new DemoEnvironmentFixtures(config);
	}
}