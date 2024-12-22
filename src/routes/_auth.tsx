import { useAppAuth } from "@/domains/authentication/hooks/use-app-auth";
import { AppHeader } from "@/domains/global/components/app-header";
import { AppLoader } from "@/domains/global/components/app-loader";
import { Menu } from "@/domains/global/components/menu";
import { AppNotFound } from "@/domains/global/components/not-found";
import { UIHelper } from "@/theming/theme";
import { Box } from "@mui/material";
import { styled } from "@mui/system";
import { createFileRoute, Outlet } from "@tanstack/react-router";

const AuthLayout = () => {
	const { auth } = useAppAuth();

	if (auth.isLoadingAuth) {
		return <AppLoader />;
	}
	return (
		<Layout data-ui="authenticated-layout">
			<AppHeader />
			<Menu />
			<Outlet />
		</Layout>
	);
};

const Layout = styled(Box)(({ theme }) => ({
	[UIHelper.whileIs("mobile")]: {
		paddingTop: theme.spacing(8),
	},
	[UIHelper.startsOn("tablet")]: {
		display: "flex",
		gap: theme.spacing(2),
	},
}));

export const Route = createFileRoute("/_auth")({
	component: AuthLayout,
	notFoundComponent: AppNotFound,
});
