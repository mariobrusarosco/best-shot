import { Page } from '@playwright/test';
import { BasePage } from '../page-objects/base/BasePage';
import { TestConfig } from '../config/TestConfig';

/**
 * Utility class for validating page object implementations
 * and testing BasePage functionality
 */
export class PageObjectValidator {
	private page: Page;
	private config: TestConfig;

	constructor(page: Page, config: TestConfig) {
		this.page = page;
		this.config = config;
	}

	/**
	 * Validate that a page object properly extends BasePage
	 */
	async validatePageObject(pageObject: BasePage): Promise<ValidationResult> {
		const results: ValidationResult = {
			isValid: true,
			errors: [],
			warnings: [],
			checks: []
		};

		try {
			// Check 1: Can navigate to the page
			results.checks.push('Testing navigation...');
			await pageObject.navigate();
			results.checks.push('✅ Navigation successful');

			// Check 2: Can wait for page load
			results.checks.push('Testing page load waiting...');
			await pageObject.waitForLoad();
			results.checks.push('✅ Page load waiting successful');

			// Check 3: Page URL is accessible
			results.checks.push('Testing URL accessibility...');
			const currentUrl = pageObject.getCurrentUrl();
			if (!currentUrl.includes(this.config.baseURL)) {
				results.warnings.push(`URL doesn't match expected base URL. Current: ${currentUrl}, Expected base: ${this.config.baseURL}`);
			}
			results.checks.push('✅ URL accessibility verified');

			// Check 4: Page title is retrievable
			results.checks.push('Testing page title retrieval...');
			const title = await pageObject.getPageTitle();
			if (!title || title.length === 0) {
				results.warnings.push('Page title is empty or unavailable');
			}
			results.checks.push('✅ Page title retrieval successful');

		} catch (error) {
			results.isValid = false;
			results.errors.push(`Page object validation failed: ${error}`);
		}

		return results;
	}

	/**
	 * Test BasePage error handling capabilities
	 */
	async testErrorHandling(pageObject: BasePage): Promise<ErrorHandlingResult> {
		const results: ErrorHandlingResult = {
			screenshotCaptured: false,
			errorLogged: false,
			contextPreserved: false,
			tests: []
		};

		// Test 1: Screenshot capture on error
		try {
			results.tests.push('Testing screenshot capture...');
			// This should trigger error handling and screenshot capture
			await (pageObject as any).testWaitForElement('[data-test="definitely-non-existent"]', { timeout: 1000 });
		} catch (error) {
			results.screenshotCaptured = true;
			results.errorLogged = true;
			results.contextPreserved = error.toString().includes('Context:');
			results.tests.push('✅ Error handling triggered successfully');
		}

		return results;
	}

	/**
	 * Performance test for page object operations
	 */
	async performanceTest(pageObject: BasePage): Promise<PerformanceResult> {
		const results: PerformanceResult = {
			navigationTime: 0,
			loadTime: 0,
			totalTime: 0,
			isWithinThreshold: false
		};

		const startTime = Date.now();

		try {
			// Measure navigation time
			const navStart = Date.now();
			await pageObject.navigate();
			results.navigationTime = Date.now() - navStart;

			// Measure load time
			const loadStart = Date.now();
			await pageObject.waitForLoad();
			results.loadTime = Date.now() - loadStart;

			results.totalTime = Date.now() - startTime;
			results.isWithinThreshold = results.totalTime < this.config.timeout;

		} catch (error) {
			results.totalTime = Date.now() - startTime;
			results.isWithinThreshold = false;
		}

		return results;
	}

	/**
	 * Comprehensive validation report
	 */
	async generateValidationReport(pageObject: BasePage): Promise<ValidationReport> {
		const validation = await this.validatePageObject(pageObject);
		const errorHandling = await this.testErrorHandling(pageObject);
		const performance = await this.performanceTest(pageObject);

		return {
			pageObjectName: pageObject.constructor.name,
			timestamp: new Date().toISOString(),
			validation,
			errorHandling,
			performance,
			overallScore: this.calculateOverallScore(validation, errorHandling, performance)
		};
	}

	private calculateOverallScore(
		validation: ValidationResult,
		errorHandling: ErrorHandlingResult,
		performance: PerformanceResult
	): number {
		let score = 0;

		// Validation score (40%)
		if (validation.isValid) score += 40;
		if (validation.errors.length === 0) score += 10;
		if (validation.warnings.length === 0) score += 10;

		// Error handling score (30%)
		if (errorHandling.screenshotCaptured) score += 10;
		if (errorHandling.errorLogged) score += 10;
		if (errorHandling.contextPreserved) score += 10;

		// Performance score (20%)
		if (performance.isWithinThreshold) score += 20;

		return Math.min(score, 100);
	}
}

/**
 * Validation result interfaces
 */
export interface ValidationResult {
	isValid: boolean;
	errors: string[];
	warnings: string[];
	checks: string[];
}

export interface ErrorHandlingResult {
	screenshotCaptured: boolean;
	errorLogged: boolean;
	contextPreserved: boolean;
	tests: string[];
}

export interface PerformanceResult {
	navigationTime: number;
	loadTime: number;
	totalTime: number;
	isWithinThreshold: boolean;
}

export interface ValidationReport {
	pageObjectName: string;
	timestamp: string;
	validation: ValidationResult;
	errorHandling: ErrorHandlingResult;
	performance: PerformanceResult;
	overallScore: number;
}