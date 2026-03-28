import { createLazyFileRoute } from "@tanstack/react-router";
import { SingleLeagueScreen } from "@/domains/league/screens/single-league";

export const Route = createLazyFileRoute("/_auth/leagues/$leagueId/")({
	component: SingleLeagueScreen,
});
