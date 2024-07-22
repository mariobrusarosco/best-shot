import { useState } from "react";
import { useGuessMutation } from "../hooks";
import { useQueryClient } from "@tanstack/react-query";
import { analyzeScore, getUserToken } from "../utils";
import { IGame } from "../typing";

export type IGuess = {
	id: string;
	memberId: string;
	matchId: number;
	tournamentId: string;
	homeScore: number;
	awayScore: number;
	createdAt: Date;
	updatedAt: Date;
};

interface Props {
	game: IGame;
	tournamentId: number;
	guesses: IGuess[] | undefined;
}

const Guess = ({ game, tournamentId, guesses }: Props) => {
	const queryClient = useQueryClient();
	const gameGuess = guesses?.find((guess) => guess.matchId === game.id);
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
				matchId: game.id,
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
			}
		);
	};

	console.log({ gameGuess });
	const now = Date.now();
	const gameDate = new Date(game.date).getTime();

	// const forbidNewGuesses = gameDate < now;
	const forbidNewGuesses = false;

	console.log(game.id, { now, gameDate, forbidNewGuesses });
	const score = analyzeScore(gameGuess, game);

	return (
		<div className="your-shot">
			<strong>Your Score: {JSON.stringify(score)}</strong>
			<p>Your shot</p>

			<div className="teams">
				<div className="home">
					{forbidNewGuesses ? (
						<span>{game.homeScore}</span>
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
						<span>{game.awayScore}</span>
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
			{!forbidNewGuesses && <button onClick={handleSave}>save</button>}
		</div>
	);
};

export { Guess };
