import { useAppAuth } from "@/domains/authentication/hooks/use-app-auth";
import { AppHeader } from "@/domains/global/components/app-header";
import { Menu } from "@/domains/global/components/menu";
import { AppNotFound } from "@/domains/global/components/not-found";
import { UIHelper } from "@/theming/theme";
import { Box } from "@mui/material";
import { styled } from "@mui/system";
import { createFileRoute, Outlet } from "@tanstack/react-router";

const AuthLayout = () => {
	const { auth } = useAppAuth();

	if (auth.isLoadingAuth) {
		return <div style={{ color: "white", fontSize: 40 }}>LOADING</div>;
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
	display: "flex",

	[UIHelper.whileIs("mobile")]: {
		flexDirection: "column",
	},
	[UIHelper.startsOn("tablet")]: {
		gap: theme.spacing(2),
	},
}));

export const Route = createFileRoute("/_auth")({
	component: AuthLayout,
	notFoundComponent: AppNotFound,
});
