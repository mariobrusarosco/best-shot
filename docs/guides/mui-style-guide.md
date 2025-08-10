# MUI Style Guide (Rigorous)

## Core Rule
- Prefer `sx` for layout and one-off adjustments
- Prefer `styled()` for reusable components and variants

## What is “layout”?
“Layout” refers to structural positioning and spacing of elements, not their visual skin.
- Layout examples: display, flex/grid configuration, gap, padding/margin, alignment, width/height constraints, responsive column/row definitions, overflow, position, z-index, container background blocks.
- Non-layout (visual skin): brand colors, borders, radii, shadows, typography decorations, component states, transitions.

Implication:
- Layout typically lives at screen/page/section level and changes with context → use `sx`.
- Visual skins belong to reusable components (buttons, cards, inputs) → use `styled()`.

## Authoring Rules
- Use `sx` for:
  - Page/section wrappers and grids
  - One-off responsive spacing and alignment
  - Minor local overrides of reusable components
- Use `styled()` for:
  - Design-system components (AppButton, AppCard…)
  - Domain components reused across multiple screens
  - Variants and interactive/state styles

## Examples

Layout with `sx` (screen-level)
```tsx
import { Box } from '@mui/material';

export const DashboardLayout = ({ children }) => (
  <Box sx={{
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: '240px 1fr' },
    gap: { xs: 1, md: 3 },
    p: { xs: 1, md: 2 },
  }}>
    {children}
  </Box>
);
```

Reusable component with `styled()`
```tsx
import { Card } from '@mui/material';
import { styled } from '@mui/material/styles';

export const AppCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[2],
  '&:hover': { boxShadow: theme.shadows[4] },
}));
```

Minor local override via `sx`
```tsx
<AppCard sx={{ p: 2, bgcolor: 'black.800' }} />
```

## Responsive Guidance
- Prefer breakpoint object syntax in `sx` and `styled()`
- Use `useMediaQuery` only for conditional rendering, not style toggles

## Theming & Tokens
- Use semantic tokens for colors (primary, error, neutral) and spacing via `theme.spacing()`
- Avoid raw hex/px; theme drives consistency

## Accessibility
- Add focus-visible outlines for interactives in `styled()` components
- Provide alt/ARIA when applicable

## Performance
- Keep `styled()` definitions module-scoped
- Extract large `sx` objects to constants to avoid recreations
- Prefer composition to deep overrides

## Co-location & Adjacent Files
- Keep small layout wrappers in the same file as the screen
- Extract to adjacent `<name>.layout.tsx` / `<name>.styles.tsx` when wrappers exceed ~80 lines, have ≥3 responsive branches, or are shared by sibling files
- Promote to design-system or domain components when reused across screens

## Do / Don’t
- Do: `sx` for container grids, spacing, simple responsive layout
- Do: `styled()` for skins/variants and reusable building blocks
- Don’t: Create `styled()` components inside render
  - Why:
    - Component identity churn → unmount/mount of subtree; breaks refs/state/memoization
    - Extra CSS work → new classes injected per render; higher CPU/memory; possible flicker/order issues
    - Missed optimizations → prevents hoisting/caching; defeats React.memo/useMemo
    - SSR/hydration risk → unstable class names; larger markup; more hydration work
    - DX noise → noisier DevTools/HMR; harder debugging/tests
  - Bad:
    ```tsx
    function CardSection({ padding = 2 }) {
      const Section = styled(Box)(({ theme }) => ({ padding: theme.spacing(padding) }));
      return <Section />;
    }
    ```
  - Good:
    ```tsx
    const Section = styled(Box)(({ theme }) => ({ borderRadius: theme.spacing(1) }));
    function CardSection({ padding = 2 }) {
      return <Section sx={{ p: padding }} />;
    }
    ```
- Don’t: Use theme overrides for heavy customizations; create components instead

## Checklists
- New screen
  - Layout via `sx`; small wrappers co-located
  - Extract to adjacent file only if complex
- New component
  - If reusable → `styled()`; add variant/state styles and focus-visible
  - If one-off → prefer `sx`
- Review
  - No hardcoded hex/px
  - Breakpoint objects used for responsiveness
  - Minimal theme overrides

## Recommended render branching order
- Loading → Error → Empty State → Main Content

Example
```tsx
export function Screen() {
  const { data, isPending, error } = useQuery(...);

  if (isPending) return <LoadingSkeleton />;        // Loading first
  if (error) return <ErrorState />;                 // Then error
  if (!data || data.length === 0) return <Empty />; // Then empty
  return <MainContent data={data} />;               // Finally main content
}
```