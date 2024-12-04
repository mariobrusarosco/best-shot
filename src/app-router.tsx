import { createRouter, RouterProvider } from "@tanstack/react-router";
import { useAppAuth } from "./domains/authentication/hooks/use-app-auth";
import { routeTree } from "./routeTree.gen";
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const router = createRouter({
	routeTree,
	context: {} as ReturnType<typeof useAppAuth>,
});

const AppRouter = () => {
	return (
		<>
			<RouterProvider router={router} />
		</>
	);
};

export { AppRouter };
