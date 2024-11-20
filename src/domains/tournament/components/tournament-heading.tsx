import { UIHelper } from "@/theming/theme";
import Typography from "@mui/material/Typography/Typography";
import { Box, styled, useMediaQuery } from "@mui/system";
import { ITournament } from "../typing";

const { startsOn, whileIs } = UIHelper.media;

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

const TournamentLogo = styled("div")(({ theme }) => ({
	borderRadius: "50%",
	backgroundColor: theme.palette.teal[500],

	[whileIs("mobile")]: {
		padding: theme.spacing(2),
		width: 48,
		height: 48,
	},

	[startsOn("tablet")]: {
		padding: theme.spacing(4),
		width: 64,
		height: 64,
	},
}));
