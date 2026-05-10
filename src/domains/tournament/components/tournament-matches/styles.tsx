import { Box, styled } from "@mui/material";

export const Container = styled(Box)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	gap: theme.spacing(7),
}));

export const RoundSelectorContainer = styled(Box)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	backgroundColor: theme.palette.black[400],
	borderRadius: theme.borderRadius.medium,
	padding: theme.spacing(1, 1.5),
}));

export const RoundsFilterContainer = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	gap: theme.spacing(1),
}));

export const RoundsFilter = styled("button")<{ isActive$: boolean }>(({ theme, isActive$ }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-start",
	backgroundColor: isActive$ ? theme.palette.neutral[100] : "transparent",
	padding: theme.spacing(1),
	borderRadius: theme.borderRadius.medium,
	border: `1px solid ${theme.palette.neutral[100]}`,
	cursor: "pointer",
}));
