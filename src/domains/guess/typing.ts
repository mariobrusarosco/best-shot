export interface IGuess {
	id: string;
	matchId: string;
	home: {
		guessOutcome: string;
		value: number | null;
		points: number | null;
	};
	away: { guessOutcome: string; value: number | null; points: number | null };
	fullMatch: {
		guessOutcome: string;
		value: number | null;
		points: number | null;
	};
	total: number | null;
}

// TODO Refactor as "GUESS_OUTCOME"
export const GUESS_STATUS = {
	NO_GUESS: "no_guess",
	INCORRECT_GUESS: "incorret_guess",
	CORRECT_GUESS: "correct_guess",
} as const;

export const GUESS_POINTS = {
	AWAY: 1,
	HOME: 1,
	MATCH: 3,
} as const;
