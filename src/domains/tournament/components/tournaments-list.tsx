import { GridOfCards } from "@/domains/ui-system/components/grid-of-cards/grid-of-cards";
import { ITournament } from "../typing";
import { TournamentCard, TournamentCardSkeleton } from "./tournament-card";

interface Props {
	tournaments: ITournament[];
}

const TournamentsList = ({ tournaments }: Props) => {
	if (tournaments === undefined) return null;

	return (
		<GridOfCards data-ui="tournaments-list" as="ul">
			{tournaments?.map((tournament) => (
				<TournamentCard tournament={tournament} key={tournament.id} />
			))}
		</GridOfCards>
	);
};

const TournamentsListLoading = () => {
	return (
		<GridOfCards data-ui="tournaments-list" as="ul">
			{Array.from({ length: 10 }).map((_) => (
				<TournamentCardSkeleton />
			))}
		</GridOfCards>
	);
};

export { TournamentsList, TournamentsListLoading };
