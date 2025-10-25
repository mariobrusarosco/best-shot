import { Box, styled } from "@mui/material";
import { DISCLAIMER_HEIGHT } from "@/domains/global/components/beta-disclaimer";
import { UIHelper } from "@/theming/theme";

export const PublicLayout = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.black[700],
	minHeight: "100dvh",
	paddingTop: `${DISCLAIMER_HEIGHT}px`,

	[UIHelper.whileIs("mobile")]: {
		paddingTop: `calc(${theme.spacing(8)} + ${DISCLAIMER_HEIGHT}px)`,
	},
	[UIHelper.startsOn("tablet")]: {
		display: "flex",
		gap: theme.spacing(2),
	},
}));
