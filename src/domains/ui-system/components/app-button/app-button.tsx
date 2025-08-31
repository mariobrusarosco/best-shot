/**
 * AppButton - Enhanced Base Button Component
 *
 * Design system base button following our MUI architecture patterns.
 * This component serves as the foundation for all button variants across domains.
 */

import { Button as MuiButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { forwardRef } from "react";
import type { AppButtonProps } from "@/types/ui-system";
import "@/types/mui-overrides.d";

// Enhanced styled button with design system improvements
const StyledButton = styled(MuiButton)<AppButtonProps>(({ theme, loading }) => ({
	// Design system base styles (handled by theme overrides)
	// Additional component-specific styles

	...(loading && {
		opacity: 0.7,
		pointerEvents: "none",
		cursor: "not-allowed",
	}),

	// Consistent focus styles for accessibility
	"&:focus-visible": {
		outline: `2px solid ${theme.palette.primary.main}`,
		outlineOffset: "2px",
	},
}));

/**
 * AppButton Component
 *
 * Enhanced button component that serves as the base for all buttons
 * in the Best Shot application. Includes loading states, icons, and
 * follows our design system patterns.
 *
 * @example
 * ```tsx
 * <AppButton variant="contained" onClick={handleClick}>
 *   Save Tournament
 * </AppButton>
 *
 * <AppButton
 *   variant="tournament"
 *   loading={isLoading}
 *   startIcon={<TrophyIcon />}
 * >
 *   Join Tournament
 * </AppButton>
 * ```
 */
export const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
	({ children, loading = false, startIcon, endIcon, disabled, ...props }, ref) => {
		return (
			<StyledButton
				ref={ref}
				disabled={Boolean(disabled || loading)}
				loading={loading}
				startIcon={loading ? undefined : startIcon}
				endIcon={loading ? undefined : endIcon}
				{...props}
			>
				{loading ? "Loading..." : children}
			</StyledButton>
		);
	}
);

AppButton.displayName = "AppButton";

// Export for backward compatibility
export { AppButton as default };
