import GlobalStyles from "@mui/material/GlobalStyles";
import { theme } from "./theme";

export const GlobalCSS = () => (
	<GlobalStyles
		styles={{
			body: {
				overflowX: "hidden",
			},
			":root": {
				"--screeh-header-height-mobile": "190px",
				"--screeh-heading-height-mobile": "190px",
				"--screeh-heading-height-tablet": "250px",
				"--tournament-heading-height-tablet": "80px",
			},
			"#root": {
				height: "100vh",
				width: "100vw",
			},
			menu: {
				margin: 0,
				padding: 0,
			},
			li: {
				listStyleType: "none",
			},
			ul: {
				padding: 0,
				margin: 0,
			},
			a: {
				textDecoration: "none",
				color: "unset",
			},
			img: {
				width: "100%",
				height: "auto",
			},

			button: {
				appearance: "none",
				backgroundColor: "unset",
				outline: "none",
				border: "none",
				padding: "unset",
			},
			/* width */

			"::-webkit-scrollbar": {
				width: "5px",
				height: "8px",
			},
			// _ Track _/
			"::-webkit-scrollbar-track": {
				background: theme.palette.black[500],
				borderRadius: "5px",
			},
			// /_ Handle _/
			"::-webkit-scrollbar-thumb": {
				// background: "#6a9b9614",
				background: theme.palette.teal[500],
			},
			"[data-ui='scrollbar']": {
				// scrollbarColor: " teal",
				scrollbarWidth: "thin",
			},

			"@keyframes shimmer": {
				"100%": {
					transform: "translateX(100%)",
				},
			},
		}}
	/>
);
