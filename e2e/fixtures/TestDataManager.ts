/**
 * Centralized test data management system
 */

import { TestConfig } from '../config/TestConfig';

/**
 * Test data categories for organized management
 */
export interface TestDataCategories {
	users: TestUserData[];
	navigation: NavigationTestData;
	dashboard: DashboardTestData;
	tournaments: TournamentTestData;
	leagues: LeagueTestData;
	scenarios: TestScenarioData[];
	errors: ErrorTestData;
}

/**
 * Enhanced test user model with environment-specific data
 */
export interface TestUserData {
	id: string;
	email: string;
	password: string;
	role: 'standard' | 'admin' | 'guest';
	environment: 'demo' | 'staging' | 'production';
	profile: {
		username: string;
		displayName: string;
		preferences: Record<string, any>;
	};
	expectedData: {
		dashboardTournaments: string[];
		leagues: string[];
		permissions: string[];
	};
	metadata: {
		createdAt: string;
		lastUsed?: string;
		isActive: boolean;
	};
}

/**
 * Navigation test data structure
 */
export interface NavigationTestData {
	menuLinks: Array<{
		href: string;
		expectedUrl: string;
		label: string;
		requiresAuth: boolean;
		testId?: string;
	}>;
	breadcrumbs: Array<{
		route: string;
		expectedBreadcrumbs: string[];
	}>;
	redirects: Array<{
		from: string;
		to: string;
		condition: string;
	}>;
}

/**
 * Dashboard-specific test data
 */
export interface DashboardTestData {
	selectors: {
		screenHeading: string;
		title: string;
		subtitle: string;
		matchdaySection: string;
		tournamentsPerformanceSection: string;
		userGreeting: string;
		statsCards: string[];
	};
	expectedContent: {
		titlePrefix: string;
		subtitle: string;
		matchdayPattern: RegExp;
		tournamentsPattern: RegExp;
		statsLabels: string[];
	};
	mockData: {
		userStats: Record<string, number>;
		recentMatches: Array<{
			id: string;
			teams: string[];
			score: string;
			date: string;
		}>;
	};
}

/**
 * Tournament test data
 */
export interface TournamentTestData {
	tournaments: Array<{
		id: string;
		name: string;
		type: 'league' | 'knockout' | 'group';
		status: 'active' | 'completed' | 'upcoming';
		participants: number;
		matches: Array<{
			id: string;
			homeTeam: string;
			awayTeam: string;
			date: string;
			status: 'scheduled' | 'live' | 'completed';
		}>;
	}>;
	filters: {
		status: string[];
		type: string[];
		dateRange: Array<{ label: string; value: string }>;
	};
}

/**
 * League test data
 */
export interface LeagueTestData {
	leagues: Array<{
		id: string;
		name: string;
		country: string;
		season: string;
		teams: string[];
		standings: Array<{
			position: number;
			team: string;
			points: number;
			played: number;
		}>;
	}>;
	searchFilters: {
		countries: string[];
		seasons: string[];
	};
}

/**
 * Test scenario data for structured testing
 */
export interface TestScenarioData {
	id: string;
	name: string;
	description: string;
	category: 'smoke' | 'regression' | 'integration' | 'performance';
	priority: 'critical' | 'high' | 'medium' | 'low';
	environment: string[];
	preconditions: string[];
	steps: Array<{
		stepNumber: number;
		action: string;
		target: string;
		data?: any;
		expectedResult: string;
		timeout?: number;
	}>;
	expectedResults: string[];
	tags: string[];
	metadata: {
		estimatedDuration: number;
		lastUpdated: string;
		author: string;
	};
}

/**
 * Error test data for negative testing
 */
export interface ErrorTestData {
	networkErrors: Array<{
		type: 'timeout' | 'offline' | '404' | '500' | 'cors';
		description: string;
		mockResponse?: any;
		expectedBehavior: string;
	}>;
	validationErrors: Array<{
		field: string;
		invalidValue: any;
		expectedMessage: string;
	}>;
	authenticationErrors: Array<{
		scenario: string;
		credentials?: { email: string; password: string };
		expectedRedirect: string;
		expectedMessage?: string;
	}>;
}

/**
 * Test data manager class for centralized data operations
 */
export class TestDataManager {
	private static instance: TestDataManager;
	private testData: Map<string, TestDataCategories> = new Map();
	private config: TestConfig;

	private constructor(config: TestConfig) {
		this.config = config;
	}

	/**
	 * Get singleton instance of TestDataManager
	 */
	public static getInstance(config: TestConfig): TestDataManager {
		if (!TestDataManager.instance) {
			TestDataManager.instance = new TestDataManager(config);
		}
		return TestDataManager.instance;
	}

	/**
	 * Load test data for specific environment
	 */
	public async loadTestData(environment: string): Promise<TestDataCategories> {
		if (this.testData.has(environment)) {
			return this.testData.get(environment)!;
		}

		const data = await this.generateTestData(environment);
		this.testData.set(environment, data);
		return data;
	}

	/**
	 * Get test data for specific category
	 */
	public getTestData<T extends keyof TestDataCategories>(
		environment: string,
		category: T
	): TestDataCategories[T] | null {
		const data = this.testData.get(environment);
		return data ? data[category] : null;
	}

	/**
	 * Get test user by role and environment
	 */
	public getTestUser(
		environment: string,
		role: 'standard' | 'admin' | 'guest' = 'standard'
	): TestUserData | null {
		const users = this.getTestData(environment, 'users');
		if (!users) return null;

		return users.find(user => 
			user.role === role && 
			user.environment === environment &&
			user.metadata.isActive
		) || null;
	}

	/**
	 * Get test scenario by category and priority
	 */
	public getTestScenarios(
		environment: string,
		category?: string,
		priority?: string
	): TestScenarioData[] {
		const scenarios = this.getTestData(environment, 'scenarios');
		if (!scenarios) return [];

		return scenarios.filter(scenario => {
			const matchesCategory = !category || scenario.category === category;
			const matchesPriority = !priority || scenario.priority === priority;
			const matchesEnvironment = scenario.environment.includes(environment);
			
			return matchesCategory && matchesPriority && matchesEnvironment;
		});
	}

	/**
	 * Clean up test data (for use after test completion)
	 */
	public async cleanupTestData(environment: string): Promise<void> {
		// Mark test users as inactive
		const data = this.testData.get(environment);
		if (data?.users) {
			data.users.forEach(user => {
				user.metadata.lastUsed = new Date().toISOString();
			});
		}

		// Clear any temporary test data
		// This would be expanded to handle actual data cleanup in a real environment
		console.log(`Test data cleanup completed for environment: ${environment}`);
	}

	/**
	 * Reset test data to initial state
	 */
	public resetTestData(environment: string): void {
		this.testData.delete(environment);
	}

	/**
	 * Generate test data for specific environment
	 */
	private async generateTestData(environment: string): Promise<TestDataCategories> {
		const baseData = this.getBaseTestData();
		
		// Customize data based on environment
		switch (environment) {
			case 'demo':
				return this.customizeForDemo(baseData);
			case 'staging':
				return this.customizeForStaging(baseData);
			case 'production':
				return this.customizeForProduction(baseData);
			default:
				return baseData;
		}
	}

	/**
	 * Get base test data structure
	 */
	private getBaseTestData(): TestDataCategories {
		return {
			users: [],
			navigation: {
				menuLinks: [],
				breadcrumbs: [],
				redirects: []
			},
			dashboard: {
				selectors: {
					screenHeading: '',
					title: '',
					subtitle: '',
					matchdaySection: '',
					tournamentsPerformanceSection: '',
					userGreeting: '',
					statsCards: []
				},
				expectedContent: {
					titlePrefix: '',
					subtitle: '',
					matchdayPattern: /matchday/i,
					tournamentsPattern: /tournaments/i,
					statsLabels: []
				},
				mockData: {
					userStats: {},
					recentMatches: []
				}
			},
			tournaments: {
				tournaments: [],
				filters: {
					status: [],
					type: [],
					dateRange: []
				}
			},
			leagues: {
				leagues: [],
				searchFilters: {
					countries: [],
					seasons: []
				}
			},
			scenarios: [],
			errors: {
				networkErrors: [],
				validationErrors: [],
				authenticationErrors: []
			}
		};
	}

	/**
	 * Customize test data for demo environment
	 */
	private customizeForDemo(baseData: TestDataCategories): TestDataCategories {
		// This will be populated with demo-specific data
		return {
			...baseData,
			users: [
				{
					id: 'demo-user-1',
					email: 'demo@example.com',
					password: 'demo-password',
					role: 'standard',
					environment: 'demo',
					profile: {
						username: 'mariobrusarosco',
						displayName: 'Mario Brusarosco',
						preferences: {}
					},
					expectedData: {
						dashboardTournaments: ['Premier League', 'Champions League'],
						leagues: ['English Premier League', 'Spanish La Liga'],
						permissions: ['view_dashboard', 'view_tournaments']
					},
					metadata: {
						createdAt: new Date().toISOString(),
						isActive: true
					}
				}
			]
		};
	}

	/**
	 * Customize test data for staging environment
	 */
	private customizeForStaging(baseData: TestDataCategories): TestDataCategories {
		// Staging-specific customizations
		return baseData;
	}

	/**
	 * Customize test data for production environment
	 */
	private customizeForProduction(baseData: TestDataCategories): TestDataCategories {
		// Production-specific customizations (minimal test data)
		return baseData;
	}
}