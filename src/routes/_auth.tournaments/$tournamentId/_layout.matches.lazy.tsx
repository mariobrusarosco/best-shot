import { useGuess } from "@/domains/guess/hooks/use-guess";
import { IGuess } from "@/domains/guess/typing";
import { MatchCard } from "@/domains/match/components/match-card/match-card";
import { TournamentRoundsBar } from "@/domains/tournament/components/tournament-rounds-bar";
import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import fakeLogo from "@/domains/ui-system/components/icon/system-icons/copa-do-brasil.svg";
import { Box } from "@mui/system";
import { createLazyFileRoute, getRouteApi } from "@tanstack/react-router";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const TournamentMatches = () => {
	const tournamentId = route.useParams().tournamentId;
	const tournament = useTournament(tournamentId);
	const guesses = useGuess(tournament.serverState.data);

	// Derivative State
	// const tournamentLabel = tournament.serverState.data?.label;
	const matchesForSelectedRound = tournament.serverState.data?.matches;

	const activeGames = tournament.serverState?.data?.matches;
	const shouldRender = tournament.serverState.isSuccess;

	// console.log("shouldRender", shouldRender);
	// console.log("activeGames", activeGames);
	// console.log("[Match], GUESSES.DATA", guesses.data);
	// console.log("activeGames", activeGames);

	return (
		<Box
			data-ui="matches"
			className="screen"
			py={[6, 10]}
			px={[2, 6]}
			maxWidth="100vw"
		>
			<TournamentRoundsBar />

			{shouldRender ? (
				<div className="round">
					<Box mt={5} display="grid" gap={2} className="round-games">
						{matchesForSelectedRound?.map((match) => {
							console.log("[Match --- match], match", match);
							const guess = guesses.data?.find((guess: IGuess) => {
								return guess.matchId === match.id;
							});

							// console.log("[Match]", match);

							return (
								<li key={match.id} className="round-item match-card">
									<MatchCard
										logoUrl={fakeLogo}
										key={match.id}
										match={match}
										guess={guess}
									/>
									{/* <Match match={match} /> */}

									{/* <Guess
									tournamentId={tournamentId}
									match={match}
									guesses={guesses.data}
								/> */}
								</li>
							);
						})}
					</Box>
				</div>
			) : null}
		</Box>
	);
};

export const Route = createLazyFileRoute(
	"/_auth/tournaments/$tournamentId/_layout/matches",
)({
	component: TournamentMatches,
});
