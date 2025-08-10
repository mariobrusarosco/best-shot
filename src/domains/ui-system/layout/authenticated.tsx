import { Box, styled } from "@mui/material";
import { UIHelper } from "@/domains/ui-system/theme/migration";

export const AuthenticatedLayout = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.black[700],
	minHeight: "100dvh",

	[UIHelper.whileIs("mobile")]: {
		paddingTop: "var(--app-header-height-mobile)",
	},
	[UIHelper.startsOn("tablet")]: {
		display: "flex",
		gap: theme.spacing(2),
	},

	[UIHelper.startsOn("desktop")]: {
		gap: theme.spacing(4),
	},
}));

export const AuthenticatedScreenLayout = styled(Box)(() => ({
	[UIHelper.startsOn("tablet")]: {
		flex: 1,
	},
}));
