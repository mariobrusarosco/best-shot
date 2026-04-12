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

type BorderRadiusTokens =
	typeof import("@/domains/ui-system/theme/foundation/spacing").BORDER_RADIUS;
type DesignSystemColors =
	typeof import("@/domains/ui-system/theme/foundation/colors").DESIGN_SYSTEM_COLORS;

// ===== INPUT SLOT PROPS AUGMENTATION =====
declare module "@mui/base/Input" {
	interface InputInputSlotPropsOverrides {
		"data-testid"?: string;
	}
}

// ===== THEME EXTENSIONS =====
declare module "@mui/material/styles" {
	interface Theme {
		borderRadius: BorderRadiusTokens;
	}

	interface ThemeOptions {
		borderRadius?: BorderRadiusTokens;
	}

	// Extend breakpoints
	interface BreakpointOverrides {
		xs: false;
		sm: false;
		md: false;
		lg: false;
		xl: false;
		all: true;
		mobile: true;
		tablet: true;
		laptop: true;
		desktop: true;
	}

	// Extend typography variants
	// interface TypographyVariants {
	// 	topic: React.CSSProperties;
	// }

	// interface TypographyVariantsOptions {
	// 	topic?: React.CSSProperties;
	// }

	// Extend palette
	interface Palette extends CustomPalette {}
	interface PaletteOptions extends CustomPalette {}
}

// ===== TYPOGRAPHY VARIANTS =====
declare module "@mui/material/Typography" {
	interface TypographyPropsVariantOverrides {
		"super-title": true;
		"page-title": true;
		"page-subtitle": true;
		h1: true;
		h2: true;
		h3: true;
		h4: true;
		h5: true;
		h6: true;
		paragraph: true;
		title: true;
		subtitle: true;
		body_1: true;
		body_2: true;
		label_1: true;
		label_2: true;
	}
}

// ===== CUSTOM PALETTE INTERFACE =====
interface CustomPalette {
	black: DesignSystemColors["black"];
	neutral: DesignSystemColors["neutral"];
	teal: DesignSystemColors["primary"];
	green: DesignSystemColors["success"];
	red: DesignSystemColors["error"];
	pink: DesignSystemColors["pink"];
}

// ===== CUSTOM TYPOGRAPHY VARIANTS =====
export type CustomTypographyVariant =
	| "super-title"
	| "page-title"
	| "page-subtitle"
	| "h1"
	| "h2"
	| "h3"
	| "h4"
	| "h5"
	| "h6"
	| "paragraph"
	| "title"
	| "subtitle"
	| "body_1"
	| "body_2"
	| "label_1"
	| "label_2";

// ===== TABLER ICONS MODULE DECLARATION =====
declare module "@tabler/icons-react/dist/icons/*.mjs" {
	import type { ForwardRefExoticComponent, SVGProps } from "react";

	const IconComponent: ForwardRefExoticComponent<SVGProps<SVGSVGElement>>;
	export default IconComponent;
}
