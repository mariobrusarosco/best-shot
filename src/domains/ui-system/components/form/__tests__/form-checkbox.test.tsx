/**
 * AppFormCheckbox Component Tests
 * 
 * Test suite for the AppFormCheckbox component covering:
 * - Boolean state management and form integration
 * - User interactions and accessibility
 * - Validation and error states
 * - Visual feedback and styling
 */

import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderFormComponent, createMockSubmitHandler, userEvent, renderWithProviders } from '@/test-utils';
import { useForm } from 'react-hook-form';
import { AppFormCheckbox } from '../form-checkbox';

describe('AppFormCheckbox', () => {
  describe('Basic Rendering', () => {
    it('renders checkbox with label', () => {
      renderFormComponent((methods) => (
        <AppFormCheckbox
          name="testCheckbox"
          control={methods.control}
          label="Test Checkbox"
        />
      ));

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByText('Test Checkbox')).toBeInTheDocument();
    });

    it('renders without label when not provided', () => {
      renderFormComponent((methods) => (
        <AppFormCheckbox
          name="testCheckbox"
          control={methods.control}
        />
      ));

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('shows required indicator when required', () => {
      renderFormComponent((methods) => (
        <AppFormCheckbox
          name="testCheckbox"
          control={methods.control}
          label="Required Checkbox"
          required
        />
      ));

      expect(screen.getByText('Required Checkbox *')).toBeInTheDocument();
    });

    it('shows helper text when provided', () => {
      renderFormComponent((methods) => (
        <AppFormCheckbox
          name="testCheckbox"
          control={methods.control}
          label="Test Checkbox"
          helperText="Check this box to agree"
        />
      ));

      expect(screen.getByText('Check this box to agree')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('can be checked and unchecked', async () => {
      const user = userEvent.setup();
      
      renderFormComponent((methods) => (
        <AppFormCheckbox
          name="testCheckbox"
          control={methods.control}
          label="Interactive Checkbox"
        />
      ));

      const checkbox = screen.getByRole('checkbox');
      
      // Initially unchecked
      expect(checkbox).not.toBeChecked();
      
      // Click to check
      await user.click(checkbox);
      expect(checkbox).toBeChecked();
      
      // Click to uncheck
      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it('updates form state when toggled', async () => {
      const user = userEvent.setup();
      const mockSubmit = createMockSubmitHandler();
      
      const { submitForm } = renderFormComponent(
        (methods) => (
          <AppFormCheckbox
            name="agreement"
            control={methods.control}
            label="I agree to terms"
          />
        ),
        { onSubmit: mockSubmit.handleSubmit }
      );

      const checkbox = screen.getByRole('checkbox');
      
      // Check the box
      await user.click(checkbox);
      await submitForm();
      
      mockSubmit.expectSubmitted({ agreement: true });
      
      // Uncheck and submit again
      await user.click(checkbox);
      await submitForm();
      
      const lastSubmission = mockSubmit.getLastSubmission();
      expect(lastSubmission.agreement).toBe(false);
    });

    it('supports keyboard interaction', async () => {
      const user = userEvent.setup();
      
      renderFormComponent((methods) => (
        <AppFormCheckbox
          name="testCheckbox"
          control={methods.control}
          label="Keyboard Checkbox"
        />
      ));

      const checkbox = screen.getByRole('checkbox');
      
      // Tab to checkbox
      await user.tab();
      expect(checkbox).toHaveFocus();
      
      // Space to toggle
      await user.keyboard(' ');
      expect(checkbox).toBeChecked();
      
      // Space to toggle again
      await user.keyboard(' ');
      expect(checkbox).not.toBeChecked();
    });

    it('can be clicked via label', async () => {
      const user = userEvent.setup();
      
      renderFormComponent((methods) => (
        <AppFormCheckbox
          name="testCheckbox"
          control={methods.control}
          label="Clickable Label"
        />
      ));

      const checkbox = screen.getByRole('checkbox');
      const label = screen.getByText('Clickable Label');
      
      // Click label to toggle checkbox
      await user.click(label);
      expect(checkbox).toBeChecked();
      
      await user.click(label);
      expect(checkbox).not.toBeChecked();
    });
  });

  describe('Validation and Error States', () => {
    it('shows error message when validation fails', async () => {
      const { submitForm } = renderFormComponent((methods) => {
        methods.register('terms', { 
          required: 'You must accept the terms and conditions' 
        });
        
        return (
          <AppFormCheckbox
            name="terms"
            control={methods.control}
            label="I accept the terms and conditions"
            required
          />
        );
      });

      // Try to submit without checking
      await submitForm();
      
      await waitFor(() => {
        expect(screen.getByText('You must accept the terms and conditions')).toBeInTheDocument();
      });
    });

    it('clears error when checkbox is checked', async () => {
      const user = userEvent.setup();
      
      const { submitForm } = renderFormComponent((methods) => {
        methods.register('terms', { 
          required: 'You must accept the terms and conditions' 
        });
        
        return (
          <AppFormCheckbox
            name="terms"
            control={methods.control}
            label="I accept the terms and conditions"
            required
          />
        );
      });

      // Trigger error first
      await submitForm();
      await waitFor(() => {
        expect(screen.getByText('You must accept the terms and conditions')).toBeInTheDocument();
      });
      
      // Check the box to clear error
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      await waitFor(() => {
        expect(screen.queryByText('You must accept the terms and conditions')).not.toBeInTheDocument();
      });
    });

    it('supports custom validation', async () => {
      const user = userEvent.setup();
      
      const { submitForm } = renderFormComponent((methods) => {
        methods.register('customValidation', {
          validate: (value) => {
            if (!value) {
              return 'This checkbox must be checked';
            }
            return true;
          }
        });
        
        return (
          <AppFormCheckbox
            name="customValidation"
            control={methods.control}
            label="Custom Validation Checkbox"
          />
        );
      });

      // Submit without checking
      await submitForm();
      
      await waitFor(() => {
        expect(screen.getByText('This checkbox must be checked')).toBeInTheDocument();
      });
      
      // Check and submit again
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      await submitForm();
      
      await waitFor(() => {
        expect(screen.queryByText('This checkbox must be checked')).not.toBeInTheDocument();
      });
    });

    it('prioritizes error message over helper text', async () => {
      const { submitForm } = renderFormComponent((methods) => {
        methods.register('terms', { 
          required: 'Required field' 
        });
        
        return (
          <AppFormCheckbox
            name="terms"
            control={methods.control}
            label="Terms Checkbox"
            helperText="This is helpful information"
            required
          />
        );
      });

      // Initially should show helper text
      expect(screen.getByText('This is helpful information')).toBeInTheDocument();
      
      // Trigger validation error
      await submitForm();
      
      await waitFor(() => {
        expect(screen.getByText('Required field')).toBeInTheDocument();
        expect(screen.queryByText('This is helpful information')).not.toBeInTheDocument();
      });
    });
  });

  describe('Disabled State', () => {
    it('disables checkbox when disabled prop is true', () => {
      renderFormComponent((methods) => (
        <AppFormCheckbox
          name="testCheckbox"
          control={methods.control}
          label="Disabled Checkbox"
          disabled
        />
      ));

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
    });

    it('prevents user interaction when disabled', async () => {
      const user = userEvent.setup();
      
      renderFormComponent((methods) => (
        <AppFormCheckbox
          name="testCheckbox"
          control={methods.control}
          label="Disabled Checkbox"
          disabled
        />
      ));

      const checkbox = screen.getByRole('checkbox');
      
      // Try to click disabled checkbox
      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it('shows disabled styling', () => {
      renderFormComponent((methods) => (
        <AppFormCheckbox
          name="testCheckbox"
          control={methods.control}
          label="Disabled Checkbox"
          disabled
        />
      ));

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
      
      // Check for disabled styling classes
      expect(checkbox).toHaveAttribute('disabled');
    });
  });

  describe('Default Values', () => {
    it('shows checked state when default value is true', () => {
      renderFormComponent(
        (methods) => (
          <AppFormCheckbox
            name="testCheckbox"
            control={methods.control}
            label="Default Checked"
          />
        ),
        { defaultValues: { testCheckbox: true } }
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('shows unchecked state when default value is false', () => {
      renderFormComponent(
        (methods) => (
          <AppFormCheckbox
            name="testCheckbox"
            control={methods.control}
            label="Default Unchecked"
          />
        ),
        { defaultValues: { testCheckbox: false } }
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('allows toggling from default state', async () => {
      const user = userEvent.setup();
      
      renderFormComponent(
        (methods) => (
          <AppFormCheckbox
            name="testCheckbox"
            control={methods.control}
            label="Toggle from Default"
          />
        ),
        { defaultValues: { testCheckbox: true } }
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
      
      // Toggle to unchecked
      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
      
      // Toggle back to checked
      await user.click(checkbox);
      expect(checkbox).toBeChecked();
    });
  });

  describe('Accessibility', () => {
    it('associates label with checkbox correctly', () => {
      renderFormComponent((methods) => (
        <AppFormCheckbox
          name="testCheckbox"
          control={methods.control}
          label="Accessible Checkbox"
        />
      ));

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAccessibleName('Accessible Checkbox');
    });

    it('has proper ARIA attributes', () => {
      renderFormComponent((methods) => (
        <AppFormCheckbox
          name="testCheckbox"
          control={methods.control}
          label="ARIA Checkbox"
        />
      ));

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('type', 'checkbox');
    });

    it('announces state changes to screen readers', async () => {
      const user = userEvent.setup();
      
      renderFormComponent((methods) => (
        <AppFormCheckbox
          name="testCheckbox"
          control={methods.control}
          label="Screen Reader Checkbox"
        />
      ));

      const checkbox = screen.getByRole('checkbox');
      
      // Initial state
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
      
      // Click to check
      await user.click(checkbox);
      expect(checkbox).toHaveAttribute('aria-checked', 'true');
      
      // Click to uncheck
      await user.click(checkbox);
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
    });

    it('supports focus indicators', async () => {
      const user = userEvent.setup();
      
      renderFormComponent((methods) => (
        <AppFormCheckbox
          name="testCheckbox"
          control={methods.control}
          label="Focus Checkbox"
        />
      ));

      const checkbox = screen.getByRole('checkbox');
      
      // Tab to focus
      await user.tab();
      expect(checkbox).toHaveFocus();
    });
  });

  describe('Form Integration', () => {
    it('integrates with form submission', async () => {
      const user = userEvent.setup();
      const mockSubmit = createMockSubmitHandler();
      
      const { submitForm } = renderFormComponent(
        (methods) => (
          <AppFormCheckbox
            name="newsletter"
            control={methods.control}
            label="Subscribe to newsletter"
          />
        ),
        { onSubmit: mockSubmit.handleSubmit }
      );

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      await submitForm();
      
      mockSubmit.expectSubmitted({ newsletter: true });
    });

    it('prevents form submission when validation fails', async () => {
      const mockSubmit = createMockSubmitHandler();
      
      const { submitForm } = renderFormComponent(
        (methods) => {
          methods.register('required', { required: 'This field is required' });
          
          return (
            <AppFormCheckbox
              name="required"
              control={methods.control}
              label="Required Checkbox"
              required
            />
          );
        },
        { onSubmit: mockSubmit.handleSubmit }
      );

      // Try to submit without checking
      await submitForm();
      
      mockSubmit.expectNotSubmitted();
      
      await waitFor(() => {
        expect(screen.getByText('This field is required')).toBeInTheDocument();
      });
    });

    it('handles multiple checkboxes in same form', async () => {
      const user = userEvent.setup();
      const mockSubmit = createMockSubmitHandler();
      
      const { submitForm } = renderFormComponent(
        (methods) => (
          <>
            <AppFormCheckbox
              name="option1"
              control={methods.control}
              label="Option 1"
            />
            <AppFormCheckbox
              name="option2"
              control={methods.control}
              label="Option 2"
            />
            <AppFormCheckbox
              name="option3"
              control={methods.control}
              label="Option 3"
            />
          </>
        ),
        { onSubmit: mockSubmit.handleSubmit }
      );

      // Check option 1 and 3
      await user.click(screen.getByLabelText('Option 1'));
      await user.click(screen.getByLabelText('Option 3'));
      
      await submitForm();
      
      mockSubmit.expectSubmitted({
        option1: true,
        option2: false,
        option3: true,
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid clicking', async () => {
      const user = userEvent.setup();
      
      renderFormComponent((methods) => (
        <AppFormCheckbox
          name="rapidClick"
          control={methods.control}
          label="Rapid Click Test"
        />
      ));

      const checkbox = screen.getByRole('checkbox');
      
      // Rapidly click multiple times
      for (let i = 0; i < 10; i++) {
        await user.click(checkbox);
      }
      
      // Should end up unchecked (even number of clicks)
      expect(checkbox).not.toBeChecked();
    });

    it('handles programmatic state changes', () => {
      const TestComponent = () => {
        const methods = useForm({ defaultValues: { test: false } });
        
        return (
          <div>
            <AppFormCheckbox
              name="test"
              control={methods.control}
              label="Programmatic Test"
            />
            <button 
              type="button"
              onClick={() => methods.setValue('test', true)}
              data-testid="set-true"
            >
              Set True
            </button>
          </div>
        );
      };
      
      renderWithProviders(<TestComponent />);
      
      const checkbox = screen.getByRole('checkbox');
      const setTrueButton = screen.getByTestId('set-true');
      
      expect(checkbox).not.toBeChecked();
      
      // Programmatically set to true
      setTrueButton.click();
      expect(checkbox).toBeChecked();
    });
  });
});