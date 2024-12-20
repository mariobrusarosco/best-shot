import { AppPill } from "@/domains/ui-system/components/pill/pill";
import Typography from "@mui/material/Typography/Typography";
import { Box, Stack, styled } from "@mui/system";
import { IParticipant } from "../../typing";
import { Participant } from "./participant";
import { ParticipantSkeleton } from "./participant.skeleton";

const ParticipantsListSkeleton = () => {
	const participants = Array.from({ length: 6 }).map((_) => _);

	return (
		<ListGrid component="ul" data-ui="leagues-list">
			{participants?.map((_) => (
				<li>
					<ParticipantSkeleton />
				</li>
			))}
		</ListGrid>
	);
};

const ListGrid = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	gap: theme.spacing(2),
	borderRadius: theme.spacing(1),
}));

const LeagueTournaments = ({
	participants,
}: {
	participants: IParticipant[] | undefined;
}) => {
	if (!participants) return null;

	return (
		<Stack gap={3} data-ui="league-participants">
			<AppPill.Component
				bgcolor="teal.500"
				color="neutral.100"
				width={100}
				height={25}
			>
				<Typography variant="tag">Participants</Typography>
			</AppPill.Component>

			<ListGrid>
				{participants.map((participant, index) => (
					<Participant key={index} participant={participant} />
				))}
			</ListGrid>
		</Stack>
	);
};

export default {
	Component: LeagueTournaments,
	Skeleton: ParticipantsListSkeleton,
};
