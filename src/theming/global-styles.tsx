import GlobalStyles from "@mui/material/GlobalStyles";

export const GlobalCSS = () => (
	<GlobalStyles
		styles={{
			"#root, body": {
				width: "100%",
				height: "100vh",
			},
			li: {
				listStyleType: "none",
			},
		}}
	/>
);
