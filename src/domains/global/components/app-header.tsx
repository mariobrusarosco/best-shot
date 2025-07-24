import { BestShotIcon } from "@/assets/best-shot-icon";
import { theme, UIHelper } from "@/theming/theme";
import { Typography } from "@mui/material";
import { styled } from "@mui/material";
import { Stack } from "@mui/system";

export const AppHeader = () => {
	return (
		<Header as="header">
			<BestShotIcon width={50} fill={theme.palette.neutral[100]} />
			<Typography
				variant="paragraph"
				color={theme.palette.neutral[100]}
				fontWeight={400}
			>
				best shot
			</Typography>
		</Header>
	);
};

const Header = styled(Stack)(({ theme }) => ({
	alignItems: "center",
	position: "fixed",
	width: "100%",
	left: 0,
	top: 0,
	gap: theme.spacing(1),
	padding: theme.spacing(2, 2),
	backgroundColor: theme.palette.black[800],
	borderBottomLeftRadius: theme.spacing(3),
	borderBottomRightRadius: theme.spacing(3),
	height: "var(--app-header-height-mobile)",

	[UIHelper.whileIs("mobile")]: {
		zIndex: theme.zIndex.appBar,
		display: "flex",
	},
	[UIHelper.startsOn("tablet")]: {
		display: "none",
	},
}));
