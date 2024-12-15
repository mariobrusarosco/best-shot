import { skeletonAnimation } from "@/domains/ui-system/components/skeleton/skeleton";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import { styled } from "@mui/system";

const Card = styled(Surface)(({ theme }) =>
	theme.unstable_sx({
		backgroundColor: "black.800",
		px: 2,
		py: 2,
		borderRadius: 2,
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		gap: 1,
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
