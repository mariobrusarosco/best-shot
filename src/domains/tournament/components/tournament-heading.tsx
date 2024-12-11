import { Box, styled } from "@mui/system";
import { useTournament } from "../hooks/use-tournament";
import { TournamentTabs } from "./tournament-tabs";

interface Props {
	tournament: ReturnType<typeof useTournament>;
}

export const TournamentHeading = ({ tournament }: Props) => {
	return (
		<Wrapper data-ui="tournament-heading">
			<TournamentTabs tournament={tournament?.data} />
		</Wrapper>
	);
};

const Wrapper = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		px: {
			all: 2,
			tablet: 2,
		},
		py: {
			all: 2,
			tablet: 4,
		},
		gap: 2,
	}),
);

export const TournamentLogo = styled("img")(({ theme }) =>
	theme?.unstable_sx({}),
);
