import { TournamentSimulatorPage } from "@/domains/tournament/pages/simulator";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
	"/_auth/tournaments/$tournamentId/_layout/simulator",
)({
	component: TournamentSimulatorPage,
});
