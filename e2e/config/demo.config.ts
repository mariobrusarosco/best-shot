import { baseConfig } from './base.config';
import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  ...baseConfig,
  use: {
    ...baseConfig.use,
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'https://best-shot.demo.mario.productions',
  },
  // Add any demo-specific project settings or overrides here
};

export default config;
