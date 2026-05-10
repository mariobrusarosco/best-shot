import { useQuery } from "@tanstack/react-query";
import { getTournamentMatches } from "@/domains/tournament/server-state/fetchers";
import { tournamentMatchesKey } from "@/domains/tournament/server-state/keys";
import type { TournamentView } from "@/stores/user-preferences-store";

export const useTournamentMatches = ({
	id,
	selectedRound,
	view,
}: {
	id: string;
	selectedRound: string | undefined;
	view: TournamentView;
}) => {
	const query = useQuery({
		queryKey: tournamentMatchesKey(id, selectedRound),
		queryFn: getTournamentMatches,
		enabled: !!id && !!selectedRound,
	});

	console.log(`Providing matches given view: ${view}`);

	return {
		query,
		actions: {},
	};
};
