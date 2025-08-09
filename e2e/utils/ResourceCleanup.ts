import { Browser, BrowserContext, Page, TestInfo } from '@playwright/test';
import { TestConfig } from '../config/TestConfig';

/**
 * Resource tracking interface
 */
export interface ResourceTracker {
	browsers: Set<Browser>;
	contexts: Set<BrowserContext>;
	pages: Set<Page>;
	timers: Set<NodeJS.Timeout>;
	intervals: Set<NodeJS.Timeout>;
	eventListeners: Map<string, Function[]>;
	memorySnapshots: MemorySnapshot[];
}

/**
 * Memory snapshot interface
 */
export interface MemorySnapshot {
	timestamp: number;
	testName: string;
	heapUsed: number;
	heapTotal: number;
	external: number;
	rss: number;
}

/**
 * Cleanup statistics interface
 */
export interface CleanupStats {
	browsersCleanedUp: number;
	contextsCleanedUp: number;
	pagesCleanedUp: number;
	timersCleared: number;
	intervalsCleared: number;
	eventListenersRemoved: number;
	memoryFreed: number;
	cleanupDuration: number;
	errors: string[];
}

/**
 * Resource cleanup utilities to prevent memory leaks and ensure proper resource management
 */
export class ResourceCleanup {
	private static instance: ResourceCleanup;
	private tracker: ResourceTracker;
	private config: TestConfig;
	private cleanupInProgress = false;
	private memoryThreshold = 100 * 1024 * 1024; // 100MB threshold

	private constructor(config: TestConfig) {
		this.config = config;
		this.tracker = {
			browsers: new Set(),
			contexts: new Set(),
			pages: new Set(),
			timers: new Set(),
			intervals: new Set(),
			eventListeners: new Map(),
			memorySnapshots: []
		};

		this.setupProcessHandlers();
		this.startMemoryMonitoring();
	}

	/**
	 * Get singleton instance
	 */
	static getInstance(config: TestConfig): ResourceCleanup {
		if (!ResourceCleanup.instance) {
			ResourceCleanup.instance = new ResourceCleanup(config);
		}
		return ResourceCleanup.instance;
	}

	/**
	 * Set up process handlers for graceful shutdown
	 */
	private setupProcessHandlers(): void {
		const cleanup = async () => {
			if (!this.cleanupInProgress) {
				console.log('🧹 Process termination detected, performing emergency cleanup...');
				await this.performEmergencyCleanup();
			}
		};

		process.on('SIGINT', cleanup);
		process.on('SIGTERM', cleanup);
		process.on('exit', cleanup);
		process.on('uncaughtException', async (error) => {
			console.error('Uncaught exception, performing cleanup:', error);
			await cleanup();
		});
		process.on('unhandledRejection', async (reason) => {
			console.error('Unhandled rejection, performing cleanup:', reason);
			await cleanup();
		});
	}

	/**
	 * Start memory monitoring
	 */
	private startMemoryMonitoring(): void {
		const monitorInterval = setInterval(() => {
			this.captureMemorySnapshot();
			this.checkMemoryThreshold();
		}, 30000); // Check every 30 seconds

		this.tracker.intervals.add(monitorInterval);
	}

	/**
	 * Register a browser for tracking
	 */
	registerBrowser(browser: Browser): void {
		this.tracker.browsers.add(browser);
		console.log(`📊 Registered browser (total: ${this.tracker.browsers.size})`);
	}

	/**
	 * Register a browser context for tracking
	 */
	registerContext(context: BrowserContext): void {
		this.tracker.contexts.add(context);
		console.log(`📊 Registered context (total: ${this.tracker.contexts.size})`);
	}

	/**
	 * Register a page for tracking
	 */
	registerPage(page: Page): void {
		this.tracker.pages.add(page);
		console.log(`📊 Registered page (total: ${this.tracker.pages.size})`);

		// Set up page-specific cleanup
		page.on('close', () => {
			this.tracker.pages.delete(page);
		});
	}

	/**
	 * Register a timer for tracking
	 */
	registerTimer(timer: NodeJS.Timeout): void {
		this.tracker.timers.add(timer);
	}

	/**
	 * Register an interval for tracking
	 */
	registerInterval(interval: NodeJS.Timeout): void {
		this.tracker.intervals.add(interval);
	}

	/**
	 * Register event listeners for tracking
	 */
	registerEventListener(eventName: string, listener: Function): void {
		if (!this.tracker.eventListeners.has(eventName)) {
			this.tracker.eventListeners.set(eventName, []);
		}
		this.tracker.eventListeners.get(eventName)!.push(listener);
	}

	/**
	 * Capture memory snapshot
	 */
	private captureMemorySnapshot(testName = 'monitoring'): void {
		const memUsage = process.memoryUsage();
		const snapshot: MemorySnapshot = {
			timestamp: Date.now(),
			testName,
			heapUsed: memUsage.heapUsed,
			heapTotal: memUsage.heapTotal,
			external: memUsage.external,
			rss: memUsage.rss
		};

		this.tracker.memorySnapshots.push(snapshot);

		// Keep only last 100 snapshots
		if (this.tracker.memorySnapshots.length > 100) {
			this.tracker.memorySnapshots = this.tracker.memorySnapshots.slice(-100);
		}
	}

	/**
	 * Check memory threshold and trigger cleanup if needed
	 */
	private checkMemoryThreshold(): void {
		const memUsage = process.memoryUsage();
		if (memUsage.heapUsed > this.memoryThreshold) {
			console.warn(`⚠️  Memory usage high: ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`);
			this.performPartialCleanup();
		}
	}

	/**
	 * Perform partial cleanup to free memory
	 */
	private async performPartialCleanup(): Promise<void> {
		console.log('🧹 Performing partial cleanup to free memory...');

		// Close unused pages (keep only the most recent ones)
		const pages = Array.from(this.tracker.pages);
		if (pages.length > 5) {
			const pagesToClose = pages.slice(0, pages.length - 5);
			for (const page of pagesToClose) {
				try {
					if (!page.isClosed()) {
						await page.close();
					}
					this.tracker.pages.delete(page);
				} catch (error) {
					console.warn('Failed to close page during partial cleanup:', error);
				}
			}
		}

		// Clear old memory snapshots
		if (this.tracker.memorySnapshots.length > 50) {
			this.tracker.memorySnapshots = this.tracker.memorySnapshots.slice(-50);
		}

		// Force garbage collection if available
		if (global.gc) {
			global.gc();
		}
	}

	/**
	 * Clean up resources for a specific test
	 */
	async cleanupTest(testInfo?: TestInfo): Promise<CleanupStats> {
		const startTime = Date.now();
		const stats: CleanupStats = {
			browsersCleanedUp: 0,
			contextsCleanedUp: 0,
			pagesCleanedUp: 0,
			timersCleared: 0,
			intervalsCleared: 0,
			eventListenersRemoved: 0,
			memoryFreed: 0,
			cleanupDuration: 0,
			errors: []
		};

		const testName = testInfo?.title || 'unknown-test';
		console.log(`🧹 Starting cleanup for test: ${testName}`);

		// Capture memory before cleanup
		const memoryBefore = process.memoryUsage().heapUsed;

		try {
			// Clean up pages
			for (const page of this.tracker.pages) {
				try {
					if (!page.isClosed()) {
						// Remove all listeners from the page
						page.removeAllListeners();
						await page.close();
						stats.pagesCleanedUp++;
					}
				} catch (error) {
					stats.errors.push(`Failed to close page: ${error}`);
				}
			}

			// Clean up timers
			for (const timer of this.tracker.timers) {
				try {
					clearTimeout(timer);
					stats.timersCleared++;
				} catch (error) {
					stats.errors.push(`Failed to clear timer: ${error}`);
				}
			}

			// Clean up intervals (but keep monitoring interval)
			const monitoringIntervals = new Set();
			for (const interval of this.tracker.intervals) {
				try {
					// Don't clear monitoring intervals
					if (!monitoringIntervals.has(interval)) {
						clearInterval(interval);
						stats.intervalsCleared++;
					}
				} catch (error) {
					stats.errors.push(`Failed to clear interval: ${error}`);
				}
			}

			// Clean up event listeners
			for (const [eventName, listeners] of this.tracker.eventListeners) {
				try {
					listeners.forEach(listener => {
						// Remove listeners if possible
						if (typeof listener === 'function') {
							stats.eventListenersRemoved++;
						}
					});
					this.tracker.eventListeners.delete(eventName);
				} catch (error) {
					stats.errors.push(`Failed to remove event listeners for ${eventName}: ${error}`);
				}
			}

			// Clear tracking sets (but keep browsers and contexts for reuse)
			this.tracker.pages.clear();
			this.tracker.timers.clear();
			this.tracker.eventListeners.clear();

			// Capture memory after cleanup
			const memoryAfter = process.memoryUsage().heapUsed;
			stats.memoryFreed = memoryBefore - memoryAfter;

			// Force garbage collection if available
			if (global.gc) {
				global.gc();
			}

		} catch (error) {
			stats.errors.push(`General cleanup error: ${error}`);
		}

		stats.cleanupDuration = Date.now() - startTime;

		console.log(`✅ Test cleanup completed in ${stats.cleanupDuration}ms`);
		console.log(`   - Pages closed: ${stats.pagesCleanedUp}`);
		console.log(`   - Timers cleared: ${stats.timersCleared}`);
		console.log(`   - Memory freed: ${(stats.memoryFreed / 1024 / 1024).toFixed(2)}MB`);

		if (stats.errors.length > 0) {
			console.warn(`⚠️  Cleanup errors: ${stats.errors.length}`);
			stats.errors.forEach(error => console.warn(`   - ${error}`));
		}

		return stats;
	}

	/**
	 * Perform complete cleanup of all resources
	 */
	async performCompleteCleanup(): Promise<CleanupStats> {
		if (this.cleanupInProgress) {
			console.log('Cleanup already in progress, skipping...');
			return {
				browsersCleanedUp: 0,
				contextsCleanedUp: 0,
				pagesCleanedUp: 0,
				timersCleared: 0,
				intervalsCleared: 0,
				eventListenersRemoved: 0,
				memoryFreed: 0,
				cleanupDuration: 0,
				errors: ['Cleanup already in progress']
			};
		}

		this.cleanupInProgress = true;
		const startTime = Date.now();
		const stats: CleanupStats = {
			browsersCleanedUp: 0,
			contextsCleanedUp: 0,
			pagesCleanedUp: 0,
			timersCleared: 0,
			intervalsCleared: 0,
			eventListenersRemoved: 0,
			memoryFreed: 0,
			cleanupDuration: 0,
			errors: []
		};

		console.log('🧹 Starting complete resource cleanup...');

		const memoryBefore = process.memoryUsage().heapUsed;

		try {
			// Clean up pages first
			for (const page of this.tracker.pages) {
				try {
					if (!page.isClosed()) {
						page.removeAllListeners();
						await page.close();
						stats.pagesCleanedUp++;
					}
				} catch (error) {
					stats.errors.push(`Failed to close page: ${error}`);
				}
			}

			// Clean up contexts
			for (const context of this.tracker.contexts) {
				try {
					await context.close();
					stats.contextsCleanedUp++;
				} catch (error) {
					stats.errors.push(`Failed to close context: ${error}`);
				}
			}

			// Clean up browsers
			for (const browser of this.tracker.browsers) {
				try {
					await browser.close();
					stats.browsersCleanedUp++;
				} catch (error) {
					stats.errors.push(`Failed to close browser: ${error}`);
				}
			}

			// Clean up all timers and intervals
			for (const timer of this.tracker.timers) {
				try {
					clearTimeout(timer);
					stats.timersCleared++;
				} catch (error) {
					stats.errors.push(`Failed to clear timer: ${error}`);
				}
			}

			for (const interval of this.tracker.intervals) {
				try {
					clearInterval(interval);
					stats.intervalsCleared++;
				} catch (error) {
					stats.errors.push(`Failed to clear interval: ${error}`);
				}
			}

			// Clean up event listeners
			for (const [eventName, listeners] of this.tracker.eventListeners) {
				stats.eventListenersRemoved += listeners.length;
			}

			// Clear all tracking
			this.tracker.browsers.clear();
			this.tracker.contexts.clear();
			this.tracker.pages.clear();
			this.tracker.timers.clear();
			this.tracker.intervals.clear();
			this.tracker.eventListeners.clear();

			const memoryAfter = process.memoryUsage().heapUsed;
			stats.memoryFreed = memoryBefore - memoryAfter;

			// Force garbage collection
			if (global.gc) {
				global.gc();
			}

		} catch (error) {
			stats.errors.push(`Complete cleanup error: ${error}`);
		}

		stats.cleanupDuration = Date.now() - startTime;
		this.cleanupInProgress = false;

		console.log(`✅ Complete cleanup finished in ${stats.cleanupDuration}ms`);
		console.log(`   - Browsers closed: ${stats.browsersCleanedUp}`);
		console.log(`   - Contexts closed: ${stats.contextsCleanedUp}`);
		console.log(`   - Pages closed: ${stats.pagesCleanedUp}`);
		console.log(`   - Memory freed: ${(stats.memoryFreed / 1024 / 1024).toFixed(2)}MB`);

		return stats;
	}

	/**
	 * Perform emergency cleanup (for process termination)
	 */
	private async performEmergencyCleanup(): Promise<void> {
		console.log('🚨 Performing emergency cleanup...');
		
		try {
			// Quick cleanup without detailed error handling
			const cleanupPromises: Promise<void>[] = [];

			// Close all pages
			for (const page of this.tracker.pages) {
				cleanupPromises.push(
					page.close().catch(() => {}) // Ignore errors in emergency cleanup
				);
			}

			// Close all contexts
			for (const context of this.tracker.contexts) {
				cleanupPromises.push(
					context.close().catch(() => {}) // Ignore errors in emergency cleanup
				);
			}

			// Close all browsers
			for (const browser of this.tracker.browsers) {
				cleanupPromises.push(
					browser.close().catch(() => {}) // Ignore errors in emergency cleanup
				);
			}

			// Wait for all cleanup operations with timeout
			await Promise.race([
				Promise.all(cleanupPromises),
				new Promise(resolve => setTimeout(resolve, 5000)) // 5 second timeout
			]);

			console.log('✅ Emergency cleanup completed');
		} catch (error) {
			console.error('❌ Emergency cleanup failed:', error);
		}
	}

	/**
	 * Get current resource usage statistics
	 */
	getResourceStats(): {
		browsers: number;
		contexts: number;
		pages: number;
		timers: number;
		intervals: number;
		eventListeners: number;
		memoryUsage: NodeJS.MemoryUsage;
		memorySnapshots: number;
	} {
		return {
			browsers: this.tracker.browsers.size,
			contexts: this.tracker.contexts.size,
			pages: this.tracker.pages.size,
			timers: this.tracker.timers.size,
			intervals: this.tracker.intervals.size,
			eventListeners: Array.from(this.tracker.eventListeners.values()).reduce((sum, listeners) => sum + listeners.length, 0),
			memoryUsage: process.memoryUsage(),
			memorySnapshots: this.tracker.memorySnapshots.length
		};
	}

	/**
	 * Generate memory usage report
	 */
	generateMemoryReport(): string {
		const stats = this.getResourceStats();
		const currentMemory = stats.memoryUsage;
		
		let report = `
# Resource Usage Report

## Current Resources
- **Browsers**: ${stats.browsers}
- **Contexts**: ${stats.contexts}
- **Pages**: ${stats.pages}
- **Timers**: ${stats.timers}
- **Intervals**: ${stats.intervals}
- **Event Listeners**: ${stats.eventListeners}

## Memory Usage
- **Heap Used**: ${(currentMemory.heapUsed / 1024 / 1024).toFixed(2)} MB
- **Heap Total**: ${(currentMemory.heapTotal / 1024 / 1024).toFixed(2)} MB
- **External**: ${(currentMemory.external / 1024 / 1024).toFixed(2)} MB
- **RSS**: ${(currentMemory.rss / 1024 / 1024).toFixed(2)} MB

## Memory History (Last 10 Snapshots)
`;

		const recentSnapshots = this.tracker.memorySnapshots.slice(-10);
		recentSnapshots.forEach(snapshot => {
			report += `- **${new Date(snapshot.timestamp).toISOString()}** (${snapshot.testName}): ${(snapshot.heapUsed / 1024 / 1024).toFixed(2)} MB\n`;
		});

		return report.trim();
	}
}