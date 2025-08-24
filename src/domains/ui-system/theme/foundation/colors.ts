/**
 * Design System Foundation: Colors
 * 
 * Semantic color palette following the Best Shot design system.
 * Based on research from our styling guide and current implementation.
 */

// Primary & Brand Colors
export const PRIMARY_COLORS = {
	teal: {
		400: "#7BA9A4", // Lighter teal for hover states
		500: "#6A9B96", // Primary brand color (existing)
		600: "#5A857F", // Darker teal for pressed states
	},
} as const;

// Semantic Colors
export const SEMANTIC_COLORS = {
	success: {
		200: "#8AC79F", // Success states (existing)
		500: "#4CAF50", // Standard success
	},
	error: {
		400: "#FF6D6D", // Error states (existing)
		500: "#F44336", // Standard error
	},
	warning: {
		400: "#FFB74D",
		500: "#FF9800",
	},
	info: {
		400: "#64B5F6",
		500: "#2196F3",
	},
} as const;

// Neutral/Grayscale Palette
export const NEUTRAL_COLORS = {
	black: {
		300: "#939393", // Light gray (existing)
		400: "#484848", // Medium gray (existing)
		500: "#373737", // Dark gray (existing)
		700: "#131514", // Almost black (existing)
		800: "#232424", // Card backgrounds (existing)
	},
	neutral: {
		0: "#FFFFFF",    // Pure white (existing)
		100: "#FDFCFC",  // Light text/backgrounds (existing)
		200: "#F5F5F5",  // Very light gray
		300: "#E0E0E0",  // Light gray
		400: "#BDBDBD",  // Medium-light gray
		500: "#A3ABA8",  // Medium gray (existing)
		600: "#757575",  // Medium-dark gray
		700: "#424242",  // Dark gray
		800: "#212121",  // Very dark gray
		900: "#121212",  // Near black
	},
} as const;

// Accent Colors
export const ACCENT_COLORS = {
	pink: {
		700: "#BB2253", // Accent color (existing)
	},
} as const;

// Combined Design System Colors
export const DESIGN_SYSTEM_COLORS = {
	primary: PRIMARY_COLORS.teal,
	...SEMANTIC_COLORS,
	...NEUTRAL_COLORS,
	...ACCENT_COLORS,
} as const;

// Export for MUI theme integration
export const MUI_PALETTE_COLORS = {
	primary: {
		main: PRIMARY_COLORS.teal[500],
		light: PRIMARY_COLORS.teal[400],
		dark: PRIMARY_COLORS.teal[600],
	},
	secondary: {
		main: ACCENT_COLORS.pink[700],
	},
	error: {
		main: SEMANTIC_COLORS.error[500],
		light: SEMANTIC_COLORS.error[400],
	},
	warning: {
		main: SEMANTIC_COLORS.warning[500],
		light: SEMANTIC_COLORS.warning[400],
	},
	info: {
		main: SEMANTIC_COLORS.info[500],
		light: SEMANTIC_COLORS.info[400],
	},
	success: {
		main: SEMANTIC_COLORS.success[500],
		light: SEMANTIC_COLORS.success[200],
	},
	background: {
		default: NEUTRAL_COLORS.neutral[100],
		paper: NEUTRAL_COLORS.neutral[0],
	},
	text: {
		primary: NEUTRAL_COLORS.black[800],
		secondary: NEUTRAL_COLORS.black[500],
	},
	// Custom color extensions
	black: NEUTRAL_COLORS.black,
	neutral: NEUTRAL_COLORS.neutral,
	teal: PRIMARY_COLORS.teal,
	green: SEMANTIC_COLORS.success,
	red: SEMANTIC_COLORS.error,
	pink: ACCENT_COLORS.pink,
} as const;

// Legacy export for backward compatibility
export const COLORS = DESIGN_SYSTEM_COLORS;