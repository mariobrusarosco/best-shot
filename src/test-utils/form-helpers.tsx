/**
 * Form Testing Helpers
 * 
 * Specialized utilities for testing React Hook Form components
 * and form validation scenarios.
 */

import { useForm, UseFormReturn, FieldValues, DefaultValues } from 'react-hook-form';
import { renderWithProviders } from './render';
import { screen } from '@testing-library/react';
import { vi, expect } from 'vitest';
import { ReactElement } from 'react';

/**
 * Form wrapper component for testing form components in isolation
 */
interface FormTestWrapperProps<T extends FieldValues> {
  children: (methods: UseFormReturn<T>) => ReactElement;
  defaultValues?: DefaultValues<T>;
  onSubmit?: (data: T) => void;
}

export function FormTestWrapper<T extends FieldValues>({
  children,
  defaultValues,
  onSubmit,
}: FormTestWrapperProps<T>) {
  const methods = useForm<T>({
    defaultValues,
    mode: 'onChange', // Enable validation on change for testing
  });

  const handleSubmit = onSubmit || (() => {});

  return (
    <form onSubmit={methods.handleSubmit(handleSubmit)}>
      {children(methods)}
      <button type="submit" data-testid="submit-button">
        Submit
      </button>
    </form>
  );
}

/**
 * Renders a form component with React Hook Form context
 * 
 * @example
 * ```tsx
 * const { getByLabelText, user } = renderFormComponent(
 *   (methods) => (
 *     <AppFormInput 
 *       name="email" 
 *       control={methods.control} 
 *       label="Email Address" 
 *     />
 *   ),
 *   { defaultValues: { email: '' } }
 * );
 * 
 * await user.type(getByLabelText('Email Address'), 'test@example.com');
 * ```
 */
export function renderFormComponent<T extends FieldValues>(
  component: (methods: UseFormReturn<T>) => ReactElement,
  options: {
    defaultValues?: DefaultValues<T>;
    onSubmit?: (data: T) => void;
  } = {}
) {
  const result = renderWithProviders(
    <FormTestWrapper<T>
      defaultValues={options.defaultValues}
      onSubmit={options.onSubmit}
    >
      {component}
    </FormTestWrapper>
  );

  return {
    ...result,
    // Helper to get the submit button
    getSubmitButton: () => result.screen.getByTestId('submit-button'),
    // Helper to trigger form submission
    submitForm: async () => {
      const submitButton = result.screen.getByTestId('submit-button');
      const user = (await import('@testing-library/user-event')).default.setup();
      await user.click(submitButton);
    },
  };
}

/**
 * Creates mock form validation rules for testing
 */
export const mockValidationRules = {
  required: {
    rule: { required: 'This field is required' },
    validValue: 'Valid input',
    invalidValue: '',
  },
  
  email: {
    rule: { 
      required: 'Email is required',
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Invalid email format'
      }
    },
    validValue: 'test@example.com',
    invalidValue: 'invalid-email',
  },
  
  minLength: {
    rule: { 
      required: 'This field is required',
      minLength: {
        value: 3,
        message: 'Minimum 3 characters required'
      }
    },
    validValue: 'Valid text',
    invalidValue: 'ab',
  },
  
  number: {
    rule: {
      required: 'Number is required',
      pattern: {
        value: /^\d+$/,
        message: 'Must be a valid number'
      }
    },
    validValue: '123',
    invalidValue: 'abc',
  },
  
  password: {
    rule: {
      required: 'Password is required',
      minLength: {
        value: 8,
        message: 'Password must be at least 8 characters'
      }
    },
    validValue: 'securePassword123',
    invalidValue: '123',
  },
} as const;

/**
 * Helper to test form field validation
 * 
 * @example
 * ```tsx
 * await testFieldValidation({
 *   getField: () => screen.getByLabelText('Email'),
 *   validValue: 'test@example.com',
 *   invalidValue: 'invalid-email',
 *   expectedErrorMessage: 'Invalid email format',
 *   user
 * });
 * ```
 */
export async function testFieldValidation({
  getField,
  validValue,
  invalidValue,
  expectedErrorMessage,
  user,
}: {
  getField: () => HTMLElement;
  validValue: string;
  invalidValue: string;
  expectedErrorMessage: string;
  user: any; // userEvent instance
}) {
  const field = getField();

  // Test invalid value
  await user.clear(field);
  await user.type(field, invalidValue);
  await user.tab(); // Trigger blur to validate

  // Check for error message
  const errorElement = await screen.findByText(expectedErrorMessage);
  expect(errorElement).toBeInTheDocument();

  // Test valid value
  await user.clear(field);
  await user.type(field, validValue);
  await user.tab(); // Trigger blur

  // Error should be gone
  expect(screen.queryByText(expectedErrorMessage)).not.toBeInTheDocument();
}

/**
 * Mock form submission handler for testing
 */
export function createMockSubmitHandler() {
  const handleSubmit = vi.fn();
  return {
    handleSubmit,
    expectSubmitted: (expectedData: any) => {
      expect(handleSubmit).toHaveBeenCalledWith(expectedData);
    },
    expectNotSubmitted: () => {
      expect(handleSubmit).not.toHaveBeenCalled();
    },
    getSubmissionCount: () => handleSubmit.mock.calls.length,
    getLastSubmission: () => handleSubmit.mock.calls[handleSubmit.mock.calls.length - 1]?.[0],
  };
}

/**
 * Common form test scenarios
 */
export const formTestScenarios = {
  /**
   * Test empty form submission (should show validation errors)
   */
  emptySubmission: async (submitButton: HTMLElement, user: any) => {
    await user.click(submitButton);
    // Form should not submit and show validation errors
  },

  /**
   * Test valid form submission
   */
  validSubmission: async (
    fillForm: () => Promise<void>,
    submitButton: HTMLElement,
    user: any
  ) => {
    await fillForm();
    await user.click(submitButton);
  },

  /**
   * Test field interaction patterns
   */
  fieldInteraction: {
    typeAndClear: async (field: HTMLElement, text: string, user: any) => {
      await user.type(field, text);
      await user.clear(field);
    },
    
    typeAndBlur: async (field: HTMLElement, text: string, user: any) => {
      await user.type(field, text);
      await user.tab();
    },
    
    focusAndBlur: async (field: HTMLElement, user: any) => {
      await user.click(field);
      await user.tab();
    },
  },
} as const;