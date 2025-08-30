import type { ButtonProps as MuiButtonProps } from "@mui/material";

// Custom button variants for our design system
export type CustomButtonVariant = "tournament" | "aiPrediction";

// Extended button props that include our custom variants
export interface AppButtonProps extends Omit<MuiButtonProps, "variant"> {
	variant?: MuiButtonProps["variant"] | CustomButtonVariant;
	loading?: boolean;
	startIcon?: React.ReactNode;
	endIcon?: React.ReactNode;
}

