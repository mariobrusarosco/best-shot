import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { getLeaguePerformance } from "../server-side/fetchers";
import { updateLeaguePerformance } from "../server-side/mutations";

const route = getRouteApi("/_auth/leagues/$leagueId/");

export const useLeaguePerformance = () => {
	const leagueId = route.useParams().leagueId;
	const queryClient = useQueryClient();

	const performance = useQuery({
		queryKey: ["league-performance", { leagueId }],
		queryFn: getLeaguePerformance,
		enabled: !!leagueId,
	});

	const mutation = useMutation({
		mutationFn: () => updateLeaguePerformance(leagueId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["league-performance", { leagueId }],
			});
		},
	});

	return { performance, mutation };
};
