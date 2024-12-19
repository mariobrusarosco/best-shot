import { useTournamentStandings } from "@/domains/tournament/hooks/use-tournament-standings";
import { ITournamentStandings } from "@/domains/tournament/typing";
import { UIHelper } from "@/theming/theme";
import Typography from "@mui/material/Typography/Typography";
import { Box, styled, useMediaQuery } from "@mui/system";
import { IMatch } from "../../typing";

export const TeamDisplay = ({
	team,
	expanded,
}: {
	team: IMatch["home"] | IMatch["away"];
	expanded: boolean;
}) => {
	const isDesktopScreen = useMediaQuery(UIHelper.startsOn("desktop"));
	const displayFullname = expanded || isDesktopScreen;
	const standings = useTournamentStandings();

	const teamStandingsData = getTeamStandingsInfo(team.id, standings.data);

	return (
		<Display>
			{expanded ? (
				<Position>
					<Typography
						textTransform="uppercase"
						variant="caption"
						color="teal.500"
					>
						pos
					</Typography>
					<Typography variant="label" color="neutral.100">
						{teamStandingsData?.order}
					</Typography>
				</Position>
			) : null}

			<LogoAndLabel data-ui="logo-and-label">
				{/* <TeamLogoBox> */}
				<TeamLogo src={team.badge} />
				{/* </TeamLogoBox> */}

				<Typography variant="caption">
					{displayFullname ? team.name : team.name}
				</Typography>
			</LogoAndLabel>
		</Display>
	);
};

export const Display = styled(Box)(({ theme }) => ({
	display: "flex",
	// flexDirection: "column",
	// alignItems: "center",
	// justifyContent: "flex-start",
	gap: theme.spacing(1),
	flex: 1,
	// width: 1,
	// height: "100%",

	// backgroundColor: "red",
	justifyContent: "center",

	"[data-open='true'] &": {
		order: 1,
		flexDirection: "column",
		alignItems: "flex-start",
	},
}));

export const LogoAndLabel = styled(Box)(({ theme }) => ({
	// padding: theme.spacing(0, 0.5),
	// borderRadius: theme.spacing(1),
	// backgroundColor: theme.palette.black[500],
	display: "inline-flex",
	flexDirection: "column",
	alignItems: "center",
	// placeItems: "center",
	flex: 1,
	justifyContent: "center",
	height: "50px",
	// backgroundColor: "green",
	textAlign: "center",
	padding: theme.spacing(0, 1.5),
}));

export const TeamLogoBox = styled(Box)(({ theme }) => ({
	padding: theme.spacing(0.5),
	borderRadius: theme.spacing(0.5),
	backgroundColor: theme.palette.black[500],
	display: "flex",
}));

export const TeamLogo = styled("img")(({ theme }) =>
	theme?.unstable_sx({
		display: "inline-flex",
		width: 18,
		height: 18,
	}),
);

export const Position = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		display: "flex",
		alignItems: "center",
		gap: 1,
	}),
);

// TODO Move this to a util, and avoid repeating the word 'standings'
const getTeamStandingsInfo = (
	teamId: string,
	standings: ITournamentStandings | undefined,
) => {
	if (!standings) return;
	console.log(standings);

	return standings.standings.find((team) => team.teamExternalId === teamId);
};
