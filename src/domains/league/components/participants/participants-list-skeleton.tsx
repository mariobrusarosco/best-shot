import { GridOfCards } from "@/domains/ui-system/components/grid-of-cards/grid-of-cards";
import { styled } from "@mui/system";
import { ParticipantSkeleton } from "./participant.skeleton";

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

export const ListGrid = styled(GridOfCards)(({ theme }) =>
	theme.unstable_sx({
		padding: 0,
		borderRadius: 1,
		gridTemplateColumns: {
			all: "1fr",
			tablet: "repeat(auto-fit, minmax(270px, auto))",
		},
		gridAutoRows: {
			all: "70px",
			tablet: "90px",
		},
	}),
);
