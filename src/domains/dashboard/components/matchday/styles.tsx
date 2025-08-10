import { styled } from "@mui/material";
import { Box } from "@mui/system";
import { appShimmerEffectNew } from "@/domains/ui-system/components/app-skeleton";
import { AppSurface } from "@/domains/ui-system/components/app-surface";
import { UIHelper } from "@/domains/ui-system/theme/migration";

export const MatchdayGrid = styled(Box)(({ theme }) => ({
	borderRadius: theme.spacing(1),
	display: "flex",
	gap: theme.spacing(1),
	overflow: "auto",
}));

export const MatchdayCard = styled(AppSurface)(({ theme }) => ({
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
		...appShimmerEffectNew,
	};
});
