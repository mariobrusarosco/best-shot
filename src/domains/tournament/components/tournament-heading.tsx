import { UIHelper } from "@/theming/theme";
import Typography from "@mui/material/Typography/Typography";
import { Box, styled, useMediaQuery } from "@mui/system";
import { useTournament } from "../hooks/use-tournament";

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
				justifyContent: "space-between",
				marginTop: 1,
				gap: 1,
			}}
		>
			<TournamentLogo
				sx={{
					// position: "absolute",
					// right: "0",
					width: "100%",
					maxWidth: "140px",
				}}
				src={`${import.meta.env["VITE_DATA_PROVIDER_ASSETS_URL"]}${tournament.data?.externalId}.png`}
			/>
			<Typography
				color="neutral.100"
				variant={titleVariant}
				sx={{
					textOverflow: "ellipsis",
					overflow: "hidden",
					wordBreak: "break-word",
					// maxWidth: "70%",
				}}
			>
				{tournament.data?.label}
			</Typography>
		</Box>
	);
};

export const TournamentLogo = styled("img")(() => ({
	display: "inline-flex",
}));
