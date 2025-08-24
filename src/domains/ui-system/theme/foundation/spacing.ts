/**
 * Design System Foundation: Spacing
 * 
 * Consistent spacing system following 8px base unit with semantic naming.
 * Includes padding, margin, and gap utilities.
 */

// Base spacing unit (8px)
export const BASE_SPACING_UNIT = 8;

// Spacing Scale (based on 8px unit)
export const SPACING_SCALE = {
	0: 0,
	0.5: BASE_SPACING_UNIT * 0.5,  // 4px
	1: BASE_SPACING_UNIT * 1,      // 8px
	1.5: BASE_SPACING_UNIT * 1.5,  // 12px
	2: BASE_SPACING_UNIT * 2,      // 16px
	2.5: BASE_SPACING_UNIT * 2.5,  // 20px
	3: BASE_SPACING_UNIT * 3,      // 24px
	3.5: BASE_SPACING_UNIT * 3.5,  // 28px
	4: BASE_SPACING_UNIT * 4,      // 32px
	5: BASE_SPACING_UNIT * 5,      // 40px
	6: BASE_SPACING_UNIT * 6,      // 48px
	7: BASE_SPACING_UNIT * 7,      // 56px
	8: BASE_SPACING_UNIT * 8,      // 64px
	10: BASE_SPACING_UNIT * 10,    // 80px
	12: BASE_SPACING_UNIT * 12,    // 96px
	16: BASE_SPACING_UNIT * 16,    // 128px
	20: BASE_SPACING_UNIT * 20,    // 160px
	24: BASE_SPACING_UNIT * 24,    // 192px
} as const;

// Semantic Spacing (for common use cases)
export const SEMANTIC_SPACING = {
	none: SPACING_SCALE[0],
	tiny: SPACING_SCALE[0.5],      // 4px
	small: SPACING_SCALE[1],       // 8px
	medium: SPACING_SCALE[2],      // 16px
	large: SPACING_SCALE[3],       // 24px
	xlarge: SPACING_SCALE[4],      // 32px
	xxlarge: SPACING_SCALE[6],     // 48px
	huge: SPACING_SCALE[8],        // 64px
} as const;

// Enhanced PADDING (keeping existing + adding new)
export const PADDING = {
	none: "0",
	tiny: "4px",                   // existing
	"extra-small": "12px",         // existing  
	small: "8px",                  // existing
	medium: "12px",                // existing
	large: "16px",                 // existing
	"extra-large": "20px",         // existing
	huge: "24px",                  // existing
	
	// New semantic padding
	xs: "4px",
	sm: "8px", 
	md: "16px",
	lg: "24px",
	xl: "32px",
	"2xl": "48px",
	"3xl": "64px",
} as const;

// MARGIN (following same pattern as padding)
export const MARGIN = {
	none: "0",
	tiny: "4px",
	small: "8px",
	medium: "16px",
	large: "24px",
	xlarge: "32px",
	xxlarge: "48px",
	huge: "64px",
	
	// Semantic margin
	xs: "4px",
	sm: "8px", 
	md: "16px",
	lg: "24px",
	xl: "32px",
	"2xl": "48px",
	"3xl": "64px",
} as const;

// GAP (for flexbox and grid layouts)
export const GAP = {
	none: "0",
	tiny: "4px",
	small: "8px",
	medium: "16px",
	large: "24px",
	xlarge: "32px",
	
	// Numeric scale for easier usage
	1: "8px",
	2: "16px",
	3: "24px",
	4: "32px",
	5: "40px",
	6: "48px",
} as const;

// Border Radius (enhanced from existing)
export const BORDER_RADIUS = {
	none: "0",
	small: "4px",
	medium: "8px",        // existing small
	large: "12px",
	xlarge: "16px",
	full: "50%",          // existing
	rounded: "9999px",    // For pill-shaped elements
} as const;

// Shadows (following Material Design elevation)
export const SHADOWS = {
	none: "none",
	sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
	md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
	lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
	xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
	"2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
	inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
} as const;

// Z-Index Scale
export const Z_INDEX = {
	base: 0,
	dropdown: 1000,
	sticky: 1010,
	banner: 1020,
	overlay: 1030,
	modal: 1040,
	popover: 1050,
	tooltip: 1060,
	notification: 1070,
	max: 9999,
} as const;

// MUI Theme Spacing Configuration
export const MUI_SPACING_CONFIG = (factor: number) => `${BASE_SPACING_UNIT * factor}px`;

// Export for theme integration
export const DESIGN_SYSTEM_SPACING = {
	scale: SPACING_SCALE,
	semantic: SEMANTIC_SPACING,
	padding: PADDING,
	margin: MARGIN,
	gap: GAP,
	borderRadius: BORDER_RADIUS,
	shadows: SHADOWS,
	zIndex: Z_INDEX,
} as const;