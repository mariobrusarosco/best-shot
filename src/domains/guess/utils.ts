import { toNumberOrNull } from "../global/utils";
import { GUESS_STATUS, IGuess, IGuessResponse, PartialGuess } from "./typing";

export const parseGuess = (guessRes: IGuessResponse): IGuess => ({
	id: guessRes.id,
	memberId: guessRes.memberId,
	matchId: guessRes.matchId,
	tournamentId: guessRes.tournamentId,
	away: {
		score: toNumberOrNull(guessRes.away.score),
		status: guessRes.away.status,
	},
	home: {
		score: toNumberOrNull(guessRes.home.score),
		status: guessRes.home.status,
	},
});

export const buildGuessInputs = (): PartialGuess => {
	return {
		home: { score: null, status: GUESS_STATUS.NO_GUESS },
		away: { score: null, status: GUESS_STATUS.NO_GUESS },
	};
};

// {isOpen ? (
// 	<InputsWrapper>
// 		<ScoreInputs guess={props.guess} match={props.match} />{" "}
// 	</InputsWrapper>
// ) : null
