import { chromium, FullConfig } from '@playwright/test';
import { getTestConfig } from './TestConfig';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Global setup for E2E tests
 * Performs environment validation and setup tasks before test execution
 */
async function globalSetup(config: FullConfig) {
	const environment = process.env.TEST_ENV || 'demo';
	const testConfig = getTestConfig(environment);
	
	console.log(`🚀 Starting E2E tests against ${environment} environment`);
	console.log(`📍 Base URL: ${testConfig.baseURL}`);
	console.log(`🔄 Retry configuration: ${testConfig.retries} retries`);
	console.log(`📸 Screenshots enabled: ${testConfig.screenshots.enabled}`);
	console.log(`🎥 Video on failure: ${testConfig.reporting.videoOnFailure}`);
	
	// Create necessary directories
	await setupDirectories(testConfig);
	
	// Validate that the target environment is accessible
	const browser = await chromium.launch();
	const page = await browser.newPage();
	
	try {
		console.log('🔍 Validating environment accessibility...');
		await page.goto(testConfig.baseURL, { timeout: 30000 });
		
		// Basic health check - verify the page loads
		await page.waitForLoadState('networkidle', { timeout: 15000 });
		const title = await page.title();
		
		if (!title.includes('Best Shot')) {
			throw new Error(`Environment health check failed: Expected title to contain "Best Shot", got "${title}"`);
		}
		
		console.log('✅ Environment is accessible and healthy');
		
		// Test error handling setup
		await validateErrorHandlingSetup(testConfig);
		
	} catch (error) {
		console.error('❌ Environment validation failed:', error);
		
		// Capture setup failure screenshot
		try {
			const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
			const screenshotPath = path.join(testConfig.screenshots.directory, `setup-failure-${timestamp}.png`);
			await page.screenshot({ path: screenshotPath, fullPage: true });
			console.log(`📸 Setup failure screenshot saved: ${screenshotPath}`);
		} catch (screenshotError) {
			console.error('Failed to capture setup failure screenshot:', screenshotError);
		}
		
		throw error;
	} finally {
		await browser.close();
	}
	
	console.log('🎯 Global setup completed successfully');
}

/**
 * Set up necessary directories for error handling and reporting
 */
async function setupDirectories(testConfig: any): Promise<void> {
	const directories = [
		testConfig.screenshots.directory,
		path.join(testConfig.screenshots.directory, 'error-contexts'),
		'test-results',
		'playwright-report'
	];
	
	for (const dir of directories) {
		const resolvedDir = path.resolve(dir);
		if (!fs.existsSync(resolvedDir)) {
			fs.mkdirSync(resolvedDir, { recursive: true });
			console.log(`📁 Created directory: ${resolvedDir}`);
		}
	}
}

/**
 * Validate error handling setup
 */
async function validateErrorHandlingSetup(testConfig: any): Promise<void> {
	console.log('🔧 Validating error handling setup...');
	
	// Check if screenshots directory is writable
	const testFile = path.join(testConfig.screenshots.directory, 'test-write.tmp');
	try {
		fs.writeFileSync(testFile, 'test');
		fs.unlinkSync(testFile);
		console.log('✅ Screenshots directory is writable');
	} catch (error) {
		throw new Error(`Screenshots directory is not writable: ${error}`);
	}
	
	// Check if error contexts directory exists
	const errorContextsDir = path.join(testConfig.screenshots.directory, 'error-contexts');
	if (!fs.existsSync(errorContextsDir)) {
		throw new Error('Error contexts directory was not created');
	}
	console.log('✅ Error contexts directory is ready');
	
	// Validate retry configuration
	if (testConfig.retries < 0 || testConfig.retries > 10) {
		console.warn(`⚠️  Unusual retry configuration: ${testConfig.retries} retries`);
	}
	console.log(`✅ Retry configuration validated: ${testConfig.retries} retries`);
	
	console.log('✅ Error handling setup validation completed');
}

export default globalSetup;