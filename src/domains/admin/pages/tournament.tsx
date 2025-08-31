import { AppTypography } from "@/domains/ui-system/components";
import { useAdminTournaments } from "@/domains/admin/hooks/use-admin-tournaments";
import type { ITournament } from "@/domains/tournament/schemas";
import { AdminTournamentHeading } from "@/domains/admin/components/tournaments/admin-tournament-heading/admin-tournament-heading";

export const AdminTournamentPage = ({ tournamentId }: { tournamentId: string }) => {
	const tournaments = useAdminTournaments();

	const tournament = tournaments.data?.find(
		(tournament: ITournament) => tournament.id === tournamentId
	);

	if (!tournament) {
		return <AppTypography>Tournament not found</AppTypography>;
	}

	console.log({ tournament });
	return (    
		<>
			<AdminTournamentHeading tournament={tournament} />
		</>
	);
};

export default AdminTournamentPage;
