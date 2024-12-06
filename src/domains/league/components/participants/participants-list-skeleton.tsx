import { ParticipantSkeleton } from "./participant.skeleton";
import { ListGrid } from "./participants-list";

export const ParticipantsListSkeleton = () => {
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
