import { PlaywrightTestConfig, devices } from '@playwright/test';
import path from 'path';

export const baseConfig: PlaywrightTestConfig = {
  // WHERE to find tests (relative to this config file)
  testDir: '../tests',
  
  // PARALLELISM
  fullyParallel: true,
  
  // CI BEHAVIOR
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // REPORTERS
  reporter: [
    ['html', { outputFolder: '../../playwright-report' }],
    ['list'],
  ],
  
  // DEFAULT SETTINGS
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  
  // BROWSER PROJECTS
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
};
