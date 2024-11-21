import { TournamentLogo } from "@/domains/tournament/components/tournament-logo";
import fakeLogo from "@/domains/ui-system/components/icon/system-icons/copa-do-brasil.svg";
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
				justifyContent: "space-between",
				marginTop: 5,
				gap: 2,
			}}
		>
			<Typography color="neutral.100" variant={titleVariant}>
				{tournament.label}
			</Typography>

			<TournamentLogo
				src={fakeLogo}
				sx={{
					width: 127,
					height: 127,
				}}
			/>
		</Box>
	);
};
