import { styled } from "@mui/material";
import { Box } from "@mui/system";

export const DashGrid = styled(Box)(({ theme }) =>
	theme.unstable_sx({
		borderRadius: 1,
		display: "grid",
		gap: {
			all: 2,
			tablet: 3,
		},
		gridTemplateColumns: {
			all: "repeat(2, minmax(100px, 1fr))",
			tablet: "repeat(2, minmax(100px, 320px))",
		},
		gridAutoRows: {
			all: "auto",
		},
	}),
);
