import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import Typography from "@mui/material/Typography/Typography";
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
				<AppPill
					border="1px solid"
					borderColor="teal.500"
					bgcolor="black.800"
					color="neutral.100"
					height={30}
					width={1}
				>
					<Typography variant="tag">matches</Typography>
				</AppPill>
			</Link>
			<Link
				to="/tournaments/$tournamentId/performance"
				params={{ tournamentId: tournament.id }}
			>
				<AppPill
					border="1px solid"
					borderColor="teal.500"
					bgcolor="black.800"
					color="neutral.100"
					height={30}
					width={1}
				>
					<Typography variant="tag">performance</Typography>
				</AppPill>
			</Link>
			<Link
				to="/tournaments/$tournamentId/performance"
				params={{ tournamentId: tournament.id }}
			>
				<AppPill
					border="1px solid"
					borderColor="teal.500"
					bgcolor="black.800"
					color="neutral.100"
					height={30}
					width={1}
				>
					<Typography variant="tag">simulator (soon)</Typography>
				</AppPill>
			</Link>
		</Wrapper>
	);
};

const Wrapper = styled(Surface)(({ theme }) =>
	theme?.unstable_sx({
		display: "flex",
		justifyContent: "space-between",
		// flexDirection: {
		// 	all: "column",
		// 	tablet: "row",
		// },
		gap: { all: 2, tablet: 2 },
		// width: { all: "120px", tablet: "auto" },

		// "> a": {
		// 	display: "inline-flex",
		// 	width: { tablet: "200px" },
		// },
	}),
);
