import { BestShotIcon } from "@/assets/best-shot-icon";
import { theme, UIHelper } from "@/theming/theme";
import { styled, Typography } from "@mui/material";
import { Stack } from "@mui/system";

export const AppHeader = () => {
	return (
		<Header as="header">
			<BestShotIcon width={50} fill={theme.palette.teal[500]} />
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
	gap: theme.spacing(1),
	padding: theme.spacing(2, 2),
	backgroundColor: theme.palette.black[800],

	[UIHelper.whileIs("mobile")]: {
		display: "flex",
	},
	[UIHelper.startsOn("tablet")]: {
		display: "none",
	},
}));
