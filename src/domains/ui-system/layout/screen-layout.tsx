import { UIHelper } from "@/theming/theme";
import { Box, styled } from "@mui/material";

export const ScreenLayout = styled(Box)(() => ({
	[UIHelper.startsOn("tablet")]: {
		flex: 1,
	},
}));
