import { Outlet } from "@tanstack/react-router";
import { Header } from "./header";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

const AppContainer = () => {
	return (
		<div className="app-container">
			<Header />
			<Outlet />
			<TanStackRouterDevtools />
		</div>
	);
};

export { AppContainer };
