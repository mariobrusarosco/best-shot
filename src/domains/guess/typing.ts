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
	hasLostTimewindowToGuess: boolean;
}

export const GUESS_STATUSES = {
	EXPIRED: "expired",
	CORRECT: "correct",
	INCORRECT: "incorrect",
	NOT_STARTED: "not-started",
	WAITING_FOR_GAME: "waiting_for_game",
	FINALIZED: "finalized",
	PAUSED: "paused",
} as const;

export type GUESS_STATUS = (typeof GUESS_STATUSES)[keyof typeof GUESS_STATUSES];
