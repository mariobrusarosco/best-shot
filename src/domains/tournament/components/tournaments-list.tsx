import { styled } from "@mui/material";
import { Box } from "@mui/system";
import { UIHelper } from "@/domains/ui-system/theme";
import type { I_Tournament } from "../schema";
import { TournamentCard, TournamentCardSkeleton } from "./tournament-card";

interface Props {
	tournaments: I_Tournament[];
}

const TournamentsList = ({ tournaments }: Props) => {
	if (tournaments === undefined) return null;

	return (
		<AppGridOfCards data-ui="tournaments-list" as="ul">
			{tournaments?.map((tournament) => (
				<TournamentCard tournament={tournament} key={tournament.id} />
			))}
		</AppGridOfCards>
	);
};

const TournamentsListLoading = () => {
	return (
		<AppGridOfCards data-ui="tournaments-list" as="ul">
			{Array.from({ length: 10 }).map((_) => (
				<TournamentCardSkeleton />
			))}
		</AppGridOfCards>
	);
};

const AppGridOfCards = styled(Box)(({ theme }) => ({
	borderRadius: theme.spacing(1),
	display: "grid",
	gap: theme.spacing(2),

	[UIHelper.whileIs("mobile")]: {
		gridTemplateColumns: "repeat(2, minmax(100px, 1fr))",
		flexDirection: "column",
		overflow: "auto",
		paddingBottom: "130px",
	},
	[UIHelper.startsOn("tablet")]: {
		flex: 1,
		gap: theme.spacing(2),
		gridTemplateColumns: "repeat(auto-fit, minmax(140px, 250px))",
		gridAutoRows: "115px",
	},
	[UIHelper.startsOn("desktop")]: {
		gridTemplateColumns: "repeat(auto-fit, minmax(300px, 280px))",
	},
}));

export { TournamentsList, TournamentsListLoading };
