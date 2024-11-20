import { Box } from "@mui/system";
import { ITournament } from "../typing";
import { TournamentCard } from "./tournament-card";

interface Props {
	tournaments: ITournament[];
}

const TournamentsList = ({ tournaments }: Props) => {
	if (tournaments === undefined) return null;

	return (
		<Box
			component="ul"
			sx={{
				display: "grid",
				gap: {
					all: 2,
					tablet: 3,
				},
				gridTemplateColumns: {
					all: "repeat(2, minmax(100px, 177px))",
					tablet: "repeat(2, minmax(100px, 320px))",
				},
			}}
			data-ui="tournaments-list"
		>
			{tournaments?.map((tournament) => (
				<TournamentCard
					key={tournament.id}
					label={tournament.label}
					id={tournament.id}
					logo={tournament.logo}
				/>
			))}
		</Box>
	);
};

export { TournamentsList };
