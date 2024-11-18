import { createLazyFileRoute } from "@tanstack/react-router";
import { TournamentRanking } from "@/domains/tournament/pages/ranking";

export const Route = createLazyFileRoute(
	"/_auth/tournaments/$tournamentId/ranking",
)({
	component: TournamentRanking,
});
