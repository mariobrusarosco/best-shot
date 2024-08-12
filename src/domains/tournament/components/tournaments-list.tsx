import { Link } from "@tanstack/react-router";
import { ITournament } from "../typing";

interface Props {
	tournaments: ITournament[];
}
const TournamentsList = ({ tournaments }: Props) => {
	if (tournaments === undefined) return null;

	return (
		<div className="tournaments">
			<ul className="tournaments-list">
				{tournaments?.map((tournament) => {
					return (
						<li key={tournament.id}>
							<Link to="/tournaments/$id" params={{ id: tournament.id }}>
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
