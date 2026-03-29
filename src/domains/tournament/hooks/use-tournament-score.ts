import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { getTournamentScore } from "@/domains/tournament/server-state/fetchers";
import { tournamentScoreKey } from "@/domains/tournament/server-state/keys";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useTournamentScore = () => {
	const tournamentId = route.useParams().tournamentId;
	const query = useQuery({
		queryKey: tournamentScoreKey(tournamentId),
		queryFn: getTournamentScore,
	});

	console.log(query.data);

	return {
		score: {
			data: query.data,
			states: {
				isLoading: query.isLoading,
				isError: query.isError,
			},
			handlers: {
				refetch: query.refetch,
			},
		},
	};
};
