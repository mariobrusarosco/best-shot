import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { createGuess } from "../server-side/mutations";
import { IGuess } from "../typing";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useGuessMutation = () => {
	const queryClient = useQueryClient();
	const search = route.useSearch() as { round: number };
	const tournamentId = route.useParams().tournamentId;
	const queryKey = ["guess", { tournamentId, round: search?.round }];

	const mutation = useMutation({
		mutationKey: ["createdGuess"],
		mutationFn: createGuess,
		onSuccess: (newGuess) => {
			const previousGuesses = queryClient.getQueryData(queryKey) as IGuess[];
			const updatedGuesses = previousGuesses.map((guess) =>
				guess.id === newGuess.id ? newGuess : guess,
			);

			queryClient.setQueryData(queryKey, updatedGuesses);

			console.log("Guess created successfully", newGuess);

			return { previousGuesses };
		},
		onError: (_, __, context) => {
			const contextData = context as { previousGuesses: any };

			queryClient.setQueryData(["todos"], contextData.previousGuesses);
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ["guess", { tournamentId, round: search?.round }],
			});
		},
	});

	return mutation;
};
