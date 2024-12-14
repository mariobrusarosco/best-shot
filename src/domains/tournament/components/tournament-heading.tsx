import { UIHelper } from "@/theming/theme";
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
		px: 2,
		py: 2,
		gap: 2,

		[UIHelper.startsOn("tablet")]: {
			height: "var(--tournament-heading-height-tablet)",
			backgroundColor: "red.400",
		},
	}),
);

export const TournamentLogo = styled("img")(({ theme }) =>
	theme?.unstable_sx({}),
);
