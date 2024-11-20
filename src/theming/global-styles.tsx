import GlobalStyles from "@mui/material/GlobalStyles";

export const GlobalCSS = () => (
	<GlobalStyles
		styles={{
			"#root, body": {
				width: "100%",
				height: "100vh",
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
		}}
	/>
);
