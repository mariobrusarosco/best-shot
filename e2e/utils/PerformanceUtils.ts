import { Page, TestInfo } from '@playwright/test';
import { TestConfig } from '../config/TestConfig';

/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
	testName: string;
	startTime: number;
	endTime: number;
	duration: number;
	pageLoadTime?: number;
	networkRequests: NetworkRequestMetric[];
	memoryUsage?: MemoryMetric;
	browserContextId: string;
	timestamp: string;
}

/**
 * Network request metric
 */
export interface NetworkRequestMetric {
	url: string;
	method: string;
	status: number;
	duration: number;
	size: number;
	timestamp: number;
}

/**
 * Memory usage metric
 */
export interface MemoryMetric {
	usedJSHeapSize: number;
	totalJSHeapSize: number;
	jsHeapSizeLimit: number;
	timestamp: number;
}

/**
 * Performance monitoring and optimization utilities
 */
export class PerformanceUtils {
	private page: Page;
	private config: TestConfig;
	private testInfo?: TestInfo;
	private metrics: PerformanceMetrics;
	private networkRequests: NetworkRequestMetric[] = [];
	private performanceObserver?: any;

	constructor(page: Page, config: TestConfig, testInfo?: TestInfo) {
		this.page = page;
		this.config = config;
		this.testInfo = testInfo;
		
		this.metrics = {
			testName: testInfo?.title || 'unknown-test',
			startTime: Date.now(),
			endTime: 0,
			duration: 0,
			networkRequests: [],
			browserContextId: page.context().toString(),
			timestamp: new Date().toISOString()
		};

		this.setupNetworkMonitoring();
		this.setupPerformanceMonitoring();
	}

	/**
	 * Set up network request monitoring
	 */
	private setupNetworkMonitoring(): void {
		this.page.on('request', (request) => {
			const startTime = Date.now();
			
			request.response().then((response) => {
				if (response) {
					const endTime = Date.now();
					const metric: NetworkRequestMetric = {
						url: request.url(),
						method: request.method(),
						status: response.status(),
						duration: endTime - startTime,
						size: parseInt(response.headers()['content-length'] || '0', 10),
						timestamp: startTime
					};
					this.networkRequests.push(metric);
				}
			}).catch(() => {
				// Ignore failed requests for monitoring purposes
			});
		});
	}

	/**
	 * Set up performance monitoring
	 */
	private setupPerformanceMonitoring(): void {
		// Monitor page load performance
		this.page.on('load', async () => {
			try {
				const performanceData = await this.page.evaluate(() => {
					const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
					return {
						loadTime: navigation.loadEventEnd - navigation.loadEventStart,
						domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
						totalLoadTime: navigation.loadEventEnd - navigation.fetchStart
					};
				});
				
				this.metrics.pageLoadTime = performanceData.totalLoadTime;
			} catch (error) {
				console.warn('Failed to capture page load performance:', error);
			}
		});
	}

	/**
	 * Start performance tracking for a test
	 */
	startTracking(testName?: string): void {
		if (testName) {
			this.metrics.testName = testName;
		}
		this.metrics.startTime = Date.now();
		this.networkRequests = [];
	}

	/**
	 * Stop performance tracking and calculate metrics
	 */
	async stopTracking(): Promise<PerformanceMetrics> {
		this.metrics.endTime = Date.now();
		this.metrics.duration = this.metrics.endTime - this.metrics.startTime;
		this.metrics.networkRequests = [...this.networkRequests];

		// Capture memory usage
		try {
			const memoryInfo = await this.page.evaluate(() => {
				if ('memory' in performance) {
					const memory = (performance as any).memory;
					return {
						usedJSHeapSize: memory.usedJSHeapSize,
						totalJSHeapSize: memory.totalJSHeapSize,
						jsHeapSizeLimit: memory.jsHeapSizeLimit,
						timestamp: Date.now()
					};
				}
				return null;
			});

			if (memoryInfo) {
				this.metrics.memoryUsage = memoryInfo;
			}
		} catch (error) {
			console.warn('Failed to capture memory usage:', error);
		}

		return { ...this.metrics };
	}

	/**
	 * Get current performance metrics without stopping tracking
	 */
	getCurrentMetrics(): Partial<PerformanceMetrics> {
		return {
			...this.metrics,
			duration: Date.now() - this.metrics.startTime,
			networkRequests: [...this.networkRequests]
		};
	}

	/**
	 * Monitor page load performance
	 */
	async measurePageLoad(url: string): Promise<{
		navigationTime: number;
		loadTime: number;
		domContentLoadedTime: number;
		firstContentfulPaint?: number;
	}> {
		const startTime = Date.now();
		
		await this.page.goto(url);
		await this.page.waitForLoadState('networkidle');
		
		const endTime = Date.now();
		const navigationTime = endTime - startTime;

		try {
			const performanceData = await this.page.evaluate(() => {
				const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
				const paint = performance.getEntriesByType('paint');
				const fcp = paint.find(entry => entry.name === 'first-contentful-paint');

				return {
					loadTime: navigation.loadEventEnd - navigation.loadEventStart,
					domContentLoadedTime: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
					firstContentfulPaint: fcp ? fcp.startTime : undefined
				};
			});

			return {
				navigationTime,
				...performanceData
			};
		} catch (error) {
			console.warn('Failed to capture detailed page load metrics:', error);
			return {
				navigationTime,
				loadTime: 0,
				domContentLoadedTime: 0
			};
		}
	}

	/**
	 * Analyze network performance
	 */
	analyzeNetworkPerformance(): {
		totalRequests: number;
		failedRequests: number;
		averageResponseTime: number;
		slowestRequest: NetworkRequestMetric | null;
		totalDataTransferred: number;
	} {
		const requests = this.networkRequests;
		const failedRequests = requests.filter(req => req.status >= 400);
		const totalDuration = requests.reduce((sum, req) => sum + req.duration, 0);
		const totalSize = requests.reduce((sum, req) => sum + req.size, 0);
		
		const slowestRequest = requests.length > 0 
			? requests.reduce((slowest, current) => 
				current.duration > slowest.duration ? current : slowest
			)
			: null;

		return {
			totalRequests: requests.length,
			failedRequests: failedRequests.length,
			averageResponseTime: requests.length > 0 ? totalDuration / requests.length : 0,
			slowestRequest,
			totalDataTransferred: totalSize
		};
	}

	/**
	 * Check for performance regressions
	 */
	checkPerformanceRegression(
		currentMetrics: PerformanceMetrics,
		baselineMetrics: PerformanceMetrics,
		thresholds: {
			durationIncrease?: number; // percentage
			pageLoadIncrease?: number; // percentage
			networkRequestIncrease?: number; // percentage
		} = {}
	): {
		hasRegression: boolean;
		regressions: string[];
		improvements: string[];
	} {
		const regressions: string[] = [];
		const improvements: string[] = [];

		// Check test duration regression
		const durationThreshold = thresholds.durationIncrease || 50; // 50% increase
		const durationIncrease = ((currentMetrics.duration - baselineMetrics.duration) / baselineMetrics.duration) * 100;
		
		if (durationIncrease > durationThreshold) {
			regressions.push(`Test duration increased by ${durationIncrease.toFixed(1)}% (${currentMetrics.duration}ms vs ${baselineMetrics.duration}ms)`);
		} else if (durationIncrease < -10) {
			improvements.push(`Test duration improved by ${Math.abs(durationIncrease).toFixed(1)}%`);
		}

		// Check page load regression
		if (currentMetrics.pageLoadTime && baselineMetrics.pageLoadTime) {
			const pageLoadThreshold = thresholds.pageLoadIncrease || 30; // 30% increase
			const pageLoadIncrease = ((currentMetrics.pageLoadTime - baselineMetrics.pageLoadTime) / baselineMetrics.pageLoadTime) * 100;
			
			if (pageLoadIncrease > pageLoadThreshold) {
				regressions.push(`Page load time increased by ${pageLoadIncrease.toFixed(1)}% (${currentMetrics.pageLoadTime}ms vs ${baselineMetrics.pageLoadTime}ms)`);
			} else if (pageLoadIncrease < -10) {
				improvements.push(`Page load time improved by ${Math.abs(pageLoadIncrease).toFixed(1)}%`);
			}
		}

		// Check network requests regression
		const networkThreshold = thresholds.networkRequestIncrease || 25; // 25% increase
		const networkIncrease = ((currentMetrics.networkRequests.length - baselineMetrics.networkRequests.length) / baselineMetrics.networkRequests.length) * 100;
		
		if (networkIncrease > networkThreshold) {
			regressions.push(`Network requests increased by ${networkIncrease.toFixed(1)}% (${currentMetrics.networkRequests.length} vs ${baselineMetrics.networkRequests.length})`);
		} else if (networkIncrease < -10) {
			improvements.push(`Network requests reduced by ${Math.abs(networkIncrease).toFixed(1)}%`);
		}

		return {
			hasRegression: regressions.length > 0,
			regressions,
			improvements
		};
	}

	/**
	 * Generate performance report
	 */
	generatePerformanceReport(metrics: PerformanceMetrics): string {
		const networkAnalysis = this.analyzeNetworkPerformance();
		
		return `
# Performance Report: ${metrics.testName}

## Test Execution
- **Duration**: ${metrics.duration}ms
- **Start Time**: ${new Date(metrics.startTime).toISOString()}
- **End Time**: ${new Date(metrics.endTime).toISOString()}
- **Browser Context**: ${metrics.browserContextId}

## Page Performance
- **Page Load Time**: ${metrics.pageLoadTime || 'N/A'}ms

## Network Performance
- **Total Requests**: ${networkAnalysis.totalRequests}
- **Failed Requests**: ${networkAnalysis.failedRequests}
- **Average Response Time**: ${networkAnalysis.averageResponseTime.toFixed(2)}ms
- **Slowest Request**: ${networkAnalysis.slowestRequest?.url || 'N/A'} (${networkAnalysis.slowestRequest?.duration || 0}ms)
- **Total Data Transferred**: ${(networkAnalysis.totalDataTransferred / 1024).toFixed(2)} KB

## Memory Usage
${metrics.memoryUsage ? `
- **Used JS Heap**: ${(metrics.memoryUsage.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB
- **Total JS Heap**: ${(metrics.memoryUsage.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB
- **JS Heap Limit**: ${(metrics.memoryUsage.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB
` : '- Memory usage data not available'}
		`.trim();
	}

	/**
	 * Save performance metrics to file
	 */
	async saveMetrics(metrics: PerformanceMetrics, filename?: string): Promise<string> {
		const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
		const filepath = filename || `test-results/performance-${metrics.testName}-${timestamp}.json`;
		
		try {
			const fs = await import('fs');
			const path = await import('path');
			
			// Ensure directory exists
			const dir = path.dirname(filepath);
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir, { recursive: true });
			}
			
			// Save metrics
			fs.writeFileSync(filepath, JSON.stringify(metrics, null, 2));
			
			// Also save human-readable report
			const reportPath = filepath.replace('.json', '-report.md');
			const report = this.generatePerformanceReport(metrics);
			fs.writeFileSync(reportPath, report);
			
			return filepath;
		} catch (error) {
			console.error('Failed to save performance metrics:', error);
			return '';
		}
	}

	/**
	 * Clean up performance monitoring
	 */
	cleanup(): void {
		// Remove event listeners
		this.page.removeAllListeners('request');
		this.page.removeAllListeners('load');
		
		// Clear performance observer if exists
		if (this.performanceObserver) {
			try {
				this.performanceObserver.disconnect();
			} catch (error) {
				// Ignore cleanup errors
			}
		}
		
		// Clear network requests array
		this.networkRequests = [];
	}
}