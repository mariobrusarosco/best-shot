import { Box, styled } from "@mui/material";

export const ScreenLayout = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		width: {
			all: "100vw",
			tablet: "100%",
		},
		height: {
			all: "100vh",
		},
	}),
);
