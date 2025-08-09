#!/usr/bin/env node

/**
 * Script to run responsive design tests with specific configurations
 * Usage: 
 *   npm run test:responsive
 *   npm run test:responsive -- --project=mobile-chrome
 *   npm run test:responsive -- --grep="viewport"
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

// Configuration options
const TEST_TYPES = {
	responsive: 'e2e/tests/responsive/',
	'cross-browser': 'e2e/tests/responsive/cross-browser.spec.ts',
	mobile: 'e2e/tests/responsive/ --grep="mobile"',
	performance: 'e2e/tests/responsive/ --grep="performance"'
};

const BROWSER_PROJECTS = {
	chrome: 'chromium',
	firefox: 'firefox',
	safari: 'webkit',
	all: 'chromium firefox webkit'
};

function parseArgs() {
	const args = process.argv.slice(2);
	const config = {
		testType: 'responsive' as keyof typeof TEST_TYPES,
		browsers: 'all' as keyof typeof BROWSER_PROJECTS,
		environment: 'demo',
		headed: false,
		debug: false,
		grep: '',
		project: ''
	};

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		
		if (arg === '--type' && args[i + 1]) {
			config.testType = args[i + 1] as keyof typeof TEST_TYPES;
			i++;
		} else if (arg === '--browsers' && args[i + 1]) {
			config.browsers = args[i + 1] as keyof typeof BROWSER_PROJECTS;
			i++;
		} else if (arg === '--env' && args[i + 1]) {
			config.environment = args[i + 1];
			i++;
		} else if (arg === '--headed') {
			config.headed = true;
		} else if (arg === '--debug') {
			config.debug = true;
		} else if (arg === '--grep' && args[i + 1]) {
			config.grep = args[i + 1];
			i++;
		} else if (arg === '--project' && args[i + 1]) {
			config.project = args[i + 1];
			i++;
		}
	}

	return config;
}

function buildCommand(config: ReturnType<typeof parseArgs>) {
	const baseCommand = 'npx playwright test';
	const parts = [baseCommand];

	// Add test path
	parts.push(TEST_TYPES[config.testType]);

	// Add environment
	if (config.environment !== 'demo') {
		parts.push(`--env=${config.environment}`);
	}

	// Add browser projects
	if (config.project) {
		parts.push(`--project=${config.project}`);
	} else if (config.browsers !== 'all') {
		parts.push(`--project=${BROWSER_PROJECTS[config.browsers]}`);
	}

	// Add grep filter
	if (config.grep) {
		parts.push(`--grep="${config.grep}"`);
	}

	// Add headed mode
	if (config.headed) {
		parts.push('--headed');
	}

	// Add debug mode
	if (config.debug) {
		parts.push('--debug');
	}

	// Add reporter
	parts.push('--reporter=html,list');

	return parts.join(' ');
}

function validateEnvironment() {
	// Check if Playwright is installed
	try {
		execSync('npx playwright --version', { stdio: 'pipe' });
	} catch (error) {
		console.error('❌ Playwright is not installed. Run: npm install @playwright/test');
		process.exit(1);
	}

	// Check if browsers are installed
	try {
		execSync('npx playwright install --dry-run', { stdio: 'pipe' });
	} catch (error) {
		console.log('⚠️  Some browsers may not be installed. Run: npx playwright install');
	}

	// Check if test files exist
	const testDir = path.join(process.cwd(), 'e2e/tests/responsive');
	if (!existsSync(testDir)) {
		console.error('❌ Responsive test directory not found:', testDir);
		process.exit(1);
	}
}

function printUsage() {
	console.log(`
🧪 Responsive Design Test Runner

Usage:
  npm run test:responsive [options]

Options:
  --type <type>        Test type: responsive, cross-browser, mobile, performance
  --browsers <list>    Browsers: chrome, firefox, safari, all
  --env <environment>  Environment: demo, staging, production
  --project <name>     Specific project name
  --grep <pattern>     Filter tests by pattern
  --headed             Run in headed mode
  --debug              Run in debug mode

Examples:
  npm run test:responsive
  npm run test:responsive -- --type=cross-browser
  npm run test:responsive -- --browsers=chrome --headed
  npm run test:responsive -- --grep="viewport" --debug
  npm run test:responsive -- --project=mobile-chrome
  npm run test:responsive -- --env=staging --type=mobile

Available Projects:
  - desktop-chrome-large, desktop-chrome-standard
  - desktop-firefox-large, desktop-firefox-standard  
  - desktop-safari-large, desktop-safari-standard
  - tablet-chrome-landscape, tablet-chrome-portrait
  - mobile-chrome-large, mobile-chrome-standard, mobile-chrome-small
  - mobile-safari-standard
`);
}

function main() {
	const config = parseArgs();

	// Show help
	if (process.argv.includes('--help') || process.argv.includes('-h')) {
		printUsage();
		return;
	}

	console.log('🚀 Starting Responsive Design Tests...\n');
	console.log('Configuration:');
	console.log(`  Test Type: ${config.testType}`);
	console.log(`  Browsers: ${config.browsers}`);
	console.log(`  Environment: ${config.environment}`);
	console.log(`  Headed: ${config.headed}`);
	console.log(`  Debug: ${config.debug}`);
	if (config.grep) console.log(`  Filter: ${config.grep}`);
	if (config.project) console.log(`  Project: ${config.project}`);
	console.log('');

	// Validate environment
	validateEnvironment();

	// Build and execute command
	const command = buildCommand(config);
	console.log('Executing:', command);
	console.log('');

	try {
		// Set environment variable
		process.env.TEST_ENV = config.environment;
		
		execSync(command, { 
			stdio: 'inherit',
			env: { ...process.env, TEST_ENV: config.environment }
		});
		
		console.log('\n✅ Responsive tests completed successfully!');
		console.log('📊 Check the HTML report: playwright-report/index.html');
		
	} catch (error) {
		console.error('\n❌ Responsive tests failed!');
		console.error('📊 Check the HTML report for details: playwright-report/index.html');
		process.exit(1);
	}
}

// Run if called directly
if (require.main === module) {
	main();
}

export { parseArgs, buildCommand, validateEnvironment };