import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { setupTournament } from "../server-state/mutations";
import { tournamentKey } from "./use-tournament";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useTournamentSetup = () => {
	const queryClient = useQueryClient();
	const { tournamentId } = route.useParams();

	const mutation = useMutation({
		mutationFn: setupTournament,
		onSuccess: () => {
			console.log("on Success start");
			queryClient.invalidateQueries({
				queryKey: tournamentKey(tournamentId),
				refetchType: "active",
			});
		},
	});

	return mutation;
};
