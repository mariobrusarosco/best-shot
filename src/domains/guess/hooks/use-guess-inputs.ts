import { IMatch } from "@/domains/match/typing";
import { useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { useState } from "react";
import { IGuess, PartialGuess } from "../typing";
import { useGuessMutation } from "./use-guess-mutation";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useGuessInputs = (guess: IGuess | PartialGuess, match: IMatch) => {
	const queryClient = useQueryClient();
	const tournamentId = route.useParams().tournamentId;

	const [homeGuess, setHomeGuess] = useState<null | number>(
		guess?.home.score ?? null,
	);
	const [awayGuess, setAwayGuess] = useState<null | number>(
		guess?.away.score ?? null,
	);
	const { isPending, mutateAsync } = useGuessMutation();

	const handleHomeGuess = (value: number | null) => {
		setHomeGuess(value);
	};
	const handleAwayGuess = (value: number | null) => {
		setAwayGuess(value);
	};

	const handleSave = () => {
		const memberId = import.meta.env.VITE_MOCKED_MEMBER_ID || "";

		if (homeGuess === null || awayGuess === null) {
			throw new Error("Invalid guess");
		}

		return mutateAsync(
			{
				matchId: match.id,
				tournamentId,
				// round: search.round,
				home: {
					score: homeGuess,
				},
				away: {
					score: awayGuess,
				},
			},
			{
				onSettled: () => {
					queryClient.invalidateQueries({
						queryKey: ["guess", { tournamentId, memberId }],
					});
				},
			},
		);
	};

	const hasEmptyInput = homeGuess === null || awayGuess === null;

	return {
		handleHomeGuess,
		handleAwayGuess,
		handleSave,
		homeGuess,
		awayGuess,
		allowNewGuess: !isPending && !hasEmptyInput,
	};
};
