import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { getRouteApi } from "@tanstack/react-router";
import { useEffect } from "react";

import { TournamentHeading } from "@/domains/tournament/components/tournament-heading/tournament-heading";
import { TournamentMatches } from "@/domains/tournament/components/tournament-matches/tournament-matches";
import { Standings } from "@/domains/tournament/components/tournament-standings/standings";
import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import { useTournamentMatches } from "@/domains/tournament/hooks/use-tournament-matches";
import { useTournamentView } from "@/domains/tournament/hooks/use-tournament-view-mode";

const route = getRouteApi("/_auth/tournaments/$tournamentId/");

export const SingleTournamentScreen = () => {
	// Hooks
	const params = route.useParams();
	const search = route.useSearch();
	const navigate = route.useNavigate();
	const tournamentView = useTournamentView();
	const { query: tournamentQuery } = useTournament({ id: params.tournamentId });
	const { query: matchesQuery } = useTournamentMatches({
		id: params.tournamentId,
		selectedRound: getSelectedRound(search.selectedRound, tournamentQuery.data?.currentRound),
		view: tournamentView.view,
	});

	// Derivate States
	const selectedRound = getSelectedRound(search.selectedRound, tournamentQuery.data?.currentRound);
	// Effects
	useEffect(
		function setSelectedRoundOnMount() {
			void navigate({
				search: (prev) => ({ ...prev, selectedRound }),
			});
		},
		[navigate, selectedRound]
	);

	// Lifecycle Handling
	// if (tournamentQuery.isError || matchesQuery.isError) return null;
	// if (tournamentQuery.isLoading || matchesQuery.isLoading) return <LoadingState />;
	// if (tournamentQuery.isSuccess && matchesQuery.isSuccess) {
	return (
		<Container data-ui="single-tournament-screen">
			<Box
				data-ui="single-tournament-screen-header"
				justifyContent="space-between"
				display="flex"
				flexDirection="column"
				position="relative"
				gap={6}
			>
				<TournamentHeading tournamentQuery={tournamentQuery} />
				<Standings tournamentId={params.tournamentId} />
				<TournamentMatches
					selectedRound={selectedRound}
					matchesQuery={matchesQuery}
					view={tournamentView.view}
				/>
			</Box>
		</Container>
	);
	// }

	// return null;
};

const Container = styled(Box)(({ theme }) => ({
	padding: theme.spacing(2.5, 2, 0),
	width: "100%",
}));

// Component's Colocated Utilities
const getSelectedRound = (
	selectedRound: string | undefined,
	currentTournamentRound: string | null | undefined
) => {
	if (selectedRound) return selectedRound;
	if (currentTournamentRound) return currentTournamentRound;
	return undefined;
};
