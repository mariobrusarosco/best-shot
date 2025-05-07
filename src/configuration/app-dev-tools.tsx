import { APP_MODE } from "@/domains/global/utils";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const AppDevTools = () => {
	if (APP_MODE !== "local-dev") return null;

	return (
		<>
			<ReactQueryDevtools initialIsOpen={false} buttonPosition="top-right" />
			<TanStackRouterDevtools position="bottom-right" initialIsOpen={false} />
		</>
	);
};
