import { useTournament } from "@/domains/tournament/hooks/use-tournament";
export const SingleTournamentLayout = () => {
	const { states } = useTournament();

	if (states.isError) {
		<div>Error</div>;
	}

	if (states.isLoading) {
		return <div>Loading</div>;
	}

	if (states.isEmpty) {
		return <div>No data</div>;
	}

	return <div data-ui="single-tournament-layout"></div>;
};
