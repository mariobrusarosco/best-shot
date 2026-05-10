import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
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
