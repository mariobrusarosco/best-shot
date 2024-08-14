import { useAuth0 } from "@auth0/auth0-react";
import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { AuthLoader } from "./domains/authentication/components/auth-loader";

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const router = createRouter({
	routeTree,
	context: { auth: undefined },
});

const AppRouter = () => {
	const auth = useAuth0();

	if (auth.isLoading) return <AuthLoader />;

	return <RouterProvider router={router} context={{ auth }} />;
};

export { AppRouter };
