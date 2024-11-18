import { Link } from "@tanstack/react-router";
import { ITournament } from "../typing";

interface Props {
	tournaments: ITournament[];
}

const TournamentsList = ({ tournaments }: Props) => {
	if (tournaments === undefined) return null;

	return (
		<div className="tournaments list">
			<ul className="">
				{tournaments?.map((tournament) => {
					return (
						<li key={tournament.id} className="list-item">
							<Link
								to="/tournaments/$tournamentId"
								params={{ tournamentId: tournament.id }}
							>
								{tournament.label}
							</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export { TournamentsList };
