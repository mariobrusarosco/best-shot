/**
 * Design System Foundation: Typography
 * 
 * Typography scale and variants following the Best Shot design system.
 * Uses Poppins for headings (clean, modern) and Montserrat for content (readable).
 */

// Font Families
export const FONT_FAMILIES = {
	heading: '"Poppins", sans-serif',
	body: '"Montserrat", sans-serif',
	mono: '"JetBrains Mono", "Consolas", monospace',
} as const;

// Font Weights
export const FONT_WEIGHTS = {
	light: 300,
	regular: 400,
	medium: 500,
	semiBold: 600,
	bold: 700,
	extraBold: 800,
} as const;

// Font Sizes (in rem for scalability)
export const FONT_SIZES = {
	xs: "0.625rem",   // 10px
	sm: "0.75rem",    // 12px
	base: "0.875rem", // 14px
	md: "1rem",       // 16px
	lg: "1.125rem",   // 18px
	xl: "1.25rem",    // 20px
	"2xl": "1.5rem",  // 24px
	"3xl": "1.875rem", // 30px
	"4xl": "2.25rem", // 36px
	"5xl": "2.625rem", // 42px
	"6xl": "3rem",    // 48px
	"7xl": "3.75rem", // 60px
} as const;

// Line Heights
export const LINE_HEIGHTS = {
	tight: 1.25,
	normal: 1.4,
	relaxed: 1.5,
	loose: 1.75,
} as const;

// Typography Variants (Enhanced from existing system)
export const TYPOGRAPHY_VARIANTS = {
	// Headings (Poppins - clean, modern)
	h1: {
		fontFamily: FONT_FAMILIES.heading,
		fontSize: FONT_SIZES["7xl"], // 60px (existing)
		fontWeight: FONT_WEIGHTS.medium, // 500 (existing)
		lineHeight: LINE_HEIGHTS.tight,
	},
	h2: {
		fontFamily: FONT_FAMILIES.heading,
		fontSize: FONT_SIZES["6xl"], // 48px (existing)
		fontWeight: FONT_WEIGHTS.medium, // 500 (existing)
		lineHeight: LINE_HEIGHTS.tight,
	},
	h3: {
		fontFamily: FONT_FAMILIES.body,
		fontSize: FONT_SIZES["5xl"], // 42px (existing)
		fontWeight: FONT_WEIGHTS.semiBold, // 600 (existing)
		lineHeight: LINE_HEIGHTS.normal,
	},
	h4: {
		fontFamily: FONT_FAMILIES.body,
		fontSize: FONT_SIZES["4xl"], // 36px (existing)
		fontWeight: FONT_WEIGHTS.semiBold, // 600 (existing)
		lineHeight: LINE_HEIGHTS.normal,
	},
	h5: {
		fontFamily: FONT_FAMILIES.body,
		fontSize: FONT_SIZES["3xl"], // 30px
		fontWeight: FONT_WEIGHTS.semiBold,
		lineHeight: LINE_HEIGHTS.normal,
	},
	h6: {
		fontFamily: FONT_FAMILIES.body,
		fontSize: FONT_SIZES["2xl"], // 24px (existing)
		fontWeight: FONT_WEIGHTS.medium,
		lineHeight: LINE_HEIGHTS.relaxed, // 1.5 (existing)
	},
	
	// Body Text (Montserrat - readable)
	body1: {
		fontFamily: FONT_FAMILIES.body,
		fontSize: FONT_SIZES.md, // 16px
		fontWeight: FONT_WEIGHTS.regular,
		lineHeight: LINE_HEIGHTS.relaxed,
	},
	body2: {
		fontFamily: FONT_FAMILIES.body,
		fontSize: FONT_SIZES.base, // 14px
		fontWeight: FONT_WEIGHTS.regular,
		lineHeight: LINE_HEIGHTS.normal,
	},
	
	// Custom Variants (from existing system)
	paragraph: {
		fontFamily: FONT_FAMILIES.body,
		fontSize: FONT_SIZES.lg, // 18px (existing)
		fontWeight: FONT_WEIGHTS.regular,
		lineHeight: LINE_HEIGHTS.relaxed,
	},
	topic: {
		fontFamily: FONT_FAMILIES.body,
		fontSize: FONT_SIZES.md, // 16px (existing)
		fontWeight: FONT_WEIGHTS.light, // 300 (existing)
		lineHeight: LINE_HEIGHTS.normal,
	},
	label: {
		fontFamily: FONT_FAMILIES.heading,
		fontSize: FONT_SIZES.sm, // 12px (existing)
		fontWeight: FONT_WEIGHTS.medium,
		lineHeight: LINE_HEIGHTS.normal,
	},
	tag: {
		fontFamily: FONT_FAMILIES.body,
		fontSize: FONT_SIZES.xs, // 10px (existing)
		fontWeight: FONT_WEIGHTS.regular,
		lineHeight: LINE_HEIGHTS.normal,
	},
	
	// Additional useful variants
	caption: {
		fontFamily: FONT_FAMILIES.body,
		fontSize: FONT_SIZES.sm, // 12px
		fontWeight: FONT_WEIGHTS.regular,
		lineHeight: LINE_HEIGHTS.normal,
	},
	overline: {
		fontFamily: FONT_FAMILIES.heading,
		fontSize: FONT_SIZES.xs, // 10px
		fontWeight: FONT_WEIGHTS.semiBold,
		textTransform: "uppercase" as const,
		letterSpacing: "0.1em",
		lineHeight: LINE_HEIGHTS.normal,
	},
	
	// Subtitles
	subtitle1: {
		fontFamily: FONT_FAMILIES.body,
		fontSize: FONT_SIZES.md, // 16px
		fontWeight: FONT_WEIGHTS.medium,
		lineHeight: LINE_HEIGHTS.normal,
	},
	subtitle2: {
		fontFamily: FONT_FAMILIES.body,
		fontSize: FONT_SIZES.base, // 14px
		fontWeight: FONT_WEIGHTS.medium,
		lineHeight: LINE_HEIGHTS.normal,
	},
} as const;

// MUI Theme Typography Configuration
export const MUI_TYPOGRAPHY_CONFIG = {
	fontFamily: [FONT_FAMILIES.body, FONT_FAMILIES.heading].join(","),
	...TYPOGRAPHY_VARIANTS,
} as const;

// Legacy export for backward compatibility
export const TYPOGRAPHY = {
	variants: TYPOGRAPHY_VARIANTS,
} as const;