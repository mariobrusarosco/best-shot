import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { getTournament } from "../server-state/fetchers";
import { ITournament } from "../schemas";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useTournament = ({
	fetchOnMount = false,
}: { fetchOnMount?: boolean } = {}) => {
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
