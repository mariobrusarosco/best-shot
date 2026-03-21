import { createFileRoute } from "@tanstack/react-router";
import { SingleTournamentLayout } from "@/domains/tournament/layout/single-tournament-layout";

export const Route = createFileRoute("/_auth/tournaments/$tournamentId/_layout")({
	component: SingleTournamentLayout,
});
