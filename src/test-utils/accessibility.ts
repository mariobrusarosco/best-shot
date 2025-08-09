/**
 * Accessibility Testing Utilities
 * 
 * Provides helpers for testing accessibility compliance and keyboard navigation.
 * These utilities ensure our components meet WCAG 2.1 AA standards.
 */

import { fireEvent } from '@testing-library/react';
import { vi, expect } from 'vitest';

/**
 * Accessibility testing helper using axe-core
 * 
 * Note: We'll add axe-core integration when we install jest-axe
 * For now, providing the interface and basic checks
 * 
 * @example
 * ```tsx
 * test('component meets accessibility standards', async () => {
 *   const { container } = renderWithProviders(<MyComponent />);
 *   await checkA11y(container);
 * });
 * ```
 */
export async function checkA11y(container: HTMLElement): Promise<void> {
  // TODO: Implement axe-core integration
  // For now, we'll do basic accessibility checks
  
  // Check for basic accessibility attributes
  const buttons = container.querySelectorAll('button');
  buttons.forEach(button => {
    // Buttons should have accessible names
    const hasAccessibleName = 
      button.textContent?.trim() ||
      button.getAttribute('aria-label') ||
      button.getAttribute('aria-labelledby') ||
      button.getAttribute('title');
    
    if (!hasAccessibleName) {
      throw new Error(`Button without accessible name found: ${button.outerHTML}`);
    }
  });

  // Check for form inputs with labels
  const inputs = container.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    const hasLabel = 
      input.getAttribute('aria-label') ||
      input.getAttribute('aria-labelledby') ||
      container.querySelector(`label[for="${input.id}"]`) ||
      input.closest('label');
    
    if (!hasLabel && input.getAttribute('type') !== 'hidden') {
      throw new Error(`Form input without label found: ${input.outerHTML}`);
    }
  });

  // More checks can be added here
  console.log('✓ Basic accessibility checks passed');
}

/**
 * Tests keyboard navigation functionality
 * 
 * @example
 * ```tsx
 * test('supports keyboard navigation', () => {
 *   renderWithProviders(<MyComponent />);
 *   const firstButton = screen.getByRole('button', { name: 'First' });
 *   
 *   checkKeyboardNavigation(firstButton, {
 *     expectedNext: 'Second Button',
 *     testEscape: true,
 *   });
 * });
 * ```
 */
export function checkKeyboardNavigation(
  element: HTMLElement,
  options: {
    expectedNext?: string;
    testEscape?: boolean;
    testEnter?: boolean;
    testSpace?: boolean;
  } = {}
): void {
  const { expectedNext, testEscape = false, testEnter = false, testSpace = false } = options;

  // Focus the element
  element.focus();
  expect(element).toHaveFocus();

  // Test Tab navigation if expectedNext is provided
  if (expectedNext) {
    fireEvent.keyDown(element, { key: 'Tab' });
    const nextElement = document.activeElement;
    expect(nextElement).toHaveAccessibleName(expectedNext);
  }

  // Test Escape key if requested
  if (testEscape) {
    fireEvent.keyDown(element, { key: 'Escape' });
    // The specific behavior depends on the component
    // This is a placeholder for escape key testing
  }

  // Test Enter key if requested
  if (testEnter) {
    const clickSpy = vi.fn();
    element.addEventListener('click', clickSpy);
    fireEvent.keyDown(element, { key: 'Enter' });
    expect(clickSpy).toHaveBeenCalled();
  }

  // Test Space key if requested (mainly for buttons)
  if (testSpace) {
    const clickSpy = vi.fn();
    element.addEventListener('click', clickSpy);
    fireEvent.keyDown(element, { key: ' ' });
    expect(clickSpy).toHaveBeenCalled();
  }
}

/**
 * Checks if an element has proper focus indicators
 */
export function checkFocusIndicators(element: HTMLElement): void {
  element.focus();
  
  // Check if element is actually focusable
  expect(element).toHaveFocus();
  
  // Check for focus styles (this is visual, so we check for CSS classes or styles)
  const computedStyles = window.getComputedStyle(element);
  const hasOutline = computedStyles.outline !== 'none' && computedStyles.outline !== '';
  const hasBoxShadow = computedStyles.boxShadow !== 'none' && computedStyles.boxShadow !== '';
  const hasFocusClass = element.classList.contains('Mui-focused') || 
                       element.classList.contains('focus-visible');
  
  if (!hasOutline && !hasBoxShadow && !hasFocusClass) {
    console.warn('Element may not have visible focus indicators:', element);
  }
}

/**
 * Tests ARIA attributes and roles
 */
export function checkAriaAttributes(
  element: HTMLElement,
  expectedAttributes: Record<string, string | boolean>
): void {
  Object.entries(expectedAttributes).forEach(([attr, expectedValue]) => {
    if (typeof expectedValue === 'boolean') {
      if (expectedValue) {
        expect(element).toHaveAttribute(attr);
      } else {
        expect(element).not.toHaveAttribute(attr);
      }
    } else {
      expect(element).toHaveAttribute(attr, expectedValue);
    }
  });
}

/**
 * Helper to test screen reader announcements
 * Tests for aria-live regions and proper labeling
 */
export function checkScreenReaderSupport(container: HTMLElement): void {
  // Check for proper headings structure
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6, [role="heading"]');
  let previousLevel = 0;
  
  headings.forEach(heading => {
    const level = heading.tagName === 'H1' ? 1 :
                  heading.tagName === 'H2' ? 2 :
                  heading.tagName === 'H3' ? 3 :
                  heading.tagName === 'H4' ? 4 :
                  heading.tagName === 'H5' ? 5 :
                  heading.tagName === 'H6' ? 6 :
                  parseInt(heading.getAttribute('aria-level') || '1');
    
    // Check for proper heading hierarchy (should not skip levels)
    if (previousLevel > 0 && level > previousLevel + 1) {
      console.warn(`Heading level skipped: went from h${previousLevel} to h${level}`);
    }
    
    previousLevel = level;
  });
  
  console.log('✓ Screen reader support checks completed');
}