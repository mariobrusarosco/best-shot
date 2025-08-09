import { FullConfig } from '@playwright/test';
import { getTestConfig } from './TestConfig';
import { ResourceCleanup } from '../utils/ResourceCleanup';
import { ParallelExecutionManager } from '../utils/ParallelExecutionManager';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Global teardown for E2E tests
 * Performs cleanup tasks after all tests have completed
 */
async function globalTeardown(config: FullConfig) {
	console.log('🧹 Starting global teardown...');
	
	const environment = process.env.TEST_ENV || 'demo';
	const testConfig = getTestConfig(environment);
	
	try {
		// Get resource cleanup and parallel execution manager instances
		const resourceCleanup = ResourceCleanup.getInstance(testConfig);
		const parallelManager = ParallelExecutionManager.getInstance(testConfig);
		
		// Generate final reports
		console.log('📊 Generating final performance and execution reports...');
		
		// Generate execution report
		const executionReport = parallelManager.generateExecutionReport();
		const executionReportPath = path.join('test-results', 'execution-report.md');
		fs.writeFileSync(executionReportPath, executionReport);
		console.log(`📄 Execution report saved: ${executionReportPath}`);
		
		// Generate memory usage report
		const memoryReport = resourceCleanup.generateMemoryReport();
		const memoryReportPath = path.join('test-results', 'memory-report.md');
		fs.writeFileSync(memoryReportPath, memoryReport);
		console.log(`📄 Memory report saved: ${memoryReportPath}`);
		
		// Get final statistics
		const executionStats = parallelManager.getExecutionStats();
		const resourceStats = resourceCleanup.getResourceStats();
		
		// Log summary statistics
		console.log(`📊 Test execution summary for ${environment} environment:`);
		console.log(`   - Total workers: ${executionStats.totalWorkers}`);
		console.log(`   - Total tests executed: ${executionStats.totalTestsExecuted}`);
		console.log(`   - Average test duration: ${executionStats.averageTestDuration.toFixed(2)}ms`);
		console.log(`   - Total errors: ${executionStats.totalErrors}`);
		console.log(`   - Active contexts: ${executionStats.activeContexts}`);
		console.log(`   - Memory usage: ${(executionStats.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
		
		// Perform complete cleanup
		console.log('🧹 Performing complete resource cleanup...');
		const cleanupStats = await resourceCleanup.performCompleteCleanup();
		
		// Shutdown parallel execution manager
		await parallelManager.shutdown();
		
		// Log cleanup results
		console.log(`✅ Cleanup completed:`);
		console.log(`   - Browsers closed: ${cleanupStats.browsersCleanedUp}`);
		console.log(`   - Contexts closed: ${cleanupStats.contextsCleanedUp}`);
		console.log(`   - Pages closed: ${cleanupStats.pagesCleanedUp}`);
		console.log(`   - Memory freed: ${(cleanupStats.memoryFreed / 1024 / 1024).toFixed(2)} MB`);
		console.log(`   - Cleanup duration: ${cleanupStats.cleanupDuration}ms`);
		
		if (cleanupStats.errors.length > 0) {
			console.warn(`⚠️  Cleanup errors (${cleanupStats.errors.length}):`);
			cleanupStats.errors.forEach(error => console.warn(`   - ${error}`));
		}
		
		// Save final statistics
		const finalStats = {
			environment,
			timestamp: new Date().toISOString(),
			execution: executionStats,
			resources: resourceStats,
			cleanup: cleanupStats
		};
		
		const statsPath = path.join('test-results', 'final-stats.json');
		fs.writeFileSync(statsPath, JSON.stringify(finalStats, null, 2));
		console.log(`📄 Final statistics saved: ${statsPath}`);
		
	} catch (error) {
		console.error('❌ Error during global teardown:', error);
		
		// Try emergency cleanup
		try {
			const resourceCleanup = ResourceCleanup.getInstance(testConfig);
			await resourceCleanup.performCompleteCleanup();
		} catch (emergencyError) {
			console.error('❌ Emergency cleanup also failed:', emergencyError);
		}
	}
	
	console.log('✅ Global teardown completed');
}

export default globalTeardown;