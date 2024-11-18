import { GridProps as MuiGridProps } from "@mui/material/Grid";

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

	interface Palette extends CustomPalette {}
	interface PaletteOptions extends CustomPalette 
}

interface CustomPalette {
	teal: {
		500: string;
	};
	black: {
		700: string;
		800: string;
	};
	neutral: {
		0: string;
		100: string;
	};
}

