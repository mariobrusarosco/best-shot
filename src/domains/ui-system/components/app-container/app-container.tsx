/**
 * AppContainer - Enhanced Layout Container Component
 *
 * Design system container component following our MUI architecture patterns.
 * Provides consistent spacing, responsive behavior, and layout patterns.
 *
 * Features:
 * - Responsive padding and margins
 * - Multiple layout variants
 * - Consistent design system integration
 * - Flexible content positioning
 *
 * Uses Dynamic sx prop pattern for layout-specific customizations.
 */

import { Container as MuiContainer, type ContainerProps as MuiContainerProps } from "@mui/material";
import { type Breakpoint, styled } from "@mui/material/styles";
import { forwardRef } from "react";

// Extended container props for our design system
export interface AppContainerProps extends Omit<MuiContainerProps, "variant"> {
	/**
	 * Container layout variant
	 */
	variant?: "default" | "centered" | "fullWidth" | "screen";
	/**
	 * Vertical spacing mode
	 */
	spacing?: "none" | "compact" | "default" | "relaxed";
}

// ===== STYLED COMPONENTS (Following Static Styled Components Pattern) =====

// Enhanced container with design system integration
const StyledContainer = styled(MuiContainer)<AppContainerProps>(({ theme, variant, spacing }) => ({
	// Base responsive padding (enhanced from theme defaults)
	paddingLeft: theme.spacing(2),
	paddingRight: theme.spacing(2),

	[theme.breakpoints.up("tablet")]: {
		paddingLeft: theme.spacing(3),
		paddingRight: theme.spacing(3),
	},

	[theme.breakpoints.up("laptop")]: {
		paddingLeft: theme.spacing(4),
		paddingRight: theme.spacing(4),
	},

	[theme.breakpoints.up("desktop")]: {
		paddingLeft: theme.spacing(6),
		paddingRight: theme.spacing(6),
	},

	// Variant-specific styles
	...(variant === "centered" && {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		minHeight: "100vh",
	}),

	...(variant === "fullWidth" && {
		maxWidth: "100%",
		width: "100%",
		paddingLeft: 0,
		paddingRight: 0,
	}),

	...(variant === "screen" && {
		minHeight: "100vh",
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),

		[theme.breakpoints.up("tablet")]: {
			paddingTop: theme.spacing(3),
			paddingBottom: theme.spacing(3),
		},

		[theme.breakpoints.up("laptop")]: {
			paddingTop: theme.spacing(4),
			paddingBottom: theme.spacing(4),
		},
	}),

	// Spacing variants
	...(spacing === "none" && {
		paddingTop: 0,
		paddingBottom: 0,
	}),

	...(spacing === "compact" && {
		paddingTop: theme.spacing(1),
		paddingBottom: theme.spacing(1),

		[theme.breakpoints.up("tablet")]: {
			paddingTop: theme.spacing(2),
			paddingBottom: theme.spacing(2),
		},
	}),

	...(spacing === "default" && {
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),

		[theme.breakpoints.up("tablet")]: {
			paddingTop: theme.spacing(3),
			paddingBottom: theme.spacing(3),
		},

		[theme.breakpoints.up("laptop")]: {
			paddingTop: theme.spacing(4),
			paddingBottom: theme.spacing(4),
		},
	}),

	...(spacing === "relaxed" && {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),

		[theme.breakpoints.up("tablet")]: {
			paddingTop: theme.spacing(6),
			paddingBottom: theme.spacing(6),
		},

		[theme.breakpoints.up("laptop")]: {
			paddingTop: theme.spacing(8),
			paddingBottom: theme.spacing(8),
		},
	}),
}));

/**
 * AppContainer Component
 *
 * Enhanced container component that provides consistent layout patterns
 * and responsive behavior across the Best Shot application.
 *
 * @example
 * ```tsx
 * <AppContainer variant="default" spacing="default">
 *   <Content />
 * </AppContainer>
 *
 * <AppContainer variant="centered" spacing="relaxed">
 *   <LoginForm />
 * </AppContainer>
 *
 * <AppContainer variant="screen" spacing="compact">
 *   <Dashboard />
 * </AppContainer>
 * ```
 */
export const AppContainer = forwardRef<HTMLDivElement, AppContainerProps>(
	({ children, variant = "default", spacing = "default", maxWidth = "lg", ...props }, ref) => {
		return (
			<StyledContainer ref={ref} spacing={spacing} maxWidth={maxWidth as Breakpoint} {...props}>
				{children}
			</StyledContainer>
		);
	}
);

AppContainer.displayName = "AppContainer";

// Export for backward compatibility
export { AppContainer as default };
