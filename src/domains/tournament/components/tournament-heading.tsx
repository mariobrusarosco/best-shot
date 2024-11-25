import { TournamentLogo } from "@/domains/tournament/components/tournament-logo";
import { UIHelper } from "@/theming/theme";
import Typography from "@mui/material/Typography/Typography";
import { Box, useMediaQuery } from "@mui/system";
import { useTournament } from "../hooks/use-tournament";

const { startsOn } = UIHelper.media;

export const TournamentHeading = () => {
	const tournament = useTournament();
	console.log(tournament.serverState.data);
	const isDesktopScreen = useMediaQuery(startsOn("desktop"));

	const titleVariant = isDesktopScreen ? "h1" : "h6";

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
			<Typography
				color="neutral.100"
				variant={titleVariant}
				sx={{
					textOverflow: "ellipsis",
					overflow: "hidden",
					wordBreak: "break-word",
					maxWidth: "50%",
				}}
			>
				{tournament.serverState.data?.label}
			</Typography>

			<TournamentLogo
				src={`https://api.sofascore.app/api/v1/unique-tournament/${tournament.serverState.data?.externalId}/image/dark`}
				sx={{
					width: 127,
					height: 127,
				}}
			/>
		</Box>
	);
};
