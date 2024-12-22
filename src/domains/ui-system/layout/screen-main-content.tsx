import { UIHelper } from "@/theming/theme";
import { Box, styled } from "@mui/material";

export const ScreenMainContent = styled(Box)(({ theme }) => ({
	// display: "flex",
	// overflow: "hidden",

	[UIHelper.whileIs("mobile")]: {
		padding: theme.spacing(4, 2),
		// height: "100px",
	},

	[UIHelper.startsOn("tablet")]: {
		padding: theme.spacing(4),
		height: "calc(100vh - var(--screeh-heading-height-tablet))",
	},

	[UIHelper.startsOn("desktop")]: {
		paddingRight: 6,
	},
}));
