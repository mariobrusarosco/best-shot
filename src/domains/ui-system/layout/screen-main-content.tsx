import { UIHelper } from "@/theming/theme";
import { Box, styled } from "@mui/material";

export const ScreenMainContent = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		[UIHelper.whileIs("mobile")]: {
			px: 2,
		},

		[UIHelper.startsOn("tablet")]: {
			pr: 1,
			py: 2,
			px: 2,
		},

		[UIHelper.startsOn("desktop")]: {
			pr: 6,
		},
	}),
);
