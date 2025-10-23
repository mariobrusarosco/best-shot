import { getRouteApi, Outlet } from "@tanstack/react-router";
import AdminTournamentTabs from "@/domains/admin/components/tournaments/admin-tournament-tabs/admin-tournament-tabs";
import { ScreenHeading, ScreenHeadingSkeleton } from "@/domains/global/components/screen-heading";
import { AuthenticatedScreenLayout } from "@/domains/ui-system/layout/authenticated";
import { useAdminTournament } from "./hooks";

const route = getRouteApi("/_auth/admin/tournament/$tournamentId");

const AdminTournamentLayout = () => {
	const { tournamentId } = route.useParams();

	const { data: tournamentData, isLoading, error } = useAdminTournament(tournamentId);

	if (isLoading) {
		return <ScreenHeadingSkeleton />;
	}

	if (error) {
		throw error;
	}

	return (
		<AuthenticatedScreenLayout data-ui="admin-tournament-page" overflow="hidden">
			<ScreenHeading title={tournamentData?.label || "Tournament Management"}>
				<AdminTournamentTabs.Component />
			</ScreenHeading>

			<Outlet />
		</AuthenticatedScreenLayout>
	);
};

export { AdminTournamentLayout };
