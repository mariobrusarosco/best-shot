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

	return (
		<Box
			data-ui="tournament-heading"
			sx={{
				gap: 2,
				display: "grid",
			}}
		>
			<Box>
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
			</Box>
			<TournamentLogo
				sx={{
					width: "100%",
					maxWidth: {
						all: "120px",
					},
				}}
				src={tournament.data?.logo}
			/>
			<TournamentTabs tournament={tournament?.data} />
		</Box>
	);
};

export const TournamentLogo = styled("img")(() => ({
	display: "inline-flex",
}));
