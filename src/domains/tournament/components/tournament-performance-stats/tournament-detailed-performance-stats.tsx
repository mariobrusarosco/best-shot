import { Box, Stack, styled, Typography } from "@mui/material";
import { useState } from "react";
import { AppButton } from "@/domains/ui-system/components/button/button";
import { Counter } from "@/domains/ui-system/components/counter/counter";
import { GridOfCards } from "@/domains/ui-system/components/grid-of-cards/grid-of-cards";
import {
	shimmerEffect,
	TypographySkeleton,
} from "@/domains/ui-system/components/skeleton/skeleton";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import { useTournamentDetailedPerformance } from "../../hooks/use-tournament-detailed-performance";

const TournamentDetailedPerformanceStats = () => {
	const [showDetailedPerformance, setShowDetailedPerformance] = useState(false);
	const detailedPerformance = useTournamentDetailedPerformance({
		enabled: showDetailedPerformance,
	});

	return (
		<Stack>
			<AppButton
				sx={{
					width: "150px",
					height: "30px",
					borderRadius: 2,
					backgroundColor: "teal.500",
				}}
				onClick={() => setShowDetailedPerformance(!showDetailedPerformance)}
			>
				<Typography variant="caption" color="neutral.100">
					see more
				</Typography>
			</AppButton>

			{detailedPerformance.data && (
				<Stack gap={4} pt={5}>
					<Stack>
						<GridOfCards>
							<PerfCard>
								<Stack direction="row" gap={1.5} alignItems="center">
									<Typography textTransform="uppercase" variant="caption" color="teal.500">
										correct guesses
									</Typography>
									<Typography textTransform="uppercase" variant="h4" color="neutral.100">
										<Counter initialValue={detailedPerformance.data?.guessesByOutcome.correct} />
									</Typography>
								</Stack>
							</PerfCard>
							<PerfCard>
								<Stack direction="row" gap={1.5} alignItems="center">
									<Typography textTransform="uppercase" variant="caption" color="teal.500">
										incorrect guesses
									</Typography>
									<Typography textTransform="uppercase" variant="h4" color="neutral.100">
										<Counter initialValue={detailedPerformance.data.guessesByOutcome.incorrect} />
									</Typography>
								</Stack>
							</PerfCard>
							<PerfCard>
								<Stack direction="row" gap={1.5} alignItems="center">
									<Typography textTransform="uppercase" variant="caption" color="teal.500">
										waiting for macth outcome
									</Typography>
									<Typography textTransform="uppercase" variant="h4" color="neutral.100">
										<Counter initialValue={detailedPerformance.data.details["waiting_for_game"]} />
									</Typography>
								</Stack>
							</PerfCard>
							<PerfCard>
								<Stack direction="row" gap={1.5} alignItems="center">
									<Typography textTransform="uppercase" variant="caption" color="teal.500">
										you still can guess
									</Typography>
									<Typography textTransform="uppercase" variant="h4" color="neutral.100">
										<Counter initialValue={detailedPerformance.data?.details["not-started"]} />
									</Typography>
								</Stack>
							</PerfCard>
						</GridOfCards>
					</Stack>

					<Stack></Stack>
				</Stack>
			)}
		</Stack>
	);
};

const PerfCard = styled(Surface)(({ theme }) =>
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
		...shimmerEffect(),
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
					<TypographySkeleton width={100} height={20} />
					<TypographySkeleton width={150} height={30} />
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
				<GridOfCards>
					<PerfCardSkeleton />
					<PerfCardSkeleton />
					<PerfCardSkeleton />
					<PerfCardSkeleton />
				</GridOfCards>
			</Stack>
		</Stack>
	);
};

export default {
	Component: TournamentDetailedPerformanceStats,
	Skeleton,
};
