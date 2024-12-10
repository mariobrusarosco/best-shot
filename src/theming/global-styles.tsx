import GlobalStyles from "@mui/material/GlobalStyles";
import { theme } from "./theme";

export const GlobalCSS = () => (
	<GlobalStyles
		styles={{
			body: {},
			":root": {
				"--screeh-heading-height-mobile": "400px",
				"--screeh-heading-height-tablet": "200px",
			},
			"#root": {
				minHeight: "100vh",
				display: "flex",
				// overflow: "hidden",
				// clipPath: "inset(0)",
			},
			menu: {
				margin: 0,
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
				maxWidth: "100%",
				height: "auto",
			},
			/* width */

			"::-webkit-scrollbar": {
				width: "5px",
				height: "5px",
			},
			// _ Track _/
			"::-webkit-scrollbar-track": {
				background: theme.palette.black[500],
				borderRadius: "5px",
			},
			// /_ Handle _/
			"::-webkit-scrollbar-thumb": {
				background: theme.palette.teal["500"],
			},
			"[data-ui='scrollbar']": {
				scrollbarColor: "red teal",
				scrollbarWidth: "thin",
			},
		}}
	/>
);
