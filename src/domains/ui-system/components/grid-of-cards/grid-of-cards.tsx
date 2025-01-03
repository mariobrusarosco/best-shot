import { Box, styled } from "@mui/system";

export const GridOfCards = styled(Box)(({ theme }) =>
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
			all: "115px",
		},
	}),
);
