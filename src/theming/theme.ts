import { createTheme } from "@mui/material/styles";
import { TYPOGRAPHY } from "./typography";

// TOKENS
const BREAKPOINTS = {
	values: {
		all: 0,
		mobile: 768,
		tablet: 769,
		laptop: 1024,
		desktop: 1440,
	},
};

export const COLORS = {
	teal: {
		500: "#6A9B96" as const,
	},
	green: {
		200: "#8AC79F" as const,
	},
	red: {
		400: "#FF6D6D" as const,
	},
	black: {
		300: "#939393" as const,
		400: "#484848" as const,
		500: "#373737" as const,
		700: "#131514" as const,
		800: "#232424" as const,
	},
	neutral: {
		0: "#FFFFFF" as const,
		100: "#FDFCFC" as const,
		500: "#A3ABA8" as const,
	},
	pink: {
		700: "#BB2253" as const,
	},
} as const;

export const BORDER_RADIUS = {
	small: "8px",
	full: "50%",
};

export const PADDING = {
	none: "0",
	tiny: "4px",
	["extra-small"]: "12px",
	small: "8px",
	medium: "12px",
	large: "16px",
	"extra-large": "20px",
	huge: "24px",
};

const theme = createTheme({
	typography: {
		fontFamily: ["Poppins", "Montserrat", "sans-serif"].join(","),
		...TYPOGRAPHY.variants,
	},
	palette: COLORS as any,
	components: {
		MuiTypography: {
			// defaultProps: {
			// 	variantMapping: TYPOGRAPHY.variantMapping,
			// },
		},
		MuiUseMediaQuery: {
			defaultProps: {
				noSsr: true,
			},
		},
	},
	breakpoints: BREAKPOINTS,
});

export const UIHelper = (() => {
	return {
		whileIs: theme.breakpoints.down,
		startsOn: theme.breakpoints.up,
		between: theme.breakpoints.between,
	};
})();

export { theme };
