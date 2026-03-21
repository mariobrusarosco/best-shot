import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import type { ITournament } from "@/domains/tournament/schemas";
import { getTournament } from "@/domains/tournament/server-state/fetchers";
import { tournamentKey } from "@/domains/tournament/server-state/keys";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useTournament = ({ fetchOnMount = false }: { fetchOnMount?: boolean } = {}) => {
	const params = route.useParams();
	const id = params.tournamentId;

	const query = useQuery<ITournament>({
		queryKey: tournamentKey(id),
		queryFn: getTournament,
		enabled: fetchOnMount,
	});

	return {
		data: {
			tournament: query.data,
		},
		states: {
			isLoading: query.isLoading,
			isError: query.isError,
			isEmpty: !query.isLoading && !query.isError && !query.data,
		},
		handlers: {},
	};
};
