import { useGuess } from "@/domains/guess/hooks/use-guess";
import { IGuess } from "@/domains/guess/typing";
import { MatchCard } from "@/domains/match/components/match-card/match-card";
import { TournamentRoundsBar } from "@/domains/tournament/components/tournament-rounds-bar";
import { TournamentSetup } from "@/domains/tournament/components/tournament-setup/tournament-setup";
import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import { useTournamentMatches } from "@/domains/tournament/hooks/use-tournament-matches";
import { useTournamentRounds } from "@/domains/tournament/hooks/use-tournament-rounds";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { Typography } from "@mui/material";
import { Box, Stack, styled } from "@mui/system";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const TournamentMatchesScreen = () => {
	const { activeRound, goToRound } = useTournamentRounds();
	const tournamentQuery = useTournament();
	const guessesQuery = useGuess();
	const matchesQuery = useTournamentMatches();

	// console.log("matches.isFetching", matches.isFetching);
	// console.log("guess.isFetching", guesses.isFetching);
	// console.log("guesses?.data", guesses?.data);
	console.log({ activeRound });
	const isEmptyState = guessesQuery.data?.length === 0;
	const isLoading =
		matchesQuery.isLoading ||
		guessesQuery.isLoading ||
		tournamentQuery.isLoading;
	const autoSelectARound = !isLoading && !activeRound;
	const isSuccess =
		matchesQuery.isSuccess &&
		guessesQuery.isSuccess &&
		tournamentQuery.isSuccess;

	useEffect(() => {
		const starterRound = Number(tournamentQuery.data?.starterRound) || 1;

		if (autoSelectARound) goToRound(starterRound);
	}, [autoSelectARound]);

	if (!isSuccess) {
		return (
			<Matches>
				<Typography variant="h3" color="red.100">
					Ops! Something went wrong
				</Typography>
			</Matches>
		);
	}

	if (isLoading) {
		return (
			<Matches>
				<Typography variant="h3" color="red.100">
					...Loading....
				</Typography>
			</Matches>
		);
	}

	if (isEmptyState) {
		return (
			<Matches>
				<TournamentSetup tournament={tournamentQuery.data} />
			</Matches>
		);
	}

	return (
		<Matches data-ui="matches">
			<TournamentRoundsBar tournament={tournamentQuery.data} />

			<Rounds data-ui="rounds">
				<RoundHeading>
					<AppPill
						bgcolor="teal.500"
						color="neutral.100"
						width={70}
						height={25}
					>
						<Typography variant="tag">round {activeRound}</Typography>
					</AppPill>
				</RoundHeading>

				<Stack gap={1} className="round-games">
					{matchesQuery?.data?.map((match) => {
						const guess = guessesQuery.data?.find((guess: IGuess) => {
							return guess.matchId === match.id;
						}) as IGuess;

						return (
							<li key={match.id} className="round-item match-card">
								<MatchCard key={match.id} match={match} guess={guess} />
							</li>
						);
					})}
				</Stack>
			</Rounds>

			<Box
				data-ui="standings"
				sx={{
					display: {
						all: "none",
						tablet: "flex",
					},
				}}
			>
				<Typography variant="h6" color="neutral.100">
					standings
				</Typography>
			</Box>
		</Matches>
	);
};

const Matches = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		overflow: "auto",
		flex: 1,
		// height: {
		// 	all: "calc(100vh - var(--screeh-heading-height-mobile))",
		// 	tablet: "calc(100vh - var(--screeh-heading-height-tablet))",
		// },
		py: {
			tablet: 8,
		},
		px: {
			tablet: 4,
		},
		// display: "grid",
		gap: {
			tablet: 4,
		},
		gridTemplateColumns: {
			all: "1fr",
			tablet: "60px 400px 1fr",
		},
	}),
);

const Rounds = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		// pb: {
		// 	all: "215px",
		// 	tablet: "215px",
		// },
	}),
);

const RoundHeading = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		// position: "sticky",
		// top: 0,
		width: "100%",
		py: { all: 2, tablet: "unset" },
		backgroundColor: "black.700",
	}),
);

export const Route = createLazyFileRoute(
	"/_auth/tournaments/$tournamentId/_layout/matches",
)({
	component: TournamentMatchesScreen,
});
