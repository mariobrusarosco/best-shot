import { TournamentLogo } from "@/domains/tournament/components/tournament-logo";
import { UIHelper } from "@/theming/theme";
import Typography from "@mui/material/Typography/Typography";
import { Box, useMediaQuery } from "@mui/system";
import { ITournament } from "../typing";

const { startsOn } = UIHelper.media;

export const TournamentHeading = ({
	tournament,
}: {
	tournament: ITournament;
}) => {
	const isDesktopScreen = useMediaQuery(startsOn("desktop"));

	const titleVariant = isDesktopScreen ? "h1" : "h3";

	return (
		<Box
			data-ui="tournament-heading"
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 3,
			}}
		>
			<Typography color="neutral.100" variant={titleVariant}>
				{tournament.label}
			</Typography>

			<TournamentLogo />
		</Box>
	);
};
