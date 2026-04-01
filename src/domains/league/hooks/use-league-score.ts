import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { getLeagueScore } from "@/domains/league/server-side/fetchers";
import { leagueScoreKey } from "@/domains/league/server-side/keys";

const route = getRouteApi("/_auth/leagues/$leagueId/");

export const useLeagueScore = () => {
	const leagueId = route.useParams().leagueId;
	const query = useQuery({
		queryKey: leagueScoreKey(leagueId),
		queryFn: getLeagueScore,
	});

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
