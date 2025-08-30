import type { CardProps as MuiCardProps } from "@mui/material";

// Custom card variants for our design system
export type CustomCardVariant = "tournament" | "league" | "match" | "aiInsight" | "elevated" | "flat";

// Extended card props that include our custom variants
export interface AppCardProps extends Omit<MuiCardProps, "variant"> {
	variant?: MuiCardProps["variant"] | CustomCardVariant;
	interactive?: boolean;
	loading?: boolean;
	withMotion?: boolean;
}

