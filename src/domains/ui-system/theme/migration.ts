/**
 * Theme Migration Utilities
 *
 * Helper utilities to migrate from legacy theme to new design system theme.
 * Use these to gradually migrate components without breaking changes.
 */

import { LEGACY_TOKENS, theme, UIHelper } from "./index";

// Re-export everything the legacy theme provided
export { theme };
export const COLORS = LEGACY_TOKENS.COLORS;
export const BORDER_RADIUS = LEGACY_TOKENS.BORDER_RADIUS;
export const PADDING = LEGACY_TOKENS.PADDING;
export { UIHelper };

// Legacy typography variants (matches old theme exactly)
export const TYPOGRAPHY = {
	variants: {
		h1: {
			fontSize: 60,
			fontWeight: 500,
			fontFamily: "Poppins",
		},
		h2: {
			fontSize: 48,
			fontWeight: 500,
			fontFamily: "Poppins",
		},
		h3: {
			fontSize: 42,
			fontWeight: 600,
			fontFamily: "Montserrat",
		},
		h4: {
			fontWeight: 600,
			fontSize: 36,
			fontFamily: "Montserrat",
		},
		h5: undefined,
		h6: {
			fontSize: 24,
			fontFamily: "Montserrat",
			lineHeight: 1.5,
		},
		paragraph: {
			fontSize: 18,
			fontFamily: "Montserrat",
		},
		topic: {
			fontSize: 16,
			fontWeight: 300,
			fontFamily: "Montserrat",
		},
		label: {
			fontSize: 12,
			fontFamily: "Poppins",
		},
		tag: {
			fontSize: 10,
			fontFamily: "Montserrat",
		},
		subtitle1: undefined,
		subtitle2: undefined,
		body1: undefined,
		body2: undefined,
	},
};

/**
 * Migration Steps for Components:
 *
 * 1. IMMEDIATE (No Changes Required):
 *    Change: import { theme, COLORS, UIHelper } from "@/domains/ui-system/theme/migration";
 *    To:     import { theme, COLORS, UIHelper } from "@/domains/ui-system/theme/migration";
 *
 * 2. GRADUAL (Component by Component):
 *    - Replace COLORS.black[800] with theme.palette.black[800]
 *    - Replace PADDING.small with theme.spacing(1) or design tokens
 *    - Replace UIHelper.whileIs with theme.breakpoints.down
 *
 * 3. FINAL (Remove Migration Layer):
 *    Change: import from "@/domains/ui-system/theme/migration"
 *    To:     import { theme } from "@/domains/ui-system/theme"
 */
