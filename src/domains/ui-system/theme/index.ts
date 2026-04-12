/**
 * Best Shot Design System Theme
 *
 * Enhanced MUI theme following the comprehensive design system architecture
 * documented in docs/guides/0001-styling-guide.md
 *
 * This theme implements:
 * - Foundation design tokens (colors, typography, spacing, breakpoints)
 * - Component overrides for consistent styling
 * - Custom variants for domain-specific components
 * - Responsive design patterns
 * - Accessibility-first approach
 */

import { createTheme } from "@mui/material/styles";

// Component overrides
import { createUIHelper, MUI_BREAKPOINTS_CONFIG } from "./foundation/breakpoints";
// Foundation imports
import { COLORS } from "./foundation/colors";
import { BORDER_RADIUS, MUI_SPACING_CONFIG } from "./foundation/spacing";
import { MUI_TYPOGRAPHY_CONFIG } from "./foundation/typography";

// Create the enhanced theme
const theme = createTheme({
	// === FOUNDATION ===
	// Color system
	palette: {
		mode: "light",
		...COLORS,
	},

	// Typography system
	typography: { ...MUI_TYPOGRAPHY_CONFIG },
	// Spacing system (8px base unit)
	spacing: MUI_SPACING_CONFIG,
	// Breakpoint system
	breakpoints: MUI_BREAKPOINTS_CONFIG,
	borderRadius: BORDER_RADIUS,

	// === COMPONENT OVERRIDES ===
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				body: {
					backgroundColor: "#2C2C2C",
				},
			},
		},
		// MUI component overrides like line below
		// MuiButton: buttonOverrides,
		// Media query component (existing)
		MuiUseMediaQuery: {
			defaultProps: {
				noSsr: true,
			},
		},
	},
});

// === UI HELPER ===

// Enhanced UIHelper with additional responsive utilities
export const UIHelper = createUIHelper(theme);

// === EXPORTS ===

export { theme };
export default theme;

export { DESIGN_SYSTEM_BREAKPOINTS as breakpoints } from "./foundation/breakpoints";
