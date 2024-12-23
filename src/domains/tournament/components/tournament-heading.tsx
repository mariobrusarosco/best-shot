import TournamentRoundsBar from "@/domains/tournament/components/tournament-rounds-bar";
import { UIHelper } from "@/theming/theme";
import { Box, styled } from "@mui/system";
import { ITournament } from "../typing";

interface Props {
	tournament: ITournament;
}

export const TournamentHeading = ({ tournament }: Props) => {
	return (
		<Wrapper data-ui="tournament-heading">
			<TournamentRoundsBar.Component tournament={tournament} />
		</Wrapper>
	);
};

const Wrapper = styled(Box)(({ theme }) => ({
	[UIHelper.whileIs("mobile")]: {
		paddingBottom: theme.spacing(4),
	},
	[UIHelper.startsOn("tablet")]: {
		display: "flex",
		justifyContent: "space-between",
		gap: theme.spacing(2),
	},
}));

export const TournamentLogo = styled("img")(() => ({}));

export const Skeleton = () => {
	return (
		<Wrapper data-ui="tournament-heading-skeleton">
			<TournamentRoundsBar.Skeleton />
		</Wrapper>
	);
};

export default {
	Component: TournamentHeading,
	Skeleton,
};
