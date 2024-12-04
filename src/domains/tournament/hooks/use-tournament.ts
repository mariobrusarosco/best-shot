import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { getTournament } from "../server-state/fetchers";
import { ITournament } from "../typing";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useTournament = () => {
	const id = route.useParams().tournamentId;

	const query = useQuery<ITournament>({
		queryKey: ["tournament", { id }],
		queryFn: getTournament,
		enabled: !!id,
	});

	return query;
};
