import { createFileRoute, Navigate, Outlet, useLocation } from "@tanstack/react-router";
import { Authentication } from "@/domains/authentication";
import { AppHeader } from "@/domains/global/components/app-header";
import { AppLoader } from "@/domains/global/components/app-loader";
import { Menu } from "@/domains/global/components/menu/menu";
import { AppNotFound } from "@/domains/global/components/not-found";
import { AuthenticatedLayout } from "@/domains/ui-system/layout/authenticated";

const useAppAuth = Authentication.useAppAuth;

const AuthLayout = () => {
	const auth = useAppAuth();
	const location = useLocation();

	if (auth.isLoadingAuth) {
		return <AppLoader />;
	}

	if (!auth.isAuthenticated) {
		return <Navigate to="/login" _fromLocation={location} />;
	}

	return (
		<AuthenticatedLayout data-ui="authenticated-layout">
			<AppHeader />
			<Menu />
			<Outlet />
		</AuthenticatedLayout>
	);
};

export const Route = createFileRoute("/_auth")({
	component: AuthLayout,
	notFoundComponent: AppNotFound,
});
