import { Page, TestInfo } from '@playwright/test';
import { TestConfig } from '../config/TestConfig';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Enhanced error context interface for comprehensive debugging
 */
export interface EnhancedErrorContext {
	timestamp: string;
	testName: string;
	testFile: string;
	url: string;
	title: string;
	viewport: { width: number; height: number } | null;
	userAgent: string;
	screenshotPath: string;
	videoPath?: string;
	consoleLogs: ConsoleMessage[];
	networkRequests: NetworkRequest[];
	performanceMetrics: PerformanceMetrics;
	browserInfo: BrowserInfo;
	errorStack: string;
	retryAttempt: number;
}

/**
 * Console message interface
 */
export interface ConsoleMessage {
	type: 'log' | 'error' | 'warn' | 'info' | 'debug';
	text: string;
	timestamp: string;
	location?: string;
}

/**
 * Network request interface
 */
export interface NetworkRequest {
	url: string;
	method: string;
	status: number;
	statusText: string;
	timestamp: string;
	duration: number;
	size: number;
	failed: boolean;
}

/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
	loadTime: number;
	domContentLoaded: number;
	firstContentfulPaint?: number;
	largestContentfulPaint?: number;
	cumulativeLayoutShift?: number;
}

/**
 * Browser information interface
 */
export interface BrowserInfo {
	name: string;
	version: string;
	platform: string;
	mobile: boolean;
}

/**
 * Enhanced error handler for comprehensive E2E test error management
 */
export class ErrorHandler {
	private page: Page;
	private config: TestConfig;
	private testInfo?: TestInfo;
	private consoleLogs: ConsoleMessage[] = [];
	private networkRequests: NetworkRequest[] = [];
	private startTime: number = Date.now();

	constructor(page: Page, config: TestConfig, testInfo?: TestInfo) {
		this.page = page;
		this.config = config;
		this.testInfo = testInfo;
		this.setupEventListeners();
	}

	/**
	 * Set up event listeners for console logs and network requests
	 */
	private setupEventListeners(): void {
		// Console message listener
		this.page.on('console', (msg) => {
			this.consoleLogs.push({
				type: msg.type() as ConsoleMessage['type'],
				text: msg.text(),
				timestamp: new Date().toISOString(),
				location: msg.location()?.url
			});

			// Keep only last 50 console messages to prevent memory issues
			if (this.consoleLogs.length > 50) {
				this.consoleLogs = this.consoleLogs.slice(-50);
			}
		});

		// Network request listener
		this.page.on('response', async (response) => {
			try {
				const request = response.request();
				const timing = response.request().timing();
				
				this.networkRequests.push({
					url: response.url(),
					method: request.method(),
					status: response.status(),
					statusText: response.statusText(),
					timestamp: new Date().toISOString(),
					duration: timing?.responseEnd ? timing.responseEnd - timing.requestStart : 0,
					size: parseInt(response.headers()['content-length'] || '0'),
					failed: !response.ok()
				});

				// Keep only last 100 network requests to prevent memory issues
				if (this.networkRequests.length > 100) {
					this.networkRequests = this.networkRequests.slice(-100);
				}
			} catch (error) {
				// Silently handle network logging errors to avoid interfering with tests
				console.debug('Failed to log network request:', error);
			}
		});
	}

	/**
	 * Capture comprehensive error context
	 */
	async captureErrorContext(error: Error, context?: string): Promise<EnhancedErrorContext> {
		const timestamp = new Date().toISOString();
		const testName = this.testInfo?.title || 'unknown-test';
		const testFile = this.testInfo?.file || 'unknown-file';
		const retryAttempt = this.testInfo?.retry || 0;

		try {
			// Capture basic page information
			const url = this.page.url();
			const title = await this.page.title().catch(() => 'Unable to get title');
			const viewport = this.page.viewportSize();
			const userAgent = await this.page.evaluate(() => navigator.userAgent).catch(() => 'Unknown');

			// Capture performance metrics
			const performanceMetrics = await this.capturePerformanceMetrics();

			// Capture browser information
			const browserInfo = await this.captureBrowserInfo();

			// Capture screenshot
			const screenshotPath = await this.captureScreenshot(testName, context);

			// Capture video path if available
			const videoPath = this.getVideoPath();

			const errorContext: EnhancedErrorContext = {
				timestamp,
				testName,
				testFile,
				url,
				title,
				viewport,
				userAgent,
				screenshotPath,
				videoPath,
				consoleLogs: [...this.consoleLogs], // Create a copy
				networkRequests: [...this.networkRequests], // Create a copy
				performanceMetrics,
				browserInfo,
				errorStack: error.stack || error.message,
				retryAttempt
			};

			// Save error context to file
			await this.saveErrorContext(errorContext, context);

			return errorContext;
		} catch (captureError) {
			console.error('Failed to capture error context:', captureError);
			
			// Return minimal error context
			return {
				timestamp,
				testName,
				testFile,
				url: 'unknown',
				title: 'unknown',
				viewport: null,
				userAgent: 'unknown',
				screenshotPath: '',
				consoleLogs: [],
				networkRequests: [],
				performanceMetrics: {
					loadTime: 0,
					domContentLoaded: 0
				},
				browserInfo: {
					name: 'unknown',
					version: 'unknown',
					platform: 'unknown',
					mobile: false
				},
				errorStack: error.stack || error.message,
				retryAttempt
			};
		}
	}

	/**
	 * Capture performance metrics
	 */
	private async capturePerformanceMetrics(): Promise<PerformanceMetrics> {
		try {
			const metrics = await this.page.evaluate(() => {
				const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
				const paint = performance.getEntriesByType('paint');
				
				return {
					loadTime: navigation ? navigation.loadEventEnd - navigation.fetchStart : 0,
					domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.fetchStart : 0,
					firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
					largestContentfulPaint: undefined, // Would need additional setup for LCP
					cumulativeLayoutShift: undefined // Would need additional setup for CLS
				};
			});

			return metrics;
		} catch (error) {
			return {
				loadTime: Date.now() - this.startTime,
				domContentLoaded: 0
			};
		}
	}

	/**
	 * Capture browser information
	 */
	private async captureBrowserInfo(): Promise<BrowserInfo> {
		try {
			const browserInfo = await this.page.evaluate(() => {
				const ua = navigator.userAgent;
				let name = 'unknown';
				let version = 'unknown';
				
				if (ua.includes('Chrome')) {
					name = 'chrome';
					const match = ua.match(/Chrome\/([0-9.]+)/);
					version = match ? match[1] : 'unknown';
				} else if (ua.includes('Firefox')) {
					name = 'firefox';
					const match = ua.match(/Firefox\/([0-9.]+)/);
					version = match ? match[1] : 'unknown';
				} else if (ua.includes('Safari')) {
					name = 'safari';
					const match = ua.match(/Version\/([0-9.]+)/);
					version = match ? match[1] : 'unknown';
				}

				return {
					name,
					version,
					platform: navigator.platform,
					mobile: /Mobi|Android/i.test(ua)
				};
			});

			return browserInfo;
		} catch (error) {
			return {
				name: 'unknown',
				version: 'unknown',
				platform: 'unknown',
				mobile: false
			};
		}
	}

	/**
	 * Capture screenshot with enhanced naming and error handling
	 */
	private async captureScreenshot(testName: string, context?: string): Promise<string> {
		if (!this.config.screenshots.enabled) {
			return '';
		}

		try {
			const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
			const contextSuffix = context ? `-${context}` : '';
			const filename = `error-${testName}${contextSuffix}-${timestamp}.png`;
			const screenshotPath = path.join(this.config.screenshots.directory, filename);

			// Ensure screenshots directory exists
			const screenshotsDir = path.dirname(screenshotPath);
			if (!fs.existsSync(screenshotsDir)) {
				fs.mkdirSync(screenshotsDir, { recursive: true });
			}

			await this.page.screenshot({
				path: screenshotPath,
				fullPage: true,
				timeout: 10000 // 10 second timeout for screenshot
			});

			return screenshotPath;
		} catch (error) {
			console.error('Failed to capture screenshot:', error);
			return '';
		}
	}

	/**
	 * Get video path if video recording is enabled
	 */
	private getVideoPath(): string | undefined {
		if (!this.config.reporting.videoOnFailure || !this.testInfo) {
			return undefined;
		}

		// Video path would be available through testInfo.outputPath
		// This is a placeholder - actual implementation would depend on Playwright's video setup
		const videoDir = path.join(this.testInfo.outputDir, 'videos');
		const videoFile = `${this.testInfo.title.replace(/[^a-zA-Z0-9]/g, '-')}.webm`;
		const videoPath = path.join(videoDir, videoFile);

		return fs.existsSync(videoPath) ? videoPath : undefined;
	}

	/**
	 * Save error context to JSON file for debugging
	 */
	private async saveErrorContext(errorContext: EnhancedErrorContext, context?: string): Promise<void> {
		try {
			const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
			const contextSuffix = context ? `-${context}` : '';
			const filename = `error-context-${errorContext.testName}${contextSuffix}-${timestamp}.json`;
			const errorDir = path.join(this.config.screenshots.directory, 'error-contexts');
			
			// Ensure error contexts directory exists
			if (!fs.existsSync(errorDir)) {
				fs.mkdirSync(errorDir, { recursive: true });
			}

			const filePath = path.join(errorDir, filename);
			await fs.promises.writeFile(filePath, JSON.stringify(errorContext, null, 2));
			
			console.log(`Error context saved to: ${filePath}`);
		} catch (error) {
			console.error('Failed to save error context:', error);
		}
	}

	/**
	 * Handle test failure with comprehensive error reporting
	 */
	async handleTestFailure(error: Error, context?: string): Promise<void> {
		console.error(`🚨 Test Failure in ${this.testInfo?.title || 'unknown test'}:`);
		console.error(`📍 Context: ${context || 'unknown'}`);
		console.error(`🔗 URL: ${this.page.url()}`);
		console.error(`⚠️  Error: ${error.message}`);

		// Capture comprehensive error context
		const errorContext = await this.captureErrorContext(error, context);

		// Log summary of captured information
		console.error(`📸 Screenshot: ${errorContext.screenshotPath}`);
		console.error(`🎥 Video: ${errorContext.videoPath || 'not available'}`);
		console.error(`📊 Console logs: ${errorContext.consoleLogs.length} messages`);
		console.error(`🌐 Network requests: ${errorContext.networkRequests.length} requests`);
		console.error(`🔄 Retry attempt: ${errorContext.retryAttempt + 1}`);

		// Log recent console errors
		const recentErrors = errorContext.consoleLogs
			.filter(log => log.type === 'error')
			.slice(-5);
		
		if (recentErrors.length > 0) {
			console.error('📝 Recent console errors:');
			recentErrors.forEach(log => {
				console.error(`   ${log.timestamp}: ${log.text}`);
			});
		}

		// Log failed network requests
		const failedRequests = errorContext.networkRequests
			.filter(req => req.failed)
			.slice(-5);
		
		if (failedRequests.length > 0) {
			console.error('🌐 Recent failed network requests:');
			failedRequests.forEach(req => {
				console.error(`   ${req.method} ${req.url} - ${req.status} ${req.statusText}`);
			});
		}
	}

	/**
	 * Clean up resources
	 */
	cleanup(): void {
		// Remove event listeners to prevent memory leaks
		this.page.removeAllListeners('console');
		this.page.removeAllListeners('response');
		
		// Clear stored data
		this.consoleLogs = [];
		this.networkRequests = [];
	}
}