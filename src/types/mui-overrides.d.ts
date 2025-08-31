/**
 * Material-UI Type Augmentation - Single Source of Truth
 *
 * This file contains ALL Material-UI type augmentations for the Best Shot design system.
 * It serves as the centralized location for extending MUI's TypeScript interfaces
 * to support custom variants and design system tokens.
 *
 * IMPORTANT: This is the ONLY file that should declare MUI module augmentations.
 * All other .d.ts files should be removed to prevent conflicts.
 */

// ===== BUTTON VARIANTS =====
declare module "@mui/material/Button" {
	interface ButtonPropsVariantOverrides {
		tournament: true;
		aiPrediction: true;
	}
}

// ===== CARD VARIANTS =====
declare module "@mui/material/Card" {
	interface CardPropsVariantOverrides {
		tournament: true;
		match: true;
		league: true;
		aiInsight: true;
		elevated: true;
		flat: true;
	}
}

// ===== PAPER VARIANTS =====
declare module "@mui/material/Paper" {
	interface PaperPropsVariantOverrides {
		tournament: true;
		match: true;
		league: true;
		aiInsight: true;
		elevated: true;
		flat: true;
	}
}

// ===== SELECT VARIANTS =====
declare module "@mui/material/Select" {
	interface SelectPropsVariantOverrides {
		default: true;
		tournament: true;
		league: true;
		compact: true;
	}
}

// ===== TEXT FIELD VARIANTS =====
declare module "@mui/material/TextField" {
	interface TextFieldPropsVariantOverrides {
		// MUI TextField already supports outlined, filled, standard
		// No custom variants needed, but we can extend if needed
	}
}

// ===== CHECKBOX VARIANTS =====
declare module "@mui/material/Checkbox" {
	interface CheckboxPropsVariantOverrides {
		default: true;
		tournament: true;
		league: true;
		compact: true;
	}
}

// ===== THEME EXTENSIONS =====
declare module "@mui/material/styles" {
	// Extend breakpoints
	interface BreakpointOverrides {
		xs: false;
		sm: false;
		md: false;
		lg: false;
		xl: false;
		mobile: true;
		tablet: true;
		laptop: true;
		desktop: true;
	}

	// Extend typography variants
	interface TypographyVariants {
		topic: React.CSSProperties;
	}

	interface TypographyVariantsOptions {
		topic?: React.CSSProperties;
	}

	// Extend palette
	interface Palette extends CustomPalette {}
	interface PaletteOptions extends CustomPalette {}
}

// ===== TYPOGRAPHY VARIANTS =====
declare module "@mui/material/Typography" {
	interface TypographyPropsVariantOverrides {
		topic: true;
		tag: true;
		paragraph: true;
		label: true;
		h5: false;
		subtitle1: false;
		subtitle2: false;
		body1: false;
		body2: false;
	}
}

// ===== CUSTOM PALETTE INTERFACE =====
interface CustomPalette {
	green: {
		200: string;
	};
	red: {
		400: string;
	};
	teal: {
		500: string;
	};
	black: {
		300: string;
		400: string;
		500: string;
		700: string;
		800: string;
	};
	neutral: {
		0: string;
		100: string;
		500: string;
	};
	pink: {
		700: string;
	};
}

// ===== CUSTOM TYPOGRAPHY VARIANTS =====
export type CustomTypographyVariant =
	| "h1"
	| "h2"
	| "h3"
	| "h4"
	| "h5"
	| "h6"
	| "paragraph"
	| "caption"
	| "label"
	| "tag";

// ===== TABLER ICONS MODULE DECLARATION =====
declare module "@tabler/icons-react/dist/icons/*.mjs" {
	import { ForwardRefExoticComponent, SVGProps } from "react";

	const IconComponent: ForwardRefExoticComponent<SVGProps<SVGSVGElement>>;
	export default IconComponent;
}
