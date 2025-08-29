import { Outlet } from "@tanstack/react-router";
import AdminTournamentTabs from "@/domains/admin/components/tournaments/admin-tournament-tabs/admin-tournament-tabs";
import { ScreenHeading } from "@/domains/global/components/screen-heading";
import { AuthenticatedScreenLayout } from "@/domains/ui-system/layout/authenticated";

const AdminLayout = () => {
	return (
		<AuthenticatedScreenLayout data-ui="admin-page" overflow="hidden">
			<ScreenHeading title="admin">
				<AdminTournamentTabs.Component />
			</ScreenHeading>

			<Outlet />
		</AuthenticatedScreenLayout>
	);
};

export { AdminLayout };
