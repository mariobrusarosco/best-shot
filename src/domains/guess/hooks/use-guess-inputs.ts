import { IMatch } from "@/domains/match/typing";
import { useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { useState } from "react";
import { IGuess } from "../typing";
import { useGuessMutation } from "./use-guess-mutation";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useGuessInputs = (guess: IGuess, match: IMatch) => {
	const queryClient = useQueryClient();
	const tournamentId = route.useParams().tournamentId;
	const [homeGuess, setHomeGuess] = useState<null | string>(
		guess?.homeScore ?? null,
	);
	const [awayGuess, setAwayGuess] = useState<null | string>(
		guess?.awayScore ?? null,
	);
	const { mutate, isPending } = useGuessMutation();

	const handleHomeGuess = (value: string | null) => {
		setHomeGuess(value);
	};
	const handleAwayGuess = (value: string | null) => {
		setAwayGuess(value);
	};

	const handleSave = () => {
		const memberId = import.meta.env.VITE_MOCKED_MEMBER_ID || "";

		if (homeGuess === null || awayGuess === null) {
			throw new Error("Invalid guess");
		}

		mutate(
			{
				matchId: match.id,
				tournamentId,
				memberId,
				homeScore: homeGuess,
				awayScore: awayGuess,
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
