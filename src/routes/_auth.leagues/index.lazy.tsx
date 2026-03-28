import { createLazyFileRoute } from "@tanstack/react-router";
import { AllLeaguesScreens } from "@/domains/league/screens/all-leagues";

export const Route = createLazyFileRoute("/_auth/leagues/")({
	component: AllLeaguesScreens,
});
