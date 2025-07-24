# ADR 0001: Upgrade Material-UI to v7

## Status
Accepted

## Date
2025-01-24

## Context
The Best Shot application was using Material-UI (MUI) packages with mismatched versions:
- `@mui/material`: ^6.2.0 
- `@mui/system`: ^5.15.15
- `@mui/base`: ^5.0.0-beta.64

This version mismatch created potential compatibility issues and prevented the application from benefiting from the latest improvements, bug fixes, and ESM support enhancements available in MUI v7.

Material-UI v7 was released with a focus on:
- Improved ESM (ES Modules) support
- Bug fixes requiring breaking changes
- Standardization of the slot pattern across components
- Removal of deprecated APIs to reduce API surface

## Decision
We will upgrade all MUI packages to version 7.x:
- `@mui/material`: ^7.2.0
- `@mui/system`: ^7.2.0  
- `@mui/base`: ^5.0.0-beta.70 (latest available beta)

## Implementation
The upgrade required addressing several breaking changes:

### 1. Deep Import Path Changes
**Before (v6):**
```typescript
import Typography from '@mui/material/Typography/Typography';
import styled from '@mui/material/styles/styled';
```

**After (v7):**
```typescript
import { Typography, styled } from '@mui/material';
```

### 2. Box Component Changes
The `component` prop was removed from Box components. We migrated styled components to use the target HTML element directly:

**Before:**
```typescript
const ListGrid = styled(Box)(styles);
// Usage: <ListGrid component="ul">
```

**After:**
```typescript
const ListGrid = styled("ul")(styles);
// Usage: <ListGrid>
```

### 3. Grid Component API
Maintained compatibility with existing Grid v1 API rather than migrating to Grid2, as the current responsive prop patterns (`mobile`, `tablet`, `desktop`) are custom and not part of standard MUI.

## Consequences

### Positive
- **Improved ESM Support**: Better compatibility with modern bundlers (Vite, webpack)
- **Bug Fixes**: Access to latest stability improvements
- **Version Alignment**: All MUI packages now use compatible versions
- **Future-Proofing**: Positioned for upcoming MUI features and updates
- **Reduced Bundle Size**: Removal of deprecated APIs reduces bundle size

### Negative
- **Breaking Changes**: Required manual migration of 25+ files
- **Development Time**: Initial upgrade effort required careful testing
- **Potential Compatibility**: Some third-party MUI-based libraries may need updates

### Neutral
- **No Visual Changes**: The upgrade maintains existing UI/UX
- **No API Changes**: Component usage patterns remain the same for end developers

## Risks and Mitigations

### Risk: Breaking Changes in Production
**Mitigation**: All breaking changes were identified and fixed during development. Build process confirms compatibility.

### Risk: Third-party Component Incompatibility  
**Mitigation**: The application primarily uses core MUI components and custom styled components, minimizing external dependencies.

## Follow-up Actions
1. Monitor for any runtime issues in production
2. Update documentation to reflect v7 patterns for new development
3. Consider migrating demo components to standard Grid API in future iterations
4. Evaluate Grid2 adoption when it becomes stable

## References
- [MUI v7 Migration Guide](https://mui.com/material-ui/migration/upgrade-to-v7/)
- [MUI v7 Release Notes](https://mui.com/blog/material-ui-v7-is-here/)
- GitHub Issues: Package version mismatches identified during styling architecture review