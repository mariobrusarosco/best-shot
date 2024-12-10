import { APP_MODE } from "@/domains/global/utils";
import { Box, styled } from "@mui/system";
import { useTournament } from "../hooks/use-tournament";
import { TournamentTabs } from "./tournament-tabs";

interface Props {
	tournament: ReturnType<typeof useTournament>;
}

export const TournamentHeading = ({ tournament }: Props) => {
	const logoSrc = APP_MODE === "production" ? "" : tournament.data?.logo;

	return (
		<Wrapper data-ui="tournament-heading">
			<LogoBox>
				<TournamentLogo src={logoSrc} />
			</LogoBox>

			<TournamentTabs tournament={tournament?.data} />
		</Wrapper>
	);
};

const Wrapper = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		display: "flex",
		flexDirection: "row",
		justifyContent: {
			all: "space-between",
			tablet: "flex-end",
		},
		px: {
			all: 2,
			tablet: 2,
		},
		py: {
			all: 4,
			tablet: 4,
		},
		gap: 2,
	}),
);

const LogoBox = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		display: { all: "grid", tablet: "none" },
		img: {
			maxHeight: {
				all: "140px",
				tablet: "140px",
			},
			maxWidth: {
				all: "140px",
				tablet: "140px",
			},
		},
	}),
);

export const TournamentLogo = styled("img")(({ theme }) =>
	theme?.unstable_sx({}),
);
