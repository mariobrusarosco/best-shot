# Frontend Styling Architecture Plan (React + MUI)

## Objectives
- Consistent, token-driven UI
- Clear authoring rules (sx vs styled) with promotion path
- Performance (bundle size, CSS-in-JS cost, SSR)
- Accessibility and responsiveness by default

## Architecture Decisions
- Package usage
  - @mui/material for 90% of UI (complete, themed, accessible)
  - @mui/system for layout and the `sx` prop
  - @mui/base for headless primitives only when complete visual control is needed
- Styling primitives
  - Prefer `sx` for layout/one-off local tweaks
  - Prefer `styled()` for reusable components/variants
  - Use theme overrides sparingly for global corrections

## Theming (Design Tokens)
- Centralize palette (semantic colors), typography, spacing, shape, and breakpoints
- Use semantic tokens (e.g., neutral.100, brand) rather than hardcoded values
- Keep variants minimal and meaningful

## Component Taxonomy & Promotion Path
- UI System (design system)
  - AppButton, AppCard, AppInput, AppDatePicker, etc. via @mui/material + `styled()`
  - Export via a barrel for a stable import path
- Domain components
  - Compose UI System; use `styled()` if reused, otherwise `sx`
- Screens/layout
  - Use `sx` for layout/one-offs
  - Co-locate small wrappers in the same file; extract to adjacent file if complex (> ~80 lines or ≥3 responsive branches)

## Authoring Rules
- `sx` for layout and one-off adjustments
  - Example: `<Box sx={{ display: 'grid', gap: { xs: 1, md: 3 }, p: { xs: 1, md: 2 } }} />`
- `styled()` for reusable components/variants
  - Example: `const AppCard = styled(Card)(({ theme }) => ({ borderRadius: theme.spacing(1) }))`
- Keep `styled()` definitions module-scoped (never inside render)

## Responsive Design
- Use breakpoint object syntax in both `sx` and `styled()` (avoid custom media queries)
- Use `useMediaQuery` for conditional rendering when needed

## Accessibility
- Leverage Material defaults; add focus-visible rings for interactives
- Provide alt and ARIA attributes where applicable

## Performance & SSR
- SSR: configure Emotion cache insertion order and critical CSS
- Bundle:
  - Import components directly (tree-shaking)
  - Prefer composition over deep overrides
  - Virtualize long lists (e.g., react-window)
- Extract large `sx` objects to consts; keep only true dynamics inline
- Define `styled()` components outside render

## Tooling & Enforcement
- Lint rules to disallow hardcoded hex/px and encourage tokens
- Storybook/MDX (or docs) for UI System components with responsive states
- A11y smoke tests (axe), performance budgets, Lighthouse in CI

## Migration Strategy (if retrofitting)
1. Add theme tokens and breakpoints; establish UI System barrel
2. Convert high-traffic screens to use `sx` for layout and `styled()` for reusable parts
3. Reduce theme overrides; move logic into components/variants
4. Add a11y checks, SSR cache config, bundle audits

## Deliverables
- Theme file with tokens and breakpoints
- UI System components (AppButton, AppCard, etc.) with docs
- Barrel exports for UI System
- Style guide (see companion file) defining `sx` vs `styled()` with examples
- Lint rules and CI checks for a11y/performance

## Success Metrics
- 100% token usage in new/updated components
- < 5% theme overrides; majority handled via components/variants
- a11y smoke tests pass; focus-visible implemented
- Bundle size stable; no CSS-in-JS runtime regressions


