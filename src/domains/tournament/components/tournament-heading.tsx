import { UIHelper } from "@/theming/theme";
import { Box, styled } from "@mui/system";
import { useTournament } from "../hooks/use-tournament";
import TournamentTabs from "./tournament-tabs";
interface Props {
	tournament: ReturnType<typeof useTournament>;
}

export const TournamentHeading = ({ tournament }: Props) => {
	return (
		<Wrapper data-ui="tournament-heading">
			<TournamentTabs.Component tournament={tournament?.data} />
		</Wrapper>
	);
};

const Wrapper = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		[UIHelper.whileIs("mobile")]: {
			pb: 4,
		},
	}),
);

export const TournamentLogo = styled("img")(({ theme }) =>
	theme?.unstable_sx({}),
);

export const Skeleton = () => {
	return (
		<Wrapper data-ui="tournament-heading-skeleton">
			<TournamentTabs.Skeleton />
		</Wrapper>
	);
};

export default {
	Component: TournamentHeading,
	Skeleton,
};
