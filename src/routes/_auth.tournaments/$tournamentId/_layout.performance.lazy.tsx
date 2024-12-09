import { TournamentPerformanceStats } from "@/domains/tournament/components/tournament-performance-stats/tournament-performance-stats";
import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import { useTournamentPerformance } from "@/domains/tournament/hooks/use-tournament-performance";
import { Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import { createLazyFileRoute } from "@tanstack/react-router";

// const getTotalPoints = (performance?: ITournamentPerformance[]) => {
// 	if (!performance) return null;

// 	return performance.reduce((acc, value) => acc + value.total, 0);
// };
export const TournamentPerformance = () => {
	const tournament = useTournament();
	const performance = useTournamentPerformance();

	if (performance.query.isError || tournament.isError) {
		return <MainContainer>error....</MainContainer>;
	}

	if (performance.query.isLoading || tournament.isLoading) {
		return <MainContainer>loading....</MainContainer>;
	}

	// const totalPoints = getTotalPoints(performance.query.data);
	// const guessesByStatus = Object.groupBy(
	// 	performance.query.data!,
	// 	({ status }) => status,
	// );
	// console.log({ guessesByStatus, totalPoints });

	return (
		<MainContainer data-ui="screen performance-screen">
			<Typography variant="h2" color="neutral.100">
				Your performance
			</Typography>

			<TournamentPerformanceStats
				mutation={performance.mutation}
				query={performance.query}
			/>
			{/* 
			<Box
				sx={{
					display: "flex",
				}}
			>
				<Box sx={{ display: "grid", gap: 2, py: 3, mt: 5 }}>
					<Typography variant="h3" color="teal.500" textTransform="lowercase">
						Scoreboard
					</Typography>

					<Box sx={{ display: "flex", alignItems: "start", gap: 4 }}>
						<Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
							<Typography
								variant="paragraph"
								color="teal.500"
								textTransform="uppercase"
							>
								Points
							</Typography>
							<Typography variant="h1" color="neutral.100">
								{totalPoints}
							</Typography>
						</Box>

						<Box
							sx={{
								display: "grid",
								visibility: "hidden",
								gap: 4,
								maxHeight: 500,
								overflow: "scroll",
							}}
						>
							{performance?.query.data?.map((performance, i) => {
								return (
									<Box
										key={performance.matchId}
										sx={{
											display: "grid",
										}}
									>
										<Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
											<Typography
												variant="caption"
												color="teal.500"
												textTransform="uppercase"
											>
												match
											</Typography>
											<Typography variant="paragraph" color="neutral.100">
												#{i + 1}
											</Typography>
										</Box>

										<Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
											<Typography
												variant="topic"
												color="neutral.100"
												textTransform="uppercase"
											>
												points
											</Typography>
											<Typography variant="h6" color="neutral.100">
												{performance.total}
											</Typography>
										</Box>
									</Box>
								);
							})}
						</Box>
					</Box>
				</Box>

				<Box sx={{ py: 3, mt: 5 }}>
					<Typography variant="h3" color="teal.500" textTransform="lowercase">
						Guesses
					</Typography>

					<Box sx={{ display: "grid", gap: 4 }}>
						<Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
							<Typography
								variant="paragraph"
								color="teal.500"
								textTransform="uppercase"
							>
								Open
							</Typography>
							<Typography variant="h1" color="neutral.100">
								{guessesByStatus["not-started"]?.length}
							</Typography>
						</Box>
						<Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
							<Typography
								variant="paragraph"
								color="teal.500"
								textTransform="uppercase"
							>
								Waiting for the game
							</Typography>
							<Typography variant="h1" color="neutral.100">
								{guessesByStatus["waiting_for_game"]?.length}
							</Typography>
						</Box>

						<Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
							<Typography
								variant="paragraph"
								color="teal.500"
								textTransform="uppercase"
							>
								expired
							</Typography>
							<Typography variant="h1" color="neutral.100">
								{guessesByStatus["expired"]?.length}
							</Typography>
						</Box>
					</Box>
				</Box>
			</Box> */}
		</MainContainer>
	);
};

const MainContainer = styled(Box)(({ theme }) =>
	theme.unstable_sx({
		px: 6,
		py: 8,
	}),
);

export const Route = createLazyFileRoute(
	"/_auth/tournaments/$tournamentId/_layout/performance",
)({
	component: TournamentPerformance,
});
