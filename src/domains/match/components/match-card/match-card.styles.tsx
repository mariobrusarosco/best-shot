import { AppButton } from "@/domains/ui-system/components/button/button";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import { UIHelper } from "@/theming/theme";
import { Box, Stack, styled } from "@mui/system";
import { motion } from "motion/react";

export const Card = styled(Surface)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	backgroundColor: theme.palette.black[800],
	padding: theme.spacing(2, 1),
	gap: theme.spacing(2),
	borderRadius: theme.spacing(1),
	maxWidth: "100%",

	"[data-card-open='true']": {
		gap: theme.spacing(3.5),
	},

	[UIHelper.startsOn("tablet")]: {
		padding: theme.spacing(3, 2),
	},
}));

export const Header = styled(Stack)(({ theme }) => ({
	flexDirection: "row",
	justifyContent: "space-between",
	alignItems: "center",
	gridArea: "header",
	gap: theme.spacing(2),
}));

export const Teams = styled(Box)(({ theme }) => ({
	display: "flex",
	justifyContent: "space-between",
	gap: theme.spacing(0.5),

	"[data-card-open='true'] &": {
		gap: theme.spacing(4),
	},
}));

export const Team = styled(motion.div)(({ theme }) => ({
	display: "flex",
	justifyContent: "space-between",
	flex: 1,
	maxWidth: "50%",

	"[data-card-open='true'] &": {
		flexDirection: "column",
		alignItems: "stretch",
		gap: theme.spacing(2),
	},
}));

export const CTA = styled(Stack)(({ theme }) => ({
	flexDirection: "row",
	justifyContent: "space-between",
	alignItems: "center",
	gap: theme.spacing(1),
}));

export const ScoreAndGuess = styled(Stack)(({ theme }) => ({
	display: "flex",
	gap: theme.spacing(1),
}));

export const Button = styled(AppButton)(({ theme }) => ({
	borderRadius: theme.spacing(0.5),
	color: theme.palette.neutral[100],
	backgroundColor: theme.palette.teal[500],
	width: "24px",
	height: "24px",

	"&[disabled]": {
		filter: "grayscale(1)",
		opacity: "0.5",
	},
}));
