import TournamentRoundOfGames from "@/domains/tournament/components/tournament-round-of-games/tournament-round-of-games";
import TournamentRoundsBar from "@/domains/tournament/components/tournament-rounds-bar";
import { TournamentSetup } from "@/domains/tournament/components/tournament-setup/tournament-setup";
import TournamentStandings from "@/domains/tournament/components/tournament-standings/tournament-standings";
import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import { useTournamentRounds } from "@/domains/tournament/hooks/use-tournament-rounds";
import { AppButton } from "@/domains/ui-system/components/button/button";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { OverflowOnHover } from "@/domains/ui-system/utils";
import { UIHelper } from "@/theming/theme";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useFeatureFlag } from "@/configuration/feature-flag/use-feature-flag";
import { useFlags } from "launchdarkly-react-client-sdk";
import { debugFeatureFlags } from "@/configuration/feature-flag/featureFlags";

export const TournamentMatchesScreen = () => {
	const { activeRound, goToRound } = useTournamentRounds();
	const tournamentQuery = useTournament();
	const isEmptyState =
		tournamentQuery.isSuccess &&
		tournamentQuery.data?.onboardingCompleted === false;

	const autoSelectARound = !tournamentQuery.isPending && !activeRound;
	const fillWithAI = useFeatureFlag("fill_round_guesses_with_ai");
	const flags = useFlags();
	console.log("flags", flags);
	console.log("fillWithAI", fillWithAI);

	useEffect(() => {
		debugFeatureFlags(flags);

		console.log("Feature flag values:");
		console.log(
			"- fill_round_guesses_with_ai (snake_case):",
			flags["fill_round_guesses_with_ai"],
		);
		console.log(
			"- fillRoundGuessesWithAi (camelCase):",
			flags["fillRoundGuessesWithAi"],
		);
		console.log("- Using our hook:", fillWithAI);
	}, [flags]);

	useEffect(() => {
		const starterRound =
			tournamentQuery.data?.starterRound ||
			tournamentQuery.data?.rounds.at(-1)?.slug ||
			"";
		if (autoSelectARound) goToRound(starterRound);
	}, [autoSelectARound]);

	if (tournamentQuery.isError) {
		return (
			<Matches>
				<Typography variant="h3" color="red.100">
					lorem
				</Typography>
			</Matches>
		);
	}

	if (isEmptyState) {
		return (
			<Matches data-ui="matches">
				<TournamentSetup />
			</Matches>
		);
	}

	return (
		<Matches data-ui="matches">
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
							round
						</Typography>
					</AppPill.Component>

					<AppPill.Component
						bgcolor="black.500"
						height={25}
						width="auto"
						padding={2}
					>
						<Typography
							variant="tag"
							textTransform="uppercase"
							color="neutral.100"
							fontWeight={500}
						>
							{activeRound}
						</Typography>
					</AppPill.Component>

					{fillWithAI && (
						<AppButton
							onClick={() => {
								console.log("fill with AI");
							}}
							variant="outlined"
							bgcolor="teal.500"
						>
							<Typography
								variant="tag"
								textTransform="uppercase"
								color="neutral.100"
								fontWeight={500}
							>
								Fill with AI
							</Typography>
						</AppButton>
					)}
				</RoundHeading>

				<TournamentRoundOfGames.Component />
			</Rounds>

			<TournamentRoundsBar.Component />

			<TournamentStandings.Component />
		</Matches>
	);
};

const Matches = styled(Box)(({ theme }) => ({
	display: "flex",

	[UIHelper.whileIs("mobile")]: {
		flexDirection: "column",
		overflow: "auto",
		paddingBottom: "130px",
	},
	[UIHelper.startsOn("tablet")]: {
		height: "100%",
		columnGap: theme.spacing(1),
	},
	[UIHelper.startsOn("desktop")]: {
		height: "100%",
		columnGap: theme.spacing(4),
	},
}));

const Rounds = styled(Box)(({ theme }) => ({
	flex: 1,

	[UIHelper.whileIs("mobile")]: {
		paddingBottom: theme.spacing(16),
	},

	[UIHelper.startsOn("tablet")]: {
		// paddingRight: theme.spacing(2),
		minWidth: "380px",
		// maxWidth: "450px",
	},

	[UIHelper.startsOn("desktop")]: {
		paddingRight: theme.spacing(2),
		minWidth: "450px",
		maxWidth: "450px",
	},

	...OverflowOnHover(),
}));

const RoundHeading = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.black[700],
	paddingBottom: theme.spacing(2),
	display: "flex",
	alignItems: "center",
	gap: theme.spacing(1),
}));

export const Route = createLazyFileRoute(
	"/_auth/tournaments/$tournamentId/_layout/matches",
)({
	component: TournamentMatchesScreen,
	// errorComponent: (error) => <Typography>{error.error.message}</Typography>,
});
