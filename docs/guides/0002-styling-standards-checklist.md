# Guide 0002: Styling Standards & Decision Checklist

## Overview

This guide provides practical standards and decision frameworks for implementing our 2-pattern MUI styling architecture consistently across the Best Shot codebase.

## 🎯 Quick Decision Checklist

### Before Creating Any Styled Component:

#### Step 1: Pattern Selection
```
□ Is this component reusable across 2+ domains?
  ✅ YES → Use Static Styled Components Pattern
  ❌ NO → Go to Step 2

□ Is this a one-off style, layout, or spacing adjustment?
  ✅ YES → Use Dynamic sx Prop Pattern  
  ❌ NO → Consider if component is needed
```

#### Step 2: Implementation Standards
```
□ Using theme tokens instead of hardcoded values?
□ Following responsive patterns (mobile-first)?
□ Accessibility considerations addressed?
□ Performance pattern followed (static vs dynamic)?
□ Component documented with usage examples?
```

## 📋 Pattern Implementation Standards

### Static Styled Components Pattern

**When to Use:**
- Reusable components across domains
- Base UI system components  
- Domain-specific component variations
- Components needing performance optimization

**Implementation Checklist:**
```tsx
// ✅ DO: Define outside render function
const StyledComponent = styled(BaseComponent)(({ theme }) => ({
  // Use theme tokens
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(2),
  
  // Responsive patterns
  [theme.breakpoints.down('tablet')]: {
    padding: theme.spacing(1),
  },
  
  // Interactive states
  '&:hover': {
    transform: 'translateY(-1px)',
    transition: theme.transitions.create(['transform']),
  },
}));

// ❌ DON'T: Create in render function
function Component() {
  const StyledComponent = styled(Button)(() => ({ ... })); // Re-created every render!
  return <StyledComponent />;
}
```

**Standards:**
- [ ] Use `theme.palette.*` for colors (never hardcoded hex)
- [ ] Use `theme.spacing()` for all spacing values  
- [ ] Use `theme.breakpoints.*` for responsive design
- [ ] Use `theme.transitions.create()` for animations
- [ ] Include hover/focus states for interactive elements
- [ ] Add comprehensive JSDoc documentation

### Dynamic sx Prop Pattern

**When to Use:**
- Layout containers (flex, grid)
- One-off component customizations
- Spacing and positioning
- Responsive value adjustments
- Quick prototyping

**Implementation Checklist:**
```tsx
// ✅ DO: Responsive values with breakpoint objects
<Box sx={{
  display: 'flex',
  gap: { mobile: 2, tablet: 3, desktop: 4 },
  p: { mobile: 2, tablet: 3 },
  gridTemplateColumns: {
    mobile: '1fr',
    tablet: 'repeat(2, 1fr)',
    desktop: 'repeat(3, 1fr)',
  },
}} />

// ✅ DO: Static objects for reusable styles
const layoutStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
};

<Box sx={layoutStyles} />

// ❌ DON'T: Hardcoded values
<Box sx={{ padding: '16px', color: '#6A9B96' }} /> // Use theme tokens!

// ❌ DON'T: Dynamic values in sx prop  
<Box sx={{ opacity: isVisible ? 1 : 0.5 }} /> // Use style prop for dynamic values
```

**Standards:**
- [ ] Use responsive object syntax: `{ mobile: value, tablet: value }`
- [ ] Use theme token strings: `'primary.main'`, `'spacing.2'`
- [ ] Static objects for reusable sx styles
- [ ] Dynamic values in `style` prop, not `sx`
- [ ] Mobile-first responsive approach

## 🎨 Theme Token Usage Standards

### Color Usage
```tsx
// ✅ DO: Use semantic theme colors
backgroundColor: theme.palette.primary.main,
color: theme.palette.primary.contrastText,
borderColor: theme.palette.divider,

// ✅ DO: Use custom design system colors  
backgroundColor: theme.palette.black[800],
color: theme.palette.neutral[100],

// ❌ DON'T: Hardcode colors
backgroundColor: '#6A9B96', // Use theme.palette.primary.main
color: '#ffffff', // Use theme.palette.primary.contrastText
```

### Spacing Usage
```tsx
// ✅ DO: Use theme spacing function
padding: theme.spacing(2), // 16px
margin: theme.spacing(1, 2), // 8px 16px
gap: theme.spacing(3), // 24px

// ✅ DO: Use spacing tokens in sx prop
sx={{ p: 2, m: { mobile: 1, tablet: 2 } }}

// ❌ DON'T: Hardcode spacing
padding: '16px', // Use theme.spacing(2)
margin: '8px 16px', // Use theme.spacing(1, 2)
```

### Typography Usage
```tsx
// ✅ DO: Use theme typography
fontSize: theme.typography.h1.fontSize,
fontWeight: theme.typography.fontWeightMedium,

// ✅ DO: Use Typography component variants
<Typography variant="h1">Title</Typography>
<Typography variant="body1">Content</Typography>

// ❌ DON'T: Custom font sizing without theme
fontSize: '2rem', // Use theme.typography.h1.fontSize
fontWeight: 500, // Use theme.typography.fontWeightMedium
```

## 🔧 Component Creation Templates

### Static Styled Component Template
```tsx
/**
 * ComponentName - Description
 * 
 * Follows Static Styled Components pattern for reusable, performant components.
 * 
 * @example
 * ```tsx
 * <ComponentName variant="primary" onClick={handleClick}>
 *   Content
 * </ComponentName>
 * ```
 */

import { ComponentProps as MuiComponentProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { forwardRef } from 'react';

export interface ComponentNameProps extends Omit<MuiComponentProps, 'variant'> {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}

// ===== STYLED COMPONENTS (Following Static Styled Components Pattern) =====

const StyledComponent = styled(MuiComponent)<ComponentNameProps>(({ theme, variant, loading }) => ({
  // Base styles with theme integration
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  
  // Variant styles
  ...(variant === 'primary' && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  }),
  
  // State styles  
  ...(loading && {
    opacity: 0.7,
    pointerEvents: 'none',
  }),
  
  // Interactive styles
  '&:hover': {
    transform: 'translateY(-1px)',
    transition: theme.transitions.create(['transform']),
  },
  
  // Responsive styles
  [theme.breakpoints.down('tablet')]: {
    padding: theme.spacing(1),
  },
}));

export const ComponentName = forwardRef<HTMLElement, ComponentNameProps>(
  ({ variant = 'primary', loading = false, ...props }, ref) => {
    return (
      <StyledComponent
        ref={ref}
        variant={variant}
        loading={loading}
        {...props}
      />
    );
  }
);

ComponentName.displayName = 'ComponentName';
```

### Dynamic sx Prop Usage Template
```tsx
/**
 * Layout Component using sx Prop Pattern
 */

import { Box } from '@mui/system';

// ✅ Static styles object for reusability
const containerStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

export const LayoutComponent = ({ children }) => {
  return (
    <Box sx={{
      ...containerStyles,
      // Responsive values
      p: { mobile: 2, tablet: 3, desktop: 4 },
      gridTemplateColumns: {
        mobile: '1fr',
        tablet: 'repeat(2, 1fr)',
        desktop: 'repeat(3, 1fr)',
      },
    }}>
      {children}
    </Box>
  );
};
```

## 📁 File Organization Standards

### Component File Structure
```
src/domains/{domain}/components/{component-name}/
├── ComponentName.tsx          # Main component (Static Styled)
├── index.ts                   # Exports and re-exports  
└── ComponentName.test.tsx     # Tests (when needed)

# For UI System components:
src/domains/ui-system/components/{component-name}/
├── ComponentName.tsx          # Enhanced base component
├── index.ts                   # Clean exports
└── ComponentName.stories.tsx  # Storybook stories (future)
```

### Import Organization
```tsx
// ✅ DO: Organize imports logically
// 1. React and external libraries
import { forwardRef } from 'react';
import { styled } from '@mui/material/styles';
import { Button as MuiButton } from '@mui/material';

// 2. Internal utilities and theme
import { theme } from '@/theming/theme';

// 3. Local components and assets
import { AppIcon } from '../icon/icon';
```

## ✅ Code Review Checklist

### For Every Component:
- [ ] **Pattern Decision**: Correctly chosen Static Styled vs Dynamic sx pattern
- [ ] **Theme Integration**: No hardcoded colors, spacing, or typography values
- [ ] **Responsive Design**: Mobile-first approach with appropriate breakpoints
- [ ] **Accessibility**: Focus states, ARIA attributes where needed
- [ ] **Performance**: No inline styled() creation, optimized sx usage
- [ ] **TypeScript**: Proper interfaces extending MUI types correctly
- [ ] **Documentation**: Clear JSDoc with usage examples

### For Static Styled Components:
- [ ] **Component Definition**: Defined outside render functions
- [ ] **Props Interface**: Extends appropriate MUI props with custom variants
- [ ] **Theme Usage**: Consistent use of theme tokens throughout
- [ ] **Interactive States**: Hover, focus, disabled states implemented
- [ ] **Responsive Behavior**: Appropriate breakpoint usage
- [ ] **Forward Ref**: Properly forwarded for component composition

### For Dynamic sx Prop Usage:
- [ ] **Appropriate Usage**: Used for layout, spacing, one-off styles only
- [ ] **Static Objects**: Reusable sx styles extracted to static objects  
- [ ] **Responsive Values**: Object syntax for breakpoint-specific values
- [ ] **Performance**: Dynamic values use `style` prop, not `sx`
- [ ] **Theme Tokens**: String-based theme token access

## 🚀 Migration Guidelines

### Migrating Existing Components:

1. **Identify Current Pattern**
   - Separate `.styles.tsx` files → Consolidate into main component
   - Inline styles → Convert to appropriate pattern
   - Mixed patterns → Standardize to single pattern

2. **Choose Target Pattern**
   - Reusable across domains → Static Styled Components
   - Layout/spacing only → Dynamic sx Prop
   - One-off customization → Dynamic sx Prop

3. **Update Implementation**  
   - Replace hardcoded values with theme tokens
   - Add responsive behavior using breakpoints
   - Include interactive states and accessibility
   - Add proper TypeScript interfaces

4. **Test and Document**
   - Verify visual regression hasn't occurred
   - Update component documentation
   - Add usage examples

## 📏 Success Metrics

### Code Quality Indicators:
- [ ] Zero separate `.styles.tsx` files
- [ ] 100% theme token usage (no hardcoded values)
- [ ] Consistent pattern usage within domains
- [ ] All components pass TypeScript strict mode
- [ ] All components have proper documentation

### Performance Indicators:
- [ ] No styled() components created in render functions
- [ ] Appropriate usage of sx vs style props
- [ ] Bundle size remains stable
- [ ] Component render times optimized

### Team Adoption:
- [ ] New components follow established patterns
- [ ] Code reviews include styling pattern checks
- [ ] Team members confident in pattern selection
- [ ] Documentation referenced during development

This checklist ensures consistent, performant, and maintainable styling across the entire Best Shot application.