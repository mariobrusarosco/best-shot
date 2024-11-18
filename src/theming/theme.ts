import { createTheme } from "@mui/material/styles";

// TOKENS

const BREAKPOINTS = {
	values: {
		mobile: 0,
		tablet: 768,
		laptop: 1024,
		desktop: 1440,
	},
};

export const COLORS = {
	teal: {
		500: "#6A9B96",
	},
	black: {
		700: "#131514",
		800: "#242424",
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
		fontFamily: ["Libre Baskerville", "Montserrat Variable", "sans-serif"].join(
			",",
		),
	},
	palette: COLORS,
	components: {
		MuiUseMediaQuery: {
			defaultProps: {
				noSsr: true,
			},
		},
	},
	breakpoints: BREAKPOINTS,
});

theme.typography.h4 = {
	...theme.typography.h4,
	fontFamily: "Montserrat Variable",
};

export { theme };
