import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

const AuthLayout = () => {
	return (
		<div data-ui="authenticated-layout">
			<Outlet />
		</div>
	);
};

export const Route = createFileRoute("/_auth")({
	beforeLoad: async ({ context, location }) => {
		if (!context.auth?.isAuthenticated) {
			throw redirect({
				to: "/",
				search: {
					redirect: location.href,
				},
			});
		}
	},
	component: AuthLayout,
});
