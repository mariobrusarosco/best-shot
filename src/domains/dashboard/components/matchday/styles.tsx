import { shimmerEffectNew } from "@/domains/ui-system/components/skeleton/skeleton";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import { UIHelper } from "@/theming/theme";
import { styled } from "@mui/material";
import { Box } from "@mui/system";

export const MatchdayGrid = styled(Box)(({ theme }) => ({
	borderRadius: theme.spacing(1),
	display: "flex",
	flexWrap: "wrap",
	gap: theme.spacing(4, 2),
}));

export const MatchdayCard = styled(Surface)(({ theme }) => ({
	backgroundColor: theme.palette.black[800],
	padding: theme.spacing(2),
	borderRadius: theme.spacing(2),
	display: "flex",
	gap: theme.spacing(1),
	justifyContent: "space-between",

	[UIHelper.startsOn("tablet")]: {
		padding: theme.spacing(1),
		// maxHeight: "160px",
		// minHeight: "160px",
	},
}));

export const MatchdayCardSkeleton = styled(Box)(() => {
	return {
		...shimmerEffectNew,
	};
});
