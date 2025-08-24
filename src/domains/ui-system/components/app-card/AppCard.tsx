/**
 * AppCard - Enhanced Base Card Component
 *
 * Design system base card following our MUI architecture patterns.
 * This component serves as the foundation for all card variants across domains.
 *
 * Features:
 * - Multiple variants (tournament, league, match, aiInsight, elevated, flat)
 * - Interactive states (hover, focus, loading)
 * - Consistent design system integration
 * - Accessibility support
 * - Motion support for animations
 *
 * Follows Static Styled Components pattern for optimal performance.
 */

import { Card as MuiCard, type CardProps as MuiCardProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "motion/react";
import { forwardRef } from "react";

// Extended card props for our design system
export interface AppCardProps extends Omit<MuiCardProps, "variant"> {
	/**
	 * Card variant for different use cases
	 */
	variant?: "tournament" | "league" | "match" | "aiInsight" | "elevated" | "flat";
	/**
	 * Interactive state - adds hover effects and cursor pointer
	 */
	interactive?: boolean;
	/**
	 * Loading state - shows skeleton-like appearance
	 */
	loading?: boolean;
	/**
	 * Enable motion animations
	 */
	withMotion?: boolean;
}

// ===== STYLED COMPONENTS (Following Static Styled Components Pattern) =====

// Base card with design system integration
const StyledCard = styled(MuiCard)<AppCardProps>(({ theme, variant, interactive, loading }) => ({
	// Base styles
	borderRadius: theme.spacing(1.5),
	border: `1px solid ${theme.palette.divider}`,
	boxShadow: theme.shadows[2],
	transition: theme.transitions.create(["transform", "box-shadow", "opacity"]),

	// Loading state
	...(loading && {
		opacity: 0.7,
		pointerEvents: "none",
	}),

	// Interactive behavior
	...(interactive && {
		cursor: "pointer",
		"&:hover": {
			transform: "translateY(-2px)",
			boxShadow: theme.shadows[4],
		},
		"&:focus-visible": {
			outline: `2px solid ${theme.palette.primary.main}`,
			outlineOffset: "2px",
		},
	}),

	// Variant-specific styles
	...(variant === "tournament" && {
		backgroundColor: theme.palette.black[800],
		color: theme.palette.neutral[100],
		borderColor: theme.palette.primary.main,
	}),

	...(variant === "league" && {
		backgroundColor: theme.palette.background.paper,
		borderColor: theme.palette.primary.main,
	}),

	...(variant === "match" && {
		backgroundColor: theme.palette.black[800],
		color: theme.palette.neutral[100],
		padding: theme.spacing(2),
	}),

	...(variant === "aiInsight" && {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.primary.contrastText,
		borderColor: theme.palette.primary.dark,
	}),

	...(variant === "elevated" && {
		boxShadow: theme.shadows[8],
		"&:hover": interactive
			? {
					boxShadow: theme.shadows[12],
				}
			: {},
	}),

	...(variant === "flat" && {
		boxShadow: "none",
		border: "none",
		backgroundColor: "transparent",
	}),

	// Responsive padding
	[theme.breakpoints.down("tablet")]: {
		padding: theme.spacing(1.5),
	},

	[theme.breakpoints.up("laptop")]: {
		padding: theme.spacing(2.5),
	},
}));

// Motion-enabled card wrapper
const MotionCard = styled(motion.div)({
	display: "contents",
});

/**
 * AppCard Component
 *
 * Enhanced card component that serves as the base for all cards
 * in the Best Shot application. Includes multiple variants, interactive
 * states, and follows our design system patterns.
 *
 * @example
 * ```tsx
 * <AppCard variant="tournament" interactive>
 *   <CardContent>Tournament content</CardContent>
 * </AppCard>
 *
 * <AppCard
 *   variant="match"
 *   loading={isLoading}
 *   withMotion
 * >
 *   <CardContent>Match details</CardContent>
 * </AppCard>
 * ```
 */
export const AppCard = forwardRef<HTMLDivElement, AppCardProps>(
	(
		{
			children,
			variant = "elevated",
			interactive = false,
			loading = false,
			withMotion = false,
			...props
		},
		ref
	) => {
		const cardContent = (
			<StyledCard
				ref={ref}
				interactive={interactive}
				loading={loading}
				tabIndex={interactive ? 0 : undefined}
				role={interactive ? "button" : undefined}
				{...props}
			>
				{children}
			</StyledCard>
		);

		// Wrap with motion if requested
		if (withMotion) {
			return (
				<MotionCard
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					whileHover={interactive ? { scale: 1.02 } : undefined}
					transition={{ duration: 0.2 }}
				>
					{cardContent}
				</MotionCard>
			);
		}

		return cardContent;
	}
);

AppCard.displayName = "AppCard";

// Export for backward compatibility
export { AppCard as default };
