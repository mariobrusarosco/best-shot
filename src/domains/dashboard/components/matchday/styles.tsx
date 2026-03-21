import { styled } from "@mui/material";
import { Box } from "@mui/system";
import { shimmerEffectNew } from "@/domains/ui-system/components/skeleton/skeleton";

export const MatchdayGrid = styled(Box)(({ theme }) => ({
	borderRadius: theme.spacing(1),
	display: "flex",
	gap: theme.spacing(2),
	overflow: "auto",
}));

export const MatchdayCardSkeleton = styled(Box)(() => {
	return {
		position: "relative",
		...shimmerEffectNew,
	};
});
