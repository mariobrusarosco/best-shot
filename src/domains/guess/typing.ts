export type IGuessResponse = {
	id: string;
	memberId: string;
	matchId: string;
	tournamentId: string;
	home: {
		score: string;
		status: (typeof GUESS_STATUS)[keyof typeof GUESS_STATUS];
	};
	away: {
		score: string;
		status: (typeof GUESS_STATUS)[keyof typeof GUESS_STATUS];
	};
	createdAt: Date;
	updatedAt: Date;
};

export type PartialGuess = Pick<IGuess, "away" | "home">;

export type IGuess = {
	id: IGuessResponse["id"];
	memberId: IGuessResponse["memberId"];
	matchId: IGuessResponse["matchId"];
	tournamentId: IGuessResponse["tournamentId"];
	home: {
		score: number | null;
		status: IGuessResponse["home"]["status"];
	};
	away: {
		score: number | null;
		status: IGuessResponse["away"]["status"];
	};
};

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
