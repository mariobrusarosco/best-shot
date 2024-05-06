import { createTheme } from "@mui/material/styles";

const theme = createTheme({
	components: {
		MuiUseMediaQuery: {
			defaultProps: {
				noSsr: true,
			},
		},
	},
	breakpoints: {
		values: {
			mobile: 767,
			tablet: 768,
			laptop: 1024,
			desktop: 1440,
		},
	},
});

export { theme };
