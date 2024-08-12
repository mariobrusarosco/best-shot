import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const router = createRouter({ routeTree });

const AppRouter = () => {
	return <RouterProvider router={router} />;
};

export { AppRouter };
