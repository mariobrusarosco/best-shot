import GlobalStyles from "@mui/material/GlobalStyles";

export const GlobalCSS = () => (
	<GlobalStyles
		styles={{
			body: {},
			"#root": {
				minHeight: "100vh",
				display: "flex",
				overflow: "hidden",
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
