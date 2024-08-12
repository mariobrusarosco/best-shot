import { IMatch } from "../typing";

export const Match = ({ match }: { match: IMatch }) => {
	return (
		<div className="information">
			<div className="local-and-date">
				{/* <strong className="stadium">{match.stadium}</strong> */}
				<p className="date">
					<span>{new Date(match.date).toLocaleString()}</span>
				</p>
			</div>
			<div className="teams">
				<div className="home">
					<span>{match.homeTeam}</span>
					<span>{match.homeScore}</span>
				</div>
				<span>x</span>
				<div className="away">
					<span>{match.awayScore}</span>
					<span>{match.awayTeam}</span>
				</div>
			</div>
		</div>
	);
};
