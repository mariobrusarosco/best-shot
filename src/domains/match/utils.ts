import { GUESS_POINTS, GUESS_STATUS, IGuess } from "../guess/typing";
import { IMatch } from "./typing";

export const MatchAnalysis = (guess: IGuess, match: IMatch) => {
	const status = {
		PENDING_MATCH: new Date(match.date).getTime() > Date.now(),
		EMPTY_GUESS: guess === undefined || guess === null,
	};

	return {
		match: status,
		score: ScoreHelper.analyze(match),
		guess: GuessHelper.analyze(guess, match),
	};
};

const ScoreHelper = {
	analyze: (match: IMatch) => {
		return {
			home: Number(match.homeScore) ?? null,
			away: Number(match.awayScore) ?? null,
			outcome: getGuessOrMatchOutcome(match),
		};
	},
};

const GuessHelper = {
	getStatus: (guessValue: string, scoreValue: string) => {
		if (guessValue === null || guessValue === undefined)
			return GUESS_STATUS.NO_GUESS;
		if (guessValue == scoreValue) return GUESS_STATUS.CORRECT_GUESS;
		else return GUESS_STATUS.INCORRECT_GUESS;
	},
	getPoints: (guessValue: string, scoreValue: string) => {
		return guessValue == scoreValue ? GUESS_POINTS.HOME : 0;
	},
	analyze: (guess: IGuess, match: IMatch) => {
		if (!guess) return;

		const points = {
			home: GuessHelper.getPoints(guess.homeScore, match.homeScore),
			away: GuessHelper.getPoints(guess.awayScore, match.awayScore),
			matchOutcome:
				getGuessOrMatchOutcome(match) === getGuessOrMatchOutcome(guess)
					? GUESS_POINTS.MATCH
					: 0,
		};

		const home = {
			value: Number(guess.homeScore) ?? null,
			status: GuessHelper.getStatus(guess.homeScore, match.homeScore),
		};

		const away = {
			value: Number(guess.awayScore) ?? null,
			status: GuessHelper.getStatus(guess.awayScore, match.awayScore),
		};

		return { away, points, home };
	},
};

const getGuessOrMatchOutcome = (
	entity: IGuess | IMatch,
): MATCH_OR_GUESS_OUTCOME | null => {
	if (!entity?.awayScore || !entity?.homeScore) return null;

	if (entity.homeScore === entity.awayScore) return "DRAW";

	return entity.homeScore > entity.awayScore ? "HOME_WIN" : "AWAY_WIN";
};

export const hideAndShow = (analysis: ReturnType<typeof MatchAnalysis>) => {
	return analysis.guess;
};

type MATCH_OR_GUESS_OUTCOME =
	| "DRAW"
	| "AWAY_WIN"
	| "HOME_WIN"
	| "NOT_PROCESSED";

export type AnalizedGuess = {
	value: number;
	status: string;
};
