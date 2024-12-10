import { APP_MODE } from "@/domains/global/utils";
import { UIHelper } from "@/theming/theme";
import Typography from "@mui/material/Typography/Typography";
import { Box, styled, useMediaQuery } from "@mui/system";
import { useTournament } from "../hooks/use-tournament";
import { TournamentTabs } from "./tournament-tabs";

const { startsOn } = UIHelper.media;

interface Props {
	tournament: ReturnType<typeof useTournament>;
}

export const TournamentHeading = ({ tournament }: Props) => {
	const isDesktopScreen = useMediaQuery(startsOn("desktop"));

	const titleVariant = isDesktopScreen ? "h1" : "h2";
	const logoSrc = APP_MODE === "local-dev" ? "" : tournament.data?.logo;

	return (
		<Wrapper data-ui="tournament-heading">
			<LabelAndLogo data-ui="label-and-logo">
				<TournamentLabelBox data-ui="tournament-label-box">
					<Typography
						color="neutral.100"
						variant={titleVariant}
						textTransform="lowercase"
						sx={{
							width: { all: "fit-content" },
						}}
					>
						{tournament.data?.label}
					</Typography>
					<Typography
						display="block"
						data-ui="season"
						variant="label"
						color="teal.500"
					>
						{tournament.data?.season}
					</Typography>
				</TournamentLabelBox>

				<TournamentLogo src={logoSrc} />
			</LabelAndLogo>
			<TournamentTabs tournament={tournament?.data} />
		</Wrapper>
	);
};

const Wrapper = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		gap: 2,
		display: "flex",
		flexDirection: {
			all: "column",
			tablet: "row",
		},
		justifyContent: "space-between",
		alignItems: "flex-start",
		px: {
			all: 0,
			tablet: 2,
		},
	}),
);

const TournamentLabelBox = styled(Box)(({ theme }) => theme?.unstable_sx({}));

const LabelAndLogo = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		width: 1,
		display: "grid",
		gap: 3,
	}),
);

export const TournamentLogo = styled("img")(({ theme }) =>
	theme?.unstable_sx({
		maxWidth: {
			all: "120px",
		},
	}),
);
