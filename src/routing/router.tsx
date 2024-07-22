import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LeaguePage } from "../domains/league/league-page";
import { LeaguesPage } from "../domains/league/leagues-page";
import { Demo } from "../domains/demo/screen";
import { ErrorPage } from "../domains/global/components/error";
import { AppContainer } from "../domains/global/components/app-container";
import { DashboardPage } from "../domains/dashboard/page";
import { TournamentPage } from "../domains/tournament/pages/tournament";
import { TournamentsPage } from "../domains/tournament/pages/tournaments";

const router = createBrowserRouter([
	{
		path: "/",
		element: <AppContainer />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "league/:leagueId",
				element: <LeaguePage />,
			},
			{
				path: "leagues",
				element: <LeaguesPage />,
			},
			{
				path: "tournaments/:tournamentId",
				element: <TournamentPage />,
			},
			{
				path: "tournaments",
				element: <TournamentsPage />,
				errorElement: <ErrorPage />,
			},
			{
				path: "dashboard",
				element: <DashboardPage />,
			},
			{
				path: "demo",
				element: <Demo />,
			},
		],
	},
]);

const AppRouter = () => {
	return <RouterProvider router={router} />;
};

export { AppRouter };
