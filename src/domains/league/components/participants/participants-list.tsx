import { ILeagueWithParticipants } from "@/domains/league/typing";
import { GridOfCards } from "@/domains/ui-system/components/grid-of-cards/grid-of-cards";
import { styled } from "@mui/system";
import { Participant } from "./participant";

const getParticipants = (league?: ILeagueWithParticipants) => {
	if (!league) return [];

	return league.participants?.map((participant) => participant);
};

export const ParticipantsList = ({
	league,
}: {
	league?: ILeagueWithParticipants;
}) => {
	const participants = getParticipants(league);

	return (
		<ListGrid component="ul" data-ui="leagues-list">
			{participants?.map((participant) => (
				<li>
					<Participant participant={participant} />
				</li>
			))}
		</ListGrid>
	);
};

export const ListGrid = styled(GridOfCards)(({ theme }) =>
	theme.unstable_sx({
		padding: 0,
		borderRadius: 1,
		gridTemplateColumns: {
			all: "1fr",
			tablet: "repeat(auto-fit, 270px)",
		},
		gridAutoRows: {
			all: "70px",
			tablet: "90px",
		},
	}),
);
