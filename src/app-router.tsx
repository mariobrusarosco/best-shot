import { queryClient } from "@/configuration/app-query";
import { AppError } from "@/domains/global/components/error";
import { AppNotFound } from "@/domains/global/components/not-found";
import { RouterContext } from "@/routes/__root";
import { routeTree } from "@/routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { Authentication } from "./domains/authentication";

const {  useAppAuth } = Authentication;

// Type-safety registration
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const router = createRouter({
	routeTree,
	context: {
		queryClient,
		auth: { isAuthenticated: false, isLoadingAuth: false },
	} as RouterContext,
	defaultErrorComponent: AppError,
	defaultNotFoundComponent: AppNotFound,
});

const Router = () => {
	const auth = useAppAuth();

	return (
		<RouterProvider
			router={router}
			context={{
				queryClient,
				auth,
			}}
		/>
	);
};

const AppRouter = () => {
	return (
			<Router />
	);
};

export { AppRouter };
