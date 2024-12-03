export interface IGuess {
	id: string;
	matchId: string;
	home: {
		status: GUESS_STATUS;
		value: number | null;
		points: number | null;
	};
	away: {
		status: GUESS_STATUS;
		value: number | null;
		points: number | null;
	};
	fullMatch: {
		status: GUESS_STATUS;
		points: number | null;
	};
	total: number | null;
	status: GUESS_STATUS;
}

export const GUESS_STATUSES = {
	EXPIRED: "expired",
	CORRECT: "correct",
	INCORRECT: "incorrect",
	OPEN: "open",
	FINALIZED: "finalized",
} as const;

export type GUESS_STATUS = (typeof GUESS_STATUSES)[keyof typeof GUESS_STATUSES];
