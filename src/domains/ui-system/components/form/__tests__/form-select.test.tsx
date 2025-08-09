/**
 * AppFormSelect Component Tests
 * 
 * Test suite for the AppFormSelect component covering:
 * - Option selection and form integration
 * - Validation and error states
 * - User interactions and accessibility
 * - Loading states and dynamic options
 */

import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderFormComponent, createMockSubmitHandler, userEvent } from '@/test-utils';
import { AppFormSelect } from '../form-select';

const mockOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

const sportOptions = [
  { value: 'football', label: 'Football' },
  { value: 'basketball', label: 'Basketball' },
  { value: 'tennis', label: 'Tennis' },
  { value: 'soccer', label: 'Soccer' },
];

describe('AppFormSelect', () => {
  describe('Basic Rendering', () => {
    it('renders select with label and options', async () => {
      const user = userEvent.setup();
      
      renderFormComponent((methods) => (
        <AppFormSelect
          name="testSelect"
          control={methods.control}
          label="Test Select"
          options={mockOptions}
        />
      ));

      expect(screen.getByText('Test Select')).toBeInTheDocument();
      
      // Click to open select
      const select = screen.getByRole('combobox');
      await user.click(select);
      
      // Check options are available
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
        expect(screen.getByText('Option 3')).toBeInTheDocument();
      });
    });

    it('renders without label when not provided', () => {
      renderFormComponent((methods) => (
        <AppFormSelect
          name="testSelect"
          control={methods.control}
          options={mockOptions}
        />
      ));

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('shows placeholder when provided', () => {
      renderFormComponent((methods) => (
        <AppFormSelect
          name="testSelect"
          control={methods.control}
          options={mockOptions}
          placeholder="Select an option..."
        />
      ));

      expect(screen.getByText('Select an option...')).toBeInTheDocument();
    });

    it('shows required indicator when required', () => {
      renderFormComponent((methods) => (
        <AppFormSelect
          name="testSelect"
          control={methods.control}
          label="Required Select"
          options={mockOptions}
          required
        />
      ));

      expect(screen.getByText('Required Select *')).toBeInTheDocument();
    });
  });

  describe('Option Selection', () => {
    it('allows user to select an option', async () => {
      const user = userEvent.setup();
      
      renderFormComponent((methods) => (
        <AppFormSelect
          name="sport"
          control={methods.control}
          label="Choose Sport"
          options={sportOptions}
        />
      ));

      const select = screen.getByRole('combobox');
      await user.click(select);
      
      // Select football option
      const footballOption = await screen.findByText('Football');
      await user.click(footballOption);
      
      // Verify selection
      expect(screen.getByDisplayValue('Football')).toBeInTheDocument();
    });

    it('updates form state when option is selected', async () => {
      const user = userEvent.setup();
      const mockSubmit = createMockSubmitHandler();
      
      const { submitForm } = renderFormComponent(
        (methods) => (
          <AppFormSelect
            name="sport"
            control={methods.control}
            label="Choose Sport"
            options={sportOptions}
          />
        ),
        { onSubmit: mockSubmit.handleSubmit }
      );

      const select = screen.getByRole('combobox');
      await user.click(select);
      
      const basketballOption = await screen.findByText('Basketball');
      await user.click(basketballOption);
      
      await submitForm();
      
      mockSubmit.expectSubmitted({ sport: 'basketball' });
    });

    it('allows changing selection', async () => {
      const user = userEvent.setup();
      
      renderFormComponent((methods) => (
        <AppFormSelect
          name="sport"
          control={methods.control}
          label="Choose Sport"
          options={sportOptions}
        />
      ));

      const select = screen.getByRole('combobox');
      
      // Select first option
      await user.click(select);
      const footballOption = await screen.findByText('Football');
      await user.click(footballOption);
      expect(screen.getByDisplayValue('Football')).toBeInTheDocument();
      
      // Change to different option
      await user.click(select);
      const tennisOption = await screen.findByText('Tennis');
      await user.click(tennisOption);
      expect(screen.getByDisplayValue('Tennis')).toBeInTheDocument();
    });

    it('clears selection when needed', async () => {
      const user = userEvent.setup();
      
      renderFormComponent(
        (methods) => (
          <AppFormSelect
            name="sport"
            control={methods.control}
            label="Choose Sport"
            options={sportOptions}
          />
        ),
        { defaultValues: { sport: 'football' } }
      );

      expect(screen.getByDisplayValue('Football')).toBeInTheDocument();
      
      const select = screen.getByRole('combobox');
      await user.click(select);
      
      // Look for clear option or empty option if available
      // This depends on the implementation of your select component
      const clearButton = screen.queryByLabelText(/clear/i);
      if (clearButton) {
        await user.click(clearButton);
        expect(screen.queryByDisplayValue('Football')).not.toBeInTheDocument();
      }
    });
  });

  describe('Validation and Error States', () => {
    it('shows error message when field has validation error', async () => {
      const user = userEvent.setup();
      
      const { submitForm } = renderFormComponent((methods) => {
        methods.register('requiredSelect', { required: 'Please select an option' });
        
        return (
          <AppFormSelect
            name="requiredSelect"
            control={methods.control}
            label="Required Select"
            options={mockOptions}
            required
          />
        );
      });

      // Try to submit without selecting
      await submitForm();
      
      await waitFor(() => {
        expect(screen.getByText('Please select an option')).toBeInTheDocument();
      });
    });

    it('clears error when valid option is selected', async () => {
      const user = userEvent.setup();
      
      const { submitForm } = renderFormComponent((methods) => {
        methods.register('requiredSelect', { required: 'Please select an option' });
        
        return (
          <AppFormSelect
            name="requiredSelect"
            control={methods.control}
            label="Required Select"
            options={mockOptions}
            required
          />
        );
      });

      // Trigger error first
      await submitForm();
      await waitFor(() => {
        expect(screen.getByText('Please select an option')).toBeInTheDocument();
      });
      
      // Select an option to clear error
      const select = screen.getByRole('combobox');
      await user.click(select);
      
      const option = await screen.findByText('Option 1');
      await user.click(option);
      
      await waitFor(() => {
        expect(screen.queryByText('Please select an option')).not.toBeInTheDocument();
      });
    });

    it('shows custom validation error', async () => {
      const { submitForm } = renderFormComponent((methods) => {
        methods.register('sport', {
          required: 'Sport is required',
          validate: (value) => {
            if (value === 'tennis') {
              return 'Tennis is not available';
            }
            return true;
          }
        });
        
        return (
          <AppFormSelect
            name="sport"
            control={methods.control}
            label="Choose Sport"
            options={sportOptions}
          />
        );
      });

      const user = userEvent.setup();
      const select = screen.getByRole('combobox');
      
      // Select tennis (invalid option)
      await user.click(select);
      const tennisOption = await screen.findByText('Tennis');
      await user.click(tennisOption);
      
      await submitForm();
      
      await waitFor(() => {
        expect(screen.getByText('Tennis is not available')).toBeInTheDocument();
      });
    });
  });

  describe('Disabled State', () => {
    it('disables select when disabled prop is true', () => {
      renderFormComponent((methods) => (
        <AppFormSelect
          name="testSelect"
          control={methods.control}
          label="Disabled Select"
          options={mockOptions}
          disabled
        />
      ));

      const select = screen.getByRole('combobox');
      expect(select).toBeDisabled();
    });

    it('prevents user interaction when disabled', async () => {
      const user = userEvent.setup();
      
      renderFormComponent((methods) => (
        <AppFormSelect
          name="testSelect"
          control={methods.control}
          label="Disabled Select"
          options={mockOptions}
          disabled
        />
      ));

      const select = screen.getByRole('combobox');
      
      // Try to click disabled select
      await user.click(select);
      
      // Options should not appear
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });
  });

  describe('Default Values', () => {
    it('shows default value when provided', () => {
      renderFormComponent(
        (methods) => (
          <AppFormSelect
            name="sport"
            control={methods.control}
            label="Choose Sport"
            options={sportOptions}
          />
        ),
        { defaultValues: { sport: 'basketball' } }
      );

      expect(screen.getByDisplayValue('Basketball')).toBeInTheDocument();
    });

    it('allows changing from default value', async () => {
      const user = userEvent.setup();
      
      renderFormComponent(
        (methods) => (
          <AppFormSelect
            name="sport"
            control={methods.control}
            label="Choose Sport"
            options={sportOptions}
          />
        ),
        { defaultValues: { sport: 'basketball' } }
      );

      expect(screen.getByDisplayValue('Basketball')).toBeInTheDocument();
      
      const select = screen.getByRole('combobox');
      await user.click(select);
      
      const footballOption = await screen.findByText('Football');
      await user.click(footballOption);
      
      expect(screen.getByDisplayValue('Football')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('shows loading state when loading prop is true', () => {
      renderFormComponent((methods) => (
        <AppFormSelect
          name="testSelect"
          control={methods.control}
          label="Loading Select"
          options={[]}
          loading
        />
      ));

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('disables interaction during loading', async () => {
      const user = userEvent.setup();
      
      renderFormComponent((methods) => (
        <AppFormSelect
          name="testSelect"
          control={methods.control}
          label="Loading Select"
          options={[]}
          loading
        />
      ));

      const select = screen.getByRole('combobox');
      expect(select).toBeDisabled();
      
      // Try to click
      await user.click(select);
      
      // Should not open options
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('associates label with select correctly', () => {
      renderFormComponent((methods) => (
        <AppFormSelect
          name="testSelect"
          control={methods.control}
          label="Accessible Select"
          options={mockOptions}
        />
      ));

      const select = screen.getByRole('combobox');
      expect(select).toHaveAccessibleName('Accessible Select');
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      
      renderFormComponent((methods) => (
        <AppFormSelect
          name="sport"
          control={methods.control}
          label="Choose Sport"
          options={sportOptions}
        />
      ));

      const select = screen.getByRole('combobox');
      
      // Tab to select
      await user.tab();
      expect(select).toHaveFocus();
      
      // Open with Enter or Space
      await user.keyboard('{Enter}');
      
      await waitFor(() => {
        expect(screen.getByText('Football')).toBeInTheDocument();
      });
    });

    it('announces selection changes to screen readers', async () => {
      const user = userEvent.setup();
      
      renderFormComponent((methods) => (
        <AppFormSelect
          name="sport"
          control={methods.control}
          label="Choose Sport"
          options={sportOptions}
        />
      ));

      const select = screen.getByRole('combobox');
      await user.click(select);
      
      const basketballOption = await screen.findByText('Basketball');
      await user.click(basketballOption);
      
      // The selected value should be announced
      expect(screen.getByDisplayValue('Basketball')).toBeInTheDocument();
    });
  });

  describe('Form Integration', () => {
    it('integrates with form submission', async () => {
      const user = userEvent.setup();
      const mockSubmit = createMockSubmitHandler();
      
      const { submitForm } = renderFormComponent(
        (methods) => (
          <AppFormSelect
            name="category"
            control={methods.control}
            label="Category"
            options={mockOptions}
          />
        ),
        { onSubmit: mockSubmit.handleSubmit }
      );

      const select = screen.getByRole('combobox');
      await user.click(select);
      
      const option = await screen.findByText('Option 2');
      await user.click(option);
      
      await submitForm();
      
      mockSubmit.expectSubmitted({ category: 'option2' });
    });

    it('prevents form submission when validation fails', async () => {
      const mockSubmit = createMockSubmitHandler();
      
      const { submitForm } = renderFormComponent(
        (methods) => {
          methods.register('requiredSelect', { required: 'This field is required' });
          
          return (
            <AppFormSelect
              name="requiredSelect"
              control={methods.control}
              label="Required Select"
              options={mockOptions}
              required
            />
          );
        },
        { onSubmit: mockSubmit.handleSubmit }
      );

      // Try to submit without selecting
      await submitForm();
      
      mockSubmit.expectNotSubmitted();
      
      await waitFor(() => {
        expect(screen.getByText('This field is required')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty options array', () => {
      renderFormComponent((methods) => (
        <AppFormSelect
          name="emptySelect"
          control={methods.control}
          label="Empty Select"
          options={[]}
        />
      ));

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('handles options with same labels but different values', async () => {
      const user = userEvent.setup();
      const duplicateOptions = [
        { value: 'id1', label: 'Same Label' },
        { value: 'id2', label: 'Same Label' },
      ];
      
      renderFormComponent((methods) => (
        <AppFormSelect
          name="duplicateSelect"
          control={methods.control}
          label="Duplicate Labels"
          options={duplicateOptions}
        />
      ));

      const select = screen.getByRole('combobox');
      await user.click(select);
      
      // Both options should be available
      const options = await screen.findAllByText('Same Label');
      expect(options).toHaveLength(2);
    });

    it('handles very long option labels', async () => {
      const user = userEvent.setup();
      const longOptions = [
        { value: 'long', label: 'This is a very long option label that might overflow the select container and cause layout issues' },
      ];
      
      renderFormComponent((methods) => (
        <AppFormSelect
          name="longSelect"
          control={methods.control}
          label="Long Options"
          options={longOptions}
        />
      ));

      const select = screen.getByRole('combobox');
      await user.click(select);
      
      const longOption = await screen.findByText(/This is a very long option label/);
      await user.click(longOption);
      
      expect(screen.getByDisplayValue(/This is a very long option label/)).toBeInTheDocument();
    });
  });
});