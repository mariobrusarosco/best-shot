import { Menu } from "@/domains/global/components/menu";
import { Box } from "@mui/material";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

const AuthLayout = () => {
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
			<Box data-ui="main-area" sx={{ flex: 1 }}>
				<Outlet />
			</Box>
		</Box>
	);
};

export const Route = createFileRoute("/_auth")({
	beforeLoad: async ({ context, location }) => {
		if (!context.auth?.isAuthenticated) {
			throw redirect({
				to: "/ui-system",
				search: {
					redirect: location.href,
				},
			});
		}
	},
	component: AuthLayout,
});
