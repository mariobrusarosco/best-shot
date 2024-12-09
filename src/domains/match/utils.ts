import { toNumberOrNull } from "../global/utils";
import { IMatch, IMatchResponse } from "./typing";

export const parseMatch = (matchRes: IMatchResponse): IMatch => ({
	id: matchRes.id,
	date: matchRes.date,
	round: matchRes.round,
	tournamentId: matchRes.tournamentId,
	status: matchRes.status,
	home: {
		...matchRes.home,
		score: toNumberOrNull(matchRes.home.score),
	},
	away: {
		...matchRes.away,
		score: toNumberOrNull(matchRes.away.score),
	},
});

//---------------------------------------------------------

// export const MatchAnalysis = (guess: IGuess, match: IMatch) => {
// 	const status = {
// 		PENDING_MATCH: new Date(match.date).getTime() > Date.now(),
// 		EMPTY_GUESS: guess === undefined || guess === null,
// 	};

// 	return {
// 		match: status,
// 		score: ScoreHelper.analyze(match),
// 		guess: GuessHelper.analyze(guess, match),
// 	};
// };

// const ScoreHelper = {
// 	analyze: (match: IMatch) => {
// 		return {
// 			home: Number(match.home.score) ?? null,
// 			away: Number(match.away.score) ?? null,
// 			outcome: getGuessOrMatchOutcome(match),
// 		};
// 	},
// };

// const GuessHelper = {
// 	getStatus: (guessValue: string, scoreValue: string) => {
// 		if (guessValue === null || guessValue === undefined)
// 			return GUESS_STATUS.NO_GUESS;
// 		if (guessValue == scoreValue) return GUESS_STATUS.CORRECT_GUESS;
// 		else return GUESS_STATUS.INCORRECT_GUESS;
// 	},
// 	getPoints: (guessValue: number, scoreValue: number) => {
// 		return guessValue == scoreValue ? GUESS_POINTS.HOME : 0;
// 	},
// 	analyze: (guess: IGuess, match: IMatch) => {
// 		if (!guess?.away?.score || !guess?.home?.score) return;

// 		const points = {
// 			home: GuessHelper.getPoints(guess.home.score, match.home.score),
// 			away: GuessHelper.getPoints(guess.away.score, match.home.score),
// 			matchOutcome:
// 				getGuessOrMatchOutcome(match) === getGuessOrMatchOutcome(guess)
// 					? GUESS_POINTS.MATCH
// 					: 0,
// 		};

// 		const home = {
// 			value: Number(guess.home.score) ?? null,
// 			status: GuessHelper.getStatus(guess.home.score, match.home.score),
// 		};

// 		const away = {
// 			value: Number(guess.away.score) ?? null,
// 			status: GuessHelper.getStatus(guess.away.score, match.away.score),
// 		};

// 		return { away, points, home };
// 	},
// };

// const getGuessOrMatchOutcome = (
// 	entity: IGuess | IMatch,
// ): MATCH_OR_GUESS_OUTCOME | null => {
// 	if (!entity?.away.score || !entity?.home.score) return null;

// 	if (entity.home.score === entity.away.score) return "DRAW";

// 	return entity.home.score > entity.away.score ? "HOME_WIN" : "AWAY_WIN";
// };

// export const hideAndShow = (analysis: ReturnType<typeof MatchAnalysis>) => {
// 	return analysis.guess;
// };

// type MATCH_OR_GUESS_OUTCOME =
// 	| "DRAW"
// 	| "AWAY_WIN"
// 	| "HOME_WIN"
// 	| "NOT_PROCESSED";

// export type AnalizedGuess = {
// 	value: string | null;
// 	status: string;
// };
