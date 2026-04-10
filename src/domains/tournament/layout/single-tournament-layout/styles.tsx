import { Box, styled } from "@mui/material";

export const TournamentContainer = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	gap: theme.spacing(4),
}));

export const CurrentRoundContainer = styled(Box)(({ theme }) => ({
	display: "flex",
	gap: theme.spacing(1.5),
	alignItems: "center",
}));

export const CurrentRound = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.teal[500],
	padding: theme.spacing(1, 1.5),
	borderRadius: theme.shape.medium,
}));

export const TournamentDisplay = styled(Box)(({ theme }) => ({
	display: "flex",
	width: "fit-content",
	gap: theme.spacing(2),
	padding: theme.spacing(3.5),
	backgroundColor: theme.palette.neutral[0],
	borderRadius: theme.shape.medium,
}));

export const NameAndCurrentRound = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	gap: theme.spacing(1),
}));

export const LogoContainer = styled(Box)(({ theme }) => ({
	padding: theme.spacing(0.5),
	borderRadius: theme.shape.medium,
	opacity: 0.7,
	width: "86px",
}));

export const Logo = styled("img")(() => ({
	height: "auto",
	maxWidth: "100%",
}));

// TODO: [SCORE DISPLAY] Consider Abstraction
export const TournamentScoreDisplay = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	height: "fit-content",
	width: "fit-content",
	gap: theme.spacing(0.5),
	padding: theme.spacing(2),
	backgroundColor: theme.palette.neutral[0],
	borderRadius: theme.shape.medium,
	alignItems: "center",
	flexWrap: "wrap",
}));

export const Score = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.teal[500],
	padding: theme.spacing(1, 1.5),
	borderRadius: theme.shape.medium,
}));

export const UnderCalculationDisplay = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.pink["700"],
	padding: theme.spacing(0.5, 1),
	borderRadius: theme.shape.medium,
	color: theme.palette.neutral[0],
}));
