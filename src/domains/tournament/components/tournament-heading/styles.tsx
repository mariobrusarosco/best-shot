import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { UIHelper } from "@/domains/ui-system/theme";

export const Container = styled(Box)(({ theme }) => ({
	display: "flex",
	gap: theme.spacing(4),
}));

export const TournamentData = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.neutral[200],
	padding: theme.spacing(2.5, 2),
	borderRadius: theme.borderRadius.medium,
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	gap: theme.spacing(2),
	width: "430px",

	[UIHelper.whileIs("mobile")]: {
		width: "100%",
	},
	[UIHelper.startsOn("tablet")]: {
		width: "520px",
	},
}));

export const CurrentRound = styled(Box)(({ theme }) => ({
	display: "flex",
	width: "fit-content",
	padding: theme.spacing(1, 1.5),
	backgroundColor: theme.palette.teal[600],
	borderRadius: theme.borderRadius.medium,
	minWidth: "10px",
}));

export const ViewModePanel = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	gap: theme.spacing(1),
}));

export const ViewModeButtons = styled(Box)(({ theme }) => ({
	display: "flex",
	gap: theme.spacing(1),
}));

export const ViewModeButton = styled("button")<{
	isActive$: boolean;
}>(({ theme, isActive$ }) => ({
	padding: theme.spacing(1),
	borderRadius: theme.borderRadius.medium,
	backgroundColor: isActive$ ? theme.palette.teal[600] : "transparent",
	color: theme.palette.neutral[100],
	cursor: "pointer",
}));

export const TournamentLogo = styled("img")(() => ({
	width: "60px",
}));
