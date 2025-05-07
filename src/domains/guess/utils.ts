// export const parseGuess = (guessRes: IGuessResponse): IGuess => ({
// 	id: guessRes.id,
// 	memberId: guessRes.memberId,
// 	matchId: guessRes.matchId,
// 	tournamentId: guessRes.tournamentId,
// 	away: {
// 		score: toNumberOrNull(guessRes.away.score),
// 		status: guessRes.away.status,
// 	},
// 	home: {
// 		score: toNumberOrNull(guessRes.home.score),
// 		status: guessRes.home.status,
// 	},
// });

interface IGUessInputs {
	home: { value: null };
	away: { value: null };
}

export const buildGuessInputs = (): IGUessInputs => {
	return {
		home: { value: null },
		away: { value: null },
	};
};

// {isOpen ? (
// 	<InputsWrapper>
// 		<ScoreInputs guess={props.guess} match={props.match} />{" "}
// 	</InputsWrapper>
// ) : null
