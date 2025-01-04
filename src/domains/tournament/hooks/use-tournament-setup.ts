import { guessKey } from "@/domains/guess/hooks/use-guess";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { setupTournament } from "../server-state/mutations";
import { tournamentKey } from "./use-tournament";
import { tournamentStandingsKey } from "./use-tournament-standings";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useTournamentSetup = () => {
	const queryClient = useQueryClient();
	const { tournamentId } = route.useParams();
	const { round } = route.useSearch() as { round: string };

	const mutation = useMutation({
		mutationFn: setupTournament,
		onSuccess: async () => {
			console.log(tournamentKey(tournamentId));
			queryClient.refetchQueries({
				queryKey: guessKey(tournamentId, round),
			});
			queryClient.invalidateQueries({
				queryKey: [
					"tournament",
					{ id: "c0389d9b-41f4-4ffb-b473-d13fabd758ae" },
				],
			});
			queryClient.refetchQueries({
				queryKey: tournamentStandingsKey(tournamentId),
			});
		},
		// onSettled: () => {
		// 	console.log(tournamentKey(tournamentId));
		// 	queryClient.invalidateQueries({
		// 		queryKey: tournamentKey(tournamentId),
		// 	});
		// },
	});

	return mutation;
};
