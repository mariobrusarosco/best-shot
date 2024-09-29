import { useTournaments } from "../../domains/tournament/hooks/use-tournaments";
import { TournamentsList } from "../../domains/tournament/components/tournaments-list";

export const TournamentsPage = () => {
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
				<h3>Tournaments</h3>
			</div>

			{isPending ? (
				<div>
					<p>... LOADING TOURNAMENTS ...</p>
				</div>
			) : null}

			{data ? (
				<div>
					<TournamentsList tournaments={data} />
				</div>
			) : null}
		</div>
	);
};
