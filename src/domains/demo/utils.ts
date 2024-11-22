import { IGuess } from "../guess/typing";
import { IMatch } from "../match/typing";
import { SCORE_TABLE } from "./constants";
import { IGame } from "./typing";

export const getUserToken = () => localStorage.getItem("fakeAuth");

const hasGuessedExactScore = (guess: IGuess, game: IGame) =>
	guess.homeScore === game.homeScore && guess.awayScore === game.awayScore;

const hasGuessedMatchResult = (guess: IGuess, game: IGame) => {
	let guessResult = null;
	let matchResult = null;

	if (guess.homeScore > guess.awayScore) {
		guessResult = "HOME_WIN";
	} else if (guess.homeScore < guess.awayScore) {
		guessResult = "AWAY_WIN";
	} else {
		guessResult = "DRAW";
	}

	if (
		game?.homeScore != null &&
		game?.awayScore != null &&
		game?.homeScore > game?.awayScore
	) {
		matchResult = "HOME_WIN";
	} else if (
		game?.homeScore != null &&
		game?.awayScore != null &&
		game?.homeScore < game?.awayScore
	) {
		matchResult = "AWAY_WIN";
	} else {
		matchResult = "DRAW";
	}

	return guessResult === matchResult;
};

export const analyzeScore = (guess: IGuess, game: IGame) => {
	if (!guess) return 0;

	const guessedExactScore = hasGuessedExactScore(guess, game);
	const guessedMatchResult = hasGuessedMatchResult(guess, game);

	return {
		EXACT_SCORE: guessedExactScore ? SCORE_TABLE.EXACT_SCORE : 0,
		MATCH_RESULT: guessedMatchResult ? SCORE_TABLE.MATCH_RESULT : 0,
	} satisfies Record<keyof typeof SCORE_TABLE, number>;
};

const getMatchOutcome = (match: IMatch) => {
	if (!match.awayScore || !match.homeScore) return null;

	if (match.homeScore === match.awayScore) return "DRAW";

	return match.homeScore > match.awayScore ? "HOME_WIN" : "AWAY_WIN";
};

const getGuessOutcome = (guess: IGuess) => {
	if (!guess?.awayScore || !guess?.homeScore) return null;

	if (guess.homeScore === guess.awayScore) return "DRAW";

	return guess.homeScore > guess.awayScore ? "HOME_WIN" : "AWAY_WIN";
};

export type GUESS_STATUS = "no_guess" | "incorret_guess" | "correct_guess";

export const MatchAnalyzer = (guess: IGuess, match: IMatch) => {
	if (!match) return null;

	const GUESSED_AWAY_SCORE = guess ? guess.awayScore === match.awayScore : null;
	const GUESSED_HOME_SCORE = guess ? guess.homeScore === match.homeScore : null;
	const GUESSED_MATCH_OUTCOME =
		getMatchOutcome(match) === getGuessOutcome(guess);

	return {
		GUESSED_AWAY_SCORE,
		GUESSED_HOME_SCORE,
		GUESSED_MATCH_OUTCOME,
	};
};
