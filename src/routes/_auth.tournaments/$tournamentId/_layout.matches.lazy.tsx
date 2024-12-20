import { useGuess } from "@/domains/guess/hooks/use-guess";
import { IGuess } from "@/domains/guess/typing";
import MatchCard from "@/domains/match/components/match-card/match-card";
import TournamentRoundsBar from "@/domains/tournament/components/tournament-rounds-bar";
import { TournamentSetup } from "@/domains/tournament/components/tournament-setup/tournament-setup";
import { TournamentStandings } from "@/domains/tournament/components/tournament-standings/tournament-standings";
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

	const isEmptyState = guessesQuery.data?.length === 0;
	const isPending =
		matchesQuery.isPending ||
		guessesQuery.isPending ||
		tournamentQuery.isPending;

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
			<Matches data-ui="matches-screen-skeleton">
				<TournamentRoundsBar.Skeleton />

				<Rounds data-ui="rounds-skeleton">
					<RoundHeading data-ui="rounds-heading-skeleton">
						<AppPill.Skeleton width={80} height={25} />
					</RoundHeading>

					<RoundGamesSkeleton />
				</Rounds>
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
			<TournamentRoundsBar.Component tournament={tournamentQuery.data} />

			<Rounds data-ui="rounds">
				<RoundHeading>
					<AppPill.Component
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
					</AppPill.Component>
				</RoundHeading>

				<Games className="round-games">
					{matchesQuery.data?.map((match) => {
						const guess = guessesQuery.data?.find((guess: IGuess) => {
							return guess.matchId === match.id;
						}) as IGuess;

						return (
							<li key={match.id} className="round-item match-card">
								<MatchCard.Component
									key={match.id}
									match={match}
									guess={guess}
								/>
							</li>
						);
					})}
				</Games>
			</Rounds>

			<TournamentStandings />
		</Matches>
	);
};

const Matches = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		display: "flex",
		flex: 1,

		[UIHelper.whileIs("mobile")]: {
			flexDirection: "column",
			overflow: "auto",
			pb: "170px",
		},
		[UIHelper.startsOn("tablet")]: {
			py: 3,
			columnGap: 4,
			flexDirection: "row",
			height:
				"calc(100vh - var(--screeh-heading-height-tablet) - var(--tournament-heading-height-tablet))",
		},
	}),
);

const Rounds = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		overflow: "auto",

		[UIHelper.whileIs("mobile")]: {
			pb: 5,
		},

		[UIHelper.startsOn("tablet")]: {
			pr: 2,
			maxWidth: "600px",
			flex: 1,
		},

		":hover": {
			"::-webkit-scrollbar-thumb": {
				background: "#394c4a",
			},
		},
	}),
);

const Games = styled(Stack)(({ theme }) => ({
	gap: theme.spacing(2),
}));

const RoundHeading = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		backgroundColor: "black.700",
		pb: 3,
	}),
);

const RoundGamesSkeleton = () => {
	return (
		<Stack gap={1} className="round-games-skeleton">
			{Array.from({ length: 10 }).map((_, index) => {
				return (
					<li key={index} className="round-item match-card">
						<MatchCard.Skeleton key={index} />
					</li>
				);
			})}
		</Stack>
	);
};

export const Route = createLazyFileRoute(
	"/_auth/tournaments/$tournamentId/_layout/matches",
)({
	component: TournamentMatchesScreen,
});
