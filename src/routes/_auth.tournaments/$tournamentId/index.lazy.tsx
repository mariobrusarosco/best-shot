import { createLazyFileRoute } from "@tanstack/react-router";
import { SingleTournamentScreen } from "@/domains/tournament/screens/single-tournament";

export const Route = createLazyFileRoute("/_auth/tournaments/$tournamentId/")({
	component: SingleTournamentScreen,
});
