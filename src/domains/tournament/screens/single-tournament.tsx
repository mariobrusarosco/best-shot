import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useParams } from "@tanstack/react-router";
import {
	TournamentHeading,
	TournamentHeadingSkeleton,
} from "@/domains/tournament/components/tournament-heading";
import {
	Standings,
	StandingsSkeleton,
} from "@/domains/tournament/components/tournament-standings/standings";
import { useTournament } from "@/domains/tournament/hooks/use-tournament";

export const SingleTournamentScreen = () => {
	const { tournamentId } = useParams({
		from: "/_auth/tournaments/$tournamentId/",
	});
	const { query } = useTournament({ id: tournamentId });

	if (query.isError) return null;
	if (query.isLoading) return <LoadingState />;
	if (query.isSuccess) {
		return (
			<Container data-ui="single-tournament-screen">
				<Box
					data-ui="single-tournament-screen-header"
					justifyContent="space-between"
					display="flex"
					position="relative"
				>
					<TournamentHeading
						label={query.data.label}
						currentRound={query.data.currentRound}
						logoUrl={query.data.logo}
					/>

					<Standings tournamentId={tournamentId} />
				</Box>
			</Container>
		);
	}

	return null;
};

const Container = styled(Box)(({ theme }) => ({
	padding: theme.spacing(2.5, 2, 0),
	width: "100%",
}));

const LoadingState = () => {
	return (
		<Container data-ui="single-tournament-screen-loading">
			<Box data-ui="single-tournament-screen-header" justifyContent="space-between" display="flex">
				<TournamentHeadingSkeleton />
				<StandingsSkeleton />
			</Box>
		</Container>
	);
};
