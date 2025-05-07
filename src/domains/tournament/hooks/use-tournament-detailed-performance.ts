import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import {  getTournamentPerformanceDetails } from "../server-state/fetchers";
import { updateTournamentPerformance } from "../server-state/mutations";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useTournamentDetailedPerformance = ({ enabled}: { enabled: boolean }) => {
	const tournamentId = route.useParams().tournamentId;
	const queryClient = useQueryClient();

	const query = useQuery({
		queryKey: ["tournament-performance", "details", { tournamentId }],
		queryFn: getTournamentPerformanceDetails,
		enabled,
	});

	const mutation = useMutation({
		mutationFn: () => updateTournamentPerformance(tournamentId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["tournament-performance", "details", { tournamentId }],
			});
		},
	});

	return { ...query, mutation };
};
