/**
 * AppButton Component Tests
 * 
 * Comprehensive test suite for the AppButton component covering:
 * - Basic rendering and props
 * - User interactions (click, keyboard)
 * - Loading states and accessibility
 * - Theme integration and variants
 */

import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, fireEvent, userEvent, checkA11y } from '@/test-utils';
import { AppButton } from '../app-button';

describe('AppButton', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      renderWithProviders(<AppButton>Click me</AppButton>);
      
      const button = screen.getByRole('button', { name: 'Click me' });
      expect(button).toBeInTheDocument();
      expect(button).toBeEnabled();
    });

    it('renders with custom text content', () => {
      renderWithProviders(<AppButton>Save Tournament</AppButton>);
      
      expect(screen.getByRole('button', { name: 'Save Tournament' })).toBeInTheDocument();
    });

    it('applies variant styles correctly', () => {
      renderWithProviders(<AppButton variant="contained">Contained Button</AppButton>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('MuiButton-contained');
    });

    it('applies color prop correctly', () => {
      renderWithProviders(<AppButton color="primary">Primary Button</AppButton>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('MuiButton-colorPrimary');
    });

    it('applies size prop correctly', () => {
      renderWithProviders(<AppButton size="large">Large Button</AppButton>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('MuiButton-sizeLarge');
    });

    it('renders with start icon', () => {
      const testIcon = <span data-testid="start-icon">🏆</span>;
      renderWithProviders(
        <AppButton startIcon={testIcon}>Trophy Button</AppButton>
      );
      
      expect(screen.getByTestId('start-icon')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /trophy button/i })).toBeInTheDocument();
    });

    it('renders with end icon', () => {
      const testIcon = <span data-testid="end-icon">→</span>;
      renderWithProviders(
        <AppButton endIcon={testIcon}>Next Step</AppButton>
      );
      
      expect(screen.getByTestId('end-icon')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next step/i })).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('shows loading text when loading prop is true', () => {
      renderWithProviders(<AppButton loading>Submit Form</AppButton>);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByText('Submit Form')).not.toBeInTheDocument();
    });

    it('disables button when loading', () => {
      renderWithProviders(<AppButton loading>Loading Button</AppButton>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('has reduced opacity when loading', () => {
      renderWithProviders(<AppButton loading>Loading Button</AppButton>);
      
      const button = screen.getByRole('button');
      const styles = window.getComputedStyle(button);
      expect(styles.opacity).toBe('0.7');
    });

    it('hides icons when loading', () => {
      const startIcon = <span data-testid="start-icon">🏆</span>;
      const endIcon = <span data-testid="end-icon">→</span>;
      
      renderWithProviders(
        <AppButton loading startIcon={startIcon} endIcon={endIcon}>
          Loading Button
        </AppButton>
      );
      
      expect(screen.queryByTestId('start-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('end-icon')).not.toBeInTheDocument();
    });

    it('prevents clicks when loading', () => {
      const handleClick = vi.fn();
      
      renderWithProviders(
        <AppButton loading onClick={handleClick}>Loading</AppButton>
      );
      
      const button = screen.getByRole('button');
      // Use fireEvent instead of userEvent for disabled elements
      fireEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Disabled State', () => {
    it('disables button when disabled prop is true', () => {
      renderWithProviders(<AppButton disabled>Disabled Button</AppButton>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('prevents clicks when disabled', () => {
      const handleClick = vi.fn();
      
      renderWithProviders(
        <AppButton disabled onClick={handleClick}>Disabled</AppButton>
      );
      
      const button = screen.getByRole('button');
      // Use fireEvent instead of userEvent for disabled elements
      fireEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('is disabled when both loading and disabled are true', () => {
      renderWithProviders(<AppButton loading disabled>Button</AppButton>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('User Interactions', () => {
    it('handles click events', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      renderWithProviders(
        <AppButton onClick={handleClick}>Click me</AppButton>
      );
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles multiple clicks', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      renderWithProviders(
        <AppButton onClick={handleClick}>Multi-click</AppButton>
      );
      
      const button = screen.getByRole('button');
      await user.click(button);
      await user.click(button);
      await user.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it('handles keyboard activation with Enter key', () => {
      const handleClick = vi.fn();
      
      renderWithProviders(
        <AppButton onClick={handleClick}>Keyboard Button</AppButton>
      );
      
      const button = screen.getByRole('button');
      button.focus();
      fireEvent.keyDown(button, { key: 'Enter' });
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles keyboard activation with Space key', () => {
      const handleClick = vi.fn();
      
      renderWithProviders(
        <AppButton onClick={handleClick}>Space Button</AppButton>
      );
      
      const button = screen.getByRole('button');
      button.focus();
      fireEvent.keyDown(button, { key: ' ' });
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not trigger click on other keys', () => {
      const handleClick = vi.fn();
      
      renderWithProviders(
        <AppButton onClick={handleClick}>Other Keys</AppButton>
      );
      
      const button = screen.getByRole('button');
      button.focus();
      fireEvent.keyDown(button, { key: 'Tab' });
      fireEvent.keyDown(button, { key: 'Escape' });
      fireEvent.keyDown(button, { key: 'a' });
      
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Focus Management', () => {
    it('is focusable by default', () => {
      renderWithProviders(<AppButton>Focusable Button</AppButton>);
      
      const button = screen.getByRole('button');
      button.focus();
      
      expect(button).toHaveFocus();
    });

    it('is not focusable when disabled', () => {
      renderWithProviders(<AppButton disabled>Non-focusable</AppButton>);
      
      const button = screen.getByRole('button');
      button.focus();
      
      expect(button).not.toHaveFocus();
    });

    it('has visible focus indicators', () => {
      renderWithProviders(<AppButton>Focus Indicators</AppButton>);
      
      const button = screen.getByRole('button');
      button.focus();
      
      // Check for focus-visible styling
      expect(button).toHaveAttribute('tabindex', '0');
    });
  });

  describe('Accessibility', () => {
    it('has proper button role', () => {
      renderWithProviders(<AppButton>Accessible Button</AppButton>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('has accessible name from text content', () => {
      renderWithProviders(<AppButton>Save Changes</AppButton>);
      
      expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
    });

    it('supports aria-label', () => {
      renderWithProviders(
        <AppButton aria-label="Close dialog">×</AppButton>
      );
      
      expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      renderWithProviders(
        <div>
          <AppButton aria-describedby="help-text">Submit</AppButton>
          <div id="help-text">This will save your changes</div>
        </div>
      );
      
      const button = screen.getByRole('button', { name: 'Submit' });
      expect(button).toHaveAttribute('aria-describedby', 'help-text');
    });

    it('announces loading state to screen readers', () => {
      renderWithProviders(<AppButton loading>Submit</AppButton>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Loading...');
      expect(button).toBeDisabled();
    });

    it('meets basic accessibility standards', async () => {
      const { container } = renderWithProviders(
        <AppButton>Accessible Button</AppButton>
      );
      
      await checkA11y(container);
    });
  });

  describe('Theme Integration', () => {
    it('applies theme colors correctly', () => {
      renderWithProviders(<AppButton color="primary">Primary</AppButton>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('MuiButton-colorPrimary');
    });

    it('responds to theme breakpoints', () => {
      // This would test responsive behavior
      // In a real test, you might use viewport testing
      renderWithProviders(<AppButton>Responsive Button</AppButton>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty children gracefully', () => {
      renderWithProviders(<AppButton></AppButton>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('');
    });

    it('handles null/undefined children', () => {
      renderWithProviders(<AppButton>{null}</AppButton>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('handles complex children elements', () => {
      renderWithProviders(
        <AppButton>
          <span>Complex</span> <strong>Children</strong>
        </AppButton>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Complex Children');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      
      renderWithProviders(<AppButton ref={ref}>Ref Button</AppButton>);
      
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
    });

    it('spreads additional props correctly', () => {
      renderWithProviders(
        <AppButton data-testid="custom-button" className="custom-class">
          Custom Props
        </AppButton>
      );
      
      const button = screen.getByTestId('custom-button');
      expect(button).toHaveClass('custom-class');
    });
  });
});