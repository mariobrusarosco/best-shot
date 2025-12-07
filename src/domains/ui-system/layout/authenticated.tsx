import { Box, styled } from "@mui/material";
import { DISCLAIMER_HEIGHT } from "@/domains/global/components/beta-disclaimer";
import { UIHelper } from "@/domains/ui-system/theme";

export const AuthenticatedLayout = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.black[700],
	minHeight: "100dvh",
	paddingTop: `${DISCLAIMER_HEIGHT}px`,

	[UIHelper.whileIs("mobile")]: {
		paddingTop: `calc(var(--app-header-height-mobile) + ${DISCLAIMER_HEIGHT}px)`,
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
