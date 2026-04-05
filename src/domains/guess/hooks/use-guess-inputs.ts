import { getRouteApi } from "@tanstack/react-router";
import { useState } from "react";
import type { IGuess } from "@/domains/guess/typing";
import type { CreateGuessInput } from "@/domains/league/typing";
import type { IMatch } from "@/domains/match/typing";
import type { MatchSaveAdapter } from "@/domains/tournament/hooks/use-tournament-simulation";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useGuessInputs = (
	guess: IGuess,
	match: IMatch,
	saveAdapter: MatchSaveAdapter
) => {
	const tournamentId = route.useParams().tournamentId;

	const [homeGuess, setHomeGuess] = useState<null | number>(guess.home.value ?? null);
	const [awayGuess, setAwayGuess] = useState<null | number>(guess.away.value ?? null);

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

		const input: CreateGuessInput = {
			matchId: match.id,
			tournamentId,
			home: { score: homeGuess },
			away: { score: awayGuess },
		};

		return saveAdapter.saveMatch(match, input);
	};

	const hasEmptyInput = homeGuess === null || awayGuess === null;

	return {
		handleHomeGuess,
		handleAwayGuess,
		handleSave,
		homeGuess,
		awayGuess,
		allowNewGuess: !saveAdapter.isPending && !hasEmptyInput,
		isPending: saveAdapter.isPending,
	};
};
