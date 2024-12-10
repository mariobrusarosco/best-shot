import { useAppAuth } from "@/domains/authentication/hooks/use-app-auth";
import { Menu } from "@/domains/global/components/menu";
import { Box } from "@mui/material";
import { createFileRoute, Outlet } from "@tanstack/react-router";

const AuthLayout = () => {
	const { auth } = useAppAuth();

	if (auth.isLoadingAuth) {
		return <div style={{ color: "white", fontSize: 40 }}>LOADING</div>;
	}
	return (
		<Box
			data-ui="authenticated-layout"
			sx={{
				display: "flex",
				height: "100%",
				width: "100%",
			}}
		>
			<Menu />
			<Outlet />
		</Box>
	);
};

export const Route = createFileRoute("/_auth")({
	component: AuthLayout,
});
