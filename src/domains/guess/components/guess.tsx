import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getUserToken } from "../../demo/utils";
import { IGuess } from "../typing";
import { IMatch } from "../../match/typing";
import { useGuessMutation } from "../hooks/use-guess-mutation";

interface Props {
	match: IMatch;
	tournamentId: string;
	guesses: IGuess[] | undefined;
}

const Guess = ({ match, tournamentId, guesses }: Props) => {
	const queryClient = useQueryClient();
	const gameGuess = guesses?.find((guess) => guess.matchId === match.id);
	const [homeScore, setHomeScore] = useState(gameGuess?.homeScore);
	const [awayScore, setAwayScore] = useState(gameGuess?.awayScore);
	const { mutate } = useGuessMutation();

	const handleHomeScore = (e: React.ChangeEvent<HTMLInputElement>) => {
		const score = Number(e.target.value) || 0;

		setHomeScore(score);
	};
	const handleAwayScore = (e: React.ChangeEvent<HTMLInputElement>) => {
		const score = Number(e.target.value) || 0;
		setAwayScore(score);
	};

	const handleSave = () => {
		const memberId = getUserToken() || "";

		mutate(
			{
				matchId: match.id,
				tournamentId,
				memberId,
				homeScore: Number(homeScore),
				awayScore: Number(awayScore),
			},
			{
				onSettled: () => {
					queryClient.invalidateQueries({
						queryKey: ["guess", { tournamentId, memberId }],
					});
				},
			},
		);
	};

	const now = Date.now();
	const gameDate = new Date(match.date).getTime();

	const forbidNewGuesses = gameDate < now;
	// const forbidNewGuesses = false;

	// console.log(match.id, { now, gameDate, forbidNewGuesses });
	// const score = analyzeScore(gameGuess, game);
	const noPreviousGuess = !gameGuess;
	console.log({ gameGuess, forbidNewGuesses });

	return (
		<div className="your-shot">
			{/* <strong>Your Score: {JSON.stringify(score)}</strong> */}

			{!gameGuess && forbidNewGuesses ? (
				<p>You have missed the chance to guess</p>
			) : (
				<>
					<p>Your shot</p>

					<div className="teams">
						<div className="home">
							{forbidNewGuesses ? (
								<span>{gameGuess?.homeScore}</span>
							) : (
								<input
									type="number"
									value={homeScore}
									name="home-team-shot"
									onChange={handleHomeScore}
									min={0}
								/>
							)}
						</div>
						<span>x</span>
						<div className="away">
							{forbidNewGuesses ? (
								<span>{gameGuess?.awayScore}</span>
							) : (
								<input
									min={0}
									type="number"
									value={awayScore}
									name="home-team-shot"
									onChange={handleAwayScore}
								/>
							)}
						</div>
					</div>
				</>
			)}
			{!forbidNewGuesses && <button onClick={handleSave}>save</button>}
		</div>
	);
};

export { Guess };
