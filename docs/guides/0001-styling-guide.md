# Guide 0001: Styling Architecture for Best Shot

## Overview

This guide establishes **opinionated styling patterns** for Best Shot based on Material-UI v7 best practices and performance research. We use **only 2 core patterns** that cover all styling needs while optimizing for performance and maintainability.

## Architecture Philosophy

**Performance-First**: Research shows runtime CSS-in-JS can increase render times by 3x. Our patterns minimize runtime work while preserving developer experience.

**Component-Scoped**: All styles are tied to specific components, preventing global CSS issues and enabling safe refactoring.

**Theme-Driven**: Every style uses our design system tokens, ensuring consistency and easy theme updates.

## Table of Contents

1. [The Two Patterns](#the-two-patterns)
2. [Design System](#design-system) 
3. [Pattern 1: Static Styled Components](#pattern-1-static-styled-components)
4. [Pattern 2: Dynamic sx Prop](#pattern-2-dynamic-sx-prop)
5. [Decision Matrix](#decision-matrix)
6. [Migration Notes](#migration-notes)

## The Two Patterns

### Pattern 1: Static Styled Components
**When:** Reusable UI components, complex styling, performance-critical areas
```tsx
const TournamentCard = styled(Surface)(({ theme }) => ({
  backgroundColor: theme.palette.black[800],
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  // All styles defined statically - no runtime work
}));
```

### Pattern 2: Dynamic sx Prop  
**When:** Instance-specific styling, prototyping, conditional styles
```tsx
<Box sx={{ 
  display: "flex", 
  gap: 2, 
  backgroundColor: isActive ? "teal.500" : "black.400" 
}}>
```

### ❌ What We Don't Use
- `useTheme()` hook (creates unnecessary runtime work)
- CSS files or CSS modules (breaks component isolation)
- Inline styles (no theme access)
- Multiple CSS-in-JS libraries (complexity)

## Design System

### Color Palette

Our design system uses a semantic color palette defined in `src/theming/theme.ts`:

```tsx
// Primary Colors
theme.palette.teal[500]     // #6A9B96 - Primary brand color
theme.palette.neutral[100]  // #FDFCFC - Light text/backgrounds
theme.palette.neutral[0]    // #FFFFFF - Pure white

// Semantic Colors  
theme.palette.green[200]    // #8AC79F - Success states
theme.palette.red[400]      // #FF6D6D - Error states
theme.palette.pink[700]     // #BB2253 - Accent color

// Neutral Scale
theme.palette.black[300]    // #939393 - Light gray
theme.palette.black[400]    // #484848 - Medium gray  
theme.palette.black[500]    // #373737 - Dark gray
theme.palette.black[700]    // #131514 - Almost black
theme.palette.black[800]    // #232424 - Card backgrounds
```

### Typography System

We use a custom typography scale with Poppins and Montserrat fonts:

```tsx
// Headings (Poppins - clean, modern)
<Typography variant="h1">   // 60px, weight 500
<Typography variant="h2">   // 48px, weight 500

// Content (Montserrat - readable)  
<Typography variant="h3">   // 42px, weight 600
<Typography variant="h4">   // 36px, weight 600
<Typography variant="h6">   // 24px, line-height 1.5

// Body Text
<Typography variant="paragraph"> // 18px
<Typography variant="topic">     // 16px, weight 300
<Typography variant="label">     // 12px (Poppins)
<Typography variant="tag">       // 10px (Montserrat)
```

### Responsive Breakpoints

Custom breakpoint system optimized for the application:

```tsx
// Breakpoint Values
all: 0px        // All screen sizes
mobile: 768px   // Mobile landscape and up
tablet: 769px   // Tablet portrait and up  
laptop: 1024px  // Laptop and up
desktop: 1440px // Desktop and up

// Usage with UIHelper
[UIHelper.whileIs("mobile")]: { /* Mobile only styles */ }
[UIHelper.startsOn("tablet")]: { /* Tablet and up */ }
[UIHelper.between("tablet", "laptop")]: { /* Tablet only */ }
```

### Spacing System

```tsx
// Theme spacing (8px base unit)
theme.spacing(1)  // 8px
theme.spacing(2)  // 16px  
theme.spacing(3)  // 24px

// Custom padding tokens
PADDING.tiny          // 4px
PADDING["extra-small"] // 12px
PADDING.small         // 8px
PADDING.medium        // 12px
PADDING.large         // 16px
PADDING["extra-large"] // 20px
PADDING.huge          // 24px
```

## Pattern 1: Static Styled Components

**Purpose:** Reusable UI components, complex styling, performance-critical components.

**Key Principles:**
- Define styles outside render functions (static performance)
- Use theme tokens exclusively
- Component-scoped styling
- Single source of truth for component styles

### Basic Implementation

```tsx
import { styled } from "@mui/material";
import { Surface } from "@/domains/ui-system/components/surface/surface";

// ✅ CORRECT: Static styled component
const TournamentCard = styled(Surface)(({ theme }) => ({
  backgroundColor: theme.palette.black[800],
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  
  // Hover states
  "&:hover": {
    transform: "translateY(-2px)",
    transition: "transform 0.2s ease",
  },
  
  // Responsive design with UIHelper
  [UIHelper.whileIs("mobile")]: {
    padding: theme.spacing(1.5),
  },
  
  [UIHelper.startsOn("tablet")]: {
    padding: theme.spacing(2.5),
  },
}));

// Usage
export const TournamentCard = ({ tournament }) => (
  <TournamentCard>
    <Typography variant="h6">{tournament.name}</Typography>
  </TournamentCard>
);
```

### Advanced: Compound Components

```tsx
// ✅ CORRECT: Compound component pattern for UI system
const CardContainer = styled(Surface)(({ theme }) => ({
  backgroundColor: theme.palette.black[800],
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
}));

const CardHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(1),
}));

const CardSkeleton = styled(CardContainer)(({ theme }) => ({
  opacity: 0.4,
  animation: "pulse 2s ease-in-out infinite",
}));

// Export as compound component
export const AppCard = {
  Container: CardContainer,
  Header: CardHeader,
  Skeleton: CardSkeleton,
};

// Usage
<AppCard.Container>
  <AppCard.Header>
    <Typography variant="h6">Title</Typography>
    <Button>Action</Button>
  </AppCard.Header>
  <Box>Content...</Box>
</AppCard.Container>
```

## Pattern 2: Dynamic sx Prop

**Purpose:** Instance-specific styling, conditional styles, rapid prototyping.

**Key Principles:**
- Use for one-off customizations
- Leverage MUI's optimized CSS-in-JS
- Keep conditional logic simple
- Theme token access through string notation

### Basic Implementation

```tsx
// ✅ CORRECT: Simple sx prop usage
<Box sx={{ 
  display: "flex", 
  gap: 2, 
  p: 3,
  backgroundColor: "black.800",
  borderRadius: 1,
}}>

// ✅ CORRECT: Conditional styling
<Typography 
  sx={{ 
    color: isActive ? "teal.500" : "black.400",
    fontWeight: isImportant ? 600 : 400,
  }}
>
  {text}
</Typography>

// ✅ CORRECT: Responsive sx
<Container sx={{
  padding: { mobile: 2, tablet: 3, desktop: 4 },
  gridTemplateColumns: { 
    mobile: "1fr", 
    tablet: "repeat(2, 1fr)",
    desktop: "repeat(3, 1fr)" 
  },
}}>
```

### Advanced: Complex Conditional Logic

```tsx
// ✅ CORRECT: Complex sx with function
<Button 
  sx={(theme) => ({
    backgroundColor: variant === "primary" 
      ? theme.palette.teal[500] 
      : theme.palette.black[400],
    color: theme.palette.neutral[100],
    padding: size === "large" 
      ? theme.spacing(2, 4) 
      : theme.spacing(1, 2),
      
    "&:hover": {
      backgroundColor: variant === "primary"
        ? theme.palette.teal[400]
        : theme.palette.black[300],
    },
  })}
>
  {children}
</Button>
```

## Decision Matrix

| Scenario | Pattern | Reason |
|----------|---------|---------|
| UI System component (Button, Card, etc.) | **Static Styled** | Reusable, performance-critical |
| Domain component (TournamentCard, etc.) | **Static Styled** | Complex styling, reusable |
| One-off layout adjustment | **sx Prop** | Instance-specific |
| Conditional styling (isActive, variant) | **sx Prop** | Dynamic logic |
| Prototyping new components | **sx Prop** | Quick iteration |
| Performance-critical animations | **Static Styled** | No runtime overhead |
| Theme-dependent calculations | **sx Prop** | MUI optimization |

## File Organization Architecture

### **1. Global Styles Placement**

| Style Type | Location | Reason | Example |
|------------|----------|---------|---------|
| **CSS Reset/Base** | `src/theming/global-styles.tsx` | Single source, affects all | `body { margin: 0 }` |
| **Theme Config** | `src/theming/theme.ts` | Centralized design system | Color palette, breakpoints |
| **Typography** | `src/theming/typography.ts` | Reusable across components | Font definitions, variants |
| **CSS Variables** | `src/theming/global-styles.tsx` | Performance, theme switching | `--app-header-height: 80px` |
| **Keyframes** | `src/theming/global-styles.tsx` | Reusable animations | `@keyframes shimmer` |

```tsx
// ✅ CORRECT: Global styles structure
src/theming/
├── global-styles.tsx    # CSS reset, variables, keyframes
├── theme.ts            # MUI theme, colors, breakpoints  
├── typography.ts       # Font system, variants
└── load-configuration.ts # Theme setup logic
```

### **2. Screen-Level Styles**

| Scenario | Pattern | Location | Reason |
|----------|---------|----------|---------|
| **Simple Layout** | **Co-located** | `screen.tsx` | Styles < 50 lines |
| **Complex Layout** | **Separate File** | `screen.styles.tsx` | Styles > 50 lines |
| **Multiple Views** | **Separate File** | `screen.styles.tsx` | Better organization |
| **Performance Critical** | **Static Styled** | `screen.tsx` | No runtime overhead |

```tsx
// ✅ CORRECT: Complex screen with separate styles
src/domains/member/screens/
├── my-accounts.tsx
└── my-accounts.styles.tsx

// ✅ CORRECT: Simple screen with co-located styles
src/domains/dashboard/pages/
└── index.tsx              # Styles inside component
```

### **3. UI-System Components**

| Component Type | Pattern | Location | Reason |
|----------------|---------|----------|---------|
| **Simple Component** | **Co-located** | `component.tsx` | Styles < 30 lines |
| **Complex Component** | **Co-located** | `component.tsx` | Compound pattern |
| **With Animations** | **Co-located** | `component.tsx` | Behavior + styles together |

```tsx
// ✅ CORRECT: UI System organization
src/domains/ui-system/components/
├── button/
│   └── button.tsx              # All styles inside
├── card/
│   └── card.tsx                # Compound component
├── surface/
│   └── surface.tsx             # Base component
└── skeleton/
    └── skeleton.tsx            # With animations
```

### **4. Domain Components**

```tsx
// ✅ CORRECT: Domain component patterns
src/domains/tournament/components/
├── tournament-card/
│   ├── tournament-card.tsx     # Simple: co-located styles
│   └── tournament-card.types.ts
└── tournament-list/
    ├── tournament-list.tsx
    ├── tournament-list.styles.tsx  # Complex: separate styles
    └── tournament-list.utils.ts
```

### **5. CSS Files vs Component Isolation**

| Approach | Isolation | Performance | Maintenance | Bundle Impact |
|----------|-----------|-------------|-------------|---------------|
| **CSS Files** | ❌ Poor | ✅ Fast | ❌ Hard | ❌ Larger |
| **CSS Modules** | ⚠️ Medium | ✅ Fast | ⚠️ Medium | ⚠️ Medium |
| **Styled Components** | ✅ Excellent | ⚠️ Medium | ✅ Easy | ✅ Optimal |
| **sx Prop** | ✅ Excellent | ❌ Slower | ✅ Easy | ✅ Optimal |

**Decision:** Use only **Styled Components + sx Prop** for complete component isolation and theme integration.

### **6. File Naming Conventions**

| File Type | Pattern | Example | Reason |
|-----------|---------|---------|---------|
| **Component** | `kebab-case.tsx` | `tournament-card.tsx` | Consistency with URLs |
| **Styles File** | `component.styles.tsx` | `tournament-card.styles.tsx` | Clear separation |
| **Types** | `component.types.ts` | `tournament-card.types.ts` | TypeScript convention |
| **Utils** | `component.utils.ts` | `tournament-card.utils.ts` | Logic separation |
| **Tests** | `component.test.tsx` | `tournament-card.test.tsx` | Testing convention |

### **7. Import Organization**

| Import Type | Order | Pattern | Example |
|-------------|-------|---------|---------|
| **External Libraries** | 1st | Direct imports | `import { styled } from "@mui/material"` |
| **Internal Components** | 2nd | Absolute paths only | `import { Surface } from "@/domains/ui-system/components/surface"` |
| **Domain Components** | 3rd | Absolute paths only | `import { TournamentCard } from "@/domains/tournament/components/tournament-card"` |
| **Types** | 4th | Absolute paths only | `import type { Tournament } from "@/domains/tournament/types"` |
| **Styles** | 5th | Absolute paths only | `import { CardContainer } from "@/domains/tournament/components/tournament-list.styles"` |

**Rule:** Always use absolute imports with `@/` prefix for all internal code - no relative imports allowed.

```tsx
// ✅ CORRECT: All absolute imports
import { styled } from "@mui/material";
import { Box, Typography } from "@mui/material";

import { Surface } from "@/domains/ui-system/components/surface";
import { AppIcon } from "@/domains/ui-system/components/icon";

import { formatDate } from "@/domains/tournament/utils/date-formatter";
import { TournamentCard } from "@/domains/tournament/components/tournament-card";

import type { Tournament } from "@/domains/tournament/types/tournament.types";
import type { ComponentProps } from "react";

import { CardContainer, CardHeader } from "@/domains/tournament/components/tournament-list.styles";
```

### **8. Performance Optimization Matrix**

| Scenario | Pattern | Implementation | Performance Impact |
|----------|---------|----------------|-------------------|
| **Static UI** | Styled Components | Outside render | ✅ 0ms overhead |
| **Conditional Styles** | sx Prop | Inside render | ⚠️ ~2ms per render |
| **Animation** | Styled + CSS | Keyframes | ✅ 60fps smooth |
| **Theme Switching** | Both patterns | CSS Variables | ✅ Instant |
| **List Items** | Styled Components | Memoized | ✅ Optimized |
| **Form Inputs** | sx Prop | Dynamic validation | ⚠️ Acceptable |

```tsx
// ✅ CORRECT: Performance-optimized list
const MemoizedTournamentCard = memo(styled(Surface)(({ theme }) => ({
  backgroundColor: theme.palette.black[800],
  // Static styles - no runtime work
})));

// ✅ CORRECT: Dynamic validation with sx
<TextField 
  sx={{ 
    borderColor: hasError ? "red.400" : "black.400",
    // Dynamic logic - acceptable for forms
  }}
/>
```

## Performance Rules

### ✅ Do's
```tsx
// ✅ Static styled component (no runtime work)
const Card = styled(Surface)(({ theme }) => ({
  backgroundColor: theme.palette.black[800], // Static reference
}));

// ✅ sx prop with simple conditionals
<Box sx={{ color: isActive ? "teal.500" : "black.400" }}>

// ✅ Theme tokens as strings (optimized by MUI)
<Typography color="teal.500" variant="h6">
```

### ❌ Don'ts
```tsx
// ❌ useTheme in render (creates runtime work)
const theme = useTheme();
const color = theme.palette.teal[500];

// ❌ Inline styles (no theme access)
<div style={{ backgroundColor: "#232424" }}>

// ❌ Complex calculations in sx
<Box sx={(theme) => ({
  color: calculateColor(theme, props, state), // Runtime work
})}>
```

## Migration Notes

**From Current Guide → New Architecture:**

1. **Remove useTheme() patterns** → Use sx prop or static styled
2. **Consolidate styling approaches** → Only 2 patterns allowed
3. **Update compound components** → Follow AppCard pattern
4. **Standardize file organization** → One component per file

**MUI v7 Compatibility:**
- ✅ All patterns work with v7
- ✅ Named imports only
- ✅ No deprecated APIs used
- ✅ Performance optimized