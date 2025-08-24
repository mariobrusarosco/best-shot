/**
 * AppPill - Pill/Badge Component
 *
 * Follows Static Styled Components pattern for consistent pill/badge elements.
 * Replaces unstable_sx usage with stable styled component pattern.
 */

import { Box, styled } from "@mui/system";
import { shimmerEffect } from "../skeleton/skeleton";

// ===== STYLED COMPONENTS (Following Static Styled Components Pattern) =====

const Pill = styled(Box)(({ theme }) => ({
	display: "grid",
	placeContent: "center",
	alignItems: "center",
	borderRadius: theme.spacing(2.5),

	// Enhanced styling for better consistency
	padding: theme.spacing(0.5, 1.5),
	fontSize: "0.75rem",
	fontWeight: 500,
	minHeight: theme.spacing(3),

	// Default styling
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.primary.contrastText,

	// Responsive text size
	[theme.breakpoints.down("tablet")]: {
		fontSize: "0.7rem",
		padding: theme.spacing(0.25, 1),
	},
}));

const PillSkeleton = styled(Pill)(({ theme }) => ({
	position: "relative",
	backgroundColor: theme.palette.action.hover,
	color: "transparent",
	...shimmerEffect(),
}));

export const AppPill = {
	Component: Pill,
	Skeleton: PillSkeleton,
};
