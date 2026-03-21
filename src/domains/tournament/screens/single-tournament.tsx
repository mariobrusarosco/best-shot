import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import { TournamentRoundOfGames } from "@/domains/tournament/components/tournament-round-of-games/tournament-round-of-games";
import { TournamentRoundsBar } from "@/domains/tournament/components/tournament-rounds-bar";
import TournamentStandings from "@/domains/tournament/components/tournament-standings/tournament-standings";
import { UIHelper } from "@/domains/ui-system/theme";

export const SingleTournamentScreen = () => {
	return (
		<Matches data-ui="matches">
			<TournamentRoundsBar />
			<TournamentRoundOfGames />
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

// const _Rounds = styled(Box)(({ theme }) => ({
// 	flex: 1,

// 	[UIHelper.whileIs("mobile")]: {
// 		paddingBottom: theme.spacing(16),
// 	},

// 	[UIHelper.startsOn("tablet")]: {
// 		// paddingRight: theme.spacing(2),
// 		minWidth: "380px",
// 		// maxWidth: "450px",
// 	},

// 	[UIHelper.startsOn("desktop")]: {
// 		paddingRight: theme.spacing(2),
// 		minWidth: "600px",
// 	},

// 	...OverflowOnHover(),
// }));
