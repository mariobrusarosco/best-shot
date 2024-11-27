export type IGuess = {
	id: string;
	memberId: string;
	matchId: string;
	tournamentId: string;
	home: {
		score: string;
		status?: typeof GUESS_STATUS;
	};
	away: {
		score: string;
		status?: typeof GUESS_STATUS;
	};
	createdAt: Date;
	updatedAt: Date;
};

export const GUESS_STATUS = {
	NO_GUESS: "no_guess",
	INCORRECT_GUESS: "incorret_guess",
	CORRECT_GUESS: "correct_guess",
};

export const GUESS_POINTS = {
	AWAY: 1,
	HOME: 1,
	MATCH: 3,
} as const;
