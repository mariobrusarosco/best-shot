import { Box, styled, Typography } from "@mui/material";
import { createLazyFileRoute } from "@tanstack/react-router";
import TournamentDetailedPerformanceStats from "@/domains/tournament/components/tournament-performance-stats/tournament-detailed-performance-stats";
import TournamentPerformanceStats from "@/domains/tournament/components/tournament-performance-stats/tournament-performance-stats";
import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import { useTournamentPerformance } from "@/domains/tournament/hooks/use-tournament-performance";
import { AppTypographySkeleton } from "@/domains/ui-system/components/app-skeleton";

export const TournamentPerformance = () => {
	const tournament = useTournament();
	const performance = useTournamentPerformance();

	if (performance.isPending || performance.isRefetching || tournament.isPending) {
		return (
			<Performance>
				<AppTypographySkeleton width={200} height={22} />

				<TournamentPerformanceStats.Skeleton />
			</Performance>
		);
	}

	if (performance.isError || tournament.isError) {
		return <Performance>error....</Performance>;
	}

	return (
		<Performance data-ui="screen performance-screen" maxWidth={700}>
			<Typography
				variant="paragraph"
				textTransform="uppercase"
				color="neutral.100"
				fontWeight={600}
			>
				Your performance
			</Typography>

			<TournamentPerformanceStats.Component
				mutation={performance.mutation}
				basicPerformance={performance.data}
			/>

			<TournamentDetailedPerformanceStats.Component />
		</Performance>
	);
};

const Performance = styled(Box)(({ theme }) =>
	theme.unstable_sx({
		px: 0,
		py: 2,
		pt: 4,
		pb: 12,
	})
);

export const Route = createLazyFileRoute("/_auth/tournaments/$tournamentId/_layout/performance")({
	component: TournamentPerformance,
});
