import { createTheme } from "@mui/material/styles";
import { TYPOGRAPHY } from "./typography";

// NOTE: This is legacy theme configuration
// The official theme is in /src/domains/ui-system/theme/
// TODO: Migrate remaining components to use the new design system theme

// Legacy TOKENS - TODO: Remove after migration to new design system
export const COLORS = {
	teal: {
		500: "#6A9B96",
	},
	green: {
		200: "#8AC79F",
	},
	red: {
		400: "#FF6D6D",
	},
	black: {
		300: "#939393",
		400: "#484848",
		500: "#373737",
		700: "#131514",
		800: "#232424",
	},
	neutral: {
		0: "#FFFFFF",
		100: "#FDFCFC",
		500: "#A3ABA8",
	},
	pink: {
		700: "#BB2253",
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
	// NOTE: Palette removed - conflicts with new design system theme
	// palette: COLORS,
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
	// NOTE: Breakpoints removed - conflicts with new design system theme  
	// breakpoints: BREAKPOINTS,
});

export const UIHelper = (() => {
	return {
		whileIs: theme.breakpoints.down,
		startsOn: theme.breakpoints.up,
		between: theme.breakpoints.between,
	};
})();

export { theme };
