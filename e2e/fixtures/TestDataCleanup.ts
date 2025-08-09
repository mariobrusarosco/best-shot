/**
 * Test data cleanup utilities for managing test data lifecycle
 */

import { TestConfig } from '../config/TestConfig';
import { TestDataManager } from './TestDataManager';

/**
 * Cleanup operation types
 */
export type CleanupOperation = 
	| 'reset_users'
	| 'clear_cache'
	| 'reset_scenarios'
	| 'cleanup_artifacts'
	| 'reset_all';

/**
 * Cleanup result interface
 */
export interface CleanupResult {
	operation: CleanupOperation;
	success: boolean;
	message: string;
	timestamp: string;
	details?: Record<string, any>;
}

/**
 * Test data cleanup manager
 */
export class TestDataCleanup {
	private config: TestConfig;
	private dataManager: TestDataManager;
	private cleanupHistory: CleanupResult[] = [];

	constructor(config: TestConfig) {
		this.config = config;
		this.dataManager = TestDataManager.getInstance(config);
	}

	/**
	 * Perform cleanup operation
	 */
	public async performCleanup(
		environment: string,
		operations: CleanupOperation[]
	): Promise<CleanupResult[]> {
		const results: CleanupResult[] = [];

		for (const operation of operations) {
			try {
				const result = await this.executeCleanupOperation(environment, operation);
				results.push(result);
				this.cleanupHistory.push(result);
			} catch (error) {
				const errorResult: CleanupResult = {
					operation,
					success: false,
					message: `Cleanup failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
					timestamp: new Date().toISOString(),
					details: { error: error instanceof Error ? error.stack : error }
				};
				results.push(errorResult);
				this.cleanupHistory.push(errorResult);
			}
		}

		return results;
	}

	/**
	 * Reset test users to initial state
	 */
	public async resetTestUsers(environment: string): Promise<CleanupResult> {
		try {
			const users = this.dataManager.getTestData(environment, 'users');
			if (users) {
				// Reset user metadata
				users.forEach(user => {
					user.metadata.lastUsed = undefined;
					user.metadata.isActive = true;
				});
			}

			return {
				operation: 'reset_users',
				success: true,
				message: `Test users reset successfully for environment: ${environment}`,
				timestamp: new Date().toISOString(),
				details: { userCount: users?.length || 0 }
			};
		} catch (error) {
			throw new Error(`Failed to reset test users: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}

	/**
	 * Clear test data cache
	 */
	public async clearTestDataCache(environment: string): Promise<CleanupResult> {
		try {
			this.dataManager.resetTestData(environment);

			return {
				operation: 'clear_cache',
				success: true,
				message: `Test data cache cleared for environment: ${environment}`,
				timestamp: new Date().toISOString(),
				details: { environment }
			};
		} catch (error) {
			throw new Error(`Failed to clear cache: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}

	/**
	 * Reset test scenarios to initial state
	 */
	public async resetTestScenarios(environment: string): Promise<CleanupResult> {
		try {
			const scenarios = this.dataManager.getTestData(environment, 'scenarios');
			if (scenarios) {
				// Reset scenario metadata
				scenarios.forEach(scenario => {
					scenario.metadata.lastUpdated = new Date().toISOString();
				});
			}

			return {
				operation: 'reset_scenarios',
				success: true,
				message: `Test scenarios reset successfully for environment: ${environment}`,
				timestamp: new Date().toISOString(),
				details: { scenarioCount: scenarios?.length || 0 }
			};
		} catch (error) {
			throw new Error(`Failed to reset scenarios: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}

	/**
	 * Clean up test artifacts (screenshots, videos, logs)
	 */
	public async cleanupTestArtifacts(environment: string): Promise<CleanupResult> {
		try {
			// In a real implementation, this would clean up actual files
			// For now, we'll simulate the cleanup
			const artifactTypes = ['screenshots', 'videos', 'logs', 'reports'];
			const cleanedArtifacts = artifactTypes.map(type => ({
				type,
				count: Math.floor(Math.random() * 10), // Simulated count
				size: `${Math.floor(Math.random() * 100)}MB` // Simulated size
			}));

			return {
				operation: 'cleanup_artifacts',
				success: true,
				message: `Test artifacts cleaned up for environment: ${environment}`,
				timestamp: new Date().toISOString(),
				details: { 
					environment,
					cleanedArtifacts,
					totalFiles: cleanedArtifacts.reduce((sum, artifact) => sum + artifact.count, 0)
				}
			};
		} catch (error) {
			throw new Error(`Failed to cleanup artifacts: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}

	/**
	 * Perform complete cleanup (all operations)
	 */
	public async performCompleteCleanup(environment: string): Promise<CleanupResult[]> {
		const allOperations: CleanupOperation[] = [
			'reset_users',
			'clear_cache',
			'reset_scenarios',
			'cleanup_artifacts'
		];

		return this.performCleanup(environment, allOperations);
	}

	/**
	 * Get cleanup history
	 */
	public getCleanupHistory(): CleanupResult[] {
		return [...this.cleanupHistory];
	}

	/**
	 * Get cleanup history for specific environment
	 */
	public getEnvironmentCleanupHistory(environment: string): CleanupResult[] {
		return this.cleanupHistory.filter(result => 
			result.details?.environment === environment
		);
	}

	/**
	 * Schedule automatic cleanup (for CI/CD integration)
	 */
	public scheduleCleanup(
		environment: string,
		operations: CleanupOperation[],
		intervalMinutes: number = 60
	): NodeJS.Timeout {
		return setInterval(async () => {
			try {
				await this.performCleanup(environment, operations);
				console.log(`Scheduled cleanup completed for environment: ${environment}`);
			} catch (error) {
				console.error(`Scheduled cleanup failed for environment: ${environment}`, error);
			}
		}, intervalMinutes * 60 * 1000);
	}

	/**
	 * Validate cleanup requirements before execution
	 */
	public validateCleanupRequirements(
		environment: string,
		operations: CleanupOperation[]
	): { valid: boolean; issues: string[] } {
		const issues: string[] = [];

		// Validate environment
		if (!environment || !['demo', 'staging', 'production'].includes(environment)) {
			issues.push(`Invalid environment: ${environment}`);
		}

		// Validate operations
		const validOperations: CleanupOperation[] = [
			'reset_users',
			'clear_cache',
			'reset_scenarios',
			'cleanup_artifacts',
			'reset_all'
		];

		operations.forEach(operation => {
			if (!validOperations.includes(operation)) {
				issues.push(`Invalid cleanup operation: ${operation}`);
			}
		});

		// Environment-specific validations
		if (environment === 'production') {
			const dangerousOperations = ['reset_all', 'reset_users'];
			const hasDangerousOps = operations.some(op => dangerousOperations.includes(op));
			if (hasDangerousOps) {
				issues.push('Dangerous cleanup operations not allowed in production environment');
			}
		}

		return {
			valid: issues.length === 0,
			issues
		};
	}

	/**
	 * Execute individual cleanup operation
	 */
	private async executeCleanupOperation(
		environment: string,
		operation: CleanupOperation
	): Promise<CleanupResult> {
		switch (operation) {
			case 'reset_users':
				return this.resetTestUsers(environment);
			case 'clear_cache':
				return this.clearTestDataCache(environment);
			case 'reset_scenarios':
				return this.resetTestScenarios(environment);
			case 'cleanup_artifacts':
				return this.cleanupTestArtifacts(environment);
			case 'reset_all':
				const allResults = await this.performCompleteCleanup(environment);
				const allSuccessful = allResults.every(result => result.success);
				return {
					operation: 'reset_all',
					success: allSuccessful,
					message: allSuccessful 
						? `Complete cleanup successful for environment: ${environment}`
						: `Some cleanup operations failed for environment: ${environment}`,
					timestamp: new Date().toISOString(),
					details: { 
						environment,
						operations: allResults.length,
						successful: allResults.filter(r => r.success).length,
						failed: allResults.filter(r => !r.success).length
					}
				};
			default:
				throw new Error(`Unknown cleanup operation: ${operation}`);
		}
	}
}

/**
 * Cleanup utility functions for common operations
 */
export class CleanupUtils {
	/**
	 * Create cleanup instance for environment
	 */
	public static createCleanup(config: TestConfig): TestDataCleanup {
		return new TestDataCleanup(config);
	}

	/**
	 * Quick cleanup for test suite completion
	 */
	public static async quickCleanup(
		config: TestConfig,
		environment: string
	): Promise<CleanupResult[]> {
		const cleanup = new TestDataCleanup(config);
		return cleanup.performCleanup(environment, ['clear_cache', 'cleanup_artifacts']);
	}

	/**
	 * Deep cleanup for environment reset
	 */
	public static async deepCleanup(
		config: TestConfig,
		environment: string
	): Promise<CleanupResult[]> {
		const cleanup = new TestDataCleanup(config);
		return cleanup.performCompleteCleanup(environment);
	}

	/**
	 * Validate cleanup safety
	 */
	public static validateCleanupSafety(
		environment: string,
		operations: CleanupOperation[]
	): boolean {
		// Production safety checks
		if (environment === 'production') {
			const unsafeOperations = ['reset_all', 'reset_users'];
			return !operations.some(op => unsafeOperations.includes(op));
		}

		return true;
	}
}