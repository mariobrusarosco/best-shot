import { useAppAuth } from "./domains/authentication/hooks/use-app-auth";
import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";

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
	const { auth } = useAppAuth();

	return <RouterProvider router={router} context={{ auth }} />;
};

export { AppRouter };
