import { createLazyFileRoute } from "@tanstack/react-router";
import { useTournaments } from "../domains/tournament/hooks/use-tournaments";
import { TournamentsList } from "../domains/tournament/components/tournaments-list";

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
		<div className="page">
			<div>
				<h2>Tournaments</h2>
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

export const Route = createLazyFileRoute("/tournaments/")({
	component: TournamentsPage,
});
