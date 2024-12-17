import { Box, styled } from "@mui/system";
import { shimmerEffect } from "../skeleton/skeleton";

const Pill = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		display: "grid",
		placeContent: "center",
		alignItems: "center",
		borderRadius: 2.5,
	}),
);

const PillSkeleton = styled(Pill)(({ theme }) =>
	theme?.unstable_sx({
		...shimmerEffect(),
	}),
);

export const AppPill = {
	Component: Pill,
	Skeleton: PillSkeleton,
};
