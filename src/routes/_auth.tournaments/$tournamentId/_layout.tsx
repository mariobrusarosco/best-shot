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
		<div data-ui="tournament-page" className="page">
			<ScreenHeading title="tournament" withBackButton />
			<Box sx={{ display: "flex", flexDirection: "column", px: 3 }}>
				<TournamentHeading />
				<TournamentRoundsBar tournament={tournament} />
			</Box>
			<Outlet />
		</div>
	);
};

export const Route = createFileRoute(
	"/_auth/tournaments/$tournamentId/_layout",
)({
	component: TournamentLayout,
});
