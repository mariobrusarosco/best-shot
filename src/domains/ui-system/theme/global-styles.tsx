import GlobalStyles from "@mui/material/GlobalStyles";

export const GlobalCSS = () => (
	<GlobalStyles
		styles={{
			body: {
				overflowX: "hidden",
			},
			":root": {
				"--app-header-height-mobile": "80px",
				"--screeh-heading-height-mobile": "144px",
				"--screeh-heading-height-tablet": "219px",
				"--tournament-heading-height-tablet": "70px",
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
				maxWidth: "100%",
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
				// background: theme.palette.black[500],
				borderRadius: "5px",
			},
			// /_ Handle _/
			"::-webkit-scrollbar-thumb": {
				// background: theme.palette.teal[500],
			},

			"::-webkit-scrollbar-thumb:hover": {
				// background: theme.palette.teal[500],
			},

			"@keyframes shimmer": {
				"100%": {
					transform: "translateX(100%)",
				},
			},
		}}
	/>
);

