import { TournamentMatches } from "@/domains/tournament/pages/matches";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
	"/_auth/tournaments/$tournamentId/matches",
)({
	component: TournamentMatches,
});
