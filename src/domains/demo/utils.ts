import { IGuess } from "./components/guess";
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

	if (game?.homeScore > game?.awayScore) {
		matchResult = "HOME_WIN";
	} else if (game?.homeScore < game?.awayScore) {
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
