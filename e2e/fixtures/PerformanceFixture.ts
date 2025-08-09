import { test as base, Browser, BrowserContext, Page } from '@playwright/test';
import { TestConfig, getTestConfig } from '../config/TestConfig';
import { PerformanceUtils, PerformanceMetrics } from '../utils/PerformanceUtils';
import { ResourceCleanup } from '../utils/ResourceCleanup';
import { ParallelExecutionManager } from '../utils/ParallelExecutionManager';

/**
 * Extended test fixtures with performance monitoring and resource management
 */
export interface PerformanceFixtures {
	testConfig: TestConfig;
	performanceUtils: PerformanceUtils;
	resourceCleanup: ResourceCleanup;
	parallelManager: ParallelExecutionManager;
	optimizedBrowser: Browser;
	optimizedContext: BrowserContext;
	optimizedPage: Page;
	performanceMetrics: PerformanceMetrics;
}

/**
 * Enhanced test fixture with performance monitoring and parallel execution optimization
 */
export const test = base.extend<PerformanceFixtures>({
	// Test configuration fixture
	testConfig: async ({}, use) => {
		const environment = process.env.TEST_ENV || 'demo';
		const config = getTestConfig(environment);
		await use(config);
	},

	// Resource cleanup fixture
	resourceCleanup: async ({ testConfig }, use) => {
		const cleanup = ResourceCleanup.getInstance(testConfig);
		await use(cleanup);
	},

	// Parallel execution manager fixture
	parallelManager: async ({ testConfig }, use) => {
		const manager = ParallelExecutionManager.getInstance(testConfig);
		await use(manager);
		// Cleanup is handled by the manager itself
	},

	// Optimized browser fixture with resource sharing
	optimizedBrowser: async ({ parallelManager, resourceCleanup }, use, testInfo) => {
		const browserName = testInfo.project.name || 'chromium';
		const browser = await parallelManager.getBrowser(browserName);
		
		resourceCleanup.registerBrowser(browser);
		
		await use(browser);
		
		// Don't close shared browsers - they're managed by the parallel manager
	},

	// Optimized context fixture with pooling
	optimizedContext: async ({ optimizedBrowser, parallelManager, resourceCleanup }, use, testInfo) => {
		const context = await parallelManager.getContext(optimizedBrowser, testInfo);
		
		resourceCleanup.registerContext(context);
		
		await use(context);
		
		// Release context back to pool instead of closing
		await parallelManager.releaseContext(context, testInfo);
	},

	// Optimized page fixture with performance monitoring
	optimizedPage: async ({ optimizedContext, parallelManager, resourceCleanup, testConfig }, use, testInfo) => {
		const page = await parallelManager.getPage(optimizedContext, testInfo);
		
		resourceCleanup.registerPage(page);
		
		await use(page);
		
		// Page cleanup is handled by context release
	},

	// Performance utilities fixture
	performanceUtils: async ({ optimizedPage, testConfig }, use, testInfo) => {
		const perfUtils = new PerformanceUtils(optimizedPage, testConfig, testInfo);
		
		// Start performance tracking
		perfUtils.startTracking(testInfo.title);
		
		await use(perfUtils);
		
		// Stop tracking and cleanup
		await perfUtils.stopTracking();
		perfUtils.cleanup();
	},

	// Performance metrics fixture
	performanceMetrics: async ({ performanceUtils, parallelManager }, use, testInfo) => {
		const startTime = Date.now();
		
		// Use the fixture
		await use({} as PerformanceMetrics); // Placeholder, actual metrics come from performanceUtils
		
		const endTime = Date.now();
		const testDuration = endTime - startTime;
		
		// Update worker statistics
		const workerId = testInfo.workerIndex?.toString() || 'unknown';
		const hasError = testInfo.status === 'failed' || testInfo.status === 'timedOut';
		parallelManager.updateWorkerStats(workerId, testDuration, hasError);
		
		// Get final metrics
		const finalMetrics = await performanceUtils.stopTracking();
		
		// Save metrics if test failed or if performance monitoring is enabled
		if (hasError || process.env.PERFORMANCE_MONITORING === 'true') {
			await performanceUtils.saveMetrics(finalMetrics);
		}
		
		// Log performance summary
		console.log(`📊 Test "${testInfo.title}" completed in ${testDuration}ms`);
		if (finalMetrics.pageLoadTime) {
			console.log(`   - Page load time: ${finalMetrics.pageLoadTime}ms`);
		}
		console.log(`   - Network requests: ${finalMetrics.networkRequests.length}`);
	}
});

/**
 * Enhanced test with automatic cleanup
 */
export const testWithCleanup = test.extend<{}>({
	// Auto-cleanup fixture that runs after each test
	auto: [async ({ resourceCleanup }, use, testInfo) => {
		await use();
		
		// Perform test-specific cleanup
		const cleanupStats = await resourceCleanup.cleanupTest(testInfo);
		
		// Log cleanup stats if there were issues
		if (cleanupStats.errors.length > 0) {
			console.warn(`⚠️  Cleanup issues for test "${testInfo.title}":`, cleanupStats.errors);
		}
		
		// Log resource usage if test failed
		if (testInfo.status === 'failed') {
			const resourceStats = resourceCleanup.getResourceStats();
			console.log(`📊 Resource usage at test failure:`, resourceStats);
		}
	}, { auto: true }]
});

/**
 * Performance-focused test for measuring and comparing performance
 */
export const performanceTest = test.extend<{
	performanceBaseline: PerformanceMetrics | null;
}>({
	performanceBaseline: async ({}, use) => {
		// Load baseline metrics if available
		// This could be loaded from a file or database
		const baseline = null; // Placeholder for baseline loading logic
		await use(baseline);
	}
});

/**
 * Utility function to create a performance-aware test
 */
export function createPerformanceTest(
	testName: string,
	testFn: (fixtures: PerformanceFixtures) => Promise<void>,
	options?: {
		timeout?: number;
		retries?: number;
		performanceThresholds?: {
			maxDuration?: number;
			maxPageLoadTime?: number;
			maxNetworkRequests?: number;
		};
	}
) {
	return test(testName, async (fixtures) => {
		const { performanceUtils, testConfig } = fixtures;
		const startTime = Date.now();
		
		try {
			// Run the actual test
			await testFn(fixtures);
			
			// Check performance thresholds if specified
			if (options?.performanceThresholds) {
				const metrics = performanceUtils.getCurrentMetrics();
				const duration = Date.now() - startTime;
				
				if (options.performanceThresholds.maxDuration && duration > options.performanceThresholds.maxDuration) {
					throw new Error(`Test exceeded maximum duration: ${duration}ms > ${options.performanceThresholds.maxDuration}ms`);
				}
				
				if (options.performanceThresholds.maxPageLoadTime && metrics.pageLoadTime && metrics.pageLoadTime > options.performanceThresholds.maxPageLoadTime) {
					throw new Error(`Page load exceeded maximum time: ${metrics.pageLoadTime}ms > ${options.performanceThresholds.maxPageLoadTime}ms`);
				}
				
				if (options.performanceThresholds.maxNetworkRequests && metrics.networkRequests && metrics.networkRequests.length > options.performanceThresholds.maxNetworkRequests) {
					throw new Error(`Too many network requests: ${metrics.networkRequests.length} > ${options.performanceThresholds.maxNetworkRequests}`);
				}
			}
			
		} catch (error) {
			// Capture performance data on failure
			const metrics = await performanceUtils.stopTracking();
			await performanceUtils.saveMetrics(metrics, `failed-${testName.replace(/\s+/g, '-')}`);
			throw error;
		}
	});
}

export { expect } from '@playwright/test';