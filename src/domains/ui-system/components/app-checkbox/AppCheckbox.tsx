/**
 * AppCheckbox - Enhanced Base Checkbox Component
 *
 * Design system checkbox component following our MUI architecture patterns.
 * This component serves as the foundation for all checkbox components across domains.
 *
 * Features:
 * - Consistent design system integration
 * - Loading and disabled states
 * - Multiple variants for different use cases
 * - Enhanced accessibility support
 * - Theme token integration
 *
 * Follows Static Styled Components pattern for optimal performance.
 */

import {
	FormControl,
	FormControlLabel,
	FormHelperText,
	Checkbox as MuiCheckbox,
	type CheckboxProps as MuiCheckboxProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { forwardRef } from "react";

// Extended checkbox props for our design system
export interface AppCheckboxProps extends Omit<MuiCheckboxProps, "variant"> {
	/**
	 * Checkbox variant for different use cases
	 */
	variant?: "default" | "tournament" | "league" | "compact";
	/**
	 * Label text for the checkbox
	 */
	label?: string;
	/**
	 * Loading state - shows loading indicator
	 */
	loading?: boolean;
	/**
	 * Error state and message
	 */
	error?: boolean;
	errorMessage?: string;
	/**
	 * Success state
	 */
	success?: boolean;
	/**
	 * Helper text for guidance
	 */
	helperText?: string;
}

// ===== STYLED COMPONENTS (Following Static Styled Components Pattern) =====

// Form control wrapper with consistent spacing
const StyledFormControl = styled(FormControl)<{ error?: boolean; success?: boolean }>(
	({ theme, error, success }) => ({
		display: "block",
		marginBottom: theme.spacing(1),

		// Error state styling
		...(error && {
			"& .MuiFormControlLabel-label": {
				color: theme.palette.error.main,
			},
		}),

		// Success state styling
		...(success && {
			"& .MuiFormControlLabel-label": {
				color: theme.palette.success.main,
			},
		}),
	})
);

// Enhanced checkbox with design system integration
const StyledCheckbox = styled(MuiCheckbox)<AppCheckboxProps>(
	({ theme, variant, loading, error, success }) => ({
		padding: theme.spacing(1),

		// Loading state
		...(loading && {
			opacity: 0.7,
			pointerEvents: "none",
		}),

		// Base color scheme
		color: theme.palette.text.secondary,
		"&.Mui-checked": {
			color: theme.palette.primary.main,
		},

		// Error state
		...(error && {
			color: theme.palette.error.main,
			"&.Mui-checked": {
				color: theme.palette.error.main,
			},
		}),

		// Success state
		...(success && {
			"&.Mui-checked": {
				color: theme.palette.success.main,
			},
		}),

		// Enhanced focus ring for accessibility
		"&.Mui-focusVisible": {
			outline: `2px solid ${theme.palette.primary.main}`,
			outlineOffset: "2px",
			borderRadius: theme.spacing(0.5),
		},

		// Hover effects
		"&:hover": {
			backgroundColor: `${theme.palette.primary.main}0A`, // 4% opacity
			transition: theme.transitions.create(["background-color"]),
		},

		// Variant-specific styles
		...(variant === "tournament" && {
			color: theme.palette.neutral[100],
			"&.Mui-checked": {
				color: theme.palette.primary.main,
			},
			"&:hover": {
				backgroundColor: `${theme.palette.primary.main}14`, // 8% opacity for dark backgrounds
			},
		}),

		...(variant === "league" && {
			"&.Mui-checked": {
				color: theme.palette.primary.main,
			},
		}),

		...(variant === "compact" && {
			padding: theme.spacing(0.5),
			"& .MuiSvgIcon-root": {
				fontSize: "1.2rem",
			},
		}),
	})
);

// Enhanced form control label with consistent styling
const StyledFormControlLabel = styled(FormControlLabel)<{ variant?: string }>(
	({ theme, variant }) => ({
		margin: 0,
		alignItems: "flex-start",

		"& .MuiFormControlLabel-label": {
			fontSize: theme.typography.body2.fontSize,
			lineHeight: 1.5,
			paddingTop: theme.spacing(0.25), // Align with checkbox center

			// Variant-specific label styling
			...(variant === "tournament" && {
				color: theme.palette.neutral[100],
			}),

			...(variant === "compact" && {
				fontSize: theme.typography.body2.fontSize,
			}),
		},

		// Responsive text size
		[theme.breakpoints.down("tablet")]: {
			"& .MuiFormControlLabel-label": {
				fontSize: theme.typography.caption.fontSize,
			},
		},
	})
);

// Helper text with consistent styling
const StyledHelperText = styled(FormHelperText)<{ error?: boolean; success?: boolean }>(
	({ theme, error, success }) => ({
		marginLeft: theme.spacing(4), // Align with label text
		marginTop: theme.spacing(0.5),
		fontSize: theme.typography.caption.fontSize,

		...(error && {
			color: theme.palette.error.main,
		}),

		...(success && {
			color: theme.palette.success.main,
		}),
	})
);

/**
 * AppCheckbox Component
 *
 * Enhanced checkbox component that serves as the base for all checkbox components
 * in the Best Shot application. Includes loading states, variants, and follows
 * our design system patterns.
 *
 * @example
 * ```tsx
 * <AppCheckbox
 *   label="Accept Terms and Conditions"
 *   checked={accepted}
 *   onChange={handleAcceptChange}
 * />
 *
 * <AppCheckbox
 *   variant="tournament"
 *   label="Include in tournament ranking"
 *   loading={isUpdating}
 *   error={hasError}
 *   errorMessage="This field is required"
 *   helperText="Check to include this match in rankings"
 * />
 * ```
 */
export const AppCheckbox = forwardRef<HTMLButtonElement, AppCheckboxProps>(
	(
		{
			label,
			variant = "default",
			loading = false,
			error = false,
			errorMessage,
			success = false,
			helperText,
			...props
		},
		ref
	) => {
		// Determine helper text to display
		const displayHelperText = error && errorMessage ? errorMessage : helperText;

		// Checkbox element
		const checkboxElement = (
			<StyledCheckbox
				ref={ref}
				variant={variant}
				loading={loading}
				error={error}
				success={success}
				disabled={loading || props.disabled}
				inputProps={{
					"aria-describedby": displayHelperText ? `${props.id || "checkbox"}-helper` : undefined,
					...props.inputProps,
				}}
				{...props}
			/>
		);

		// If no label, return just the checkbox
		if (!label) {
			return (
				<StyledFormControl error={error} success={success}>
					{checkboxElement}
					{displayHelperText && (
						<StyledHelperText
							id={`${props.id || "checkbox"}-helper`}
							error={error}
							success={success}
						>
							{displayHelperText}
						</StyledHelperText>
					)}
				</StyledFormControl>
			);
		}

		// Return checkbox with label
		return (
			<StyledFormControl error={error} success={success}>
				<StyledFormControlLabel
					variant={variant}
					control={checkboxElement}
					label={loading ? "Loading..." : label}
				/>
				{displayHelperText && (
					<StyledHelperText id={`${props.id || "checkbox"}-helper`} error={error} success={success}>
						{displayHelperText}
					</StyledHelperText>
				)}
			</StyledFormControl>
		);
	}
);

AppCheckbox.displayName = "AppCheckbox";

// Export for backward compatibility
export { AppCheckbox as default };
