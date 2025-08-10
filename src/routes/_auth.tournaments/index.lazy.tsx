import { createLazyFileRoute } from "@tanstack/react-router";
import { TournamentsScreen } from "@/domains/tournament/screens/tournaments";

export const Route = createLazyFileRoute("/_auth/tournaments/")({
	component: TournamentsScreen,
});
