import { createFileRoute } from "@tanstack/react-router";
import { TournamentLayout } from "@/domains/tournament/layout";

export const Route = createFileRoute("/_auth/tournaments/$tournamentId/_layout")({
	component: TournamentLayout,
});
