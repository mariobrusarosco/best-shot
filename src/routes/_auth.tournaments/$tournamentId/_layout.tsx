import { createFileRoute } from "@tanstack/react-router";

import { ScreenHeading } from "@/domains/global/components/screen-heading";
import { TournamentHeading } from "@/domains/tournament/components/tournament-heading";
import { TournamentRoundsBar } from "@/domains/tournament/components/tournament-rounds-bar";
import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import { Box } from "@mui/system";
import { Outlet } from "@tanstack/react-router";

const TournamentLayout = () => {
	const tournament = useTournament();

	return (
		<Box data-ui="tournament-page" sx={{ height: "100%" }}>
			<ScreenHeading title="tournament" withBackButton />
			{/* <ScrollRestoration /> */}
			<Box sx={{ display: "flex", flexDirection: "column", px: 1.5 }}>
				<TournamentHeading />
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
