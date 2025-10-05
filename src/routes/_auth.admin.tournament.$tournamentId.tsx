import { createFileRoute, Outlet } from "@tanstack/react-router";
import AdminTournamentTabs from "@/domains/admin/components/tournaments/admin-tournament-tabs/admin-tournament-tabs";
import { ScreenHeading } from "@/domains/global/components/screen-heading";
import { AuthenticatedScreenLayout } from "@/domains/ui-system/layout/authenticated";

export const Route = createFileRoute("/_auth/admin/tournament/$tournamentId")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<AuthenticatedScreenLayout data-ui="admin-tournament-page" overflow="hidden">
			<ScreenHeading title="Tournament Management">
				<AdminTournamentTabs.Component />
			</ScreenHeading>

			<Outlet />
		</AuthenticatedScreenLayout>
	);
}
