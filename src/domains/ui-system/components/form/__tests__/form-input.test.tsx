/**
 * AppFormInput Component Tests
 * 
 * Comprehensive test suite for the AppFormInput component covering:
 * - Form integration with React Hook Form
 * - Field validation and error states
 * - User interactions and accessibility
 * - Different input types and configurations
 */

import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderFormComponent, createMockSubmitHandler, mockValidationRules, userEvent } from '@/test-utils';
import { AppFormInput } from '../form-input';

describe('AppFormInput', () => {
  describe('Basic Rendering', () => {
    it('renders form input with label', () => {
      renderFormComponent((methods) => (
        <AppFormInput
          name="testField"
          control={methods.control}
          label="Test Label"
        />
      ));

      expect(screen.getByText('Test Label')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders without label when not provided', () => {
      renderFormComponent((methods) => (
        <AppFormInput
          name="testField"
          control={methods.control}
        />
      ));

      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.queryByText(/test/i)).not.toBeInTheDocument();
    });

    it('applies placeholder correctly', () => {
      renderFormComponent((methods) => (
        <AppFormInput
          name="testField"
          control={methods.control}
          placeholder="Enter your text here"
        />
      ));

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('placeholder', 'Enter your text here');
    });

    it('shows required indicator when required', () => {
      renderFormComponent((methods) => (
        <AppFormInput
          name="testField"
          control={methods.control}
          label="Required Field"
          required
        />
      ));

      expect(screen.getByText('Required Field *')).toBeInTheDocument();
    });

    it('shows helper text when provided', () => {
      renderFormComponent((methods) => (
        <AppFormInput
          name="testField"
          control={methods.control}
          label="Test Field"
          helperText="This is helpful information"
        />
      ));

      expect(screen.getByText('This is helpful information')).toBeInTheDocument();
    });
  });

  describe('Input Types', () => {
    it('renders text input by default', () => {
      renderFormComponent((methods) => (
        <AppFormInput
          name="testField"
          control={methods.control}
        />
      ));

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('renders email input when type is email', () => {
      renderFormComponent((methods) => (
        <AppFormInput
          name="email"
          control={methods.control}
          type="email"
        />
      ));

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('renders password input when type is password', () => {
      renderFormComponent((methods) => (
        <AppFormInput
          name="password"
          control={methods.control}
          type="password"
        />
      ));

      const input = screen.getByLabelText(/password/i);
      expect(input).toHaveAttribute('type', 'password');
    });

    it('renders number input when type is number', () => {
      renderFormComponent((methods) => (
        <AppFormInput
          name="age"
          control={methods.control}
          type="number"
        />
      ));

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('type', 'number');
    });

    it('renders multiline textarea when multiline is true', () => {
      renderFormComponent((methods) => (
        <AppFormInput
          name="description"
          control={methods.control}
          multiline
          rows={4}
        />
      ));

      const textarea = screen.getByRole('textbox');
      expect(textarea.tagName).toBe('TEXTAREA');
      expect(textarea).toHaveAttribute('rows', '4');
    });
  });

  describe('User Interactions', () => {
    it('allows user to type in the input', async () => {
      const user = userEvent.setup();
      
      renderFormComponent((methods) => (
        <AppFormInput
          name="testField"
          control={methods.control}
          label="Test Input"
        />
      ));

      const input = screen.getByRole('textbox');
      await user.type(input, 'Hello World');
      
      expect(input).toHaveValue('Hello World');
    });

    it('updates form state when value changes', async () => {
      const user = userEvent.setup();
      const mockSubmit = createMockSubmitHandler();
      
      const { submitForm } = renderFormComponent(
        (methods) => (
          <AppFormInput
            name="testField"
            control={methods.control}
            label="Test Input"
          />
        ),
        { onSubmit: mockSubmit.handleSubmit }
      );

      const input = screen.getByRole('textbox');
      await user.type(input, 'Test Value');
      await submitForm();
      
      mockSubmit.expectSubmitted({ testField: 'Test Value' });
    });

    it('clears input when user clears it', async () => {
      const user = userEvent.setup();
      
      renderFormComponent((methods) => (
        <AppFormInput
          name="testField"
          control={methods.control}
          label="Test Input"
        />
      ));

      const input = screen.getByRole('textbox');
      await user.type(input, 'Some text');
      expect(input).toHaveValue('Some text');
      
      await user.clear(input);
      expect(input).toHaveValue('');
    });

    it('handles focus and blur events', async () => {
      const user = userEvent.setup();
      
      renderFormComponent((methods) => (
        <AppFormInput
          name="testField"
          control={methods.control}
          label="Test Input"
        />
      ));

      const input = screen.getByRole('textbox');
      
      await user.click(input);
      expect(input).toHaveFocus();
      
      await user.tab();
      expect(input).not.toHaveFocus();
    });
  });

  describe('Validation and Error States', () => {
    it('shows error message when field has validation error', async () => {
      const user = userEvent.setup();
      
      renderFormComponent((methods) => {
        // Register field with validation rules
        methods.register('email', mockValidationRules.email.rule);
        
        return (
          <AppFormInput
            name="email"
            control={methods.control}
            label="Email Address"
            type="email"
          />
        );
      });

      const input = screen.getByRole('textbox');
      
      // Type invalid email and blur to trigger validation
      await user.type(input, mockValidationRules.email.invalidValue);
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText('Invalid email format')).toBeInTheDocument();
      });
    });

    it('clears error message when field becomes valid', async () => {
      const user = userEvent.setup();
      
      renderFormComponent((methods) => {
        methods.register('email', mockValidationRules.email.rule);
        
        return (
          <AppFormInput
            name="email"
            control={methods.control}
            label="Email Address"
            type="email"
          />
        );
      });

      const input = screen.getByRole('textbox');
      
      // Type invalid email first
      await user.type(input, mockValidationRules.email.invalidValue);
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText('Invalid email format')).toBeInTheDocument();
      });
      
      // Clear and type valid email
      await user.clear(input);
      await user.type(input, mockValidationRules.email.validValue);
      await user.tab();
      
      await waitFor(() => {
        expect(screen.queryByText('Invalid email format')).not.toBeInTheDocument();
      });
    });

    it('shows required field error when field is empty and required', async () => {
      const user = userEvent.setup();
      
      const { submitForm } = renderFormComponent((methods) => {
        methods.register('requiredField', mockValidationRules.required.rule);
        
        return (
          <AppFormInput
            name="requiredField"
            control={methods.control}
            label="Required Field"
            required
          />
        );
      });

      // Try to submit without filling required field
      await submitForm();
      
      await waitFor(() => {
        expect(screen.getByText('This field is required')).toBeInTheDocument();
      });
    });

    it('prioritizes error message over helper text', async () => {
      const user = userEvent.setup();
      
      renderFormComponent((methods) => {
        methods.register('testField', mockValidationRules.required.rule);
        
        return (
          <AppFormInput
            name="testField"
            control={methods.control}
            label="Test Field"
            helperText="This is helper text"
            required
          />
        );
      });

      const input = screen.getByRole('textbox');
      
      // Initially should show helper text
      expect(screen.getByText('This is helper text')).toBeInTheDocument();
      
      // Focus and blur to trigger validation
      await user.click(input);
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText('This field is required')).toBeInTheDocument();
        expect(screen.queryByText('This is helper text')).not.toBeInTheDocument();
      });
    });
  });

  describe('Disabled State', () => {
    it('disables input when disabled prop is true', () => {
      renderFormComponent((methods) => (
        <AppFormInput
          name="testField"
          control={methods.control}
          label="Disabled Field"
          disabled
        />
      ));

      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('prevents user interaction when disabled', async () => {
      const user = userEvent.setup();
      
      renderFormComponent((methods) => (
        <AppFormInput
          name="testField"
          control={methods.control}
          label="Disabled Field"
          disabled
        />
      ));

      const input = screen.getByRole('textbox');
      
      // Try to type in disabled input
      await user.type(input, 'This should not work');
      expect(input).toHaveValue('');
    });
  });

  describe('Default Values', () => {
    it('shows default value when provided', () => {
      renderFormComponent(
        (methods) => (
          <AppFormInput
            name="testField"
            control={methods.control}
            label="Test Field"
          />
        ),
        { defaultValues: { testField: 'Default Value' } }
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('Default Value');
    });

    it('allows editing default value', async () => {
      const user = userEvent.setup();
      
      renderFormComponent(
        (methods) => (
          <AppFormInput
            name="testField"
            control={methods.control}
            label="Test Field"
          />
        ),
        { defaultValues: { testField: 'Default Value' } }
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('Default Value');
      
      await user.clear(input);
      await user.type(input, 'New Value');
      expect(input).toHaveValue('New Value');
    });
  });

  describe('Accessibility', () => {
    it('associates label with input correctly', () => {
      renderFormComponent((methods) => (
        <AppFormInput
          name="testField"
          control={methods.control}
          label="Accessible Label"
        />
      ));

      const input = screen.getByRole('textbox');
      const label = screen.getByText('Accessible Label');
      
      // Check that they are properly associated
      expect(input).toHaveAccessibleName('Accessible Label');
    });

    it('includes error message in accessible description', async () => {
      const user = userEvent.setup();
      
      renderFormComponent((methods) => {
        methods.register('email', mockValidationRules.email.rule);
        
        return (
          <AppFormInput
            name="email"
            control={methods.control}
            label="Email"
            type="email"
          />
        );
      });

      const input = screen.getByRole('textbox');
      
      // Trigger validation error
      await user.type(input, 'invalid');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText('Invalid email format')).toBeInTheDocument();
      });
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      
      renderFormComponent((methods) => (
        <AppFormInput
          name="testField"
          control={methods.control}
          label="Keyboard Navigation"
        />
      ));

      const input = screen.getByRole('textbox');
      
      // Tab to input
      await user.tab();
      expect(input).toHaveFocus();
      
      // Tab away
      await user.tab();
      expect(input).not.toHaveFocus();
    });
  });

  describe('Form Integration', () => {
    it('integrates with form submission', async () => {
      const user = userEvent.setup();
      const mockSubmit = createMockSubmitHandler();
      
      const { submitForm } = renderFormComponent(
        (methods) => (
          <AppFormInput
            name="username"
            control={methods.control}
            label="Username"
          />
        ),
        { onSubmit: mockSubmit.handleSubmit }
      );

      const input = screen.getByRole('textbox');
      await user.type(input, 'john_doe');
      await submitForm();
      
      mockSubmit.expectSubmitted({ username: 'john_doe' });
    });

    it('prevents form submission when validation fails', async () => {
      const mockSubmit = createMockSubmitHandler();
      
      const { submitForm } = renderFormComponent(
        (methods) => {
          methods.register('email', mockValidationRules.email.rule);
          
          return (
            <AppFormInput
              name="email"
              control={methods.control}
              label="Email"
              type="email"
            />
          );
        },
        { onSubmit: mockSubmit.handleSubmit }
      );

      // Try to submit with empty required field
      await submitForm();
      
      mockSubmit.expectNotSubmitted();
      
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles very long input values', async () => {
      const user = userEvent.setup();
      const longText = 'a'.repeat(1000);
      
      renderFormComponent((methods) => (
        <AppFormInput
          name="longField"
          control={methods.control}
          label="Long Text Field"
        />
      ));

      const input = screen.getByRole('textbox');
      await user.type(input, longText);
      
      expect(input).toHaveValue(longText);
    });

    it('handles special characters correctly', async () => {
      const user = userEvent.setup();
      const specialText = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      
      renderFormComponent((methods) => (
        <AppFormInput
          name="specialField"
          control={methods.control}
          label="Special Characters"
        />
      ));

      const input = screen.getByRole('textbox');
      await user.type(input, specialText);
      
      expect(input).toHaveValue(specialText);
    });

    it('handles rapid input changes', async () => {
      const user = userEvent.setup();
      
      renderFormComponent((methods) => (
        <AppFormInput
          name="rapidField"
          control={methods.control}
          label="Rapid Input"
        />
      ));

      const input = screen.getByRole('textbox');
      
      // Rapidly type and clear multiple times
      for (let i = 0; i < 5; i++) {
        await user.type(input, `Text ${i}`);
        await user.clear(input);
      }
      
      await user.type(input, 'Final text');
      expect(input).toHaveValue('Final text');
    });
  });
});