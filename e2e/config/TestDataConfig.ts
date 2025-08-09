/**
 * Configuration for test data management across environments
 */

/**
 * Test data configuration interface
 */
export interface TestDataConfig {
	environment: string;
	dataRefreshInterval: number; // minutes
	maxCacheSize: number; // number of data sets to cache
	cleanupSchedule: {
		enabled: boolean;
		intervalMinutes: number;
		operations: string[];
	};
	validation: {
		enabled: boolean;
		strictMode: boolean;
		requiredFields: string[];
	};
	storage: {
		type: 'memory' | 'file' | 'database';
		location?: string;
		encryption: boolean;
	};
	fixtures: {
		autoLoad: boolean;
		preloadEnvironments: string[];
		customFixturePaths: string[];
	};
}

/**
 * Demo environment test data configuration
 */
export const demoTestDataConfig: TestDataConfig = {
	environment: 'demo',
	dataRefreshInterval: 60, // Refresh every hour
	maxCacheSize: 10,
	cleanupSchedule: {
		enabled: true,
		intervalMinutes: 30,
		operations: ['cleanup_artifacts', 'clear_cache']
	},
	validation: {
		enabled: true,
		strictMode: false,
		requiredFields: ['id', 'email', 'role', 'environment']
	},
	storage: {
		type: 'memory',
		encryption: false
	},
	fixtures: {
		autoLoad: true,
		preloadEnvironments: ['demo'],
		customFixturePaths: []
	}
};

/**
 * Staging environment test data configuration
 */
export const stagingTestDataConfig: TestDataConfig = {
	environment: 'staging',
	dataRefreshInterval: 30, // More frequent refresh for staging
	maxCacheSize: 5,
	cleanupSchedule: {
		enabled: true,
		intervalMinutes: 15,
		operations: ['cleanup_artifacts', 'clear_cache', 'reset_scenarios']
	},
	validation: {
		enabled: true,
		strictMode: true,
		requiredFields: ['id', 'email', 'role', 'environment', 'metadata']
	},
	storage: {
		type: 'memory',
		encryption: true
	},
	fixtures: {
		autoLoad: true,
		preloadEnvironments: ['staging'],
		customFixturePaths: []
	}
};

/**
 * Production environment test data configuration
 */
export const productionTestDataConfig: TestDataConfig = {
	environment: 'production',
	dataRefreshInterval: 120, // Less frequent refresh for production
	maxCacheSize: 3,
	cleanupSchedule: {
		enabled: true,
		intervalMinutes: 60,
		operations: ['cleanup_artifacts'] // Only safe operations in production
	},
	validation: {
		enabled: true,
		strictMode: true,
		requiredFields: ['id', 'email', 'role', 'environment', 'metadata']
	},
	storage: {
		type: 'memory',
		encryption: true
	},
	fixtures: {
		autoLoad: false, // Manual loading for production
		preloadEnvironments: [],
		customFixturePaths: []
	}
};

/**
 * Get test data configuration for environment
 */
export function getTestDataConfig(environment: string = 'demo'): TestDataConfig {
	switch (environment.toLowerCase()) {
		case 'staging':
			return stagingTestDataConfig;
		case 'production':
			return productionTestDataConfig;
		case 'demo':
		default:
			return demoTestDataConfig;
	}
}

/**
 * Test data validation rules
 */
export interface TestDataValidationRules {
	users: {
		emailFormat: RegExp;
		passwordMinLength: number;
		requiredRoles: string[];
		requiredEnvironments: string[];
	};
	scenarios: {
		maxSteps: number;
		requiredCategories: string[];
		requiredPriorities: string[];
		maxDurationMinutes: number;
	};
	general: {
		maxStringLength: number;
		allowedSpecialChars: string[];
		dateFormat: string;
	};
}

/**
 * Default validation rules
 */
export const defaultValidationRules: TestDataValidationRules = {
	users: {
		emailFormat: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
		passwordMinLength: 8,
		requiredRoles: ['standard', 'admin', 'guest'],
		requiredEnvironments: ['demo', 'staging', 'production']
	},
	scenarios: {
		maxSteps: 20,
		requiredCategories: ['smoke', 'regression', 'integration', 'performance'],
		requiredPriorities: ['critical', 'high', 'medium', 'low'],
		maxDurationMinutes: 120
	},
	general: {
		maxStringLength: 1000,
		allowedSpecialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?',
		dateFormat: 'ISO8601'
	}
};

/**
 * Environment-specific data limits
 */
export interface EnvironmentDataLimits {
	maxUsers: number;
	maxScenarios: number;
	maxTestDuration: number; // minutes
	allowedOperations: string[];
	dataRetentionDays: number;
}

/**
 * Data limits by environment
 */
export const environmentDataLimits: Record<string, EnvironmentDataLimits> = {
	demo: {
		maxUsers: 50,
		maxScenarios: 100,
		maxTestDuration: 60,
		allowedOperations: ['all'],
		dataRetentionDays: 7
	},
	staging: {
		maxUsers: 20,
		maxScenarios: 50,
		maxTestDuration: 30,
		allowedOperations: ['reset_users', 'clear_cache', 'reset_scenarios', 'cleanup_artifacts'],
		dataRetentionDays: 3
	},
	production: {
		maxUsers: 5,
		maxScenarios: 10,
		maxTestDuration: 15,
		allowedOperations: ['cleanup_artifacts'],
		dataRetentionDays: 1
	}
};

/**
 * Get environment data limits
 */
export function getEnvironmentDataLimits(environment: string): EnvironmentDataLimits {
	return environmentDataLimits[environment.toLowerCase()] || environmentDataLimits.demo;
}

/**
 * Test data security configuration
 */
export interface TestDataSecurityConfig {
	encryptSensitiveData: boolean;
	maskPasswords: boolean;
	auditDataAccess: boolean;
	allowDataExport: boolean;
	dataAnonymization: boolean;
}

/**
 * Security configuration by environment
 */
export const testDataSecurityConfig: Record<string, TestDataSecurityConfig> = {
	demo: {
		encryptSensitiveData: false,
		maskPasswords: true,
		auditDataAccess: false,
		allowDataExport: true,
		dataAnonymization: false
	},
	staging: {
		encryptSensitiveData: true,
		maskPasswords: true,
		auditDataAccess: true,
		allowDataExport: false,
		dataAnonymization: true
	},
	production: {
		encryptSensitiveData: true,
		maskPasswords: true,
		auditDataAccess: true,
		allowDataExport: false,
		dataAnonymization: true
	}
};

/**
 * Get security configuration for environment
 */
export function getTestDataSecurityConfig(environment: string): TestDataSecurityConfig {
	return testDataSecurityConfig[environment.toLowerCase()] || testDataSecurityConfig.demo;
}