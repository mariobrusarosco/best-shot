import { UIHelper } from "@/theming/theme";
import { Box, styled } from "@mui/material";

export const ScreenMainContent = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		// py: 2,
		// pb: 14,
		// pt: 2,

		[UIHelper.startsOn("tablet")]: {
			pr: 1,
		},

		[UIHelper.startsOn("desktop")]: {
			pr: 6,
		},
	}),
);
