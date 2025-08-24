import { createLazyFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "@/domains/admin/components/admin-dashboard/admin-dashboard";

const AdminIndexPage = () => {
	return <AdminDashboard />;
};

export const Route = createLazyFileRoute("/_auth/admin/")({
	component: AdminIndexPage,
});
