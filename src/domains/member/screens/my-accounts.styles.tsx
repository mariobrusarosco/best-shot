import { AppButton } from "@/domains/ui-system/components/button/button";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";
import { styled } from "@mui/material";

export const MyAccount = styled(ScreenMainContent)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	gap: theme.spacing(2),
}));

export const LogoutButton = styled(AppButton)(({ theme }) => ({
	display: "block",
	padding: theme.spacing(2, 4),
	borderRadius: theme.spacing(1),
	backgroundColor: theme.palette.teal[500],
	color: theme.palette.neutral[100],
	maxWidth: "fit-content",
}));
