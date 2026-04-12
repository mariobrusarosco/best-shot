import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useParams } from "@tanstack/react-router";
import { TournamentHeading } from "@/domains/tournament/components/tournament-heading";
import { useTournament } from "@/domains/tournament/hooks/use-tournament";

export const SingleTournamentScreen = () => {
	const { tournamentId } = useParams({
		from: "/_auth/tournaments/$tournamentId/",
	});
	const { tournament } = useTournament({ id: tournamentId });
	console.log(tournament);

	return (
		<Container data-ui="single-tournament-screen">
			<TournamentHeading isLoading={tournament.states.isLoading} />
		</Container>
	);
};

const Container = styled(Box)(({ theme }) => ({
	padding: theme.spacing(2.5, 2, 0),
}));
