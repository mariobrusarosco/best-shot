/**
 * AppBox - Enhanced Layout Utility Component
 *
 * Design system box component following our MUI architecture patterns.
 * Optimized for layout, spacing, and quick styling using the sx prop pattern.
 *
 * Features:
 * - Optimized sx prop usage (Dynamic sx Prop pattern)
 * - Common layout presets
 * - Responsive helper utilities
 * - Performance optimized for frequent usage
 *
 * This component exemplifies our Dynamic sx Prop pattern for layout and one-off styling.
 */

import { Box as MuiBox, type BoxProps as MuiBoxProps } from "@mui/system";
import { forwardRef } from "react";

// Extended box props for our design system
export interface AppBoxProps extends MuiBoxProps {
	/**
	 * Common layout preset patterns
	 */
	layout?: "flex-row" | "flex-col" | "grid" | "center" | "space-between" | "stack";
	/**
	 * Common spacing preset
	 */
	spacing?: "xs" | "sm" | "md" | "lg" | "xl";
	/**
	 * Quick responsive display control
	 */
	hide?: "mobile" | "tablet" | "desktop";
	/**
	 * Quick responsive show control
	 */
	show?: "mobile" | "tablet" | "desktop";
}

// Common layout patterns (optimized objects for performance)
const LAYOUT_PRESETS = {
	"flex-row": {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},
	"flex-col": {
		display: "flex",
		flexDirection: "column",
	},
	grid: {
		display: "grid",
	},
	center: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	"space-between": {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
	},
	stack: {
		display: "flex",
		flexDirection: "column",
		gap: 2,
	},
} as const;

// Common spacing patterns
const SPACING_PRESETS = {
	xs: 1,
	sm: 2,
	md: 3,
	lg: 4,
	xl: 6,
} as const;

// Responsive display patterns
const RESPONSIVE_HIDE = {
	mobile: {
		display: { mobile: "none", tablet: "block" },
	},
	tablet: {
		display: { mobile: "block", tablet: "none", desktop: "block" },
	},
	desktop: {
		display: { mobile: "block", tablet: "block", desktop: "none" },
	},
} as const;

const RESPONSIVE_SHOW = {
	mobile: {
		display: { mobile: "block", tablet: "none" },
	},
	tablet: {
		display: { mobile: "none", tablet: "block", desktop: "none" },
	},
	desktop: {
		display: { mobile: "none", tablet: "none", desktop: "block" },
	},
} as const;

/**
 * AppBox Component
 *
 * Enhanced box component optimized for layout and spacing patterns.
 * Uses the Dynamic sx Prop pattern for flexible, responsive styling.
 *
 * @example
 * ```tsx
 * // Layout presets
 * <AppBox layout="flex-row" spacing="md">
 *   <Button />
 *   <Button />
 * </AppBox>
 *
 * // Responsive visibility
 * <AppBox hide="mobile" layout="space-between">
 *   <Navigation />
 * </AppBox>
 *
 * // Custom sx with responsive values
 * <AppBox sx={{
 *   p: { mobile: 2, tablet: 3, desktop: 4 },
 *   gridTemplateColumns: { mobile: '1fr', tablet: 'repeat(2, 1fr)' }
 * }}>
 *   <Content />
 * </AppBox>
 * ```
 */
export const AppBox = forwardRef<HTMLDivElement, AppBoxProps>(
	({ children, layout, spacing, hide, show, sx = {}, ...props }, ref) => {
		// Build sx object with presets and custom styles
		const computedSx = {
			// Apply layout preset
			...(layout && LAYOUT_PRESETS[layout]),

			// Apply spacing (gap for flex layouts, padding for others)
			...(spacing &&
				(layout?.includes("flex") || layout === "stack"
					? { gap: SPACING_PRESETS[spacing] }
					: { p: SPACING_PRESETS[spacing] })),

			// Apply responsive visibility
			...(hide && RESPONSIVE_HIDE[hide]),
			...(show && RESPONSIVE_SHOW[show]),

			// Merge with custom sx prop
			...sx,
		};

		return (
			<MuiBox ref={ref} sx={computedSx} {...props}>
				{children}
			</MuiBox>
		);
	}
);

AppBox.displayName = "AppBox";

// Export for backward compatibility
export { AppBox as default };
