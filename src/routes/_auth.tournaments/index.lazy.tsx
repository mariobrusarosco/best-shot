import { createLazyFileRoute } from "@tanstack/react-router";
import { AllTournamentsScreen } from "@/domains/tournament/screens/all-tournaments";

export const Route = createLazyFileRoute("/_auth/tournaments/")({
	component: AllTournamentsScreen,
});
