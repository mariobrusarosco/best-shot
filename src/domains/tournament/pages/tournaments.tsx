import { TournamentsList } from "../components/tournaments-list";
import { useTournaments } from "../hooks/use-tournaments";

const TournamentsPage = () => {
	const { data, isPending, error } = useTournaments();

	if (error) {
		return (
			<div className="error tournaments-page-error">
				We could not load all available tournaments
			</div>
		);
	}

	return (
		<div className="tournaments-screen screen">
			<div className="heading">
				<h3>Leagues</h3>
			</div>

			{data ? (
				<div>
					<TournamentsList tournaments={data} />
				</div>
			) : null}
		</div>
	);
};

export { TournamentsPage };
