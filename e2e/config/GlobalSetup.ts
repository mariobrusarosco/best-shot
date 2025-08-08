import { chromium, FullConfig } from '@playwright/test';
import { getTestConfig } from './TestConfig';

/**
 * Global setup for E2E tests
 * Performs environment validation and setup tasks before test execution
 */
async function globalSetup(config: FullConfig) {
	const environment = process.env.TEST_ENV || 'demo';
	const testConfig = getTestConfig(environment);
	
	console.log(`🚀 Starting E2E tests against ${environment} environment`);
	console.log(`📍 Base URL: ${testConfig.baseURL}`);
	
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
		
		// Create screenshots directory if it doesn't exist
		const fs = require('fs');
		const path = require('path');
		const screenshotsDir = path.resolve(testConfig.screenshots.directory);
		
		if (!fs.existsSync(screenshotsDir)) {
			fs.mkdirSync(screenshotsDir, { recursive: true });
			console.log(`📁 Created screenshots directory: ${screenshotsDir}`);
		}
		
	} catch (error) {
		console.error('❌ Environment validation failed:', error);
		throw error;
	} finally {
		await browser.close();
	}
	
	console.log('🎯 Global setup completed successfully');
}

export default globalSetup;