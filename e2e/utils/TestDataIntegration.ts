/**
 * Integration utilities for connecting test data management with existing tests
 */

import { Page, TestInfo } from '@playwright/test';
import { TestConfig } from '../config/TestConfig';
import { TestDataManager, TestUserData, TestScenarioData } from '../fixtures/TestDataManager';
import { getEnvironmentFixtures } from '../fixtures/EnvironmentFixtures';
import { TestDataCleanup } from '../fixtures/TestDataCleanup';
import { TestDataFactory } from '../fixtures/TestDataFactory';

/**
 * Test data integration helper class
 */
export class TestDataIntegration {
	private dataManager: TestDataManager;
	private cleanup: TestDataCleanup;
	private factory: TestDataFactory;
	private environment: string;
	private config: TestConfig;

	constructor(config: TestConfig, environment: string = 'demo') {
		this.config = config;
		this.environment = environment;
		this.dataManager = TestDataManager.getInstance(config);
		this.cleanup = new TestDataCleanup(config);
		this.factory = TestDataFactory.getInstance();
	}

	/**
	 * Initialize test data for a test suite
	 */
	public async initializeForTestSuite(): Promise<void> {
		await this.dataManager.loadTestData(this.environment);
	}

	/**
	 * Get test user for authentication scenarios
	 */
	public getTestUser(role: 'standard' | 'admin' | 'guest' = 'standard'): TestUserData | null {
		return this.dataManager.getTestUser(this.environment, role);
	}

	/**
	 * Get test scenarios by category
	 */
	public getTestScenarios(category?: string, priority?: string): TestScenarioData[] {
		return this.dataManager.getTestScenarios(this.environment, category, priority);
	}

	/**
	 * Get environment-specific fixtures
	 */
	public getEnvironmentFixtures() {
		return getEnvironmentFixtures(this.environment, this.config);
	}

	/**
	 * Setup test data before test execution
	 */
	public async setupTestData(testInfo: TestInfo): Promise<{
		user: TestUserData | null;
		scenario: TestScenarioData | null;
		fixtures: any;
	}> {
		// Determine test requirements from test title or annotations
		const testTitle = testInfo.title.toLowerCase();
		const isAuthTest = testTitle.includes('auth') || testTitle.includes('login');
		const isAdminTest = testTitle.includes('admin');
		const isSmokeTest = testTitle.includes('smoke') || testInfo.tags.includes('@smoke');

		// Get appropriate test user
		let user: TestUserData | null = null;
		if (isAuthTest || isAdminTest) {
			const role = isAdminTest ? 'admin' : 'standard';
			user = this.getTestUser(role);
		}

		// Get appropriate test scenario
		let scenario: TestScenarioData | null = null;
		if (isSmokeTest) {
			const smokeScenarios = this.getTestScenarios('smoke', 'critical');
			scenario = smokeScenarios[0] || null;
		}

		// Get environment fixtures
		const fixtures = this.getEnvironmentFixtures();

		return { user, scenario, fixtures };
	}

	/**
	 * Cleanup test data after test execution
	 */
	public async cleanupAfterTest(testInfo: TestInfo): Promise<void> {
		// Perform cleanup based on test result
		if (testInfo.status === 'failed') {
			// Keep data for debugging failed tests
			console.log(`Test failed: ${testInfo.title}. Preserving test data for debugging.`);
		} else {
			// Clean up successful tests
			await this.cleanup.performCleanup(this.environment, ['cleanup_artifacts']);
		}
	}

	/**
	 * Cleanup test data after test suite completion
	 */
	public async cleanupAfterTestSuite(): Promise<void> {
		await this.cleanup.performCompleteCleanup(this.environment);
	}

	/**
	 * Generate dynamic test data for parameterized tests
	 */
	public generateTestData(testType: string, count: number = 1) {
		switch (testType.toLowerCase()) {
			case 'users':
				return this.factory.generateTestUsers(count, { environment: this.environment as any });
			case 'scenarios':
				return Array.from({ length: count }, () => 
					this.factory.generateTestScenario({ environment: [this.environment] })
				);
			case 'dashboard':
				return this.factory.generateDashboardTestData();
			case 'navigation':
				return this.factory.generateNavigationTestData();
			default:
				throw new Error(`Unknown test data type: ${testType}`);
		}
	}

	/**
	 * Validate test data before test execution
	 */
	public validateTestData(data: any): { valid: boolean; errors: string[] } {
		const errors: string[] = [];

		// Basic validation
		if (!data) {
			errors.push('Test data is null or undefined');
			return { valid: false, errors };
		}

		// User data validation
		if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
			errors.push('Invalid email format');
		}

		if (data.role && !['standard', 'admin', 'guest'].includes(data.role)) {
			errors.push('Invalid user role');
		}

		if (data.environment && !['demo', 'staging', 'production'].includes(data.environment)) {
			errors.push('Invalid environment');
		}

		return {
			valid: errors.length === 0,
			errors
		};
	}

	/**
	 * Get test data summary for reporting
	 */
	public getTestDataSummary(): {
		environment: string;
		userCount: number;
		scenarioCount: number;
		lastCleanup: string | null;
	} {
		const users = this.dataManager.getTestData(this.environment, 'users');
		const scenarios = this.dataManager.getTestData(this.environment, 'scenarios');
		const cleanupHistory = this.cleanup.getEnvironmentCleanupHistory(this.environment);
		const lastCleanup = cleanupHistory.length > 0 
			? cleanupHistory[cleanupHistory.length - 1].timestamp 
			: null;

		return {
			environment: this.environment,
			userCount: users?.length || 0,
			scenarioCount: scenarios?.length || 0,
			lastCleanup
		};
	}
}

/**
 * Playwright test fixture integration
 */
export interface TestDataFixture {
	testData: TestDataIntegration;
}

/**
 * Helper functions for common test data operations
 */
export class TestDataHelpers {
	/**
	 * Create test data integration for environment
	 */
	public static createIntegration(config: TestConfig, environment: string = 'demo'): TestDataIntegration {
		return new TestDataIntegration(config, environment);
	}

	/**
	 * Setup test data for page object tests
	 */
	public static async setupForPageObject(
		page: Page,
		config: TestConfig,
		environment: string = 'demo'
	): Promise<{
		integration: TestDataIntegration;
		user: TestUserData | null;
		fixtures: any;
	}> {
		const integration = new TestDataIntegration(config, environment);
		await integration.initializeForTestSuite();
		
		const user = integration.getTestUser('standard');
		const fixtures = integration.getEnvironmentFixtures();

		return { integration, user, fixtures };
	}

	/**
	 * Setup test data for authentication tests
	 */
	public static async setupForAuthTests(
		config: TestConfig,
		environment: string = 'demo'
	): Promise<{
		standardUser: TestUserData | null;
		adminUser: TestUserData | null;
		guestUser: TestUserData | null;
		fixtures: any;
	}> {
		const integration = new TestDataIntegration(config, environment);
		await integration.initializeForTestSuite();

		const standardUser = integration.getTestUser('standard');
		const adminUser = integration.getTestUser('admin');
		const guestUser = integration.getTestUser('guest');
		const fixtures = integration.getEnvironmentFixtures();

		return { standardUser, adminUser, guestUser, fixtures };
	}

	/**
	 * Setup test data for smoke tests
	 */
	public static async setupForSmokeTests(
		config: TestConfig,
		environment: string = 'demo'
	): Promise<{
		scenarios: TestScenarioData[];
		user: TestUserData | null;
		fixtures: any;
	}> {
		const integration = new TestDataIntegration(config, environment);
		await integration.initializeForTestSuite();

		const scenarios = integration.getTestScenarios('smoke', 'critical');
		const user = integration.getTestUser('standard');
		const fixtures = integration.getEnvironmentFixtures();

		return { scenarios, user, fixtures };
	}

	/**
	 * Cleanup after test execution
	 */
	public static async performTestCleanup(
		config: TestConfig,
		environment: string,
		testInfo: TestInfo
	): Promise<void> {
		const integration = new TestDataIntegration(config, environment);
		await integration.cleanupAfterTest(testInfo);
	}

	/**
	 * Generate test report with data summary
	 */
	public static generateTestDataReport(
		config: TestConfig,
		environment: string
	): string {
		const integration = new TestDataIntegration(config, environment);
		const summary = integration.getTestDataSummary();

		return `
Test Data Summary for ${environment.toUpperCase()} Environment
==========================================================
Environment: ${summary.environment}
Users Available: ${summary.userCount}
Test Scenarios: ${summary.scenarioCount}
Last Cleanup: ${summary.lastCleanup || 'Never'}
Generated: ${new Date().toISOString()}
		`.trim();
	}
}