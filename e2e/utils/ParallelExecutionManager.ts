import { Browser, BrowserContext, Page, TestInfo } from '@playwright/test';
import { TestConfig } from '../config/TestConfig';
import { ResourceCleanup } from './ResourceCleanup';
import { PerformanceUtils } from './PerformanceUtils';

/**
 * Browser context pool configuration
 */
export interface ContextPoolConfig {
	maxContexts: number;
	reuseContexts: boolean;
	contextTimeout: number;
	isolationLevel: 'strict' | 'shared' | 'optimized';
}

/**
 * Parallel execution configuration
 */
export interface ParallelConfig {
	maxWorkers: number;
	workerTimeout: number;
	contextPool: ContextPoolConfig;
	loadBalancing: 'round-robin' | 'least-loaded' | 'random';
	resourceSharing: {
		shareBrowsers: boolean;
		shareContexts: boolean;
		maxSharedPages: number;
	};
}

/**
 * Worker statistics
 */
export interface WorkerStats {
	workerId: string;
	testsExecuted: number;
	totalDuration: number;
	averageDuration: number;
	contextsUsed: number;
	pagesCreated: number;
	memoryUsage: number;
	errors: number;
}

/**
 * Context pool entry
 */
interface ContextPoolEntry {
	context: BrowserContext;
	inUse: boolean;
	createdAt: number;
	lastUsed: number;
	testsExecuted: number;
	workerId?: string;
}

/**
 * Parallel execution manager for optimized test performance
 */
export class ParallelExecutionManager {
	private static instance: ParallelExecutionManager;
	private config: TestConfig;
	private parallelConfig: ParallelConfig;
	private contextPool: Map<string, ContextPoolEntry> = new Map();
	private workerStats: Map<string, WorkerStats> = new Map();
	private resourceCleanup: ResourceCleanup;
	private browsers: Map<string, Browser> = new Map();
	private isShuttingDown = false;

	private constructor(config: TestConfig, parallelConfig?: Partial<ParallelConfig>) {
		this.config = config;
		this.resourceCleanup = ResourceCleanup.getInstance(config);
		
		// Default parallel configuration
		this.parallelConfig = {
			maxWorkers: parallelConfig?.maxWorkers || Math.max(1, Math.floor(require('os').cpus().length / 2)),
			workerTimeout: parallelConfig?.workerTimeout || 300000, // 5 minutes
			contextPool: {
				maxContexts: parallelConfig?.contextPool?.maxContexts || 10,
				reuseContexts: parallelConfig?.contextPool?.reuseContexts ?? true,
				contextTimeout: parallelConfig?.contextPool?.contextTimeout || 600000, // 10 minutes
				isolationLevel: parallelConfig?.contextPool?.isolationLevel || 'optimized',
				...parallelConfig?.contextPool
			},
			loadBalancing: parallelConfig?.loadBalancing || 'least-loaded',
			resourceSharing: {
				shareBrowsers: parallelConfig?.resourceSharing?.shareBrowsers ?? true,
				shareContexts: parallelConfig?.resourceSharing?.shareContexts ?? true,
				maxSharedPages: parallelConfig?.resourceSharing?.maxSharedPages || 5,
				...parallelConfig?.resourceSharing
			}
		};

		this.setupCleanupHandlers();
		this.startContextPoolMaintenance();
	}

	/**
	 * Get singleton instance
	 */
	static getInstance(config: TestConfig, parallelConfig?: Partial<ParallelConfig>): ParallelExecutionManager {
		if (!ParallelExecutionManager.instance) {
			ParallelExecutionManager.instance = new ParallelExecutionManager(config, parallelConfig);
		}
		return ParallelExecutionManager.instance;
	}

	/**
	 * Set up cleanup handlers
	 */
	private setupCleanupHandlers(): void {
		process.on('SIGINT', () => this.shutdown());
		process.on('SIGTERM', () => this.shutdown());
		process.on('exit', () => this.shutdown());
	}

	/**
	 * Start context pool maintenance
	 */
	private startContextPoolMaintenance(): void {
		const maintenanceInterval = setInterval(() => {
			if (!this.isShuttingDown) {
				this.maintainContextPool();
			}
		}, 60000); // Run every minute

		this.resourceCleanup.registerInterval(maintenanceInterval);
	}

	/**
	 * Maintain context pool by cleaning up stale contexts
	 */
	private async maintainContextPool(): Promise<void> {
		const now = Date.now();
		const staleContexts: string[] = [];

		for (const [contextId, entry] of this.contextPool) {
			// Mark contexts as stale if they haven't been used recently and aren't in use
			if (!entry.inUse && (now - entry.lastUsed) > this.parallelConfig.contextPool.contextTimeout) {
				staleContexts.push(contextId);
			}
		}

		// Clean up stale contexts
		for (const contextId of staleContexts) {
			await this.removeContextFromPool(contextId);
		}

		console.log(`🔧 Context pool maintenance: ${staleContexts.length} stale contexts removed, ${this.contextPool.size} active contexts`);
	}

	/**
	 * Get or create a browser for the specified browser type
	 */
	async getBrowser(browserName: string): Promise<Browser> {
		if (this.parallelConfig.resourceSharing.shareBrowsers && this.browsers.has(browserName)) {
			return this.browsers.get(browserName)!;
		}

		// Create new browser
		const { chromium, firefox, webkit } = await import('@playwright/test');
		let browser: Browser;

		switch (browserName.toLowerCase()) {
			case 'firefox':
				browser = await firefox.launch({
					headless: process.env.CI ? true : false,
					args: ['--no-sandbox', '--disable-dev-shm-usage']
				});
				break;
			case 'webkit':
			case 'safari':
				browser = await webkit.launch({
					headless: process.env.CI ? true : false
				});
				break;
			case 'chromium':
			case 'chrome':
			default:
				browser = await chromium.launch({
					headless: process.env.CI ? true : false,
					args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-web-security']
				});
				break;
		}

		if (this.parallelConfig.resourceSharing.shareBrowsers) {
			this.browsers.set(browserName, browser);
		}

		this.resourceCleanup.registerBrowser(browser);
		return browser;
	}

	/**
	 * Get or create a browser context with optimal resource sharing
	 */
	async getContext(browser: Browser, testInfo?: TestInfo): Promise<BrowserContext> {
		const workerId = testInfo?.workerIndex?.toString() || 'unknown';
		
		// Initialize worker stats if needed
		if (!this.workerStats.has(workerId)) {
			this.workerStats.set(workerId, {
				workerId,
				testsExecuted: 0,
				totalDuration: 0,
				averageDuration: 0,
				contextsUsed: 0,
				pagesCreated: 0,
				memoryUsage: 0,
				errors: 0
			});
		}

		// Try to reuse context if enabled and appropriate
		if (this.parallelConfig.contextPool.reuseContexts) {
			const reusableContext = this.findReusableContext(workerId);
			if (reusableContext) {
				return this.reuseContext(reusableContext, workerId);
			}
		}

		// Create new context if pool isn't full
		if (this.contextPool.size < this.parallelConfig.contextPool.maxContexts) {
			return await this.createNewContext(browser, workerId);
		}

		// Pool is full, wait for available context or create temporary one
		const availableContext = await this.waitForAvailableContext(5000); // 5 second timeout
		if (availableContext) {
			return this.reuseContext(availableContext, workerId);
		}

		// Create temporary context (not pooled)
		console.warn(`⚠️  Context pool full, creating temporary context for worker ${workerId}`);
		return await this.createTemporaryContext(browser, workerId);
	}

	/**
	 * Find a reusable context based on isolation level
	 */
	private findReusableContext(workerId: string): ContextPoolEntry | null {
		const { isolationLevel } = this.parallelConfig.contextPool;

		for (const entry of this.contextPool.values()) {
			if (entry.inUse) continue;

			switch (isolationLevel) {
				case 'strict':
					// Each worker gets its own context
					if (entry.workerId === workerId) {
						return entry;
					}
					break;
				case 'shared':
					// Any available context can be reused
					return entry;
				case 'optimized':
					// Prefer worker's own context, but allow sharing if needed
					if (entry.workerId === workerId) {
						return entry;
					}
					// If no worker-specific context, use any available
					if (!entry.workerId || entry.testsExecuted < 10) {
						return entry;
					}
					break;
			}
		}

		return null;
	}

	/**
	 * Reuse an existing context
	 */
	private reuseContext(entry: ContextPoolEntry, workerId: string): BrowserContext {
		entry.inUse = true;
		entry.lastUsed = Date.now();
		entry.workerId = workerId;
		entry.testsExecuted++;

		const stats = this.workerStats.get(workerId)!;
		stats.contextsUsed++;

		console.log(`♻️  Reusing context for worker ${workerId} (used ${entry.testsExecuted} times)`);
		return entry.context;
	}

	/**
	 * Create a new context and add to pool
	 */
	private async createNewContext(browser: Browser, workerId: string): Promise<BrowserContext> {
		const context = await browser.newContext({
			viewport: this.config.viewport,
			ignoreHTTPSErrors: true,
			// Optimize for performance
			recordVideo: process.env.CI ? undefined : {
				dir: 'test-results/videos/',
				size: this.config.viewport
			}
		});

		const contextId = `context-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
		const entry: ContextPoolEntry = {
			context,
			inUse: true,
			createdAt: Date.now(),
			lastUsed: Date.now(),
			testsExecuted: 1,
			workerId
		};

		this.contextPool.set(contextId, entry);
		this.resourceCleanup.registerContext(context);

		const stats = this.workerStats.get(workerId)!;
		stats.contextsUsed++;

		console.log(`🆕 Created new context ${contextId} for worker ${workerId} (pool size: ${this.contextPool.size})`);
		return context;
	}

	/**
	 * Create a temporary context (not pooled)
	 */
	private async createTemporaryContext(browser: Browser, workerId: string): Promise<BrowserContext> {
		const context = await browser.newContext({
			viewport: this.config.viewport,
			ignoreHTTPSErrors: true
		});

		this.resourceCleanup.registerContext(context);

		const stats = this.workerStats.get(workerId)!;
		stats.contextsUsed++;

		return context;
	}

	/**
	 * Wait for an available context
	 */
	private async waitForAvailableContext(timeout: number): Promise<ContextPoolEntry | null> {
		const startTime = Date.now();

		while (Date.now() - startTime < timeout) {
			for (const entry of this.contextPool.values()) {
				if (!entry.inUse) {
					return entry;
				}
			}

			// Wait a bit before checking again
			await new Promise(resolve => setTimeout(resolve, 100));
		}

		return null;
	}

	/**
	 * Release a context back to the pool
	 */
	async releaseContext(context: BrowserContext, testInfo?: TestInfo): Promise<void> {
		const workerId = testInfo?.workerIndex?.toString() || 'unknown';

		// Find the context in the pool
		for (const [contextId, entry] of this.contextPool) {
			if (entry.context === context) {
				entry.inUse = false;
				entry.lastUsed = Date.now();

				// Clean up pages in the context to prevent memory leaks
				const pages = context.pages();
				for (const page of pages) {
					if (!page.isClosed()) {
						try {
							await page.close();
						} catch (error) {
							console.warn(`Failed to close page during context release: ${error}`);
						}
					}
				}

				console.log(`🔄 Released context ${contextId} from worker ${workerId}`);
				return;
			}
		}

		// Context not in pool (temporary context), close it
		try {
			await context.close();
			console.log(`🗑️  Closed temporary context from worker ${workerId}`);
		} catch (error) {
			console.warn(`Failed to close temporary context: ${error}`);
		}
	}

	/**
	 * Get an optimized page from context
	 */
	async getPage(context: BrowserContext, testInfo?: TestInfo): Promise<Page> {
		const workerId = testInfo?.workerIndex?.toString() || 'unknown';
		
		// Check if we can reuse an existing page
		const existingPages = context.pages();
		if (existingPages.length > 0 && this.parallelConfig.resourceSharing.maxSharedPages > 0) {
			const availablePage = existingPages.find(page => !page.isClosed());
			if (availablePage) {
				// Clear the page state for reuse
				try {
					await availablePage.goto('about:blank');
					await availablePage.evaluate(() => {
						// Clear local storage, session storage, etc.
						localStorage.clear();
						sessionStorage.clear();
					});
					
					console.log(`♻️  Reusing page for worker ${workerId}`);
					return availablePage;
				} catch (error) {
					console.warn(`Failed to reset page for reuse: ${error}`);
				}
			}
		}

		// Create new page
		const page = await context.newPage();
		this.resourceCleanup.registerPage(page);

		const stats = this.workerStats.get(workerId)!;
		stats.pagesCreated++;

		console.log(`🆕 Created new page for worker ${workerId}`);
		return page;
	}

	/**
	 * Remove context from pool
	 */
	private async removeContextFromPool(contextId: string): Promise<void> {
		const entry = this.contextPool.get(contextId);
		if (entry) {
			try {
				if (!entry.context.browser()?.isConnected()) {
					await entry.context.close();
				}
			} catch (error) {
				console.warn(`Failed to close context ${contextId}: ${error}`);
			}
			this.contextPool.delete(contextId);
		}
	}

	/**
	 * Update worker statistics
	 */
	updateWorkerStats(workerId: string, testDuration: number, hasError: boolean = false): void {
		const stats = this.workerStats.get(workerId);
		if (stats) {
			stats.testsExecuted++;
			stats.totalDuration += testDuration;
			stats.averageDuration = stats.totalDuration / stats.testsExecuted;
			stats.memoryUsage = process.memoryUsage().heapUsed;
			if (hasError) {
				stats.errors++;
			}
		}
	}

	/**
	 * Get load balancing recommendation for next test
	 */
	getOptimalWorker(): string {
		if (this.workerStats.size === 0) {
			return '0';
		}

		switch (this.parallelConfig.loadBalancing) {
			case 'round-robin':
				return this.getRoundRobinWorker();
			case 'least-loaded':
				return this.getLeastLoadedWorker();
			case 'random':
				return this.getRandomWorker();
			default:
				return this.getLeastLoadedWorker();
		}
	}

	/**
	 * Get round-robin worker
	 */
	private getRoundRobinWorker(): string {
		const workers = Array.from(this.workerStats.keys()).sort();
		const totalTests = Array.from(this.workerStats.values()).reduce((sum, stats) => sum + stats.testsExecuted, 0);
		return workers[totalTests % workers.length] || '0';
	}

	/**
	 * Get least loaded worker
	 */
	private getLeastLoadedWorker(): string {
		let leastLoadedWorker = '0';
		let minLoad = Infinity;

		for (const [workerId, stats] of this.workerStats) {
			const load = stats.testsExecuted + (stats.errors * 2); // Weight errors more heavily
			if (load < minLoad) {
				minLoad = load;
				leastLoadedWorker = workerId;
			}
		}

		return leastLoadedWorker;
	}

	/**
	 * Get random worker
	 */
	private getRandomWorker(): string {
		const workers = Array.from(this.workerStats.keys());
		return workers[Math.floor(Math.random() * workers.length)] || '0';
	}

	/**
	 * Get execution statistics
	 */
	getExecutionStats(): {
		totalWorkers: number;
		activeContexts: number;
		pooledContexts: number;
		totalTestsExecuted: number;
		averageTestDuration: number;
		totalErrors: number;
		memoryUsage: NodeJS.MemoryUsage;
		workerStats: WorkerStats[];
	} {
		const workerStatsArray = Array.from(this.workerStats.values());
		const totalTests = workerStatsArray.reduce((sum, stats) => sum + stats.testsExecuted, 0);
		const totalDuration = workerStatsArray.reduce((sum, stats) => sum + stats.totalDuration, 0);
		const totalErrors = workerStatsArray.reduce((sum, stats) => sum + stats.errors, 0);

		return {
			totalWorkers: this.workerStats.size,
			activeContexts: Array.from(this.contextPool.values()).filter(entry => entry.inUse).length,
			pooledContexts: this.contextPool.size,
			totalTestsExecuted: totalTests,
			averageTestDuration: totalTests > 0 ? totalDuration / totalTests : 0,
			totalErrors,
			memoryUsage: process.memoryUsage(),
			workerStats: workerStatsArray
		};
	}

	/**
	 * Generate execution report
	 */
	generateExecutionReport(): string {
		const stats = this.getExecutionStats();
		
		let report = `
# Parallel Execution Report

## Overall Statistics
- **Total Workers**: ${stats.totalWorkers}
- **Active Contexts**: ${stats.activeContexts}
- **Pooled Contexts**: ${stats.pooledContexts}
- **Total Tests Executed**: ${stats.totalTestsExecuted}
- **Average Test Duration**: ${stats.averageTestDuration.toFixed(2)}ms
- **Total Errors**: ${stats.totalErrors}

## Memory Usage
- **Heap Used**: ${(stats.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB
- **Heap Total**: ${(stats.memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB

## Worker Statistics
`;

		stats.workerStats.forEach(workerStat => {
			report += `
### Worker ${workerStat.workerId}
- **Tests Executed**: ${workerStat.testsExecuted}
- **Average Duration**: ${workerStat.averageDuration.toFixed(2)}ms
- **Contexts Used**: ${workerStat.contextsUsed}
- **Pages Created**: ${workerStat.pagesCreated}
- **Errors**: ${workerStat.errors}
- **Memory Usage**: ${(workerStat.memoryUsage / 1024 / 1024).toFixed(2)} MB
`;
		});

		return report.trim();
	}

	/**
	 * Shutdown the parallel execution manager
	 */
	async shutdown(): Promise<void> {
		if (this.isShuttingDown) {
			return;
		}

		this.isShuttingDown = true;
		console.log('🛑 Shutting down parallel execution manager...');

		// Close all contexts in pool
		const closePromises: Promise<void>[] = [];
		for (const [contextId, entry] of this.contextPool) {
			closePromises.push(
				entry.context.close().catch(error => 
					console.warn(`Failed to close context ${contextId}: ${error}`)
				)
			);
		}

		// Close all browsers
		for (const [browserName, browser] of this.browsers) {
			closePromises.push(
				browser.close().catch(error => 
					console.warn(`Failed to close browser ${browserName}: ${error}`)
				)
			);
		}

		// Wait for all cleanup with timeout
		await Promise.race([
			Promise.all(closePromises),
			new Promise(resolve => setTimeout(resolve, 10000)) // 10 second timeout
		]);

		this.contextPool.clear();
		this.browsers.clear();
		this.workerStats.clear();

		console.log('✅ Parallel execution manager shutdown complete');
	}
}