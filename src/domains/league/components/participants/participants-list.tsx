import { useLeague } from "@/domains/league/hooks/use-league";
import { ILeague } from "@/domains/league/typing";
import { GridOfCards } from "@/domains/ui-system/components/grid-of-cards/grid-of-cards";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import Typography from "@mui/material/Typography/Typography";
import { Box, styled } from "@mui/system";
import { Participant } from "./participant";

const getParticipants = (participants?: ILeague["participants"]) => {
	if (!participants) return [];

	return participants?.map((participant) => participant);
};

export const ParticipantsList = ({
	league,
}: {
	league?: ReturnType<typeof useLeague>["league"];
}) => {
	const participants = getParticipants(league?.data?.participants);

	return (
		<Box>
			<AppPill
				bgcolor="teal.500"
				color="neutral.100"
				width={100}
				height={25}
				mb={2}
			>
				<Typography variant="tag">Participants</Typography>
			</AppPill>

			<ListGrid component="ul" data-ui="leagues-list">
				{participants?.map((participant) => (
					<li>
						<Participant participant={participant} />
					</li>
				))}
			</ListGrid>
		</Box>
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
