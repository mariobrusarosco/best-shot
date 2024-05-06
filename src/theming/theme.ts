import { createTheme } from "@mui/material/styles";

const breakpoints = {
	values: {
		mobile: 767,
		tablet: 768,
		laptop: 1024,
		desktop: 1440,
	},
};

const theme = createTheme({
	typography: {
		fontFamily: ["Libre Baskerville", "Montserrat Variable", "sans-serif"].join(
			","
		),
	},
	palette: {
		primary: {
			main: "#ff0000",
		},
		secondary: {
			main: "#00ff00",
		},
	},
	components: {
		MuiUseMediaQuery: {
			defaultProps: {
				noSsr: true,
			},
		},
	},
	breakpoints,
});

theme.typography.h4 = {
	...theme.typography.h4,
	fontFamily: "Montserrat Variable",
};

export { theme };
