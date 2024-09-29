import { Outlet } from "@tanstack/react-router";
import { Header } from "./header";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Utils } from "../utils";
import Grid from "@mui/material/Grid2";

const shouldDisplayDevTools = Utils.environments;

const AppContainer = () => {
	return (
		<Grid container className="app-container">
			<Grid size={{ mobile: 12, tablet: 3, desktop: 3 }}>
				<Header />
			</Grid>
			<Grid size={{ mobile: 12, tablet: 8, desktop: 8 }}>
				<main>
					<Outlet />
				</main>
			</Grid>
			{shouldDisplayDevTools && <TanStackRouterDevtools />}
		</Grid>
	);
};

export { AppContainer };
