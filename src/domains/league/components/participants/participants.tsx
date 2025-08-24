import { Box, Stack, styled, Typography } from "@mui/material";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { shimmerEffect } from "@/domains/ui-system/components/skeleton/skeleton";
import type { IParticipant } from "../../typing";
import { Participant } from "./participant";

const ListGrid = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	gap: theme.spacing(2),
	borderRadius: theme.spacing(1),
}));

const LeagueTournaments = ({ participants }: { participants: IParticipant[] | undefined }) => {
	if (!participants) return null;

	return (
		<Stack gap={6.5} data-ui="league-participants" flex={1}>
			<AppPill.Component bgcolor="teal.500" color="neutral.100" width={100} height={25}>
				<Typography variant="tag">Participants</Typography>
			</AppPill.Component>

			<ListGrid>
				{participants.map((participant, index) => (
					<Participant
						key={`participant-${participant.nickName}-${index}`}
						participant={participant}
					/>
				))}
			</ListGrid>
		</Stack>
	);
};

const ParticipantsListSkeleton = () => {
	// Generate stable keys for skeleton items
	const skeletonKeys = Array.from({ length: 6 }, (_, i) => `skeleton-item-${i}`);

	return (
		<Stack gap={6.5} data-ui="league-participants-skeleton" flex={1}>
			<AppPill.Skeleton width={100} height={25} />

			<ListGrid data-ui="leagues-list">
				{skeletonKeys.map((key) => (
					<Skeleton key={key} />
				))}
			</ListGrid>
		</Stack>
	);
};

const Skeleton = styled(Box)(() => ({
	position: "relative",
	height: "87px",
	...shimmerEffect(),
}));

export default {
	Component: LeagueTournaments,
	Skeleton: ParticipantsListSkeleton,
};
