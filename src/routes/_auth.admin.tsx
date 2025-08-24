import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useAdminAuth } from "@/domains/admin/hooks/use-admin-auth";
import { AppLoader } from "@/domains/global/components/app-loader";

const AdminLayout = () => {
	const { isAdmin, isLoading, isAuthenticated } = useAdminAuth();

	if (isLoading) {
		return <AppLoader />;
	}

	if (!isAuthenticated || !isAdmin) {
		return <Navigate to="/dashboard" />;
	}

	return <Outlet />;
};

export const Route = createFileRoute("/_auth/admin")({
	component: AdminLayout,
});
