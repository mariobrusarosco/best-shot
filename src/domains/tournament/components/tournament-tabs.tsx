import { Box } from "@mui/system";
import { Link } from "@tanstack/react-router";

export const TournamentTabs = ({ tournamentId }: { tournamentId: string }) => {
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
			<Link to="/tournaments/$tournamentId/matches" params={{ tournamentId }}>
				Matches
			</Link>
			<Link to="/tournaments/$tournamentId/ranking" params={{ tournamentId }}>
				Ranking
			</Link>
			<Link to="/tournaments/$tournamentId/standings" params={{ tournamentId }}>
				Simulator
			</Link>
		</Box>
	);
};
