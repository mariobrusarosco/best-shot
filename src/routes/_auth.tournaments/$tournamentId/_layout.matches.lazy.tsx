import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useFeatureFlag } from "@/configuration/feature-flag/use-feature-flag";
import TournamentRoundOfGames from "@/domains/tournament/components/tournament-round-of-games/tournament-round-of-games";
import TournamentRoundsBar from "@/domains/tournament/components/tournament-rounds-bar";
import TournamentStandings from "@/domains/tournament/components/tournament-standings/tournament-standings";
import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import { useTournamentRounds } from "@/domains/tournament/hooks/use-tournament-rounds";
import { AppButtonBase } from "@/domains/ui-system/components/app-button-base";
import { AppPill } from "@/domains/ui-system/components/app-pill";
import { OverflowOnHover } from "@/domains/ui-system/utils";
import { UIHelper } from "@/theming/theme";

export const TournamentMatchesScreen = () => {
	const { activeRound } = useTournamentRounds();
	const tournamentQuery = useTournament();
	const fillWithAI = useFeatureFlag("fill_round_guesses_with_ai");

	if (tournamentQuery.isError) {
		return (
			<Matches>
				<Typography variant="h3" color="red.100">
					lorem
				</Typography>
			</Matches>
		);
	}

	return (
		<Matches data-ui="matches">
			<Rounds data-ui="rounds">
				<RoundHeading>
					<AppPill.Component border="1px solid" borderColor="teal.500" width={80} height={25}>
						<Typography
							variant="tag"
							textTransform="uppercase"
							color="neutral.100"
							fontWeight={500}
						>
							round
						</Typography>
					</AppPill.Component>

					<AppPill.Component bgcolor="black.500" height={25} width="auto" padding={2}>
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
						<AppButtonBase
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
						</AppButtonBase>
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

export const Route = createLazyFileRoute("/_auth/tournaments/$tournamentId/_layout/matches")({
	component: TournamentMatchesScreen,
	// errorComponent: (error) => <Typography>{error.error.message}</Typography>,
});
