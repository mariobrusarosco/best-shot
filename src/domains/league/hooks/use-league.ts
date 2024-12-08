import { useMutation, useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { getLeague } from "../server-side/fetchers";
import { updateLeaguePerformance } from "../server-side/mutations";

const route = getRouteApi("/_auth/leagues/$leagueId");

export const useLeague = () => {
	const { leagueId } = route.useParams() as { leagueId: string };
	const league = useQuery({
		queryKey: ["leagues", { leagueId }],
		queryFn: getLeague,
		enabled: !!leagueId,
	});

	const mutation = useMutation({
		mutationFn: updateLeaguePerformance,
	});

	return { league, mutation };
};

// export const useLeageScore = (leagueId: string | null) => {
// 	const query = useQuery({
// 		queryKey: ["league-score", { leagueId }],
// 		queryFn: getLeagueScore,
// 		enabled: !!leagueId,
// 	});

// 	return query;
// };
