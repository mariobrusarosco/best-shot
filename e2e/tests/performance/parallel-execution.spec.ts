import { expect } from '@playwright/test';
import { test, testWithCleanup, createPerformanceTest } from '../../fixtures/PerformanceFixture';

/**
 * Parallel execution and performance optimization tests
 * These tests demonstrate and validate the parallel execution features
 */

test.describe('Parallel Execution Optimization', () => {
	test('should execute tests in parallel with shared browser contexts', async ({ 
		optimizedPage, 
		performanceUtils, 
		parallelManager,
		testConfig 
	}) => {
		// Navigate to the demo application
		const loadMetrics = await performanceUtils.measurePageLoad(testConfig.baseURL);
		
		// Verify page loads within reasonable time
		expect(loadMetrics.navigationTime).toBeLessThan(10000); // 10 seconds max
		
		// Verify the page is accessible
		await expect(optimizedPage).toHaveTitle(/Best Shot/);
		
		// Check that we're using optimized resources
		const executionStats = parallelManager.getExecutionStats();
		console.log(`📊 Current execution stats: ${JSON.stringify(executionStats, null, 2)}`);
		
		// Verify context pooling is working
		expect(executionStats.pooledContexts).toBeGreaterThan(0);
	});

	test('should reuse browser contexts efficiently', async ({ 
		optimizedContext, 
		parallelManager 
	}) => {
		const initialStats = parallelManager.getExecutionStats();
		
		// Create multiple pages in the same context
		const page1 = await optimizedContext.newPage();
		const page2 = await optimizedContext.newPage();
		
		// Navigate both pages
		await Promise.all([
			page1.goto('https://best-shot-demo.mariobrusarosco.com'),
			page2.goto('https://best-shot-demo.mariobrusarosco.com/dashboard')
		]);
		
		// Verify both pages loaded
		await Promise.all([
			expect(page1).toHaveTitle(/Best Shot/),
			expect(page2).toHaveURL(/dashboard/)
		]);
		
		// Clean up pages
		await page1.close();
		await page2.close();
		
		const finalStats = parallelManager.getExecutionStats();
		
		// Context should be reused, not creating new ones
		expect(finalStats.pooledContexts).toBeLessThanOrEqual(initialStats.pooledContexts + 1);
	});

	test('should handle resource cleanup properly', async ({ 
		resourceCleanup,
		optimizedPage 
	}) => {
		const initialStats = resourceCleanup.getResourceStats();
		
		// Create some resources
		await optimizedPage.goto('https://best-shot-demo.mariobrusarosco.com');
		
		// Simulate some activity that might create resources
		await optimizedPage.evaluate(() => {
			// Create some timers and intervals (these would normally be cleaned up)
			const timer = setTimeout(() => {}, 1000);
			const interval = setInterval(() => {}, 1000);
			
			// Store references so they can be cleaned up
			(window as any).testTimer = timer;
			(window as any).testInterval = interval;
		});
		
		// Get current stats
		const currentStats = resourceCleanup.getResourceStats();
		expect(currentStats.pages).toBeGreaterThanOrEqual(initialStats.pages);
		
		// Resource cleanup will happen automatically via fixtures
	});

	testWithCleanup('should automatically clean up resources after test', async ({ 
		optimizedPage,
		resourceCleanup 
	}) => {
		// This test uses the testWithCleanup fixture which automatically cleans up
		await optimizedPage.goto('https://best-shot-demo.mariobrusarosco.com');
		
		// Create some resources that need cleanup
		await optimizedPage.evaluate(() => {
			// Create event listeners
			const handler = () => {};
			document.addEventListener('click', handler);
			document.addEventListener('scroll', handler);
		});
		
		// The cleanup will happen automatically after this test
		const stats = resourceCleanup.getResourceStats();
		expect(stats.pages).toBeGreaterThan(0);
	});
});

test.describe('Performance Monitoring', () => {
	test('should track performance metrics during test execution', async ({ 
		optimizedPage, 
		performanceUtils,
		testConfig 
	}) => {
		// Start tracking
		performanceUtils.startTracking('performance-tracking-test');
		
		// Navigate and perform actions
		const loadMetrics = await performanceUtils.measurePageLoad(testConfig.baseURL);
		
		// Verify performance metrics are reasonable
		expect(loadMetrics.navigationTime).toBeLessThan(15000); // 15 seconds max
		expect(loadMetrics.loadTime).toBeGreaterThan(0);
		
		// Perform some interactions
		await optimizedPage.waitForSelector('body');
		await optimizedPage.evaluate(() => {
			// Simulate some work
			const start = Date.now();
			while (Date.now() - start < 100) {
				// Busy wait for 100ms
			}
		});
		
		// Get current metrics
		const currentMetrics = performanceUtils.getCurrentMetrics();
		expect(currentMetrics.networkRequests).toBeDefined();
		expect(currentMetrics.duration).toBeGreaterThan(0);
		
		// Analyze network performance
		const networkAnalysis = performanceUtils.analyzeNetworkPerformance();
		expect(networkAnalysis.totalRequests).toBeGreaterThan(0);
		expect(networkAnalysis.averageResponseTime).toBeGreaterThan(0);
		
		console.log(`📊 Network analysis: ${JSON.stringify(networkAnalysis, null, 2)}`);
	});

	// Example of using the createPerformanceTest utility
	createPerformanceTest(
		'should load dashboard within performance thresholds',
		async ({ optimizedPage, testConfig }) => {
			await optimizedPage.goto(`${testConfig.baseURL}/dashboard`);
			
			// Wait for dashboard elements
			await optimizedPage.waitForSelector('[data-testid="screen-heading"]', { timeout: 10000 });
			
			// Verify dashboard loaded
			await expect(optimizedPage.locator('[data-testid="screen-heading"]')).toContainText('Dashboard');
		},
		{
			performanceThresholds: {
				maxDuration: 15000, // 15 seconds max
				maxPageLoadTime: 8000, // 8 seconds max page load
				maxNetworkRequests: 50 // Max 50 network requests
			}
		}
	);
});

test.describe('Load Balancing and Worker Distribution', () => {
	test('should distribute tests across workers efficiently', async ({ 
		parallelManager 
	}) => {
		const stats = parallelManager.getExecutionStats();
		
		// Get optimal worker recommendation
		const optimalWorker = parallelManager.getOptimalWorker();
		expect(optimalWorker).toBeDefined();
		expect(typeof optimalWorker).toBe('string');
		
		console.log(`📊 Optimal worker: ${optimalWorker}`);
		console.log(`📊 Worker stats: ${JSON.stringify(stats.workerStats, null, 2)}`);
		
		// Verify load balancing is working
		if (stats.workerStats.length > 1) {
			const maxTests = Math.max(...stats.workerStats.map(w => w.testsExecuted));
			const minTests = Math.min(...stats.workerStats.map(w => w.testsExecuted));
			
			// Load should be relatively balanced (within 50% difference)
			const loadDifference = maxTests > 0 ? (maxTests - minTests) / maxTests : 0;
			expect(loadDifference).toBeLessThan(0.5);
		}
	});

	test('should handle worker failures gracefully', async ({ 
		optimizedPage,
		parallelManager 
	}) => {
		// Simulate a test that might cause issues
		try {
			await optimizedPage.goto('https://invalid-url-that-should-fail.com');
		} catch (error) {
			// Expected to fail
			expect(error).toBeDefined();
		}
		
		// Verify the parallel manager still functions
		const stats = parallelManager.getExecutionStats();
		expect(stats.totalWorkers).toBeGreaterThan(0);
		
		// Should still be able to get optimal worker
		const optimalWorker = parallelManager.getOptimalWorker();
		expect(optimalWorker).toBeDefined();
	});
});

test.describe('Memory Management', () => {
	test('should monitor memory usage and prevent leaks', async ({ 
		resourceCleanup,
		optimizedPage 
	}) => {
		const initialMemory = process.memoryUsage().heapUsed;
		
		// Perform memory-intensive operations
		for (let i = 0; i < 5; i++) {
			await optimizedPage.goto('https://best-shot-demo.mariobrusarosco.com');
			await optimizedPage.waitForLoadState('networkidle');
			
			// Create some objects that might cause memory leaks
			await optimizedPage.evaluate(() => {
				const largeArray = new Array(1000).fill('test data');
				(window as any)[`testData${Date.now()}`] = largeArray;
			});
		}
		
		// Get memory stats
		const memoryStats = resourceCleanup.getResourceStats();
		const currentMemory = memoryStats.memoryUsage.heapUsed;
		
		console.log(`📊 Memory usage: ${(currentMemory / 1024 / 1024).toFixed(2)} MB`);
		console.log(`📊 Memory increase: ${((currentMemory - initialMemory) / 1024 / 1024).toFixed(2)} MB`);
		
		// Memory should not increase excessively (allow for some growth)
		const memoryIncrease = currentMemory - initialMemory;
		const memoryIncreasePercent = (memoryIncrease / initialMemory) * 100;
		
		// Allow up to 100% memory increase for this test
		expect(memoryIncreasePercent).toBeLessThan(100);
		
		// Verify resource tracking is working
		expect(memoryStats.pages).toBeGreaterThan(0);
		expect(memoryStats.memorySnapshots).toBeGreaterThan(0);
	});
});