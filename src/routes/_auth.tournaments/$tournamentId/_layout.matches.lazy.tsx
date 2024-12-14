import { useGuess } from "@/domains/guess/hooks/use-guess";
import { IGuess } from "@/domains/guess/typing";
import { MatchCard } from "@/domains/match/components/match-card/match-card";
import { TournamentRoundsBar } from "@/domains/tournament/components/tournament-rounds-bar";
import { TournamentSetup } from "@/domains/tournament/components/tournament-setup/tournament-setup";
import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import { useTournamentMatches } from "@/domains/tournament/hooks/use-tournament-matches";
import { useTournamentRounds } from "@/domains/tournament/hooks/use-tournament-rounds";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { UIHelper } from "@/theming/theme";
import { Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
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
	const isPending =
		matchesQuery.isPending ||
		guessesQuery.isPending ||
		tournamentQuery.isPending;

	console.log(
		{ isPending },
		matchesQuery.isPending,
		guessesQuery.isPending,
		tournamentQuery.isPending,
	);
	const autoSelectARound = !tournamentQuery.isPending && !activeRound;

	useEffect(() => {
		const starterRound = Number(tournamentQuery.data?.starterRound) || 1;

		if (autoSelectARound) goToRound(starterRound);
	}, [autoSelectARound]);

	if (tournamentQuery.isError) {
		return (
			<Matches>
				<Typography variant="h3" color="red.100">
					Ops! Something went wrong
				</Typography>
			</Matches>
		);
	}

	if (isPending) {
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
						border="1px solid"
						borderColor="teal.500"
						width={80}
						height={25}
					>
						<Typography
							variant="tag"
							textTransform="uppercase"
							color="neutral.100"
							fontWeight={500}
						>
							round {activeRound}
						</Typography>
					</AppPill>
				</RoundHeading>

				<Stack gap={1} className="round-games">
					{matchesQuery.data?.map((match) => {
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
		flex: 1,
		[UIHelper.whileIs("mobile")]: {
			overflow: "auto",
			pb: "200px",
		},
		[UIHelper.startsOn("tablet")]: {
			overflow: "hidden",
			placeContent: "start",
			pt: 6,
			pb: 4,
			columnGap: 4,
			display: "flex",
			maxHeight:
				"calc(100vh - var(--screeh-heading-height-tablet) - var(--tournament-heading-height-tablet))",
		},
		[UIHelper.startsOn("desktop")]: {
			px: 4,
		},
	}),
);

const Rounds = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		overflow: "auto",
		pb: 2,

		[UIHelper.startsOn("desktop")]: {
			pr: 2,
		},
	}),
);

const RoundHeading = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		// position: "sticky",
		// top: 0,
		// width: "100%",
		backgroundColor: "black.700",
		pb: 3,

		[UIHelper.whileIs("mobile")]: {},

		[UIHelper.startsOn("desktop")]: {},
	}),
);

export const Route = createLazyFileRoute(
	"/_auth/tournaments/$tournamentId/_layout/matches",
)({
	component: TournamentMatchesScreen,
});
