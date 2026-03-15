import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { createGuess } from "@/domains/guess/server-side/mutations";
import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import { getActiveTournamentRound } from "@/domains/tournament/hooks/use-tournament-rounds";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useGuessMutation = () => {
	const queryClient = useQueryClient();
	const search = route.useSearch() as { round?: string };
	const tournamentId = route.useParams().tournamentId;
	const tournamentQuery = useTournament();
	const round = getActiveTournamentRound(search.round, tournamentQuery.data);

	const mutation = useMutation({
		mutationKey: ["createdGuess"],
		mutationFn: createGuess,
		onSuccess: (newGuess) => {
			console.log("Guess created successfully", newGuess);

			// Invalidate and refetch - let reconciliation handle the merge
			queryClient.invalidateQueries({
				queryKey: ["guess", { tournamentId, round }],
			});
		},
	});

	return mutation;
};
