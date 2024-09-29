import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/tournaments/")({
	component: TournamentsPage,
});
