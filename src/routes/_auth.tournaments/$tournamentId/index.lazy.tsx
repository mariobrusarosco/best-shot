import { TournamentPage } from "@/domains/tournament/pages/tournament";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/tournaments/$tournamentId/")({
	component: TournamentPage,
});
