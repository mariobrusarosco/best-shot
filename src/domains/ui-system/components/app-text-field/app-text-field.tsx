/**
 * AppTextField - Enhanced Base Text Field Component
 *
 * Design system base text field following our MUI architecture patterns.
 * This component serves as the foundation for all text input variants across domains.
 */

import { TextField as MuiTextField, type TextFieldProps as MuiTextFieldProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";
import { forwardRef } from "react";

// Extended text field props for our design system
export interface AppTextFieldProps extends Omit<MuiTextFieldProps, "variant"> {
	/**
	 * Whether the field should show a loading state
	 */
	loading?: boolean;
	/**
	 * Enhanced error state with better visual feedback
	 */
	hasError?: boolean;
	/**
	 * Success state for validation feedback
	 */
	hasSuccess?: boolean;
	/**
	 * Variant override - defaults to outlined
	 */
	variant?: "outlined" | "filled" | "standard";
}

// Helper functions to reduce complexity
const getBorderColor = (theme: Theme, hasError: boolean, hasSuccess: boolean) => {
	if (hasError) return theme.palette.error.main;
	if (hasSuccess) return theme.palette.success.main;
	return theme.palette.primary.main;
};

const getOutlineColor = (theme: Theme, hasError: boolean, hasSuccess: boolean) => {
	if (hasError) return `${theme.palette.error.main}20`;
	if (hasSuccess) return `${theme.palette.success.main}20`;
	return `${theme.palette.primary.main}20`;
};

const getInputRootStyles = (theme: Theme, loading: boolean, hasError: boolean, hasSuccess: boolean) => ({
	borderRadius: theme.spacing(1), // 8px

	// Loading state
	...(loading && {
		opacity: 0.7,
		pointerEvents: "none",
		backgroundColor: theme.palette.action.disabled,
	}),

	// Error state
	...(hasError && {
		"& .MuiOutlinedInput-notchedOutline": {
			borderColor: theme.palette.error.main,
			borderWidth: "2px",
		},

		"&:hover .MuiOutlinedInput-notchedOutline": {
			borderColor: theme.palette.error.dark,
		},
	}),

	// Success state
	...(hasSuccess && {
		"& .MuiOutlinedInput-notchedOutline": {
			borderColor: theme.palette.success.main,
			borderWidth: "2px",
		},

		"&:hover .MuiOutlinedInput-notchedOutline": {
			borderColor: theme.palette.success.dark,
		},
	}),

	// Enhanced focus state
	"&.Mui-focused": {
		"& .MuiOutlinedInput-notchedOutline": {
			borderWidth: "2px",
			borderColor: getBorderColor(theme, hasError, hasSuccess),
		},
	},

	// Accessibility improvements
	"&:focus-within": {
		outline: `2px solid ${getOutlineColor(theme, hasError, hasSuccess)}`,
		outlineOffset: "2px",
	},
});

const getLabelStyles = (theme: Theme, hasError: boolean, hasSuccess: boolean) => ({
	...(hasError && {
		color: theme.palette.error.main,
	}),

	...(hasSuccess && {
		color: theme.palette.success.main,
	}),

	"&.Mui-focused": {
		color: getBorderColor(theme, hasError, hasSuccess),
	},
});

const getHelperTextStyles = (theme: Theme, hasError: boolean, hasSuccess: boolean) => ({
	marginLeft: theme.spacing(0.5),

	...(hasError && {
		color: theme.palette.error.main,
	}),

	...(hasSuccess && {
		color: theme.palette.success.main,
	}),
});

// Enhanced styled text field with design system improvements
const StyledTextField = styled(MuiTextField)<AppTextFieldProps>(
	({ theme, loading, hasError, hasSuccess }) => ({
		// Design system base styles (handled by theme overrides)

		"& .MuiOutlinedInput-root": getInputRootStyles(theme, loading || false, hasError || false, hasSuccess || false),

		// Label styling
		"& .MuiInputLabel-root": getLabelStyles(theme, hasError || false, hasSuccess || false),

		// Helper text styling
		"& .MuiFormHelperText-root": getHelperTextStyles(theme, hasError || false, hasSuccess || false),
	})
);

/**
 * AppTextField Component
 *
 * Enhanced text field component that serves as the base for all text inputs
 * in the Best Shot application. Includes validation states, loading states,
 * and follows our design system patterns.
 *
 * @example
 * ```tsx
 * <AppTextField
 *   label="Tournament Name"
 *   placeholder="Enter tournament name"
 *   required
 * />
 *
 * <AppTextField
 *   label="Email"
 *   type="email"
 *   hasError={!!errors.email}
 *   helperText={errors.email?.message}
 * />
 *
 * <AppTextField
 *   label="Username"
 *   hasSuccess={isUsernameValid}
 *   helperText="Username is available"
 * />
 * ```
 */
export const AppTextField = forwardRef<HTMLDivElement, AppTextFieldProps>(
	({ loading = false, hasError = false, hasSuccess = false, disabled, error, ...props }, ref) => {
		// Combine error states
		const isError = hasError || error;

		return (
			<StyledTextField
				ref={ref}
				disabled={disabled || loading}
				error={isError}
				loading={loading}
				hasError={isError}
				hasSuccess={hasSuccess && !isError}
				variant="outlined"
				{...props}
			/>
		);
	}
);

AppTextField.displayName = "AppTextField";

// Export for backward compatibility
export { AppTextField as default };
