import TournamentRoundOfGames from "@/domains/tournament/components/tournament-round-of-games/tournament-round-of-games";
import TournamentRoundsBar from "@/domains/tournament/components/tournament-rounds-bar";
import TournamentStandings from "@/domains/tournament/components/tournament-standings/tournament-standings";
import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import { useTournamentRounds } from "@/domains/tournament/hooks/use-tournament-rounds";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { OverflowOnHover } from "@/domains/ui-system/utils";
import { UIHelper } from "@/theming/theme";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const TournamentMatchesScreen = () => {
	const { activeRound, goToRound } = useTournamentRounds();
	const tournamentQuery = useTournament();

	const autoSelectARound = !tournamentQuery.isPending && !activeRound;

	useEffect(() => {
		const starterRound = tournamentQuery.data?.starterRound || "1";

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
		columnGap: theme.spacing(4),
	},
}));

const Rounds = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		flex: 1,
		[UIHelper.whileIs("mobile")]: {
			pb: 5,
		},

		[UIHelper.startsOn("tablet")]: {
			pr: 2,
			maxWidth: "450px",
		},

		...OverflowOnHover(),
	}),
);

const RoundHeading = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.black[700],
	paddingBotto: theme.spacing(2),
}));

export const Route = createLazyFileRoute(
	"/_auth/tournaments/$tournamentId/_layout/matches",
)({
	component: TournamentMatchesScreen,
	// errorComponent: (error) => <Typography>{error.error.message}</Typography>,
});
