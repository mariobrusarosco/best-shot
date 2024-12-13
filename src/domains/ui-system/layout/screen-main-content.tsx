import { Box, styled } from "@mui/material";

export const ScreenMainContent = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		px: 2,
		pb: 14,
		pt: 2,
	}),
);
