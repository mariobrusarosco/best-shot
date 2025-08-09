# Frontend Component Testing Plan

## Table of Contents

- [Overview](#overview)
- [Current State Analysis](#current-state-analysis)
- [Testing Strategy](#testing-strategy)
- [Implementation Phases](#implementation-phases)
- [Testing Categories](#testing-categories)
- [Component Testing Matrix](#component-testing-matrix)
- [Testing Utilities & Setup](#testing-utilities--setup)
- [Testing Patterns](#testing-patterns)
- [Success Metrics](#success-metrics)
- [Implementation Timeline](#implementation-timeline)
- [Next Steps](#next-steps)

---

## Overview

This document outlines a comprehensive testing strategy for the Best Shot frontend components. The plan focuses on implementing unit and integration tests for our React-based UI system using Vitest and React Testing Library.

### Goals

- **Quality Assurance**: Ensure all components work reliably across different scenarios
- **Regression Prevention**: Catch breaking changes before they reach production
- **Documentation**: Tests serve as living documentation of component behavior
- **Confidence**: Enable safe refactoring and feature development
- **Accessibility**: Ensure compliance with WCAG 2.1 AA standards

---

## Current State Analysis

### ✅ Existing Infrastructure

- **Testing Framework**: Vitest configured with jsdom environment
- **Testing Library**: React Testing Library with jest-dom matchers
- **TypeScript**: Full TypeScript support for type-safe testing
- **Coverage**: Vitest coverage with v8 provider
- **CI/CD**: Ready for test integration in GitHub Actions

### 📊 Component Inventory

**UI System Components (25+ components)**:
- Base components: AppButton, AppCard, AppTextField, AppSelect, AppCheckbox
- Layout components: AppContainer, AppBox, Surface, Grid
- Form components: FormInput, FormSelect, FormCheckbox, FormFieldArray
- Utility components: Icon, Pill, Skeleton, Counter

**Domain Components (13 domains)**:
- Authentication, Dashboard, Tournament, League, Match, Member, Guess, etc.

### ❌ Current Gaps

- **Zero Test Coverage**: No existing unit or integration tests
- **Testing Utilities**: Missing custom render functions and test helpers
- **Mock Factories**: No standardized data mocking patterns
- **Accessibility Testing**: No systematic a11y testing approach

---

## Testing Strategy

### Testing Pyramid Distribution

```
                    /\
                   /  \
                  / E2E \     (5% - Already planned with Playwright)
                 /------\
                /        \
               / Integration \   (25% - Component interactions)
              /-------------\
             /               \
            /    Unit Tests   \    (70% - Individual components)
           /-----------------\
```

### Test Types

**1. Unit Tests (70% of effort)**
- Individual component rendering
- Props validation and handling
- State management and updates
- Event handling and callbacks
- Error states and edge cases

**2. Integration Tests (25% of effort)**
- Component interactions and workflows
- Form submission flows
- Context provider integration
- Route-based component testing

**3. Accessibility Tests (Built into all tests)**
- ARIA compliance
- Keyboard navigation
- Screen reader compatibility
- Focus management

---

## Implementation Phases

### Phase 1: Foundation (Week 1) 🔨

**Priority: Critical**

#### Testing Utilities Setup
- Custom render function with theme providers
- Mock factories for common data structures
- Test helpers for form interactions
- Accessibility testing utilities

#### Base Component Testing
- **AppButton**: Loading states, variants, click handling
- **AppCard**: Layout variations, content rendering
- **AppTextField**: Validation, error states, user input
- **AppSelect**: Options handling, async loading
- **AppCheckbox**: Controlled/uncontrolled states

**Deliverables:**
- `src/test-utils/` directory with testing utilities
- Unit tests for 5 core base components
- Testing patterns documentation

### Phase 2: Form Components (Week 2) 📝

**Priority: High**

#### Form Component Testing
- **FormInput**: Field validation, error display
- **FormSelect**: Option selection, validation
- **FormCheckbox**: Boolean state management
- **FormFieldArray**: Dynamic field management
- **FormScoreInput**: Numeric input validation

#### Integration Testing
- Complete form submission workflows
- Multi-field validation scenarios
- Form state management integration

**Deliverables:**
- Unit tests for all form components
- Integration tests for form workflows
- Form testing utilities and patterns

### Phase 3: Domain Components (Week 3-4) 🏆

**Priority: Medium-High**

#### Tournament Domain
- Tournament cards and listings
- Performance statistics display
- Tournament creation forms
- Real-time updates handling

#### League Domain
- League management interfaces
- Participant handling components
- League customization forms
- Settings management

#### Match Domain
- Match cards with scoring
- Guess functionality
- Match status updates
- Score input validation

**Deliverables:**
- Unit tests for critical domain components
- Integration tests for key user workflows
- Domain-specific testing utilities

### Phase 4: Advanced Testing (Week 5) 🚀

**Priority: Medium**

#### Complex Interactions
- Multi-component workflows
- State synchronization testing
- Route-based component testing
- Context provider interactions

#### Performance Testing
- Component rendering performance
- Large list handling
- Memory leak detection
- Bundle size impact analysis

**Deliverables:**
- Integration tests for complex workflows
- Performance test suite
- Visual regression test setup

---

## Testing Categories

### Unit Tests

```typescript
// Component Rendering Tests
✓ Renders with default props
✓ Renders with custom props
✓ Handles missing optional props
✓ Applies correct CSS classes

// User Interaction Tests
✓ Handles click events
✓ Processes keyboard input
✓ Manages focus states
✓ Triggers callbacks correctly

// State Management Tests
✓ Updates internal state
✓ Responds to prop changes
✓ Maintains state consistency
✓ Handles state errors

// Edge Cases
✓ Handles empty/null data
✓ Manages loading states
✓ Displays error states
✓ Graceful degradation
```

### Integration Tests

```typescript
// Form Workflows
✓ Complete form submission
✓ Multi-step form navigation
✓ Form validation flows
✓ Error recovery scenarios

// Component Interactions
✓ Parent-child communication
✓ Sibling component coordination
✓ Context provider integration
✓ Route-based interactions

// Data Flow Testing
✓ API integration scenarios
✓ State management flows
✓ Real-time update handling
✓ Cache invalidation
```

### Accessibility Tests

```typescript
// ARIA Compliance
✓ Proper ARIA labels
✓ Role assignments
✓ State announcements
✓ Live region updates

// Keyboard Navigation
✓ Tab order correctness
✓ Keyboard shortcuts
✓ Focus management
✓ Escape handling

// Screen Reader Support
✓ Descriptive text content
✓ Form label associations
✓ Error announcements
✓ Status updates
```

---

## Component Testing Matrix

### Base UI Components

| Component | Unit Tests | Integration Tests | Accessibility | Priority |
|-----------|------------|------------------|---------------|----------|
| AppButton | ✓ Variants, loading, clicks | ✓ Form submission | ✓ Focus, ARIA | High |
| AppCard | ✓ Layout, content rendering | ✓ Card interactions | ✓ Keyboard nav | High |
| AppTextField | ✓ Validation, error states | ✓ Form integration | ✓ Screen reader | High |
| AppSelect | ✓ Options, async loading | ✓ Form submission | ✓ Keyboard select | High |
| AppCheckbox | ✓ State management | ✓ Form validation | ✓ Label association | Medium |
| AppContainer | ✓ Layout variations | ✓ Content wrapping | ✓ Semantic structure | Medium |
| AppBox | ✓ Styling props | ✓ Layout composition | ✓ DOM structure | Low |
| Surface | ✓ Elevation, theming | ✓ Content placement | ✓ Visual hierarchy | Low |
| AppIcon | ✓ Icon rendering | ✓ Icon usage contexts | ✓ Alt text, roles | Medium |
| Pill | ✓ Content display | ✓ Status indication | ✓ Color accessibility | Low |

### Form Components

| Component | Unit Tests | Integration Tests | Accessibility | Priority |
|-----------|------------|------------------|---------------|----------|
| FormInput | ✓ Validation, errors | ✓ Form submission | ✓ Label association | High |
| FormSelect | ✓ Option handling | ✓ Dynamic options | ✓ Keyboard navigation | High |
| FormCheckbox | ✓ Boolean states | ✓ Form validation | ✓ State announcement | Medium |
| FormFieldArray | ✓ Dynamic fields | ✓ Complex forms | ✓ Field management | High |
| FormScoreInput | ✓ Numeric validation | ✓ Score submission | ✓ Input constraints | Medium |

### Domain Components

| Domain | Key Components | Test Focus | Priority |
|--------|----------------|------------|----------|
| Tournament | Cards, Stats, Forms | Data display, metrics | High |
| League | Management, Participants | CRUD operations, UI | High |
| Match | Cards, Scoring, Guesses | Real-time updates | High |
| Authentication | Login, Bypass | Auth flows, errors | Medium |
| Dashboard | Performance, Cards | Data visualization | Medium |
| Member | Profile, Settings | User management | Medium |
| Guess | Prediction, Validation | Form workflows | Medium |

---

## Testing Utilities & Setup

### Custom Render Function

```typescript
// src/test-utils/render.tsx
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from '@/theming/theme';

interface CustomRenderOptions extends RenderOptions {
  queryClient?: QueryClient;
  themeOverrides?: object;
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) {
  const { queryClient = new QueryClient(), themeOverrides, ...renderOptions } = options;
  
  const customTheme = themeOverrides ? { ...theme, ...themeOverrides } : theme;
  
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={customTheme}>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
}
```

### Mock Factories

```typescript
// src/test-utils/factories.ts
export const createMockTournament = (overrides = {}) => ({
  id: 'tournament-1',
  name: 'Test Tournament',
  status: 'active',
  participantCount: 10,
  startDate: new Date(),
  ...overrides,
});

export const createMockUser = (overrides = {}) => ({
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'participant',
  ...overrides,
});

export const createMockMatch = (overrides = {}) => ({
  id: 'match-1',
  homeTeam: 'Team A',
  awayTeam: 'Team B',
  status: 'upcoming',
  date: new Date(),
  ...overrides,
});
```

### Accessibility Testing Helpers

```typescript
// src/test-utils/accessibility.ts
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

export const checkA11y = async (container: HTMLElement) => {
  const results = await axe(container);
  expect(results).toHaveNoViolations();
};

export const checkKeyboardNavigation = (element: HTMLElement) => {
  // Tab navigation testing utilities
  element.focus();
  expect(element).toHaveFocus();
  
  // Simulate tab key
  fireEvent.keyDown(element, { key: 'Tab' });
  // Add assertions for next focused element
};
```

---

## Testing Patterns

### Component Test Structure

```typescript
// src/domains/ui-system/components/app-button/__tests__/app-button.test.tsx
import { renderWithProviders } from '@/test-utils';
import { AppButton } from '../app-button';
import { fireEvent, screen } from '@testing-library/react';

describe('AppButton', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      renderWithProviders(<AppButton>Click me</AppButton>);
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('applies variant styles correctly', () => {
      renderWithProviders(<AppButton variant="contained">Button</AppButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('MuiButton-contained');
    });

    it('shows loading state', () => {
      renderWithProviders(<AppButton loading>Loading Button</AppButton>);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('User Interactions', () => {
    it('handles click events', () => {
      const handleClick = jest.fn();
      renderWithProviders(<AppButton onClick={handleClick}>Click me</AppButton>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('prevents clicks when loading', () => {
      const handleClick = jest.fn();
      renderWithProviders(
        <AppButton loading onClick={handleClick}>Loading</AppButton>
      );
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper focus management', () => {
      renderWithProviders(<AppButton>Accessible Button</AppButton>);
      const button = screen.getByRole('button');
      
      button.focus();
      expect(button).toHaveFocus();
      expect(button).toHaveAttribute('aria-label');
    });

    it('meets accessibility standards', async () => {
      const { container } = renderWithProviders(<AppButton>Test</AppButton>);
      await checkA11y(container);
    });
  });
});
```

### Form Component Testing Pattern

```typescript
// src/domains/ui-system/components/form/__tests__/form-input.test.tsx
describe('FormInput', () => {
  const mockControl = {
    register: jest.fn(),
    formState: { errors: {} },
    getValues: jest.fn(),
  };

  describe('Validation', () => {
    it('displays error messages', () => {
      const controlWithErrors = {
        ...mockControl,
        formState: { errors: { testField: { message: 'Required field' } } },
      };

      renderWithProviders(
        <FormInput 
          control={controlWithErrors} 
          name="testField" 
          label="Test Field" 
        />
      );

      expect(screen.getByText('Required field')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('validates input format', async () => {
      const { user } = renderWithProviders(
        <FormInput 
          control={mockControl} 
          name="email" 
          type="email" 
          label="Email" 
        />
      );

      const input = screen.getByLabelText('Email');
      await user.type(input, 'invalid-email');
      
      // Trigger validation
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      });
    });
  });

  describe('User Experience', () => {
    it('provides loading states during async validation', async () => {
      // Test async validation loading states
    });

    it('maintains focus after validation', () => {
      // Test focus management during validation
    });
  });
});
```

### Integration Test Pattern

```typescript
// src/domains/tournament/__tests__/tournament-creation-flow.test.tsx
describe('Tournament Creation Flow', () => {
  it('completes full tournament creation workflow', async () => {
    const { user } = renderWithProviders(<TournamentCreationForm />);

    // Fill in tournament details
    await user.type(screen.getByLabelText('Tournament Name'), 'Test Tournament');
    await user.selectOptions(screen.getByLabelText('Sport'), 'football');
    await user.click(screen.getByLabelText('Public Tournament'));

    // Add participants
    await user.click(screen.getByRole('button', { name: 'Add Participant' }));
    await user.type(screen.getByLabelText('Participant Email'), 'user@example.com');

    // Submit form
    await user.click(screen.getByRole('button', { name: 'Create Tournament' }));

    // Verify success
    await waitFor(() => {
      expect(screen.getByText('Tournament created successfully')).toBeInTheDocument();
    });
  });

  it('handles form validation errors gracefully', async () => {
    // Test error scenarios and recovery
  });
});
```

---

## Success Metrics

### Coverage Targets

- **Unit Test Coverage**: 85% minimum
- **Integration Test Coverage**: 70% of critical user flows
- **Accessibility Compliance**: 100% WCAG 2.1 AA compliance
- **Performance**: All tests complete in under 30 seconds

### Quality Indicators

- **Zero Flaky Tests**: All tests must be deterministic and reliable
- **Clear Error Messages**: Test failures provide actionable debugging information
- **Fast Feedback**: Tests run quickly in development and CI/CD
- **Maintainable**: Tests are easy to update as components evolve

### Testing KPIs

| Metric | Target | Current | Status |
|--------|--------|---------|---------|
| Unit Test Coverage | 85% | 0% | 🔴 |
| Integration Test Coverage | 70% | 0% | 🔴 |
| Accessibility Violations | 0 | Unknown | 🔴 |
| Test Execution Time | <30s | N/A | 🔴 |
| Test Reliability | 100% | N/A | 🔴 |

---

## Implementation Timeline

### Week 1: Foundation
- **Days 1-2**: Set up testing utilities and helpers
- **Days 3-5**: Implement base component tests (AppButton, AppCard, AppTextField)

### Week 2: Forms & Core Components
- **Days 1-3**: Complete remaining base component tests
- **Days 4-5**: Implement form component tests and integration tests

### Week 3: Domain Components (Part 1)
- **Days 1-2**: Tournament domain component tests
- **Days 3-4**: League domain component tests
- **Day 5**: Match domain component tests

### Week 4: Domain Components (Part 2)
- **Days 1-2**: Authentication and member domain tests
- **Days 3-4**: Dashboard and guess domain tests
- **Day 5**: Buffer for completion and documentation

### Week 5: Advanced Testing
- **Days 1-2**: Complex integration tests
- **Days 3-4**: Performance and visual regression tests
- **Day 5**: Test optimization and documentation

---

## Next Steps

### Immediate Actions (This Week)

1. **Create Testing Utilities**
   - Set up custom render function with providers
   - Create mock factories for common data structures
   - Implement accessibility testing helpers

2. **Start with Core Components**
   - Begin with AppButton component testing
   - Establish testing patterns and conventions
   - Document testing approach for team

3. **Set Up CI Integration**
   - Configure test coverage reporting
   - Add test requirements to PR checks
   - Set up automated accessibility testing

### Medium-term Goals (Next Month)

1. **Complete Base Component Coverage**
   - Achieve 85% test coverage for UI system components
   - Implement all form component tests
   - Establish integration testing patterns

2. **Domain Component Testing**
   - Prioritize high-value domain components
   - Focus on user-critical workflows
   - Implement complex interaction testing

3. **Quality Assurance**
   - Regular accessibility audits
   - Performance testing integration
   - Test maintenance and optimization

### Long-term Vision (Next Quarter)

1. **Advanced Testing Capabilities**
   - Visual regression testing
   - Cross-browser testing integration
   - Performance benchmarking

2. **Developer Experience**
   - Test-driven development workflows
   - Automated test generation tools
   - Comprehensive testing documentation

3. **Quality Culture**
   - Testing best practices training
   - Code review processes including test quality
   - Continuous improvement of testing strategies

---

## Resources

### Documentation
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Tools
- [Axe Accessibility Testing](https://github.com/dequelabs/axe-core)
- [MSW for API Mocking](https://mswjs.io/)
- [Storybook for Component Testing](https://storybook.js.org/)

### Team Resources
- Testing patterns documentation (to be created)
- Component testing examples (to be created)
- Accessibility testing guide (to be created)

---

*This testing plan is a living document that should be updated as the codebase evolves and new testing requirements emerge.*