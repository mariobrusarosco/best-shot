# Guide 0001: Styling Guide for Best Shot

## Overview

This guide provides comprehensive guidelines for styling components in the Best Shot application using Material-UI v7, our custom theme system, and established patterns.

## Table of Contents

1. [Quick Reference](#quick-reference)
2. [Design System](#design-system)
3. [Styling Approaches](#styling-approaches)
4. [Component Creation Patterns](#component-creation-patterns)
5. [Responsive Design](#responsive-design)
6. [Best Practices](#best-practices)
7. [Migration Notes (MUI v7)](#migration-notes-mui-v7)

## Quick Reference

### Essential Imports
```tsx
// Core styling
import { styled, useTheme } from "@mui/material";
import { Box, Typography } from "@mui/material";

// Theme and utilities
import { theme, UIHelper } from "@/theming/theme";

// Custom components
import { Surface } from "@/domains/ui-system/components/surface/surface";
```

### Common Patterns
```tsx
// ✅ Good: Styled component with theme
const StyledCard = styled(Surface)(({ theme }) => ({
  backgroundColor: theme.palette.black[800],
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
}));

// ✅ Good: Using sx prop for quick styling
<Box sx={{ display: "flex", gap: 2, p: 3 }}>

// ✅ Good: Runtime theme access
const theme = useTheme();
const buttonColor = theme.palette.teal[500];
```

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

## Styling Approaches

### 1. Styled Components (Recommended for Reusable Components)

**When to use:** Creating reusable components, complex styling logic, or when you need theme access.

```tsx
import { styled } from "@mui/material";

// ✅ Basic styled component
const CardContainer = styled(Surface)(({ theme }) => ({
  backgroundColor: theme.palette.black[800],
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  display: "grid",
  height: "100%",
  overflow: "hidden",
}));

// ✅ With responsive design
const ResponsiveCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  
  [UIHelper.whileIs("mobile")]: {
    padding: theme.spacing(1),
    fontSize: "14px",
  },
  
  [UIHelper.startsOn("tablet")]: {
    padding: theme.spacing(3),
    fontSize: "16px",
  },
}));

// ✅ Using theme.unstable_sx for responsive objects
const ModernCard = styled(Surface)(({ theme }) =>
  theme.unstable_sx({
    backgroundColor: "black.800",
    padding: 2,
    borderRadius: 2,
    gap: {
      all: 2,
      tablet: 3,
    },
  })
);
```

### 2. sx Prop (Recommended for One-off Styling)

**When to use:** Quick styling, prototyping, or component-specific adjustments.

```tsx
// ✅ Basic sx usage
<Box sx={{ 
  display: "flex", 
  gap: 2, 
  p: 3,
  backgroundColor: "black.800" 
}}>

// ✅ Responsive sx
<Typography sx={{
  fontSize: { mobile: 14, tablet: 16, desktop: 18 },
  color: "teal.500",
}}>

// ✅ Using theme in sx
<Button sx={(theme) => ({
  backgroundColor: theme.palette.teal[500],
  color: theme.palette.neutral[100],
  '&:hover': {
    backgroundColor: theme.palette.teal[400],
  },
})}>
```

### 3. Runtime Theme Access (Recommended for Dynamic Styling)

**When to use:** Conditional styling based on props, state, or complex logic.

```tsx
import { useTheme } from "@mui/material";

const DynamicComponent = ({ variant, isActive }) => {
  const theme = useTheme();
  
  const buttonColor = isActive 
    ? theme.palette.teal[500] 
    : theme.palette.black[400];
    
  return (
    <Button sx={{ backgroundColor: buttonColor }}>
      {children}
    </Button>
  );
};
```

## Component Creation Patterns

### Pattern 1: Single Component with Styled Base

```tsx
import { styled } from "@mui/material";
import { Surface } from "@/domains/ui-system/components/surface/surface";

const StyledButton = styled(Surface)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.teal[500],
  color: theme.palette.neutral[100],
  borderRadius: theme.spacing(0.5),
  cursor: "pointer",
  
  "&:hover": {
    backgroundColor: theme.palette.teal[400],
  },
}));

export const AppButton = StyledButton;
```

### Pattern 2: Compound Component Pattern (Recommended for UI System)

```tsx
import { styled } from "@mui/material";

const CardContainer = styled(Surface)(({ theme }) =>
  theme.unstable_sx({
    backgroundColor: "black.800",
    padding: 2,
    borderRadius: 2,
  })
);

const CardHeader = styled(Box)(({ theme }) =>
  theme.unstable_sx({
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 2,
  })
);

const CardSkeleton = () => (
  <CardContainer sx={{ opacity: 0.4 }} />
);

// Export as compound component
export const AppCard = {
  Container: CardContainer,
  Header: CardHeader,
  Skeleton: CardSkeleton,
};

// Usage
<AppCard.Container>
  <AppCard.Header>
    <Typography variant="h6">Card Title</Typography>
  </AppCard.Header>
  <Box>Card content...</Box>
</AppCard.Container>
```

### Pattern 3: CSS Utility Functions

```tsx
import { css } from "@mui/system";

// ✅ Reusable style utilities
const resetButton = () => css`
  background-color: unset;
  outline: none;
  border: none;
  padding: 0;
  margin: 0;
`;

const shimmerEffect = () => css`
  position: relative;
  overflow: hidden;
  
  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    animation: shimmer 2s infinite;
  }
`;

// Usage in styled component
const LoadingCard = styled(Box)`
  ${shimmerEffect};
`;
```

## Responsive Design

### Using UIHelper (Recommended)

```tsx
import { UIHelper } from "@/theming/theme";

const ResponsiveComponent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  
  // Mobile only (0-768px)
  [UIHelper.whileIs("mobile")]: {
    padding: theme.spacing(1),
    flexDirection: "column",
  },
  
  // Tablet and up (769px+)
  [UIHelper.startsOn("tablet")]: {
    padding: theme.spacing(3),
    flexDirection: "row",
  },
  
  // Desktop and up (1440px+)
  [UIHelper.startsOn("desktop")]: {
    padding: theme.spacing(4),
  },
}));
```

### Using theme.unstable_sx with Responsive Objects

```tsx
const ResponsiveCard = styled(Surface)(({ theme }) =>
  theme.unstable_sx({
    padding: {
      all: 2,        // Mobile: 16px
      tablet: 3,     // Tablet+: 24px
      desktop: 4,    // Desktop+: 32px
    },
    
    gridTemplateColumns: {
      all: "1fr",
      tablet: "repeat(2, 1fr)",
      desktop: "repeat(3, 1fr)",
    },
  })
);
```

### Using useMediaQuery for Runtime Responsiveness

```tsx
import { useMediaQuery } from "@mui/material";

const ResponsiveComponent = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1023px)");
  
  return (
    <Box>
      {isMobile && <MobileLayout />}
      {isTablet && <TabletLayout />}
      {!isMobile && !isTablet && <DesktopLayout />}
    </Box>
  );
};
```

## Best Practices

### ✅ Do's

1. **Use the theme system consistently**
   ```tsx
   // ✅ Good
   backgroundColor: theme.palette.black[800]
   padding: theme.spacing(2)
   
   // ❌ Avoid
   backgroundColor: "#232424"
   padding: "16px"
   ```

2. **Prefer semantic color names**
   ```tsx
   // ✅ Good  
   color: "teal.500"
   backgroundColor: "black.800"
   
   // ❌ Avoid
   color: "#6A9B96"
   backgroundColor: "#232424"
   ```

3. **Use compound components for complex UI**
   ```tsx
   // ✅ Good
   export const AppCard = {
     Container: CardContainer,
     Header: CardHeader,
     Content: CardContent,
   };
   ```

4. **Follow the file organization pattern**
   ```
   src/domains/ui-system/components/
   ├── button/
   │   └── button.tsx
   ├── card/
   │   ├── card.tsx
   │   └── card.styles.tsx (if complex)
   ```

5. **Use styled components for reusable patterns**
6. **Use sx prop for one-off adjustments**
7. **Use UIHelper for responsive design**

### ❌ Don'ts

1. **Don't mix styling approaches unnecessarily**
2. **Don't use inline styles**
3. **Don't hardcode values that exist in the theme**
4. **Don't create styled components for single-use cases**
5. **Don't use deprecated MUI patterns**

## Migration Notes (MUI v7)

### Breaking Changes Addressed

1. **Deep imports removed**
   ```tsx
   // ❌ Old (v6)
   import Typography from '@mui/material/Typography/Typography';
   import styled from '@mui/material/styles/styled';
   
   // ✅ New (v7)
   import { Typography, styled } from '@mui/material';
   ```

2. **Box component prop changes**
   ```tsx
   // ❌ Old (v6)
   const ListGrid = styled(Box)(styles);
   <ListGrid component="ul">
   
   // ✅ New (v7)
   const ListGrid = styled("ul")(styles);
   <ListGrid>
   ```

3. **Import patterns standardized**
   ```tsx
   // ✅ Always use named imports
   import { styled, useTheme, Typography, Box } from "@mui/material";
   ```

### Updated Patterns

- All styled components now use named imports
- Box components with `component` prop converted to direct HTML element styling
- Theme access remains the same
- sx prop usage unchanged

## Examples

### Complete Component Example

```tsx
import { styled, Typography, Box } from "@mui/material";
import { UIHelper } from "@/theming/theme";
import { Surface } from "@/domains/ui-system/components/surface/surface";

// Styled components
const TournamentCardContainer = styled(Surface)(({ theme }) => ({
  backgroundColor: theme.palette.black[800],
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  transition: "transform 0.2s ease",
  
  "&:hover": {
    transform: "translateY(-2px)",
  },
  
  [UIHelper.whileIs("mobile")]: {
    padding: theme.spacing(1.5),
  },
  
  [UIHelper.startsOn("tablet")]: {
    padding: theme.spacing(2.5),
  },
}));

const TournamentHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(1),
}));

// Component
export const TournamentCard = ({ tournament, actions }) => {
  return (
    <TournamentCardContainer>
      <TournamentHeader>
        <Typography variant="h6" color="neutral.100">
          {tournament.name}
        </Typography>
        <Box sx={{ color: "teal.500" }}>
          {actions}
        </Box>
      </TournamentHeader>
      
      <Typography variant="topic" color="black.300">
        {tournament.description}
      </Typography>
      
      <Box sx={{ 
        display: "flex", 
        gap: 1, 
        mt: 2,
        flexWrap: "wrap" 
      }}>
        {tournament.tags.map(tag => (
          <Typography 
            key={tag}
            variant="tag" 
            sx={{ 
              backgroundColor: "black.700", 
              px: 1, 
              py: 0.5, 
              borderRadius: 0.5 
            }}
          >
            {tag}
          </Typography>
        ))}
      </Box>
    </TournamentCardContainer>
  );
};
```

This guide should be your go-to reference for styling components in the Best Shot application. For questions or additions, please update this guide or create new ADRs for architectural decisions.