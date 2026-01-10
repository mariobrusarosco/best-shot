import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { createGuess } from "@/domains/guess/server-side/mutations";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useGuessMutation = () => {
	const queryClient = useQueryClient();
	const search = route.useSearch() as { round: number };
	const tournamentId = route.useParams().tournamentId;

	const mutation = useMutation({
		mutationKey: ["createdGuess"],
		mutationFn: createGuess,
		onSuccess: (newGuess) => {
			console.log("Guess created successfully", newGuess);

			// Invalidate and refetch - let reconciliation handle the merge
			queryClient.invalidateQueries({
				queryKey: ["guess", { tournamentId, round: search?.round }],
			});
		},
	});

	return mutation;
};
