import { useAppAuth } from "@/domains/authentication/hooks/use-app-auth";
import { Menu } from "@/domains/global/components/menu";
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
			<Menu />
			<Outlet />
		</Layout>
	);
};

export const Layout = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		display: "grid",
		gap: {
			tablet: 6,
		},
		gridTemplateColumns: {
			tablet: "75px 1fr",
		},
	}),
);

export const Route = createFileRoute("/_auth")({
	component: AuthLayout,
});
