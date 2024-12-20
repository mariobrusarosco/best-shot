import { useTournamentStandings } from "@/domains/tournament/hooks/use-tournament-standings";
import { ITournamentStandings } from "@/domains/tournament/typing";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import Typography from "@mui/material/Typography/Typography";
import { Box, styled } from "@mui/system";
import { IMatch } from "../../typing";

export const TeamDisplay = ({
	team,
	cardExpanded,
}: {
	team: IMatch["home"] | IMatch["away"];
	cardExpanded: boolean;
}) => {
	const standings = useTournamentStandings();
	const teamStandingsData = getTeamStandingsInfo(team.id, standings.data);

	return (
		<Display data-ui="team-display">
			{cardExpanded ? (
				<Position>
					<Typography
						textTransform="uppercase"
						variant="caption"
						color="teal.500"
					>
						pos
					</Typography>
					<AppPill.Component bgcolor={"black.500"} minWidth={30} height={20}>
						<Typography variant="label" color="neutral.100">
							{teamStandingsData?.order}
						</Typography>
					</AppPill.Component>
				</Position>
			) : null}

			<LogoAndLabel data-ui="logo-and-label">
				<TeamLogo src={team.badge} />

				<Typography
					variant="caption"
					sx={{
						overflowWrap: "anywhere",
					}}
				>
					{team.name}
				</Typography>
			</LogoAndLabel>
		</Display>
	);
};

export const Display = styled(Box)(({ theme }) => ({
	display: "flex",
	gap: theme.spacing(1),
	flex: 1,
	justifyContent: "center",
	"[data-card-open='true'] &": {
		flexDirection: "column",
		justifyContent: "flex-start",
	},
}));

export const LogoAndLabel = styled(Box)(({ theme }) => ({
	display: "inline-flex",
	flexDirection: "column",
	alignItems: "center",
	flex: 1,
	justifyContent: "center",
	textAlign: "center",
	padding: theme.spacing(0, 1.5),

	"[data-card-open='true'] &": {
		flexDirection: "row",
		padding: theme.spacing(0),
		gap: theme.spacing(1),
		justifyContent: "flex-start",
	},
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

export const Position = styled(Box)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	gap: theme.spacing(1),
}));

// TODO Move this to a util, and avoid repeating the word 'standings'
const getTeamStandingsInfo = (
	teamId: string,
	standings: ITournamentStandings | undefined,
) => {
	if (!standings) return;
	console.log(standings);

	return standings.standings.find((team) => team.teamExternalId === teamId);
};
