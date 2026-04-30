import { useQuery } from "@tanstack/react-query";
import { getTournamentStandings } from "@/domains/tournament/server-state/fetchers";
import { tournamentStandingsKey } from "@/domains/tournament/server-state/keys";

export const useTournamentStandings = ({ tournamentId }: { tournamentId: string }) => {
	const query = useQuery({
		queryKey: tournamentStandingsKey(tournamentId),
		queryFn: getTournamentStandings,
		enabled: !!tournamentId,
	});

	return { query };
};
