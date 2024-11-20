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
		500: "#6A9B96",
	},
	black: {
		400: "#A3ABA8",
		700: "#131514",
		800: "#232424",
	},
	neutral: {
		0: "#FFFFFF",
		100: "#FDFCFC",
	},
};

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
	palette: COLORS,
	components: {
		MuiTypography: {
			defaultProps: {
				variantMapping: TYPOGRAPHY.variantMapping,
			},
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
		media: {
			whileIs: theme.breakpoints.down,
			startsOn: theme.breakpoints.up,
			between: theme.breakpoints.between,
		},
	};
})();

export { theme };
