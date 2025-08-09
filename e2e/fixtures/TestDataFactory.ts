/**
 * Test data factory for generating dynamic test data
 */

import { TestUserData, TestScenarioData, DashboardTestData, NavigationTestData } from './TestDataManager';

/**
 * Factory class for generating test data dynamically
 */
export class TestDataFactory {
	private static instance: TestDataFactory;

	private constructor() {}

	/**
	 * Get singleton instance
	 */
	public static getInstance(): TestDataFactory {
		if (!TestDataFactory.instance) {
			TestDataFactory.instance = new TestDataFactory();
		}
		return TestDataFactory.instance;
	}

	/**
	 * Generate test user with custom properties
	 */
	public generateTestUser(overrides: Partial<TestUserData> = {}): TestUserData {
		const defaultUser: TestUserData = {
			id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			email: `test.user.${Date.now()}@example.com`,
			password: 'TestPassword123!',
			role: 'standard',
			environment: 'demo',
			profile: {
				username: `testuser${Date.now()}`,
				displayName: 'Test User',
				preferences: {
					theme: 'light',
					language: 'en',
					notifications: true
				}
			},
			expectedData: {
				dashboardTournaments: ['Test Tournament 1', 'Test Tournament 2'],
				leagues: ['Test League 1', 'Test League 2'],
				permissions: ['view_dashboard', 'view_tournaments', 'view_leagues']
			},
			metadata: {
				createdAt: new Date().toISOString(),
				isActive: true
			}
		};

		return { ...defaultUser, ...overrides };
	}

	/**
	 * Generate multiple test users
	 */
	public generateTestUsers(count: number, baseOverrides: Partial<TestUserData> = {}): TestUserData[] {
		return Array.from({ length: count }, (_, index) => 
			this.generateTestUser({
				...baseOverrides,
				id: `user-${Date.now()}-${index}`,
				email: `test.user.${Date.now()}.${index}@example.com`,
				profile: {
					...baseOverrides.profile,
					username: `testuser${Date.now()}${index}`,
					displayName: `Test User ${index + 1}`
				}
			})
		);
	}

	/**
	 * Generate test scenario with custom properties
	 */
	public generateTestScenario(overrides: Partial<TestScenarioData> = {}): TestScenarioData {
		const defaultScenario: TestScenarioData = {
			id: `scenario-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			name: 'Generated Test Scenario',
			description: 'Dynamically generated test scenario',
			category: 'regression',
			priority: 'medium',
			environment: ['demo'],
			preconditions: ['Application is accessible', 'User is authenticated'],
			steps: [
				{
					stepNumber: 1,
					action: 'navigate',
					target: '/dashboard',
					expectedResult: 'Dashboard loads successfully'
				},
				{
					stepNumber: 2,
					action: 'verify',
					target: 'page content',
					expectedResult: 'Content is displayed correctly'
				}
			],
			expectedResults: ['Test completes successfully'],
			tags: ['generated', 'automated'],
			metadata: {
				estimatedDuration: 30,
				lastUpdated: new Date().toISOString(),
				author: 'TestDataFactory'
			}
		};

		return { ...defaultScenario, ...overrides };
	}

	/**
	 * Generate dashboard test data with custom properties
	 */
	public generateDashboardTestData(overrides: Partial<DashboardTestData> = {}): DashboardTestData {
		const defaultDashboard: DashboardTestData = {
			selectors: {
				screenHeading: '[data-ui="screen-heading"]',
				title: '[data-ui="title"]',
				subtitle: '[data-ui="subtitle"]',
				matchdaySection: '[data-ui="matchday"]',
				tournamentsPerformanceSection: '[data-ui="tournaments-perf"]',
				userGreeting: '[data-testid="user-greeting"]',
				statsCards: [
					'[data-testid="stats-card-1"]',
					'[data-testid="stats-card-2"]',
					'[data-testid="stats-card-3"]'
				]
			},
			expectedContent: {
				titlePrefix: 'Hello,',
				subtitle: 'testuser',
				matchdayPattern: /matchday/i,
				tournamentsPattern: /tournaments/i,
				statsLabels: ['Predictions', 'Accuracy', 'Tournaments']
			},
			mockData: {
				userStats: {
					predictions: Math.floor(Math.random() * 100),
					accuracy: Math.floor(Math.random() * 100),
					tournaments: Math.floor(Math.random() * 10)
				},
				recentMatches: this.generateRecentMatches(3)
			}
		};

		return this.deepMerge(defaultDashboard, overrides);
	}

	/**
	 * Generate navigation test data with custom properties
	 */
	public generateNavigationTestData(overrides: Partial<NavigationTestData> = {}): NavigationTestData {
		const defaultNavigation: NavigationTestData = {
			menuLinks: [
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
				}
			],
			breadcrumbs: [
				{
					route: '/dashboard',
					expectedBreadcrumbs: ['Home', 'Dashboard']
				}
			],
			redirects: [
				{
					from: '/',
					to: '/dashboard',
					condition: 'authenticated user'
				}
			]
		};

		return this.deepMerge(defaultNavigation, overrides);
	}

	/**
	 * Generate test data for specific environment
	 */
	public generateEnvironmentTestData(environment: 'demo' | 'staging' | 'production') {
		const baseData = {
			users: this.generateTestUsers(3, { environment }),
			scenarios: [
				this.generateTestScenario({ 
					environment: [environment],
					name: `${environment} Environment Test`,
					category: 'smoke'
				})
			],
			dashboard: this.generateDashboardTestData(),
			navigation: this.generateNavigationTestData()
		};

		// Environment-specific customizations
		switch (environment) {
			case 'demo':
				return {
					...baseData,
					users: baseData.users.map(user => ({
						...user,
						profile: {
							...user.profile,
							username: 'mariobrusarosco' // Demo-specific username
						}
					}))
				};
			case 'staging':
				return {
					...baseData,
					scenarios: baseData.scenarios.map(scenario => ({
						...scenario,
						priority: 'high' as const,
						tags: [...scenario.tags, 'staging']
					}))
				};
			case 'production':
				return {
					...baseData,
					users: baseData.users.slice(0, 1), // Minimal users for production
					scenarios: baseData.scenarios.filter(scenario => 
						scenario.category === 'smoke'
					)
				};
			default:
				return baseData;
		}
	}

	/**
	 * Generate recent matches data
	 */
	private generateRecentMatches(count: number) {
		const teams = [
			'Manchester United', 'Liverpool', 'Arsenal', 'Chelsea',
			'Barcelona', 'Real Madrid', 'Bayern Munich', 'PSG'
		];

		return Array.from({ length: count }, (_, index) => {
			const homeTeam = teams[Math.floor(Math.random() * teams.length)];
			let awayTeam = teams[Math.floor(Math.random() * teams.length)];
			while (awayTeam === homeTeam) {
				awayTeam = teams[Math.floor(Math.random() * teams.length)];
			}

			return {
				id: `match-${Date.now()}-${index}`,
				teams: [homeTeam, awayTeam],
				score: `${Math.floor(Math.random() * 5)}-${Math.floor(Math.random() * 5)}`,
				date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
			};
		});
	}

	/**
	 * Deep merge utility for combining objects
	 */
	private deepMerge<T>(target: T, source: Partial<T>): T {
		const result = { ...target };
		
		for (const key in source) {
			if (source[key] !== undefined) {
				if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
					result[key] = this.deepMerge(result[key] as any, source[key] as any);
				} else {
					result[key] = source[key] as T[Extract<keyof T, string>];
				}
			}
		}
		
		return result;
	}
}

/**
 * Convenience functions for common test data generation
 */
export const TestDataFactoryUtils = {
	/**
	 * Create a standard test user
	 */
	createStandardUser: (environment: string = 'demo'): TestUserData => {
		return TestDataFactory.getInstance().generateTestUser({
			role: 'standard',
			environment: environment as any
		});
	},

	/**
	 * Create an admin test user
	 */
	createAdminUser: (environment: string = 'demo'): TestUserData => {
		return TestDataFactory.getInstance().generateTestUser({
			role: 'admin',
			environment: environment as any,
			expectedData: {
				dashboardTournaments: ['Admin Tournament 1', 'Admin Tournament 2'],
				leagues: ['Admin League 1', 'Admin League 2'],
				permissions: [
					'view_dashboard',
					'view_tournaments',
					'view_leagues',
					'admin_panel',
					'manage_users'
				]
			}
		});
	},

	/**
	 * Create a smoke test scenario
	 */
	createSmokeTestScenario: (environment: string = 'demo'): TestScenarioData => {
		return TestDataFactory.getInstance().generateTestScenario({
			category: 'smoke',
			priority: 'critical',
			environment: [environment],
			name: `${environment} Smoke Test`,
			description: `Critical smoke test for ${environment} environment`
		});
	},

	/**
	 * Create test data for a complete test suite
	 */
	createTestSuite: (environment: string = 'demo') => {
		const factory = TestDataFactory.getInstance();
		return {
			users: {
				standard: factory.generateTestUser({ role: 'standard', environment: environment as any }),
				admin: factory.generateTestUser({ role: 'admin', environment: environment as any }),
				guest: factory.generateTestUser({ role: 'guest', environment: environment as any })
			},
			scenarios: {
				smoke: factory.generateTestScenario({ 
					category: 'smoke', 
					priority: 'critical',
					environment: [environment]
				}),
				regression: factory.generateTestScenario({ 
					category: 'regression', 
					priority: 'high',
					environment: [environment]
				})
			},
			dashboard: factory.generateDashboardTestData(),
			navigation: factory.generateNavigationTestData()
		};
	}
};