import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
	"/_auth/tournaments/$tournamentId/matches/$matchId",
)({
	component: () => (
		<div>Hello /tournaments/$tournamentId/matches/$matchId!</div>
	),
});
