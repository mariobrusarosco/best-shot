# MUI (Material-UI) Customization Guide

## Latest Version
v5.15.15 (as of 2025-07-23)

## Key Customizations in This Project

### Breakpoints
```ts
interface BreakpointOverrides {
  xs: false;
  sm: false;
  md: false;
  lg: false;
  xl: false;
  mobile: true;   // 0-599
  tablet: true;   // 600-1199
  laptop: true;   // 1200-1799
  desktop: true;  // 1800+
}
```

### Palette
```ts
interface CustomPalette {
  green: { 200: string };
  red: { 400: string };
  teal: { 500: string };
  // ... other custom colors
}
```

### Typography
```ts
interface TypographyVariants {
  topic: React.CSSProperties;
  tag: React.CSSProperties;
  paragraph: React.CSSProperties;
  label: React.CSSProperties;
}

// Disabled variants
interface TypographyPropsVariantOverrides {
  h5: false;
  subtitle1: false;
  subtitle2: false;
  body1: false;
  body2: false;
}
```

## Usage Examples

### Custom Typography Variants
```tsx
<Typography 
  variant="topic"
  textTransform="uppercase"
>
  Tournaments
</Typography>

<Typography variant="tag">All guesses</Typography>
```

### Custom Palette Colors
```tsx
<Box bgcolor="teal.500">
  <Typography color="neutral.100">...</Typography>
</Box>
```

## Best Practices

1. **Theme Extensions**: Always extend interfaces when adding customizations:
```ts
declare module "@mui/material/styles" {
  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPalette {}
}
```

2. **Component Variants**: Disable unused variants to reduce bundle size:
```ts
interface TypographyPropsVariantOverrides {
  h5: false; // Disable unused variant
}
```

3. **Type Safety**: Use module augmentation for custom props:
```tsx
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    topic: true;
    tag: true;
  }
}
```

4. **Responsive Design**: Use custom breakpoints consistently:
```ts
const theme = createTheme({
  breakpoints: {
    values: {
      mobile: 0,
      tablet: 600,
      laptop: 1200,
      desktop: 1800,
    }
  }
});

// Usage
theme.breakpoints.up('tablet')
```

## Resources
- [MUI Customization Docs](https://mui.com/material-ui/customization/)
- [Theme Augmentation Guide](https://mui.com/material-ui/guides/typescript/#customization-of-theme)
- [Latest Release Notes](https://github.com/mui/material-ui/releases)
