import { Box, styled } from "@mui/material";
import { AppButton } from "@/domains/ui-system/components/button/button";

export const Form = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	gap: theme.spacing(2),
}));

export const DialogActions = styled(Box)(({ theme }) => ({
	display: "flex",
	gap: theme.spacing(2),
	justifyContent: "flex-end",
	width: "100%",
}));

export const CancelButton = styled(AppButton)(({ theme }) => ({
	padding: theme.spacing(1.5, 3),
	borderRadius: theme.spacing(0.5),
	backgroundColor: "transparent",
	color: theme.palette.neutral[500],
	border: `1px solid ${theme.palette.black[400]}`,

	"&:hover": {
		backgroundColor: theme.palette.black[800],
		borderColor: theme.palette.neutral[500],
	},

	"&:disabled": {
		opacity: 0.5,
		cursor: "not-allowed",
	},
}));

export const SubmitButton = styled(AppButton)(({ theme }) => ({
	padding: theme.spacing(1.5, 3),
	borderRadius: theme.spacing(0.5),
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.neutral[100],

	"&:hover": {
		backgroundColor: theme.palette.primary.dark,
	},

	"&:disabled": {
		opacity: 0.5,
		cursor: "not-allowed",
	},
}));
