import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { useState } from "react";
import { getLeague } from "../server-side/fetchers";
import { useLeaguePerformance } from "./use-league-performance";

const route = getRouteApi("/_auth/leagues/$leagueId/");

export const useLeague = () => {
	const [editMode, setEditMode] = useState(false);
	const { leagueId } = route.useParams() as { leagueId: string };
	const league = useQuery({
		queryKey: ["leagues", { leagueId }],
		queryFn: getLeague,
		enabled: !!leagueId,
	});

	const { mutation, performance } = useLeaguePerformance();

	return { league, mutation, performance, setEditMode, editMode };
};
