/**
 * Design System Foundation: Colors
 *
 * Single source of truth for all application colors.
 *
 * The app defines colors here and consumes them everywhere through `theme.palette.*`.
 */

export const PALETTE = {
	mode: "light",

	// MUI semantic palette
	primary: {
		main: "#6A9B96",
		light: "#7BA9A4",
		dark: "#5A857F",
	},
	secondary: {
		main: "#BB2253",
	},
	error: {
		main: "#F44336",
		light: "#FF6D6D",
	},
	warning: {
		main: "#FF9800",
		light: "#FFB74D",
	},
	info: {
		main: "#2196F3",
		light: "#64B5F6",
	},
	success: {
		main: "#4CAF50",
		light: "#8AC79F",
	},
	background: {
		default: "#FDFCFC",
		paper: "#FFFFFF",
	},
	text: {
		primary: "#232424",
		secondary: "#939393",
	},

	// Custom palette groups used directly across the app
	black: {
		100: "#939393",
		200: "#2C2C2C",
		300: "#4D4D4D",
		400: "#373737",
		500: "#2F3030",
		600: "#1E2020",
		700: "#131514",
		800: "#232424",
		900: "#0B0C0C",
	},
	neutral: {
		0: "#FFFFFF",
		100: "#FDFCFC",
		200: "#F5F5F5",
		300: "#D9D9D9",
		400: "#BDBDBD",
		500: "#A3ABA8",
		600: "#757575",
		700: "#424242",
		800: "#212121",
		900: "#121212",
	},
	teal: {
		300: "#8DBAB5",
		400: "#7BA9A4",
		500: "#6A9B96",
		600: "#5B98A5",
		700: "#5AB1A3",
	},
	green: {
		200: "#8AC79F",
		500: "#4CAF50",
	},
	red: {
		400: "#FF6D6D",
		500: "#F44336",
		700: "#C63F3E",
	},
	pink: {
		700: "#BB2253",
	},
} as const;
