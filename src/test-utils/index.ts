/**
 * Test Utilities Index
 * 
 * Centralized exports for all testing utilities and helpers.
 * Import from here to get consistent testing setup across all test files.
 */

// Core testing utilities
export { renderWithProviders } from './render';
export { checkA11y, checkKeyboardNavigation } from './accessibility';

// Form testing utilities
export { renderFormComponent, FormTestWrapper, mockValidationRules, testFieldValidation, createMockSubmitHandler, formTestScenarios } from './form-helpers';

// Mock factories
export * from './factories';

// Custom matchers (if we add any)
// export * from './matchers';

// Re-export commonly used testing library functions
export {
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';

// Re-export user-event separately
export { default as userEvent } from '@testing-library/user-event';