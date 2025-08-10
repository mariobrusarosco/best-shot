import { styled } from "@mui/material";
import { AppButtonBase } from "@/domains/ui-system/components/app-button-base";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";

export const MyAccount = styled(ScreenMainContent)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	gap: theme.spacing(2),
}));

export const LogoutButton = styled(AppButtonBase)(({ theme }) => ({
	display: "block",
	padding: theme.spacing(2, 4),
	borderRadius: theme.spacing(1),
	backgroundColor: theme.palette.teal[500],
	color: theme.palette.neutral[100],
	maxWidth: "fit-content",
}));
