import { UIHelper } from "@/theming/theme";
import { Box, styled } from "@mui/material";

export const PublicLayout = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.black[700],
	minHeight: "100dvh",

	[UIHelper.whileIs("mobile")]: {
		paddingTop: theme.spacing(8),
	},
	[UIHelper.startsOn("tablet")]: {
		display: "flex",
		gap: theme.spacing(2),
	},
}));
