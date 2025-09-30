import { Outlet } from "@tanstack/react-router";
import { ScreenHeading } from "@/domains/global/components/screen-heading";
import { AuthenticatedScreenLayout } from "@/domains/ui-system/layout/authenticated";

const AdminLayout = () => {
	return (
		<AuthenticatedScreenLayout data-ui="admin-page" overflow="hidden">
			<ScreenHeading title="admin" />

			<Outlet />
		</AuthenticatedScreenLayout>
	);
};

export { AdminLayout };
