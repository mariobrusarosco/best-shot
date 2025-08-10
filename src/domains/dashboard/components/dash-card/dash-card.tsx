import { styled } from "@mui/system";
import { appShimmerEffect } from "@/domains/ui-system/components/app-skeleton";
import { AppSurface } from "@/domains/ui-system/components/app-surface";
import { UIHelper } from "@/domains/ui-system/theme/migration";

const Card = styled(AppSurface)(({ theme }) =>
	theme.unstable_sx({
		backgroundColor: "black.800",
		p: 2,
		px: 2.5,
		borderRadius: 2,
		display: "flex",
		flexDirection: "column",
		gap: 1,
		justifyContent: "space-between",

		[UIHelper.startsOn("tablet")]: {
			p: 3,
			maxHeight: "160px",
		},
	})
);

export const CardSkeleton = styled(Card)(() => ({
	position: "relative",
	...appShimmerEffect(),
}));

export const DashCard = {
	Component: Card,
	Skeleton: CardSkeleton,
};
