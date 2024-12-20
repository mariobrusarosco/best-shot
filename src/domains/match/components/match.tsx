import { format } from "date-fns";
import { IMatch } from "../typing";

export const Match = ({ match }: { match: IMatch }) => {
	// const navigate = useNavigate();
	// const { tournamentId } = useParams();

	// const handleMoreDetails = () => {
	// 	navigate({
	// 		to: "/tournaments/$tournamentId/matches/$matchId",
	// 		params: {
	// 			matchId: match.id,
	// 			tournamentId,
	// 		},
	// 	});
	// };

	return (
		<div className="information">
			<div className="local-and-date">
				<p className="date">
					<span>{format(match.date, "dd/MM/yy - k:mm")}</span>
				</p>

				{/* <p onClick={handleMoreDetails}>more</p> */}
			</div>
			<div className="teams">
				<div className="home">
					<span>{match.home.shortName}</span>
					<span>{match.home.score}</span>
				</div>
				<span>x</span>
				<div className="away">
					<span>{match.away.shortName}</span>
					<span>{match.away.score}</span>
				</div>
			</div>
		</div>
	);
};
