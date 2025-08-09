/**
 * AppPill Component Tests
 * 
 * Test suite for the AppPill component covering:
 * - Basic rendering and content display
 * - Theme integration and styling
 * - Skeleton state functionality
 * - Accessibility compliance
 */

import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen, checkA11y } from '@/test-utils';
import { AppPill } from '../pill';

describe('AppPill', () => {
  describe('Component Rendering', () => {
    it('renders pill component with content', () => {
      renderWithProviders(<AppPill.Component>Active</AppPill.Component>);
      
      const pill = screen.getByText('Active');
      expect(pill).toBeInTheDocument();
    });

    it('renders pill with numeric content', () => {
      renderWithProviders(<AppPill.Component>42</AppPill.Component>);
      
      const pill = screen.getByText('42');
      expect(pill).toBeInTheDocument();
    });

    it('renders pill with custom content', () => {
      renderWithProviders(
        <AppPill.Component>
          <span data-testid="custom-content">🏆 Winner</span>
        </AppPill.Component>
      );
      
      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
      expect(screen.getByText('🏆 Winner')).toBeInTheDocument();
    });

    it('applies correct styling classes', () => {
      renderWithProviders(<AppPill.Component>Styled Pill</AppPill.Component>);
      
      const pill = screen.getByText('Styled Pill');
      expect(pill).toBeInTheDocument();
      
      // Check for MUI Box component classes
      const computedStyles = window.getComputedStyle(pill);
      expect(computedStyles.display).toBe('grid');
    });
  });

  describe('Skeleton State', () => {
    it('renders skeleton pill correctly', () => {
      renderWithProviders(<AppPill.Skeleton>Loading...</AppPill.Skeleton>);
      
      const skeletonPill = screen.getByText('Loading...');
      expect(skeletonPill).toBeInTheDocument();
    });

    it('applies skeleton styling', () => {
      renderWithProviders(<AppPill.Skeleton>Skeleton</AppPill.Skeleton>);
      
      const skeletonPill = screen.getByText('Skeleton');
      const computedStyles = window.getComputedStyle(skeletonPill);
      
      // Skeleton should have transparent color
      expect(computedStyles.color).toBe('transparent');
    });

    it('maintains pill structure in skeleton state', () => {
      renderWithProviders(<AppPill.Skeleton>Test Content</AppPill.Skeleton>);
      
      const skeletonPill = screen.getByText('Test Content');
      expect(skeletonPill).toBeInTheDocument();
      
      // Should still have grid display
      const computedStyles = window.getComputedStyle(skeletonPill);
      expect(computedStyles.display).toBe('grid');
    });
  });

  describe('Theme Integration', () => {
    it('applies theme spacing correctly', () => {
      renderWithProviders(<AppPill.Component>Themed Pill</AppPill.Component>);
      
      const pill = screen.getByText('Themed Pill');
      const computedStyles = window.getComputedStyle(pill);
      
      // Should have some padding applied from theme
      expect(computedStyles.padding).toBeTruthy();
    });

    it('applies theme colors correctly', () => {
      renderWithProviders(<AppPill.Component>Color Test</AppPill.Component>);
      
      const pill = screen.getByText('Color Test');
      const computedStyles = window.getComputedStyle(pill);
      
      // Should have background and text colors applied
      expect(computedStyles.backgroundColor).toBeTruthy();
      expect(computedStyles.color).toBeTruthy();
    });

    it('responds to theme breakpoints', () => {
      // Test responsive behavior
      renderWithProviders(<AppPill.Component>Responsive</AppPill.Component>);
      
      const pill = screen.getByText('Responsive');
      expect(pill).toBeInTheDocument();
      
      // In a real test, you might test different viewport sizes
      // For now, we just ensure the component renders
    });
  });

  describe('Content Handling', () => {
    it('handles empty content gracefully', () => {
      renderWithProviders(<AppPill.Component></AppPill.Component>);
      
      // Should render even with empty content
      const pill = document.querySelector('[class*="MuiBox"]');
      expect(pill).toBeInTheDocument();
    });

    it('handles long content appropriately', () => {
      const longContent = 'This is a very long pill content that might wrap or truncate';
      renderWithProviders(<AppPill.Component>{longContent}</AppPill.Component>);
      
      const pill = screen.getByText(longContent);
      expect(pill).toBeInTheDocument();
    });

    it('handles special characters', () => {
      const specialContent = '🎯 100% ✓ Success!';
      renderWithProviders(<AppPill.Component>{specialContent}</AppPill.Component>);
      
      const pill = screen.getByText(specialContent);
      expect(pill).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper semantic structure', () => {
      renderWithProviders(<AppPill.Component>Accessible Pill</AppPill.Component>);
      
      const pill = screen.getByText('Accessible Pill');
      expect(pill).toBeInTheDocument();
      
      // Should be properly accessible to screen readers
      expect(pill.textContent).toBe('Accessible Pill');
    });

    it('supports aria attributes when provided', () => {
      renderWithProviders(
        <AppPill.Component aria-label="Status indicator" role="status">
          Active
        </AppPill.Component>
      );
      
      const pill = screen.getByRole('status');
      expect(pill).toHaveAttribute('aria-label', 'Status indicator');
      expect(pill).toHaveTextContent('Active');
    });

    it('maintains accessibility in skeleton state', () => {
      renderWithProviders(
        <AppPill.Skeleton aria-label="Loading status">
          Loading...
        </AppPill.Skeleton>
      );
      
      const skeletonPill = screen.getByLabelText('Loading status');
      expect(skeletonPill).toBeInTheDocument();
    });

    it('meets basic accessibility standards', async () => {
      const { container } = renderWithProviders(
        <AppPill.Component>Accessible Content</AppPill.Component>
      );
      
      await checkA11y(container);
    });
  });

  describe('Common Use Cases', () => {
    it('works as status indicator', () => {
      renderWithProviders(
        <AppPill.Component role="status" aria-label="Tournament status">
          Active
        </AppPill.Component>
      );
      
      const statusPill = screen.getByRole('status');
      expect(statusPill).toHaveTextContent('Active');
      expect(statusPill).toHaveAttribute('aria-label', 'Tournament status');
    });

    it('works as count/badge indicator', () => {
      renderWithProviders(
        <AppPill.Component aria-label="Participant count">
          12
        </AppPill.Component>
      );
      
      const countPill = screen.getByLabelText('Participant count');
      expect(countPill).toHaveTextContent('12');
    });

    it('works as category tag', () => {
      renderWithProviders(
        <AppPill.Component role="img" aria-label="Sport category">
          Football
        </AppPill.Component>
      );
      
      const categoryPill = screen.getByRole('img');
      expect(categoryPill).toHaveTextContent('Football');
    });
  });

  describe('Edge Cases', () => {
    it('handles null/undefined children', () => {
      renderWithProviders(<AppPill.Component>{null}</AppPill.Component>);
      
      // Should still render the container
      const pill = document.querySelector('[class*="MuiBox"]');
      expect(pill).toBeInTheDocument();
    });

    it('handles zero values correctly', () => {
      renderWithProviders(<AppPill.Component>{0}</AppPill.Component>);
      
      const pill = screen.getByText('0');
      expect(pill).toBeInTheDocument();
    });

    it('handles boolean values', () => {
      renderWithProviders(<AppPill.Component>{true}</AppPill.Component>);
      
      // React renders boolean as empty, but container should exist
      const pill = document.querySelector('[class*="MuiBox"]');
      expect(pill).toBeInTheDocument();
    });

    it('forwards additional props correctly', () => {
      renderWithProviders(
        <AppPill.Component 
          data-testid="custom-pill" 
          className="custom-class"
          title="Tooltip text"
        >
          Custom Props
        </AppPill.Component>
      );
      
      const pill = screen.getByTestId('custom-pill');
      expect(pill).toHaveClass('custom-class');
      expect(pill).toHaveAttribute('title', 'Tooltip text');
    });
  });
});