import { shimmerEffectNew } from "@/domains/ui-system/components/skeleton/skeleton";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import { UIHelper } from "@/theming/theme";
import { styled } from "@mui/material";
import { Box } from "@mui/system";

export const MatchdayGrid = styled(Box)(({ theme }) => ({
	borderRadius: theme.spacing(1),
	display: "flex",
	gap: theme.spacing(1),
	overflow: "auto",
}));

export const MatchdayCard = styled(Surface)(({ theme }) => ({
	backgroundColor: theme.palette.black[800],
	borderRadius: theme.spacing(2),
	display: "flex",
	gap: theme.spacing(1),

	[UIHelper.whileIs("mobile")]: {},

	[UIHelper.startsOn("tablet")]: {
		padding: theme.spacing(1),
	},
}));

export const MatchdayCardSkeleton = styled(Box)(() => {
	return {
		position: "relative",
		...shimmerEffectNew,
	};
});
