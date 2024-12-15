import { skeletonAnimation } from "@/domains/ui-system/components/skeleton/skeleton";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import { UIHelper } from "@/theming/theme";
import { styled } from "@mui/system";

const Card = styled(Surface)(({ theme }) =>
	theme.unstable_sx({
		backgroundColor: "black.800",
		p: 2,
		px: 2.5,
		borderRadius: 2,
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		gap: 1,

		[UIHelper.startsOn("tablet")]: {
			p: 3,
		},
	}),
);

export const CardSkeleton = styled(Card)(({ theme }) =>
	theme.unstable_sx({
		...skeletonAnimation(),
	}),
);

export const DashCard = {
	Component: Card,
	Skeleton: CardSkeleton,
};
