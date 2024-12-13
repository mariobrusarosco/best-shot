import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { setupTournament } from "../server-state/mutations";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useTournamentSetup = () => {
	const queryClient = useQueryClient();
	const id = route.useParams().tournamentId;

	const mutation = useMutation({
		mutationFn: setupTournament,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["guess"],
			});
			queryClient.invalidateQueries({
				queryKey: ["tournament", { id }],
			});
		},
	});

	return mutation;
};
