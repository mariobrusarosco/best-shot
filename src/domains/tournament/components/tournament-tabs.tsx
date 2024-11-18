import { Link } from "@tanstack/react-router";

export const TournamentTabs = ({ tournamentId }: { tournamentId: string }) => {
	return (
		<div data-ui="tournament-tabs">
			<ul>
				<Link to="/tournaments/$tournamentId/matches" params={{ tournamentId }}>
					Matches
				</Link>
				<Link to="/tournaments/$tournamentId/ranking" params={{ tournamentId }}>
					Ranking
				</Link>
				<Link
					to="/tournaments/$tournamentId/standings"
					params={{ tournamentId }}
				>
					Simulator
				</Link>
			</ul>
		</div>
	);
};
