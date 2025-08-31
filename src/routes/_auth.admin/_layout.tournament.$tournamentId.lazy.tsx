import { createLazyFileRoute, getRouteApi } from "@tanstack/react-router";
import AdminTournamentPage from "@/domains/admin/pages/tournament";
import { AppTypography } from "@/domains/ui-system/components";

const route = getRouteApi("/_auth/admin/_layout/tournament/$tournamentId");


const RouteComponent = () => {
	const tournamentId = route.useParams().tournamentId;    


	if (!tournamentId) {
		<AppTypography>
			Tournament ID is required
		</AppTypography>
	}

	return <AdminTournamentPage tournamentId={tournamentId} />;
};


export const Route = createLazyFileRoute("/_auth/admin/_layout/tournament/$tournamentId")({
	component: RouteComponent,
});
