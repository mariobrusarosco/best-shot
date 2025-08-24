import { Box, styled } from "@mui/material";
import { UIHelper } from "@/theming/theme";

export const ScreenMainContent = styled(Box)(({ theme }) => ({
	[UIHelper.whileIs("mobile")]: {
		padding: theme.spacing(2),
	},

	[UIHelper.startsOn("tablet")]: {
		overflow: "auto",
		padding: theme.spacing(4, 2, 0, 0),
		height: "calc(100vh - var(--screeh-heading-height-tablet))",
		display: "flex",
	},

	[UIHelper.startsOn("desktop")]: {
		paddingRight: 6,
	},
}));
