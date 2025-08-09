/**
 * Custom Render Function with Providers
 * 
 * Provides a standardized way to render components with all necessary providers
 * for testing. This ensures consistent test environment setup across all tests.
 */

import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactElement, ReactNode } from 'react';
import { theme } from '@/domains/ui-system/theme';

// Extend render options to include our custom providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  /**
   * Custom QueryClient instance for testing
   * Defaults to a new QueryClient with disabled retries and caching
   */
  queryClient?: QueryClient;
  
  /**
   * Theme overrides for testing specific theme scenarios
   */
  themeOverrides?: object;
  
  /**
   * Additional wrapper components (will be composed with our providers)
   */
  wrapper?: ({ children }: { children: ReactNode }) => ReactElement;
}

/**
 * Creates a QueryClient optimized for testing
 * - Disables retries to make tests predictable
 * - Disables caching to prevent test interference
 * - Reduces default timeouts for faster tests
 */
function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0, // Disable caching
        staleTime: 0, // Always consider data stale
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * Custom render function that wraps components with necessary providers
 * 
 * @example
 * ```tsx
 * import { renderWithProviders } from '@/test-utils';
 * 
 * test('renders component correctly', () => {
 *   renderWithProviders(<MyComponent />);
 *   expect(screen.getByText('Hello World')).toBeInTheDocument();
 * });
 * 
 * // With custom theme
 * test('renders with dark theme', () => {
 *   renderWithProviders(<MyComponent />, {
 *     themeOverrides: { palette: { mode: 'dark' } }
 *   });
 * });
 * ```
 */
export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const {
    queryClient = createTestQueryClient(),
    themeOverrides,
    wrapper: CustomWrapper,
    ...renderOptions
  } = options;

  // Merge theme overrides with base theme
  const testTheme = themeOverrides ? { ...theme, ...themeOverrides } : theme;

  // Create the provider wrapper
  function AllProviders({ children }: { children: ReactNode }) {
    const content = (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={testTheme}>
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    );

    // If custom wrapper provided, compose it with our providers
    if (CustomWrapper) {
      return <CustomWrapper>{content}</CustomWrapper>;
    }

    return content;
  }

  // Render with providers and return enhanced result
  const result = render(ui, {
    wrapper: AllProviders,
    ...renderOptions,
  });

  return {
    ...result,
    // Expose the QueryClient for test-specific operations
    queryClient,
    // Helper to rerender with the same providers
    rerender: (newUi: ReactElement) =>
      result.rerender(newUi),
  };
}

/**
 * Simplified render function for components that don't need providers
 * Use this for simple components that don't use theme or queries
 */
export function renderSimple(ui: ReactElement, options?: RenderOptions) {
  return render(ui, options);
}