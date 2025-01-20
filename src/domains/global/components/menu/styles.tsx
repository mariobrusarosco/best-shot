import { UIHelper } from "@/theming/theme";
import { styled } from "@mui/material";
import { Box } from "@mui/system";
import { Link } from "@tanstack/react-router";

export const MenuLink = styled(Link)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	gap: theme.spacing(2),
}));

export const LinkList = styled(Box)(({ theme }) => ({
	display: "flex",
	borderTopRightRadius: "16px",
	borderTopLeftRadius: "16px",
	gap: theme.spacing(4),
	maxHeight: "100vh",
	backgroundColor: theme.palette.black[800],

	[UIHelper.whileIs("mobile")]: {
		justifyContent: "center",
		padding: theme.spacing(3, 2),
		width: "100vw",
		position: "fixed",
		bottom: 0,
		zIndex: theme.zIndex.appBar,
	},
	[UIHelper.startsOn("tablet")]: {
		width: "auto",
		justifyContent: "flex-start",
		alignItems: "center",
		flexDirection: "column",
		padding: theme.spacing(2),
		gap: theme.spacing(4),
	},
}));

export const MenuLogo = styled(Link)(({ theme }) => ({
	paddingTop: theme.spacing(2),
	paddingBottom: theme.spacing(10),
	display: "none",

	svg: {
		width: "40px",
	},
	[UIHelper.startsOn("tablet")]: {
		display: "grid",
		placeItems: "center",
		gap: theme.spacing(1),
	},
}));

export const Wrapper = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	gap: theme.spacing(2),

	[UIHelper.startsOn("tablet")]: {
		backgroundColor: theme.palette.black[800],
	},
}));
