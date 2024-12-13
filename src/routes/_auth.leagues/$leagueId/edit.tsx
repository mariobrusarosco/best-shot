import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/leagues/$leagueId/edit")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_auth/leagues/$leagueId/edit"!</div>;
}
