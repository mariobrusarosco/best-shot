// import { useQueryClient } from "@tanstack/react-query";
// import { useState } from "react";
// import { getUserToken } from "../../demo/utils";
// import { IMatch } from "../../match/typing";
// import { useGuessMutation } from "../hooks/use-guess-mutation";
// import { IGuess } from "../typing";

// interface Props {
// 	match: IMatch;
// 	tournamentId: string;
// 	guesses: IGuess[] | undefined;
// }

// const Guess = ({ match, tournamentId, guesses }: Props) => {
// 	const queryClient = useQueryClient();
// 	const gameGuess = guesses?.find((guess) => guess.matchId === match.id);
// 	const [homeScore, setHomeScore] = useState(gameGuess?.home.score || null);
// 	const [awayScore, setAwayScore] = useState(gameGuess?.away.score || null);
// 	const { mutate } = useGuessMutation();

// 	const handleHomeScore = (e: React.ChangeEvent<HTMLInputElement>) => {
// 		const score = e.target.value;

// 		setHomeScore(score);
// 	};
// 	const handleAwayScore = (e: React.ChangeEvent<HTMLInputElement>) => {
// 		const score = e.target.value;
// 		setAwayScore(score);
// 	};

// 	const handleSave = () => {
// 		const memberId = getUserToken() || "";

// 		mutate(
// 			{
// 				matchId: match.id,
// 				tournamentId,
// 				memberId,
// 				home: { score: homeScore },
// 				away: { score: awayScore },
// 			},
// 			{
// 				onSettled: () => {
// 					queryClient.invalidateQueries({
// 						queryKey: ["guess", { tournamentId, memberId }],
// 					});
// 				},
// 			},
// 		);
// 	};

// 	const now = Date.now();
// 	const gameDate = new Date(match.date).getTime();

// 	const forbidNewGuesses = gameDate < now;
// 	// const forbidNewGuesses = false;

// 	// console.log(match.id, { now, gameDate, forbidNewGuesses });
// 	// const score = analyzeScore(gameGuess, game);
// 	console.log({ gameGuess, forbidNewGuesses });

// 	return (
// 		<div className="your-shot">
// 			{/* <strong>Your Score: {JSON.stringify(score)}</strong> */}

// 			{!gameGuess && forbidNewGuesses ? (
// 				<p>You have missed the chance to guess</p>
// 			) : (
// 				<>
// 					<p>Your shot</p>

// 					<div className="guess">
// 						<div className="home">
// 							{forbidNewGuesses ? (
// 								<span>{gameGuess?.away.score}</span>
// 							) : (
// 								<input
// 									type="number"
// 									value={homeScore}
// 									name="home-team-shot"
// 									onChange={handleHomeScore}
// 									min={0}
// 								/>
// 							)}
// 						</div>
// 						<span>x</span>
// 						<div className="away">
// 							{forbidNewGuesses ? (
// 								<span>{gameGuess?.away.score}</span>
// 							) : (
// 								<input
// 									min={0}
// 									type="number"
// 									value={awayScore}
// 									name="home-team-shot"
// 									onChange={handleAwayScore}
// 								/>
// 							)}
// 						</div>
// 					</div>
// 				</>
// 			)}
// 			{!forbidNewGuesses && <button onClick={handleSave}>save</button>}
// 		</div>
// 	);
// };

// export { Guess };
