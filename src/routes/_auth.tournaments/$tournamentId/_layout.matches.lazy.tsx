import { useGuess } from "@/domains/guess/hooks/use-guess";
import { IGuess } from "@/domains/guess/typing";
import { MatchCard } from "@/domains/match/components/match-card/match-card";
import { TournamentRoundsBar } from "@/domains/tournament/components/tournament-rounds-bar";
import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import { useTournamentMatches } from "@/domains/tournament/hooks/use-tournament-matches";
import { useTournamentRounds } from "@/domains/tournament/hooks/use-tournament-rounds";
import { useTournamentSetup } from "@/domains/tournament/hooks/use-tournament-setup";
import { AppButton } from "@/domains/ui-system/components/button/button";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import { useQueryClient } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";

export const TournamentMatchesScreen = () => {
	const { activeRound } = useTournamentRounds();
	const tournament = useTournament();
	const guesses = useGuess();
	const matches = useTournamentMatches();
	const setup = useTournamentSetup();
	const queryClient = useQueryClient();

	// console.log("matches.isFetching", matches.isFetching);
	// console.log("guess.isFetching", guesses.isFetching);
	// console.log("guesses?.data", guesses?.data);

	if (matches.isError || guesses.isError) {
		return (
			<Matches>
				<Typography variant="h3" color="red.100">
					Ops! Something went wrong
				</Typography>
			</Matches>
		);
	}

	if (matches.isLoading || guesses.isLoading) {
		return (
			<Matches>
				<Typography variant="h3" color="red.100">
					...Loading....
				</Typography>
			</Matches>
		);
	}

	if (guesses.data?.length === 0) {
		return (
			<Matches>
				<AppButton
					sx={{
						width: "180px",
						height: "50px",
						borderRadius: 2,
						backgroundColor: "teal.500",
					}}
					disabled={setup.isPending}
					onClick={async () => {
						await setup.mutateAsync({
							tournamentId: tournament.data?.id || "",
						});

						queryClient.invalidateQueries({
							queryKey: ["guess"],
						});
					}}
				>
					<Typography variant="caption" color="neutral.100">
						click here to setup
					</Typography>
				</AppButton>
			</Matches>
		);
	}

	return (
		<Matches data-ui="matches">
			<TournamentRoundsBar tournament={tournament} />

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

				<Box display="grid" gap={2} className="round-games">
					{matches?.data?.map((match) => {
						const guess = guesses.data?.find((guess: IGuess) => {
							return guess.matchId === match.id;
						}) as IGuess;

						return (
							<li key={match.id} className="round-item match-card">
								<MatchCard key={match.id} match={match} guess={guess} />
							</li>
						);
					})}
				</Box>
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
		overflow: "hidden",
		height: {
			all: "calc(100vh - var(--screeh-heading-height-mobile))",
			tablet: "calc(100vh - var(--screeh-heading-height-tablet))",
		},
		py: {
			tablet: 8,
		},
		px: {
			tablet: 4,
		},
		display: "grid",
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
		overflow: "auto",
		height: {
			all: "calc(100vh - var(--screeh-heading-height-mobile))",
			tablet: "calc(100vh - var(--screeh-heading-height-tablet))",
		},
		px: [1.5, 3],
		pb: {
			all: "175px",
			tablet: "50px",
		},
	}),
);

const RoundHeading = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		position: "sticky",
		top: 0,
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
