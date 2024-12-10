import { Surface } from "@/domains/ui-system/components/surface/surface";
import { styled } from "@mui/system";
import { Link } from "@tanstack/react-router";
import { ITournament } from "../typing";

export const TournamentTabs = ({
	tournament,
}: {
	tournament?: ITournament;
}) => {
	if (!tournament) return null;

	return (
		<Wrapper as="ul" data-ui="tournament-tabs">
			<Link
				to="/tournaments/$tournamentId/matches"
				params={{ tournamentId: tournament.id }}
			>
				Matches
			</Link>
			<Link
				to="/tournaments/$tournamentId/performance"
				params={{ tournamentId: tournament.id }}
			>
				performance
			</Link>
			{/* <span>Simulator (Coming soon)</span> */}
		</Wrapper>
	);
};

const Wrapper = styled(Surface)(({ theme }) =>
	theme?.unstable_sx({
		backgroundColor: "black.500",
		display: "flex",
		justifyContent: "center",
		gap: 4,
		py: 3,
		mt: 3,
		borderRadius: 2,
		width: 1,
	}),
);
