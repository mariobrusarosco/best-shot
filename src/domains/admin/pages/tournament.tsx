import { ScheduleJobForm } from "@/domains/admin/components/schedule-job-form/schedule-job-form";
import { AdminTournamentHeading } from "@/domains/admin/components/tournaments/admin-tournament-heading/admin-tournament-heading";
import { useAdminTournaments } from "@/domains/admin/hooks/use-admin-tournaments";
import type { ITournament } from "@/domains/tournament/schemas";
import { AppTypography } from "@/domains/ui-system/components";

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
			<ScheduleJobForm preselectedTournament={tournament} />
		</>
	);
};

export default AdminTournamentPage;
