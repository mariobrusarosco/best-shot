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

export const tournaments = {
  // Using partial text matching for flexibility
  cardLink: (page: Page, name: string | RegExp) => page.getByRole('link', { name: name }),
};

export const leagues = {
  // Floating Action Button for actions
  fab: (page: Page) => page.getByTestId('fab-menu'),
  // Menu options often appear in a portal/popover
  createOption: (page: Page) => page.getByTestId('fab-action-create-league'),
  // Form elements
  nameInput: (page: Page) => page.getByTestId('label'),
  descriptionInput: (page: Page) => page.getByTestId('description'),
  submitButton: (page: Page) => page.getByTestId('submit-league-btn'),
};

export const admin = {
  createTournamentBtn: (page: Page) => page.getByRole('button', { name: /create tournament/i }),
  // Create Tournament Form
  labelInput: (page: Page) => page.getByTestId('label'),
  slugInput: (page: Page) => page.getByTestId('slug'),
  seasonInput: (page: Page) => page.getByTestId('season'),
  providerSelect: (page: Page) => page.getByTestId('provider'),
  publicIdInput: (page: Page) => page.getByTestId('tournamentPublicId'),
  baseUrlInput: (page: Page) => page.getByTestId('baseUrl'),
  modeSelect: (page: Page) => page.getByTestId('mode'),
  standingsModeSelect: (page: Page) => page.getByTestId('standingsMode'),
  submitBtn: (page: Page) => page.getByRole('button', { name: /create tournament/i }),
};
