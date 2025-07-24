import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { getTournamentPerformance } from "../server-state/fetchers";
import { updateTournamentPerformance } from "../server-state/mutations";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useTournamentPerformance = () => {
	const tournamentId = route.useParams().tournamentId;
	const queryClient = useQueryClient();

	const query = useQuery({
		queryKey: ["tournament-performance", { tournamentId }],
		queryFn: getTournamentPerformance,
		enabled: !!tournamentId,
	});

	const mutation = useMutation({
		mutationFn: () => updateTournamentPerformance(tournamentId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["tournament-performance", { tournamentId }],
			});
		},
	});

	return { ...query, mutation };
};
