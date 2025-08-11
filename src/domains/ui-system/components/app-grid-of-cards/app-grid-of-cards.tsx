/**
 * AppGridOfCards - Card Layout Grid Component
 *
 * Follows Static Styled Components pattern for reusable, consistent card grids.
 * Replaces unstable_sx usage with stable styled component pattern.
 */

import { Box, styled } from "@mui/system";

// ===== STYLED COMPONENTS (Following Static Styled Components Pattern) =====

export const AppGridOfCards = styled(Box)(({ theme }) => ({
	borderRadius: theme.spacing(1),
	display: "grid",
	gap: theme.spacing(2),
	gridTemplateColumns: "repeat(2, minmax(100px, 1fr))",
	gridAutoRows: "115px",

	// Responsive behavior using stable breakpoint system
	[theme.breakpoints.up("tablet")]: {
		gap: theme.spacing(3),
		gridTemplateColumns: "repeat(2, minmax(100px, 320px))",
	},

	// Enhanced responsive behavior for larger screens
	[theme.breakpoints.up("desktop")]: {
		gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
	},
}));
