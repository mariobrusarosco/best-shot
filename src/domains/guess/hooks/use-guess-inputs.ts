import { IMatch } from "@/domains/match/typing";
import { getRouteApi } from "@tanstack/react-router";
import { useState } from "react";
import { IGuess } from "../typing";
import { useGuessMutation } from "./use-guess-mutation";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useGuessInputs = (
	guess: IGuess,
	match: IMatch,
	guessMutation: ReturnType<typeof useGuessMutation>,
) => {
	const tournamentId = route.useParams().tournamentId;

	const [homeGuess, setHomeGuess] = useState<null | number>(
		guess.home.value ?? null,
	);
	const [awayGuess, setAwayGuess] = useState<null | number>(
		guess.away.value ?? null,
	);

	const handleHomeGuess = (value: number | null) => {
		setHomeGuess(value);
	};
	const handleAwayGuess = (value: number | null) => {
		setAwayGuess(value);
	};

	const handleSave = () => {
		if (homeGuess === null || awayGuess === null) {
			throw new Error("Invalid guess");
		}

		return guessMutation.mutateAsync({
			id: guess?.id || "",
			matchId: match.id,
			tournamentId,
			home: { score: homeGuess },
			away: { score: awayGuess },
		});
	};

	const hasEmptyInput = homeGuess === null || awayGuess === null;

	return {
		handleHomeGuess,
		handleAwayGuess,
		handleSave,
		homeGuess,
		awayGuess,
		allowNewGuess: !guessMutation.isPending && !hasEmptyInput,
		isPending: guessMutation.isPending,
	};
};
