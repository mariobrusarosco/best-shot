import { ITournament } from "../typing";

export const TournamentHeading = ({
	tournament,
}: {
	tournament: ITournament;
}) => {
	return (
		<div data-ui="tournament-heading">
			<p>tournament</p>
			<div>
				<p>{tournament.label}</p>
				<img src={tournament.logo} alt={tournament.label} />
			</div>
		</div>
	);
};
