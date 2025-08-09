/**
 * Test configuration interface for environment-specific settings
 */
export interface TestConfig {
	baseURL: string;
	timeout: number;
	retries: number;
	browsers: string[];
	viewport: { width: number; height: number };
	auth: {
		protectedRoutes: string[];
		// Future implementation when authentication flows are established
		// validUser?: { email: string; password: string };
		// invalidUser?: { email: string; password: string };
	};
	screenshots: {
		enabled: boolean;
		onFailure: boolean;
		directory: string;
	};
	reporting: {
		htmlReport: boolean;
		junitReport: boolean;
		videoOnFailure: boolean;
	};
}

/**
 * Environment configuration model
 */
export interface EnvironmentConfig {
	name: 'demo' | 'staging' | 'production';
	baseURL: string;
	auth: {
		provider: 'auth0';
		domain: string;
		clientId: string;
	};
	features: {
		[key: string]: boolean;
	};
}

/**
 * Demo environment configuration
 */
export const demoConfig: TestConfig = {
	baseURL: 'https://best-shot-demo.mariobrusarosco.com',
	timeout: 30000,
	retries: 2,
	browsers: ['chromium', 'firefox', 'webkit'],
	viewport: { width: 1280, height: 720 },
	auth: {
		protectedRoutes: [
			'/dashboard',
			'/tournaments',
			'/leagues',
			'/my-account'
		]
	},
	screenshots: {
		enabled: true,
		onFailure: true,
		directory: 'e2e/screenshots'
	},
	reporting: {
		htmlReport: true,
		junitReport: true,
		videoOnFailure: true
	}
};

/**
 * Staging environment configuration (for future use)
 */
export const stagingConfig: TestConfig = {
	...demoConfig,
	baseURL: 'https://best-shot-staging.mariobrusarosco.com', // placeholder
	retries: 1
};

/**
 * Production environment configuration (for future use)
 */
export const productionConfig: TestConfig = {
	...demoConfig,
	baseURL: 'https://best-shot.mariobrusarosco.com', // placeholder
	retries: 3,
	timeout: 60000
};

/**
 * Get configuration based on environment
 */
export function getTestConfig(environment: string = 'demo'): TestConfig {
	switch (environment.toLowerCase()) {
		case 'staging':
			return stagingConfig;
		case 'production':
			return productionConfig;
		case 'demo':
		default:
			return demoConfig;
	}
}

/**
 * Demo environment details
 */
export const demoEnvironment: EnvironmentConfig = {
	name: 'demo',
	baseURL: 'https://best-shot-demo.mariobrusarosco.com',
	auth: {
		provider: 'auth0',
		domain: 'best-shot-demo.auth0.com', // placeholder - will be updated when auth is implemented
		clientId: 'demo-client-id' // placeholder - will be updated when auth is implemented
	},
	features: {
		dashboard: true,
		tournaments: true,
		leagues: true,
		myAccount: true,
		authentication: true // Currently testing protected routes only
	}
};