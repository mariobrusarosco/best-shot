import { Page } from '@playwright/test';

// Centralized selectors for the application
export const dashboard = {
  screenHeading: (page: Page) => page.locator('[data-ui="screen-heading"]'),
  title: (page: Page) => page.locator('[data-ui="title"]'),
  subtitle: (page: Page) => page.locator('[data-ui="subtitle"]'),
  matchdaySection: (page: Page) => page.locator('[data-ui="matchday"]'),
  tournamentsPerformance: (page: Page) => page.locator('[data-ui="tournaments-perf"]'),
};

export const navigation = {
  menu: (page: Page) => page.locator('menu'),
  menuLinks: (page: Page) => page.locator('menu a'),
  menuLink: (page: Page, href: string) => page.locator(`menu a[href="${href}"]`),
};

export const auth = {
  // Using role selector as recommended in best practices
  loginButton: (page: Page) => page.getByRole('button', { name: /enter demo/i }),
  signupButton: (page: Page) => page.getByRole('link', { name: /register now!/i }),
};
