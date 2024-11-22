export type IGuess = {
	id: string;
	memberId: string;
	matchId: string;
	tournamentId: string;
	homeScore: number;
	awayScore: number;
	createdAt: Date;
	updatedAt: Date;
};

export const GUESS_STATUS = {
	NO_GUESS: "no_guess",
	INCORRECT_GUESS: "incorret_guess",
	CORRECT_GUESS: "correct_guess",
};
