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

import { createTheme } from '@mui/material/styles';

// Foundation imports
import { MUI_PALETTE_COLORS, DESIGN_SYSTEM_COLORS } from './foundation/colors';
import { MUI_TYPOGRAPHY_CONFIG } from './foundation/typography';
import { MUI_SPACING_CONFIG, DESIGN_SYSTEM_SPACING } from './foundation/spacing';
import { MUI_BREAKPOINTS_CONFIG, createUIHelper } from './foundation/breakpoints';

// Component overrides
import { buttonOverrides } from './components/button';
import { cardOverrides } from './components/card';

// Create the enhanced theme
const theme = createTheme({
	// === FOUNDATION ===
	
	// Color system
	palette: {
		mode: 'light',
		...MUI_PALETTE_COLORS,
	},
	
	// Typography system  
	typography: {
		...MUI_TYPOGRAPHY_CONFIG,
	},
	
	// Spacing system (8px base unit)
	spacing: MUI_SPACING_CONFIG,
	
	// Breakpoint system
	breakpoints: MUI_BREAKPOINTS_CONFIG,
	
	// Shape system
	shape: {
		borderRadius: 8, // Default border radius
	},
	
	// Shadow system
	shadows: [
		'none',
		'0 1px 2px 0 rgb(0 0 0 / 0.05)',
		'0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
		'0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
		'0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
		'0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
		'0 25px 50px -12px rgb(0 0 0 / 0.25)',
		'0 35px 60px -12px rgb(0 0 0 / 0.3)',
		'0 45px 70px -12px rgb(0 0 0 / 0.35)',
		'0 55px 80px -12px rgb(0 0 0 / 0.4)',
		'0 65px 90px -12px rgb(0 0 0 / 0.45)',
		'0 75px 100px -12px rgb(0 0 0 / 0.5)',
		'0 85px 110px -12px rgb(0 0 0 / 0.55)',
		'0 95px 120px -12px rgb(0 0 0 / 0.6)',
		'0 105px 130px -12px rgb(0 0 0 / 0.65)',
		'0 115px 140px -12px rgb(0 0 0 / 0.7)',
		'0 125px 150px -12px rgb(0 0 0 / 0.75)',
		'0 135px 160px -12px rgb(0 0 0 / 0.8)',
		'0 145px 170px -12px rgb(0 0 0 / 0.85)',
		'0 155px 180px -12px rgb(0 0 0 / 0.9)',
		'0 165px 190px -12px rgb(0 0 0 / 0.95)',
		'0 175px 200px -12px rgb(0 0 0 / 1)',
		'0 185px 210px -12px rgb(0 0 0 / 1)',
		'0 195px 220px -12px rgb(0 0 0 / 1)',
		'0 205px 230px -12px rgb(0 0 0 / 1)',
	],
	
	// Z-index system
	zIndex: {
		mobileStepper: 1000,
		fab: 1050,
		speedDial: 1050,
		appBar: 1100,
		drawer: 1200,
		modal: 1300,
		snackbar: 1400,
		tooltip: 1500,
	},
	
	// === COMPONENT OVERRIDES ===
	components: {
		// MUI component overrides
		MuiButton: buttonOverrides,
		MuiCard: cardOverrides,
		
		// Typography component
		MuiTypography: {
			defaultProps: {
				// Enable responsive typography
				component: 'div',
			},
		},
		
		// Media query component (existing)
		MuiUseMediaQuery: {
			defaultProps: {
				noSsr: true,
			},
		},
		
		// Container component
		MuiContainer: {
			styleOverrides: {
				root: ({ theme }) => ({
					paddingLeft: theme.spacing(2),
					paddingRight: theme.spacing(2),
					
					[theme.breakpoints.up('tablet')]: {
						paddingLeft: theme.spacing(3),
						paddingRight: theme.spacing(3),
					},
					
					[theme.breakpoints.up('laptop')]: {
						paddingLeft: theme.spacing(4),
						paddingRight: theme.spacing(4),
					},
				}),
			},
		},
		
		// Paper component
		MuiPaper: {
			styleOverrides: {
				root: ({ theme }) => ({
					borderRadius: theme.spacing(1.5),
					border: `1px solid ${theme.palette.divider}`,
				}),
			},
		},
		
		// TextField component
		MuiTextField: {
			styleOverrides: {
				root: ({ theme }) => ({
					'& .MuiOutlinedInput-root': {
						borderRadius: theme.spacing(1),
						
						'&:hover .MuiOutlinedInput-notchedOutline': {
							borderColor: theme.palette.primary.main,
						},
						
						'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
							borderWidth: '2px',
						},
					},
				}),
			},
			defaultProps: {
				variant: 'outlined',
			},
		},
	},
});

// === EXTENDED THEME WITH DESIGN SYSTEM ===

// Augment the theme with our design system tokens
declare module '@mui/material/styles' {
	interface Theme {
		designSystem: typeof DESIGN_SYSTEM_COLORS & typeof DESIGN_SYSTEM_SPACING;
	}
	
	interface ThemeOptions {
		designSystem?: typeof DESIGN_SYSTEM_COLORS & typeof DESIGN_SYSTEM_SPACING;
	}
	
	// Extend palette with custom colors
	interface Palette {
		black: typeof DESIGN_SYSTEM_COLORS.black;
		neutral: typeof DESIGN_SYSTEM_COLORS.neutral;
		teal: typeof DESIGN_SYSTEM_COLORS.primary;
		green: typeof DESIGN_SYSTEM_COLORS.success;
		red: typeof DESIGN_SYSTEM_COLORS.error;
		pink: typeof DESIGN_SYSTEM_COLORS.pink;
	}
	
	interface PaletteOptions {
		black?: typeof DESIGN_SYSTEM_COLORS.black;
		neutral?: typeof DESIGN_SYSTEM_COLORS.neutral;
		teal?: typeof DESIGN_SYSTEM_COLORS.primary;
		green?: typeof DESIGN_SYSTEM_COLORS.success;
		red?: typeof DESIGN_SYSTEM_COLORS.error;
		pink?: typeof DESIGN_SYSTEM_COLORS.pink;
	}
	
	// Extend button variants
	interface ButtonPropsVariantOverrides {
		tournament: true;
		aiPrediction: true;
	}
	
	// Extend card variants
	interface CardPropsVariantOverrides {
		tournament: true;
		match: true;
		league: true;
		aiInsight: true;
		elevated: true;
		flat: true;
	}
}

// Add design system tokens to theme
const enhancedTheme = createTheme(theme, {
	designSystem: {
		...DESIGN_SYSTEM_COLORS,
		...DESIGN_SYSTEM_SPACING,
	},
});

// === UI HELPER ===

// Enhanced UIHelper with additional responsive utilities
export const UIHelper = createUIHelper(enhancedTheme);

// === EXPORTS ===

export { enhancedTheme as theme };
export default enhancedTheme;

// Export design tokens for direct usage
export { DESIGN_SYSTEM_COLORS as colors } from './foundation/colors';
export { DESIGN_SYSTEM_SPACING as spacing } from './foundation/spacing';
export { DESIGN_SYSTEM_BREAKPOINTS as breakpoints } from './foundation/breakpoints';

// Export legacy tokens for backward compatibility
export { COLORS } from './foundation/colors';
export { PADDING, BORDER_RADIUS } from './foundation/spacing';
export { TYPOGRAPHY } from './foundation/typography';