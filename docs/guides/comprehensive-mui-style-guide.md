# Comprehensive MUI Style Guide
*The definitive guide for React + MUI styling at Best Shot*

## 🎯 Philosophy & Objectives

### Core Principles
- **Token-driven consistency**: Every color, spacing, and breakpoint comes from the design system
- **Performance-first**: Optimize for bundle size, CSS-in-JS efficiency, and SSR
- **Accessibility by default**: Leverage MUI's built-in a11y with enhanced focus management
- **Clear authoring rules**: Eliminate decision paralysis with concrete `sx` vs `styled()` guidelines

### Why This Matters
Modern web applications need systematic approaches to styling that scale with team size and codebase complexity. Ad-hoc styling leads to:
- ❌ **Inconsistent UX**: Different spacing, colors, and behaviors across screens
- ❌ **Performance issues**: Duplicate CSS, runtime overhead, poor tree-shaking
- ❌ **Maintenance debt**: Hardcoded values, unclear component boundaries
- ❌ **Accessibility gaps**: Missing focus states, poor semantic structure

## 📦 Package Strategy & Architecture

### Package Usage Decision Tree
```
Need a component? 
├── Standard UI element (button, card, input)
│   └── @mui/material (complete, themed, accessible)
├── Layout & spacing needs
│   └── @mui/system (sx prop, responsive utilities)
└── Complete visual control needed
    └── @mui/base (headless primitives)
```

### Why This Package Strategy?
**@mui/material for 90% of UI**
- ✅ **Complete components**: Button, Card, TextField with full interaction states
- ✅ **Theme integration**: Automatically uses your design tokens
- ✅ **Accessibility built-in**: Focus management, ARIA attributes, keyboard navigation
- ✅ **Performance optimized**: Tree-shakeable, SSR-ready

**@mui/system for layout**
- ✅ **`sx` prop**: Responsive, token-aware styling for layout concerns
- ✅ **Utility functions**: spacing(), breakpoints.up(), palette access
- ✅ **Responsive patterns**: Breakpoint object syntax for mobile-first design

**@mui/base sparingly**
- ✅ **Headless control**: When you need 100% visual customization
- ⚠️ **More work required**: Manual accessibility, state management, styling

## 🎨 The `sx` vs `styled()` Decision Framework

### What is "Layout"?
**Layout = Structural positioning and spacing, not visual skin**

**Layout concerns (use `sx`):**
- Container structure: `display: grid`, `flexDirection: column`
- Spacing: `gap`, `padding`, `margin`
- Positioning: `position: relative`, `top: 0`, `zIndex: 10`
- Responsive behavior: `gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }`
- Size constraints: `width: '100%'`, `maxWidth: 'lg'`, `height: { xs: 200, md: 300 }`

**Visual skin concerns (use `styled()`):**
- Brand colors and theming: `backgroundColor: 'primary.main'`, `color: 'text.primary'`
- Visual decorations: `borderRadius`, `boxShadow`, `border`
- Component states: `:hover`, `:focus`, `:disabled`
- Transitions and animations: `transition: 'all 0.2s ease'`

### The Decision Tree

```
Is this styling...?
├── Positioning/spacing elements on a screen/page?
│   └── Use `sx` (layout concern)
├── Creating a reusable component with visual identity?
│   └── Use `styled()` (component concern)
├── Making a small local adjustment to existing component?
│   └── Use `sx` (override concern)
└── Adding interaction states (:hover, :focus)?
    └── Use `styled()` (behavior concern)
```

## 📋 Comprehensive Examples

### ✅ Layout with `sx` (Screen/Page Level)

**Dashboard Grid Layout**
```tsx
import { Box, Container } from '@mui/material';

export const DashboardScreen = () => (
  <Container 
    sx={{
      // Layout structure
      display: 'grid',
      gridTemplateColumns: { 
        xs: '1fr',                    // Mobile: single column
        md: '240px 1fr',              // Desktop: sidebar + main
        lg: '280px 1fr 300px'         // Large: sidebar + main + aside
      },
      gridTemplateRows: 'auto 1fr auto',
      gap: { xs: 2, md: 3, lg: 4 },  // Responsive spacing
      minHeight: '100vh',
      
      // Responsive padding
      p: { xs: 2, md: 3 },
      
      // Layout-specific background
      bgcolor: 'grey.50',
    }}
  >
    <Box sx={{ gridArea: 'sidebar' }}>
      <Navigation />
    </Box>
    
    <Box sx={{ 
      gridArea: 'main',
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      overflow: 'auto'
    }}>
      <MainContent />
    </Box>
    
    <Box sx={{ 
      gridArea: 'aside',
      display: { xs: 'none', lg: 'block' }  // Hide on smaller screens
    }}>
      <Sidebar />
    </Box>
  </Container>
);
```

**Why `sx` here?**
- 🎯 **Layout positioning**: Grid structure, responsive columns, spacing
- 🎯 **Screen-specific**: This layout is unique to the dashboard
- 🎯 **Responsive behavior**: Different layouts for different screen sizes
- 🎯 **One-off usage**: Not a reusable component pattern

### ✅ Reusable Component with `styled()`

**AppCard Design System Component**
```tsx
import { Card, CardProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface AppCardProps extends CardProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'interactive';
  size?: 'small' | 'medium' | 'large';
}

export const AppCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'variant' && prop !== 'size',
})<AppCardProps>(({ theme, variant = 'default', size = 'medium' }) => ({
  // Base styles - visual identity
  borderRadius: theme.spacing(1.5),
  overflow: 'hidden',
  transition: theme.transitions.create(['box-shadow', 'transform'], {
    duration: theme.transitions.duration.short,
  }),
  
  // Size variants
  ...(size === 'small' && {
    padding: theme.spacing(2),
  }),
  ...(size === 'medium' && {
    padding: theme.spacing(3),
  }),
  ...(size === 'large' && {
    padding: theme.spacing(4),
  }),
  
  // Visual variants
  ...(variant === 'default' && {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
  }),
  
  ...(variant === 'elevated' && {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[4],
  }),
  
  ...(variant === 'outlined' && {
    backgroundColor: 'transparent',
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: 'none',
  }),
  
  ...(variant === 'interactive' && {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    cursor: 'pointer',
    
    '&:hover': {
      boxShadow: theme.shadows[6],
      transform: 'translateY(-2px)',
    },
    
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: '2px',
    },
    
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: theme.shadows[3],
    },
  }),
  
  // Responsive adjustments
  [theme.breakpoints.down('md')]: {
    ...(size === 'large' && {
      padding: theme.spacing(3), // Reduce padding on mobile
    }),
  },
}));
```

**Why `styled()` here?**
- 🎯 **Reusable component**: Used across multiple screens and contexts
- 🎯 **Visual identity**: Defines the brand appearance of cards
- 🎯 **Interaction states**: Hover, focus, active behaviors
- 🎯 **Variants system**: Multiple visual configurations
- 🎯 **Design system**: Part of the component library

### ✅ Local Override with `sx`

**Adjusting Component for Specific Context**
```tsx
import { AppCard } from '@/components/ui-system';

export const ProfileSection = () => (
  <AppCard 
    variant="elevated"
    size="medium"
    sx={{
      // Context-specific layout adjustments
      maxWidth: 400,              // Size constraint for this usage
      mx: 'auto',                 // Center in parent container
      mt: 4,                      // Specific top margin
      
      // Context-specific visual override
      bgcolor: 'primary.50',      // Special background for profile
      
      // Responsive adjustment for this context
      width: { xs: '100%', md: 400 },
    }}
  >
    <ProfileContent />
  </AppCard>
);
```

**Why `sx` for overrides?**
- 🎯 **Context-specific**: Only needed in this particular usage
- 🎯 **Layout adjustment**: Positioning and sizing for this context
- 🎯 **Non-reusable**: Won't be used exactly this way elsewhere

## 🚫 Anti-Patterns & Why They're Problematic

### ❌ DON'T: Create `styled()` Components Inside Render

**The Problem**
```tsx
// ❌ BAD: Component created inside render
function ProductCard({ product, emphasis = false }) {
  // This creates a new component on every render!
  const StyledCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(emphasis ? 3 : 2),
    backgroundColor: emphasis ? theme.palette.primary.light : 'transparent',
  }));
  
  return <StyledCard>{product.name}</StyledCard>;
}
```

**Why This Is Bad:**
1. **Component Identity Churn**
   - React sees a new component type on every render
   - Causes unmount/mount cycles instead of updates
   - Breaks React.memo, refs, component state, and focus

2. **CSS Performance Issues**
   - New CSS classes generated and injected every render
   - Increases memory usage and CPU overhead
   - Can cause visual flicker as styles are applied

3. **SSR/Hydration Problems**
   - Class names are unstable between server and client
   - Larger HTML payload with duplicate styles
   - Hydration mismatches and extra work

4. **Development Experience**
   - DevTools show confusing component trees
   - Hot reload becomes unreliable
   - Harder to debug and test

**✅ GOOD: Solutions**

**Option 1: Static styled component with `sx` for dynamics**
```tsx
// ✅ Static component definition
const ProductCardBase = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  transition: theme.transitions.create(['background-color', 'padding']),
}));

function ProductCard({ product, emphasis = false }) {
  return (
    <ProductCardBase 
      sx={{
        p: emphasis ? 3 : 2,                      // Dynamic padding
        bgcolor: emphasis ? 'primary.light' : 'transparent',  // Dynamic background
      }}
    >
      {product.name}
    </ProductCardBase>
  );
}
```

**Option 2: Styled component with props**
```tsx
// ✅ Static component with prop-based styling
const ProductCardStyled = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'emphasis',
})<{ emphasis?: boolean }>(({ theme, emphasis }) => ({
  padding: theme.spacing(emphasis ? 3 : 2),
  backgroundColor: emphasis ? theme.palette.primary.light : 'transparent',
  borderRadius: theme.spacing(1),
  transition: theme.transitions.create(['background-color', 'padding']),
}));

function ProductCard({ product, emphasis = false }) {
  return <ProductCardStyled emphasis={emphasis}>{product.name}</ProductCardStyled>;
}
```

### ❌ DON'T: Hardcode Values Instead of Using Tokens

**The Problem**
```tsx
// ❌ BAD: Hardcoded values
const BadCard = styled(Card)({
  padding: '24px',                    // Should use theme.spacing()
  backgroundColor: '#f5f5f5',         // Should use theme.palette
  borderRadius: '8px',                // Should use theme.shape or spacing
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',  // Should use theme.shadows
  
  '@media (max-width: 768px)': {      // Should use theme.breakpoints
    padding: '16px',
  },
});
```

**Why This Is Bad:**
- ❌ **Design inconsistency**: Values drift from design system
- ❌ **Hard to maintain**: Changes require finding/replacing hardcoded values
- ❌ **No dark mode**: Hardcoded colors don't adapt to theme changes
- ❌ **Poor responsive**: Hardcoded breakpoints don't match system

**✅ GOOD: Token-driven styling**
```tsx
// ✅ Token-driven with design system
const GoodCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),                    // 24px from 8px base
  backgroundColor: theme.palette.grey[50],      // System color
  borderRadius: theme.spacing(1),               // 8px from system
  boxShadow: theme.shadows[2],                  // System shadow
  
  [theme.breakpoints.down('md')]: {             // System breakpoint
    padding: theme.spacing(2),                  // 16px
  },
}));
```

## 📱 Responsive Design Patterns

### Breakpoint Object Syntax
```tsx
// ✅ Responsive spacing
<Box sx={{
  p: { xs: 2, sm: 3, md: 4, lg: 5 },          // Padding scales up
  gap: { xs: 1, md: 2 },                       // Gap increases on desktop
  gridTemplateColumns: { 
    xs: '1fr',                                  // Mobile: single column
    sm: 'repeat(2, 1fr)',                      // Tablet: 2 columns
    lg: 'repeat(3, 1fr)'                       // Desktop: 3 columns
  },
}} />

// ✅ Responsive styling in styled components
const ResponsiveCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
  },
  
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(6),
    '& .card-image': {
      width: '40%',
    },
  },
}));
```

### Conditional Rendering vs Responsive Styling
```tsx
// ✅ Use responsive styling for layout changes
<Box sx={{
  display: { xs: 'block', md: 'flex' },        // Layout change
  flexDirection: { md: 'row', lg: 'column' },  // Direction change
  gap: { xs: 2, md: 4 },                       // Spacing change
}} />

// ✅ Use useMediaQuery for conditional rendering
const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

return (
  <div>
    {isDesktop ? <DesktopNavigation /> : <MobileNavigation />}
    <MainContent />
  </div>
);
```

## 🎯 Component Promotion Path

### When to Extract and Promote Components

**1. Co-located Wrappers (Same File)**
```tsx
// ✅ Small, screen-specific wrappers stay in the same file
const HeaderWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
}));

export const DashboardScreen = () => (
  <div>
    <HeaderWrapper>
      <Logo />
      <UserMenu />
    </HeaderWrapper>
    <MainContent />
  </div>
);
```

**2. Adjacent Files (Complex but Screen-Specific)**
```tsx
// dashboard.styles.tsx - Complex wrappers in adjacent file
export const DashboardGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: theme.spacing(3),
  padding: theme.spacing(4),
  
  // Complex responsive behavior (>3 breakpoints)
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
    padding: theme.spacing(2),
    gap: theme.spacing(2),
  },
  
  [theme.breakpoints.between('sm', 'md')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
    padding: theme.spacing(3),
  },
  
  [theme.breakpoints.up('xl')]: {
    gridTemplateColumns: 'repeat(4, 1fr)',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  
  // Many nested selectors and states...
  '& .dashboard-card': {
    transition: theme.transitions.create(['transform', 'box-shadow']),
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[8],
    },
  },
}));

// dashboard.tsx - Import from adjacent file
import { DashboardGrid } from './dashboard.styles';

export const DashboardScreen = () => (
  <DashboardGrid>
    <DashboardCard />
    <DashboardCard />
  </DashboardGrid>
);
```

**3. Domain Components (Reused Within Domain)**
```tsx
// domains/dashboard/components/dashboard-card.tsx
export const DashboardCard = styled(Card)(({ theme }) => ({
  // Reused across multiple dashboard screens
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  // ... dashboard-specific styling
}));
```

**4. Design System (Reused Across Domains)**
```tsx
// domains/ui-system/components/app-card.tsx
export const AppCard = styled(Card)(({ theme }) => ({
  // Used across entire application
  borderRadius: theme.spacing(1),
  // ... universal card styling
}));
```

## ♿ Accessibility Best Practices

### Focus Management
```tsx
// ✅ Proper focus states for interactive components
const InteractiveCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: theme.transitions.create(['box-shadow', 'transform']),
  
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
  
  // Clear focus indicator
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '2px',
    transform: 'scale(1.02)',
  },
  
  // Remove default browser outline
  '&:focus': {
    outline: 'none',
  },
}));
```

### Semantic HTML and ARIA
```tsx
// ✅ Proper semantic structure
<Box 
  component="main"
  sx={{ p: 3 }}
  role="main"
  aria-labelledby="page-title"
>
  <Typography id="page-title" variant="h1" component="h1">
    Dashboard
  </Typography>
  
  <Box 
    component="section"
    sx={{ mt: 4 }}
    role="region"
    aria-labelledby="stats-heading"
  >
    <Typography id="stats-heading" variant="h2" component="h2">
      Statistics
    </Typography>
    {/* Content */}
  </Box>
</Box>
```

## 🚀 Performance Optimization

### Extract Large `sx` Objects
```tsx
// ❌ Recreated object on every render
<Box sx={{
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
  gap: { xs: 2, md: 4 },
  p: { xs: 2, md: 4 },
  bgcolor: 'background.default',
  borderRadius: 2,
  boxShadow: 2,
}} />

// ✅ Extract to constant
const gridStyles = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
  gap: { xs: 2, md: 4 },
  p: { xs: 2, md: 4 },
  bgcolor: 'background.default',
  borderRadius: 2,
  boxShadow: 2,
} as const;

<Box sx={gridStyles} />
```

### Component Memoization
```tsx
// ✅ Memoize components with stable styled definitions
const StatsCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
}));

const MemoizedStatsCard = memo(({ title, value, trend }) => (
  <StatsCard>
    <Typography variant="h6">{title}</Typography>
    <Typography variant="h3">{value}</Typography>
    <TrendIndicator trend={trend} />
  </StatsCard>
));
```

## 📏 Render Branching Best Practices

### Recommended Order: Loading → Error → Empty → Content
```tsx
export function UserDashboard() {
  const { data: user, isPending, error } = useUserQuery();
  const { data: stats, isPending: statsLoading } = useStatsQuery();
  
  // 1. Loading state first
  if (isPending || statsLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="rectangular" height={200} />
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Skeleton variant="rectangular" width="30%" height={100} />
          <Skeleton variant="rectangular" width="30%" height={100} />
          <Skeleton variant="rectangular" width="30%" height={100} />
        </Box>
      </Box>
    );
  }
  
  // 2. Error state second
  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ m: 3 }}
        action={
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        }
      >
        Failed to load dashboard data. Please try again.
      </Alert>
    );
  }
  
  // 3. Empty state third
  if (!user || !stats || stats.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        textAlign: 'center',
        p: 3 
      }}>
        <Typography variant="h5" gutterBottom>
          No data available
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Get started by adding some content to your dashboard.
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add Content
        </Button>
      </Box>
    );
  }
  
  // 4. Main content last
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Welcome back, {user.name}
      </Typography>
      
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        gap: 3,
        mb: 4
      }}>
        {stats.map((stat) => (
          <StatsCard key={stat.id} {...stat} />
        ))}
      </Box>
      
      <RecentActivity />
    </Box>
  );
}
```

## 🔧 Development Tools & Enforcement

### ESLint Rules (Recommended)
```json
{
  "rules": {
    "no-restricted-syntax": [
      "error",
      {
        "selector": "Literal[value=/#[0-9a-fA-F]{3,6}/]",
        "message": "Use theme colors instead of hardcoded hex values"
      }
    ],
    "no-magic-numbers": [
      "warn",
      {
        "ignore": [0, 1, 2, 3, 4, 5],
        "ignoreArrayIndexes": true
      }
    ]
  }
}
```

### Theme Token Linting
```tsx
// ✅ Prefer these patterns
theme.spacing(2)          // vs hardcoded '16px'
theme.palette.primary.main // vs '#1976d2'
theme.breakpoints.up('md') // vs '@media (min-width: 960px)'
theme.shadows[2]          // vs '0 2px 4px rgba(0,0,0,0.1)'
```

## 📋 Quick Reference Checklists

### 🆕 Creating a New Screen
- [ ] Use `sx` for layout (grid, flex, spacing, positioning)
- [ ] Keep layout wrappers co-located unless >80 lines or >3 breakpoints
- [ ] Import design system components (AppCard, AppButton, etc.)
- [ ] Use responsive breakpoint object syntax
- [ ] Add proper semantic HTML and ARIA labels
- [ ] Implement proper render branching: Loading → Error → Empty → Content

### 🧩 Creating a New Component
- [ ] Reusable across screens? → Use `styled()` and add to domain/ui-system
- [ ] One-off usage? → Use `sx` or co-located wrapper
- [ ] Add interaction states (hover, focus, active, disabled)
- [ ] Include focus-visible outline for accessibility
- [ ] Use theme tokens for all values
- [ ] Add TypeScript props interface with variants if applicable

### 🔍 Code Review Checklist
- [ ] No hardcoded colors, spacing, or breakpoints
- [ ] No `styled()` components created inside render functions
- [ ] Proper semantic HTML structure
- [ ] Focus management for interactive elements
- [ ] Responsive behavior using breakpoint objects
- [ ] Performance: large `sx` objects extracted to constants
- [ ] Consistent render branching pattern

## 📖 Migration Guide

### From Legacy CSS/SCSS
1. **Identify component boundaries**: What's reusable vs one-off?
2. **Extract design tokens**: Colors, spacing, breakpoints to theme
3. **Convert layouts**: CSS Grid/Flexbox → `sx` prop patterns
4. **Create styled components**: Reusable elements → `styled()` components
5. **Add responsive behavior**: Media queries → breakpoint objects

### From Other CSS-in-JS Libraries
1. **Theme migration**: Convert existing tokens to MUI theme structure
2. **Component conversion**: styled-components syntax → MUI `styled()`
3. **Responsive updates**: Custom breakpoints → MUI breakpoint system
4. **Prop forwarding**: Update shouldForwardProp patterns

## 🎯 Success Metrics

- [ ] **100% token usage**: No hardcoded colors, spacing, or breakpoints in new code
- [ ] **<5% theme overrides**: Components handle variants instead of global overrides
- [ ] **Accessibility compliance**: All interactive elements have proper focus states
- [ ] **Performance targets**: Bundle size stable, no CSS-in-JS runtime regressions
- [ ] **Team velocity**: Reduced decision time with clear `sx` vs `styled()` rules

---

*This guide is a living document. Update it as patterns evolve and new best practices emerge.*
