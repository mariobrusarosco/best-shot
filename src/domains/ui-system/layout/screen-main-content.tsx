import { UIHelper } from "@/theming/theme";
import { Box, styled } from "@mui/material";

export const ScreenMainContent = styled(Box)(({ theme }) => ({
	[UIHelper.whileIs("mobile")]: {
		padding: theme.spacing(4, 2),
	},

	[UIHelper.startsOn("tablet")]: {
		padding: theme.spacing(4),
		height: "calc(100vh - var(--screeh-heading-height-tablet))",
		display: "flex",
	},

	[UIHelper.startsOn("desktop")]: {
		paddingRight: 6,
	},
}));
