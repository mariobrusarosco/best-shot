import { useAppAuth } from "@/domains/authentication/hooks/use-app-auth";
import { AppError } from "@/domains/global/components/error";
import { AppNotFound } from "@/domains/global/components/not-found";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const router = createRouter({
	routeTree,
	context: {} as ReturnType<typeof useAppAuth>,
	defaultErrorComponent: AppError,
	defaultNotFoundComponent: AppNotFound,
});

const AppRouter = () => {
	const auth = useAppAuth();

	return (
		<>
			<RouterProvider router={router} context={auth} />
		</>
	);
};

export { AppRouter };
