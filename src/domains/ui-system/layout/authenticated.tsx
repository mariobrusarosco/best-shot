import { Box, styled } from "@mui/material";
import { UIHelper } from "@/domains/ui-system/theme";

export const AuthenticatedLayout = styled(Box)(({ theme }) => ({
	height: "100%",

	[UIHelper.whileIs("mobile")]: {
		// TODO
	},
	[UIHelper.startsOn("tablet")]: {
		paddingTop: theme.spacing(2.5),
		display: "flex",
		gap: theme.spacing(4),
	},
}));

export const AuthenticatedScreenLayout = styled(Box)(({ theme }) => ({
	padding: theme.spacing(4, 0),

	[UIHelper.startsOn("tablet")]: {
		flex: 1,
	},
}));
