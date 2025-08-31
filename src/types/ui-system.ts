/**
 * UI System Type Utilities
 *
 * Centralized type definitions and utilities for the Best Shot UI System.
 * This file provides consistent typing patterns and helper types used across
 * all UI components in the design system.
 */

import type { 
	ButtonProps as MuiButtonProps,
	CardProps as MuiCardProps,
	TextFieldProps as MuiTextFieldProps,
	SelectProps as MuiSelectProps,
	CheckboxProps as MuiCheckboxProps,
	TypographyProps as MuiTypographyProps,
	BoxProps as MuiBoxProps
} from "@mui/material";

// ===== BASE COMPONENT PROPS =====

/**
 * Base props interface that all UI System components should extend
 */
export interface BaseComponentProps {
	/**
	 * Optional CSS class name for styling
	 */
	className?: string;
	/**
	 * Optional test ID for testing purposes
	 */
	"data-testid"?: string;
}

/**
 * Loading state props interface
 */
export interface LoadingProps {
	/**
	 * Whether the component should show a loading state
	 */
	loading?: boolean;
}

/**
 * Error state props interface
 */
export interface ErrorProps {
	/**
	 * Whether the component has an error state
	 */
	error?: boolean;
	/**
	 * Error message to display
	 */
	errorMessage?: string;
}

/**
 * Success state props interface
 */
export interface SuccessProps {
	/**
	 * Whether the component has a success state
	 */
	success?: boolean;
}

/**
 * Helper text props interface
 */
export interface HelperTextProps {
	/**
	 * Helper text to display below the component
	 */
	helperText?: React.ReactNode;
}

// ===== CUSTOM VARIANTS =====

/**
 * Button variant types
 */
export type ButtonVariant = MuiButtonProps["variant"] | "tournament" | "aiPrediction";

/**
 * Card variant types
 */
export type CardVariant = MuiCardProps["variant"] | "tournament" | "match" | "league" | "aiInsight" | "elevated" | "flat";

/**
 * TextField variant types
 */
export type TextFieldVariant = MuiTextFieldProps["variant"];

/**
 * Select variant types
 */
export type SelectVariant = MuiSelectProps["variant"] | "default" | "tournament" | "league" | "compact";

/**
 * Checkbox variant types (MUI Checkbox doesn't have variants, so we define our own)
 */
export type CheckboxVariant = "default" | "tournament" | "league" | "compact";

/**
 * Typography variant types
 */
export type TypographyVariant = MuiTypographyProps["variant"] | "topic" | "tag" | "paragraph" | "label";

// ===== COMPONENT-SPECIFIC PROPS =====

/**
 * AppButton component props
 */
export interface AppButtonProps extends 
	Omit<MuiButtonProps, "variant" | "loading">,
	BaseComponentProps {
	/**
	 * Button variant
	 */
	variant?: ButtonVariant;
	/**
	 * Custom loading state
	 */
	loading?: boolean;
	/**
	 * Icon to show before the button text
	 */
	startIcon?: React.ReactNode;
	/**
	 * Icon to show after the button text
	 */
	endIcon?: React.ReactNode;
}

/**
 * AppCard component props
 */
export interface AppCardProps extends 
	Omit<MuiCardProps, "variant">,
	BaseComponentProps,
	LoadingProps {
	/**
	 * Card variant
	 */
	variant?: CardVariant;
	/**
	 * Whether the card should be interactive (hover effects)
	 */
	interactive?: boolean;
	/**
	 * Enable motion animations
	 */
	withMotion?: boolean;
}

/**
 * AppTextField component props
 */
export interface AppTextFieldProps extends 
	Omit<MuiTextFieldProps, "variant" | "helperText">,
	BaseComponentProps,
	LoadingProps,
	ErrorProps,
	SuccessProps {
	/**
	 * TextField variant
	 */
	variant?: TextFieldVariant;
	/**
	 * Enhanced error state with better visual feedback
	 */
	hasError?: boolean;
	/**
	 * Success state for validation feedback
	 */
	hasSuccess?: boolean;
	/**
	 * Helper text to display below the component
	 */
	helperText?: React.ReactNode;
}

/**
 * AppSelect component props
 */
export interface AppSelectProps extends 
	Omit<MuiSelectProps, "variant">,
	BaseComponentProps,
	LoadingProps,
	ErrorProps,
	SuccessProps,
	HelperTextProps {
	/**
	 * Select variant
	 */
	variant?: SelectVariant;
	/**
	 * Options for the select (simplified usage)
	 */
	options?: Array<{ value: string | number; label: string; disabled?: boolean }>;
}

/**
 * AppCheckbox component props
 */
export interface AppCheckboxProps extends 
	MuiCheckboxProps,
	BaseComponentProps,
	LoadingProps,
	ErrorProps,
	SuccessProps,
	HelperTextProps {
	/**
	 * Checkbox variant
	 */
	variant?: CheckboxVariant;
	/**
	 * Label text for the checkbox
	 */
	label?: React.ReactNode;
}

/**
 * AppTypography component props
 */
export interface AppTypographyProps extends 
	MuiTypographyProps,
	BaseComponentProps {
	/**
	 * Typography variant
	 */
	variant?: TypographyVariant;
}

/**
 * AppBox component props
 */
export interface AppBoxProps extends 
	MuiBoxProps,
	BaseComponentProps {
	// AppBox inherits all MUI Box props
}

// ===== FORM COMPONENT PROPS =====

/**
 * Base form component props for react-hook-form integration
 */
export interface BaseFormProps<T extends Record<string, any>> {
	/**
	 * Field name for react-hook-form
	 */
	name: keyof T & string;
	/**
	 * Form control from react-hook-form
	 */
	control: any; // Using any to avoid complex react-hook-form typing
	/**
	 * Field label
	 */
	label?: React.ReactNode;
	/**
	 * Whether the field is required
	 */
	required?: boolean;
	/**
	 * Whether the field is disabled
	 */
	disabled?: boolean;
}

/**
 * AppFormInput component props
 */
export interface AppFormInputProps<T extends Record<string, any>> extends 
	BaseFormProps<T>,
	Omit<AppTextFieldProps, "name" | "control"> {
	/**
	 * Input type
	 */
	type?: "text" | "email" | "password" | "number" | "tel" | "url";
	/**
	 * Placeholder text
	 */
	placeholder?: string;
	/**
	 * Whether the input should be multiline
	 */
	multiline?: boolean;
	/**
	 * Number of rows for multiline input
	 */
	rows?: number;
}

/**
 * AppFormSelect component props
 */
export interface AppFormSelectProps<T extends Record<string, any>> extends 
	BaseFormProps<T>,
	Omit<AppSelectProps, "name" | "control"> {
	/**
	 * Options for the select
	 */
	options: Array<{ value: string | number; label: string; disabled?: boolean }>;
}

/**
 * AppFormCheckbox component props
 */
export interface AppFormCheckboxProps<T extends Record<string, any>> extends 
	BaseFormProps<T>,
	Omit<AppCheckboxProps, "name" | "control" | "label"> {
	// Inherits all checkbox props except name, control, and label which are handled by BaseFormProps
}

// ===== UTILITY TYPES =====

/**
 * Utility type to make all properties optional except specified ones
 */
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

/**
 * Utility type to make all properties required except specified ones
 */
export type RequiredExcept<T, K extends keyof T> = Required<T> & Partial<Pick<T, K>>;

/**
 * Utility type for component ref forwarding
 */
export type ComponentRef<T> = React.ForwardedRef<T>;

/**
 * Utility type for component children
 */
export type ComponentChildren = React.ReactNode;

// ===== THEME-RELATED TYPES =====

/**
 * Design system color tokens
 */
export type DesignSystemColor = 
	| "primary"
	| "secondary"
	| "error"
	| "warning"
	| "info"
	| "success"
	| "black"
	| "neutral"
	| "teal"
	| "pink"
	| "green"
	| "red";

/**
 * Design system spacing tokens
 */
export type DesignSystemSpacing = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 4 | 5 | 6 | 8 | 10 | 12;

/**
 * Design system breakpoint tokens
 */
export type DesignSystemBreakpoint = "mobile" | "tablet" | "laptop" | "desktop";

// ===== VALIDATION TYPES =====

/**
 * Form validation error structure
 */
export interface ValidationError {
	/**
	 * Error message
	 */
	message: string;
	/**
	 * Error type
	 */
	type?: string;
}

/**
 * Form field state from react-hook-form
 */
export interface FieldState {
	/**
	 * Whether the field is invalid
	 */
	invalid: boolean;
	/**
	 * Whether the field is touched
	 */
	isTouched: boolean;
	/**
	 * Whether the field is dirty
	 */
	isDirty: boolean;
	/**
	 * Field error
	 */
	error?: ValidationError;
}

// ===== EXPORT ALL TYPES =====

export type {
	// Re-export MUI types for convenience
	MuiButtonProps,
	MuiCardProps,
	MuiTextFieldProps,
	MuiSelectProps,
	MuiCheckboxProps,
	MuiTypographyProps,
	MuiBoxProps,
};
