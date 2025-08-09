/**
 * AppPill - Pill/Badge Component
 * 
 * Follows Static Styled Components pattern for consistent pill/badge elements.
 * Replaces unstable_sx usage with stable styled component pattern.
 */

import { Box } from "@mui/system";
import { styled } from "@mui/material/styles";
import { shimmerEffect } from "../skeleton/skeleton";

// Import theme to ensure TypeScript picks up our augmentations
import "../../theme/index";

// ===== STYLED COMPONENTS (Following Static Styled Components Pattern) =====

const Pill = styled(Box)(({ theme }) => ({
	display: "grid",
	placeContent: "center",
	alignItems: "center",
	borderRadius: theme.spacing(2.5),
	
	// Enhanced styling for better consistency
	padding: theme.spacing(0.5, 1.5),
	fontSize: theme.typography.caption.fontSize,
	fontWeight: theme.typography.caption.fontWeight,
	minHeight: theme.spacing(3),
	
	// Default styling
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.primary.contrastText,
	
	// Responsive text size
	[theme.breakpoints.down('md')]: {
		fontSize: theme.typography.caption.fontSize,
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
