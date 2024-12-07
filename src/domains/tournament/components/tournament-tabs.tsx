import { Box } from "@mui/system";
import { Link } from "@tanstack/react-router";
import { ITournament } from "../typing";

export const TournamentTabs = ({
	tournament,
}: {
	tournament?: ITournament;
}) => {
	if (!tournament) return null;

	return (
		<Box
			component="ul"
			sx={{
				display: "flex",
				justifyContent: "center",
				gap: 4,
				padding: 4,
			}}
			data-ui="tournament-tabs"
		>
			<Link
				to="/tournaments/$tournamentId/matches"
				params={{ tournamentId: tournament.id }}
			>
				Matches
			</Link>
			<Link
				to="/tournaments/$tournamentId/performance"
				params={{ tournamentId: tournament.id }}
			>
				performance
			</Link>
			{/* <span>Simulator (Coming soon)</span> */}
		</Box>
	);
};
