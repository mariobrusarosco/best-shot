// TODO Move Breakpoint-related code to a .d.ts
declare module "@mui/material/styles" {
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

	// TODO Move Typography-related code to a .d.ts
	interface TypographyVariants {
		topic: React.CSSProperties;
	}

	// allow configuration using `createTheme()`
	interface TypographyVariantsOptions {
		topic?: React.CSSProperties;
	}

	// TODO Move Palette-related code to a .d.ts
	interface Palette extends CustomPalette {}
	interface PaletteOptions extends CustomPalette {}
}

// TODO Move Typography-related code to a .d.ts
// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
	interface TypographyPropsVariantOverrides {
		topic: true;
		tag: true;
		label: true;
		h4: false;
		h5: false;
		subtitle1: false;
		subtitle2: false;
		body1: false;
		body2: false;
	}
}

// TODO Move Palette-related code to a .d.ts
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
		500: string;
		700: string;
		800: string;
	};
	neutral: {
		0: string;
		100: string;
		500: string;
	};
}

export type CustomTypographyVariant =
	| "h1"
	| "h2"
	| "h3"
	| "h4"
	| "h5"
	| "h6"
	| "caption"
	| "label"
	| "tag";

declare module "@tabler/icons-react/dist/icons/*.mjs" {
	import { ForwardRefExoticComponent, SVGProps } from "react";

	const IconComponent: ForwardRefExoticComponent<SVGProps<SVGSVGElement>>;
	export default IconComponent;
}
