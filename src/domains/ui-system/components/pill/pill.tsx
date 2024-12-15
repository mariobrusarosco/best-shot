import { Box, styled } from "@mui/system";
import { shimmerEffect } from "../skeleton/skeleton";

const Pill = styled(Box)(
	({ theme }) => `
  display: flex;
  justify-content: center;
  align-items: center;
	border-radius: ${theme.spacing(2.5)};
  padding: ${theme.spacing(1, 0.5)};
`,
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
