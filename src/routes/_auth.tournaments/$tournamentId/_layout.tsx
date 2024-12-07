import { TournamentLayout } from "@/domains/tournament/layout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_auth/tournaments/$tournamentId/_layout",
)({
	component: TournamentLayout,
});
