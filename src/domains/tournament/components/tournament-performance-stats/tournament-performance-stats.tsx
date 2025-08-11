import { Box, Stack, styled, Typography } from "@mui/material";
import { AppButton } from "@/domains/ui-system/components/app-button/app-button";
import { AppCounter } from "@/domains/ui-system/components/app-counter/app-counter";
import { AppGridOfCards } from "@/domains/ui-system/components/app-grid-of-cards/grid-of-cards/app-grid-of-cards";
import {
	AppTypographySkeleton,
	appShimmerEffect,
} from "@/domains/ui-system/components/app-skeleton/app-skeleton";
import { AppSurface } from "@/domains/ui-system/components/app-surface/app-surface";
import type { useTournamentPerformance } from "../../hooks/use-tournament-performance";
import type { I_TournamentPerformance } from "../../schema";

const TournamentPerformanceStats = ({
	basicPerformance,
	mutation,
}: {
	basicPerformance: I_TournamentPerformance;
	mutation: ReturnType<typeof useTournamentPerformance>["mutation"];
}) => {
	if (!basicPerformance) return null;

	return (
		<Stack gap={4} pt={5}>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
				}}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 1,
					}}
				>
					<Typography textTransform="uppercase" variant="caption" color="teal.500">
						last updated at:
					</Typography>
					<Typography textTransform="uppercase" variant="caption" color="neutral.100">
						{basicPerformance.lastUpdated && new Date(basicPerformance.lastUpdated).toUTCString()}
					</Typography>
					<AppButton
						sx={{
							width: "150px",
							height: "30px",
							borderRadius: 2,
							backgroundColor: "teal.500",
						}}
						disabled={mutation.isPending}
						onClick={async () => {
							mutation.mutate();
						}}
					>
						<Typography variant="caption" color="neutral.100">
							Update
						</Typography>
					</AppButton>
				</Box>
			</Box>

			<PerfCard>
				<Stack direction="row" gap={1.5} alignItems="start" justifyContent="space-between">
					<Typography textTransform="uppercase" variant="topic" color="teal.500">
						points
					</Typography>
					<Typography textTransform="uppercase" variant="h1" color="neutral.100">
						<AppCounter initialValue={Number(basicPerformance?.points) ?? 0} />
					</Typography>
				</Stack>
			</PerfCard>
		</Stack>
	);
};

const PerfCard = styled(AppSurface)(({ theme }) =>
	theme.unstable_sx({
		backgroundColor: "black.800",
		px: 2,
		py: 2,
		borderRadius: 2,
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		gap: 1,
	})
);

const PerfCardSkeleton = styled(PerfCard)(({ theme }) =>
	theme.unstable_sx({
		position: "relative",
		...appShimmerEffect(),
	})
);

export const Skeleton = () => {
	return (
		<Stack gap={4} pt={5}>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
				}}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 1,
					}}
				>
					<AppTypographySkeleton width={100} height={20} />
					<AppTypographySkeleton width={150} height={30} />
				</Box>
			</Box>

			<PerfCardSkeleton>
				<Stack
					direction="row"
					gap={1.5}
					alignItems="start"
					justifyContent="space-between"
					height={102}
				/>
			</PerfCardSkeleton>

			<Stack>
				<AppGridOfCards>
					<PerfCardSkeleton />
					<PerfCardSkeleton />
					<PerfCardSkeleton />
					<PerfCardSkeleton />
				</AppGridOfCards>
			</Stack>
		</Stack>
	);
};

export default {
	Component: TournamentPerformanceStats,
	Skeleton,
};
