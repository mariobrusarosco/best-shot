import { TournamentPerformanceStats } from "@/domains/tournament/components/tournament-performance-stats/tournament-performance-stats";
import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import { useTournamentPerformance } from "@/domains/tournament/hooks/use-tournament-performance";
import { Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import { createLazyFileRoute } from "@tanstack/react-router";

export const TournamentPerformance = () => {
	const tournament = useTournament();
	const performance = useTournamentPerformance();

	if (performance.isPending || tournament.isPending) {
		return <Performance>loading....</Performance>;
	}

	if (performance.isError || tournament.isError) {
		return <Performance>error....</Performance>;
	}

	console.log("====", performance.data);

	return (
		<Performance data-ui="screen performance-screen">
			<Typography
				variant="paragraph"
				textTransform="uppercase"
				color="neutral.100"
				fontWeight={600}
			>
				Your performance
			</Typography>

			<TournamentPerformanceStats
				mutation={performance.mutation}
				data={performance.data}
			/>
		</Performance>
	);
};

const Performance = styled(Box)(({ theme }) =>
	theme.unstable_sx({
		px: 0,
		py: 2,
		pt: 4,
		pb: 12,
	}),
);

export const Route = createLazyFileRoute(
	"/_auth/tournaments/$tournamentId/_layout/performance",
)({
	component: TournamentPerformance,
});
