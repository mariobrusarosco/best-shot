import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import type { ITournament } from "@/domains/tournament/schemas";
import { getTournament } from "@/domains/tournament/server-state/fetchers";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useTournament = ({ fetchOnMount = false }: { fetchOnMount?: boolean } = {}) => {
	const params = route.useParams();
	const id = params.tournamentId;

	const query = useQuery<ITournament>({
		queryKey: ["tournament", { id: id }],
		queryFn: getTournament,
		enabled: fetchOnMount,
	});

	return query;
};

export const tournamentKey = (id: string) => ["tournament", { id }];
