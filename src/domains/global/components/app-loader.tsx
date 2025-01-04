import { BestShotIcon } from "@/assets/best-shot-icon";
import { theme, UIHelper } from "@/theming/theme";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Stack } from "@mui/system";

export const AppLoader = () => {
	return (
		<Wrapper data-iu="app-loader">
			<BestShotIcon fill={theme.palette.neutral[100]} isAnimated />
			<Typography
				color={theme.palette.neutral[100]}
				variant="h3"
				fontWeight={200}
			>
				best shot
			</Typography>
		</Wrapper>
	);
};

const Wrapper = styled(Stack)(({ theme }) => ({
	height: "100dvh",
	width: "100dvw",
	backgroundColor: theme.palette.black[800],
	display: "grid",
	placeContent: "center",
	placeItems: "center",
	padding: theme.spacing(0, 2),
	svg: { width: "150px" },

	[UIHelper.startsOn("tablet")]: {
		svg: { width: "450px" },
	},
}));
