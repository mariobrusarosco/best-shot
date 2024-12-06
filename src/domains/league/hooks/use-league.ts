import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { getLeague } from "../server-side/fetchers";

const route = getRouteApi("/_auth/leagues/$leagueId");

export const useLeague = () => {
	const { leagueId } = route.useParams() as { leagueId: string };
	const query = useQuery({
		queryKey: ["leagues", { leagueId }],
		queryFn: getLeague,
		enabled: !!leagueId,
	});

	return query;
};

// export const useLeageScore = (leagueId: string | null) => {
// 	const query = useQuery({
// 		queryKey: ["league-score", { leagueId }],
// 		queryFn: getLeagueScore,
// 		enabled: !!leagueId,
// 	});

// 	return query;
// };
