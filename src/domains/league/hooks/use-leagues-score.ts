import { useQuery } from "@tanstack/react-query";
import { getLeagueScore } from "../server-side/fetchers";

export const useLeageScore = (leagueId: string) => {
	const query = useQuery({
		queryKey: ["scores", { leagueId }],
		queryFn: getLeagueScore,
		enabled: !!leagueId,
	});

	return query;
};
