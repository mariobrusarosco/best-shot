import { createFileRoute } from "@tanstack/react-router";

import { ScreenHeading } from "@/domains/global/components/screen-heading";
import { TournamentHeading } from "@/domains/tournament/components/tournament-heading";
import { TournamentRoundsBar } from "@/domains/tournament/components/tournament-rounds-bar";
import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Outlet } from "@tanstack/react-router";

const TournamentLayout = () => {
	const tournament = useTournament();
	console.log({ tournament });

	if (tournament.isLoading) {
		return (
			<Box>
				<Typography variant="h3" color="neutral.10">
					...Loading...
				</Typography>
			</Box>
		);
	}

	if (tournament.isError) {
		return (
			<Box>
				<Typography variant="h3" color="neutral.10">
					Ops! Something happened
				</Typography>
			</Box>
		);
	}

	return (
		<Box data-ui="tournament-page" sx={{ height: "100%" }}>
			<ScreenHeading withBackButton>
				<TournamentHeading tournament={tournament} />
			</ScreenHeading>
			{/* <ScrollRestoration /> */}
			<Box sx={{ display: "flex", flexDirection: "column", px: 1.5 }}>
				<TournamentRoundsBar tournament={tournament} />
			</Box>
			<Outlet />
		</Box>
	);
};

export const Route = createFileRoute(
	"/_auth/tournaments/$tournamentId/_layout",
)({
	component: TournamentLayout,
});
