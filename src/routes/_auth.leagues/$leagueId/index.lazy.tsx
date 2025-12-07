import { createLazyFileRoute } from "@tanstack/react-router";
import { LeagueScreen } from "@/domains/league/screens/league";

export const Route = createLazyFileRoute("/_auth/leagues/$leagueId/")({
	component: LeagueScreen,
});
