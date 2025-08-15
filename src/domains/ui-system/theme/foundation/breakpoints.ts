/**
 * Design System Foundation: Breakpoints
 * 
 * Responsive breakpoint system optimized for Best Shot application.
 * Follows mobile-first approach with semantic naming.
 */

// Breakpoint Values (in pixels)
export const BREAKPOINT_VALUES = {
	all: 0,        // All screen sizes (existing)
	mobile: 768,   // Mobile landscape and up (existing)
	tablet: 769,   // Tablet portrait and up (existing)  
	laptop: 1024,  // Laptop and up (existing)
	desktop: 1440, // Desktop and up (existing)
} as const;

// Additional breakpoint aliases for common use cases
export const BREAKPOINT_ALIASES = {
	xs: BREAKPOINT_VALUES.all,      // Extra small (0px+)
	sm: BREAKPOINT_VALUES.mobile,   // Small (768px+)
	md: BREAKPOINT_VALUES.tablet,   // Medium (769px+)
	lg: BREAKPOINT_VALUES.laptop,   // Large (1024px+)
	xl: BREAKPOINT_VALUES.desktop,  // Extra large (1440px+)
} as const;

// Container Max Widths
export const CONTAINER_MAX_WIDTHS = {
	sm: 640,   // Small container
	md: 768,   // Medium container  
	lg: 1024,  // Large container
	xl: 1280,  // Extra large container
	"2xl": 1400, // 2X large container
} as const;

// Responsive Grid Columns
export const GRID_COLUMNS = {
	mobile: 4,    // 4 columns on mobile
	tablet: 8,    // 8 columns on tablet
	laptop: 12,   // 12 columns on laptop+
	desktop: 12,  // 12 columns on desktop
} as const;

// Media Query Helpers (for use in styled components)
export const MEDIA_QUERIES = {
	// Mobile first approach
	up: {
		mobile: `@media (min-width: ${BREAKPOINT_VALUES.mobile}px)`,
		tablet: `@media (min-width: ${BREAKPOINT_VALUES.tablet}px)`,
		laptop: `@media (min-width: ${BREAKPOINT_VALUES.laptop}px)`,
		desktop: `@media (min-width: ${BREAKPOINT_VALUES.desktop}px)`,
	},
	
	// Max-width queries
	down: {
		mobile: `@media (max-width: ${BREAKPOINT_VALUES.mobile - 1}px)`,
		tablet: `@media (max-width: ${BREAKPOINT_VALUES.tablet - 1}px)`,
		laptop: `@media (max-width: ${BREAKPOINT_VALUES.laptop - 1}px)`,
		desktop: `@media (max-width: ${BREAKPOINT_VALUES.desktop - 1}px)`,
	},
	
	// Range queries
	only: {
		mobile: `@media (max-width: ${BREAKPOINT_VALUES.tablet - 1}px)`,
		tablet: `@media (min-width: ${BREAKPOINT_VALUES.tablet}px) and (max-width: ${BREAKPOINT_VALUES.laptop - 1}px)`,
		laptop: `@media (min-width: ${BREAKPOINT_VALUES.laptop}px) and (max-width: ${BREAKPOINT_VALUES.desktop - 1}px)`,
		desktop: `@media (min-width: ${BREAKPOINT_VALUES.desktop}px)`,
	},
} as const;

// MUI Theme Breakpoints Configuration
export const MUI_BREAKPOINTS_CONFIG = {
	values: BREAKPOINT_VALUES,
	// Unit for breakpoint values
	unit: 'px',
	// Custom breakpoint names (properly typed for MUI)
	keys: ['all', 'mobile', 'tablet', 'laptop', 'desktop'],
};

// Responsive Design Tokens
export const RESPONSIVE_TOKENS = {
	// Common responsive padding
	padding: {
		mobile: "16px",
		tablet: "24px", 
		laptop: "32px",
		desktop: "40px",
	},
	
	// Common responsive margins
	margin: {
		mobile: "16px",
		tablet: "24px",
		laptop: "32px", 
		desktop: "48px",
	},
	
	// Container padding
	containerPadding: {
		mobile: "16px",
		tablet: "24px",
		laptop: "32px",
		desktop: "40px",
	},
	
	// Typography scaling
	fontSize: {
		mobile: 1,      // Base scale
		tablet: 1.1,    // 10% larger
		laptop: 1.15,   // 15% larger
		desktop: 1.2,   // 20% larger
	},
} as const;

// Legacy UIHelper (enhanced version)
export const createUIHelper = (theme: any) => ({
	whileIs: theme.breakpoints.down,
	startsOn: theme.breakpoints.up,
	between: theme.breakpoints.between,
	only: theme.breakpoints.only,
	
	// Additional helpers
	isMobile: theme.breakpoints.down('tablet'),
	isTabletUp: theme.breakpoints.up('tablet'),
	isLaptopUp: theme.breakpoints.up('laptop'),
	isDesktopUp: theme.breakpoints.up('desktop'),
});

// Export everything for theme integration
export const DESIGN_SYSTEM_BREAKPOINTS = {
	values: BREAKPOINT_VALUES,
	aliases: BREAKPOINT_ALIASES,
	containerMaxWidths: CONTAINER_MAX_WIDTHS,
	gridColumns: GRID_COLUMNS,
	mediaQueries: MEDIA_QUERIES,
	responsiveTokens: RESPONSIVE_TOKENS,
} as const;