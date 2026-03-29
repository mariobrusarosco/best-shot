import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { createGuess } from "@/domains/guess/server-side/mutations";
import { useTournamentRounds } from "@/domains/tournament/hooks/use-tournament-rounds";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useGuessMutation = () => {
	const queryClient = useQueryClient();
	const tournamentId = route.useParams().tournamentId;
	const { activeRound } = useTournamentRounds();

	const mutation = useMutation({
		mutationKey: ["createdGuess"],
		mutationFn: createGuess,
		onSuccess: (newGuess) => {
			console.log("Guess created successfully", newGuess);

			// Invalidate and refetch - let reconciliation handle the merge
			queryClient.invalidateQueries({
				queryKey: ["guess", { tournamentId, activeRound: activeRound.data }],
			});
		},
	});

	return mutation;
};
