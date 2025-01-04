import { queryClient } from "@/configuration/app-query";
import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { getTournament } from "../server-state/fetchers";
import { ITournament } from "../typing";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useTournament = () => {
	const params = route.useParams();
	const id = params.tournamentId;

	const cachedData = queryClient.getQueryData<ITournament>([
		"tournament",
		{ id },
	]);

	const query = useQuery<ITournament>({
		queryKey: ["tournament", { id }],
		queryFn: getTournament,
		enabled: !!id && !cachedData,
	});

	return query;
};

export const tournamentKey = (id: string) => ["tournament", { id }];
