import { Box, styled, Typography } from "@mui/material";
import { useTournamentStandings } from "@/domains/tournament/hooks/use-tournament-standings";
import type { ITournamentStandings } from "@/domains/tournament/schemas";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { UIHelper } from "@/theming/theme";
import type { IMatch } from "../../typing";

export const TeamDisplay = ({ team }: { team: IMatch["home"] | IMatch["away"] }) => {
	const standings = useTournamentStandings();
	const teamStandingsData = getTeamStandingsInfo(team.id, standings.data);

	return (
		<Display data-ui="team-display">
			<Position>
				<Typography textTransform="uppercase" variant="caption" color="teal.500">
					pos
				</Typography>
				<AppPill.Component bgcolor={"black.500"} minWidth={30} height={20}>
					<Typography variant="label" color="neutral.100">
						{teamStandingsData?.order}
					</Typography>
				</AppPill.Component>
			</Position>

			<LogoAndName data-ui="logo-and-name">
				<TeamLogo src={team.badge} />

				<Typography
					variant="tag"
					textTransform="uppercase"
					fontWeight={500}
					sx={{
						textOverflow: "ellipsis",
						overflow: "hidden",
						width: "80px",

						"[data-card-open='true'] &": {
							width: "auto",
						},

						[UIHelper.startsOn("tablet")]: {
							width: "auto",
						},
					}}
				>
					{team.name}
				</Typography>
			</LogoAndName>
		</Display>
	);
};

export const Display = styled(Box)(({ theme }) => ({
	display: "flex",
	gap: theme.spacing(1),
}));

export const LogoAndName = styled(Box)(({ theme }) => ({
	display: "grid",
	justifyItems: "center",
	gap: theme.spacing(1),

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
	})
);

export const Position = styled(Box)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	gap: theme.spacing(1),
}));

// TODO Move this to a util, and avoid repeating the word 'standings'
const getTeamStandingsInfo = (teamId: string, standings: ITournamentStandings | undefined) => {
	if (!standings) return;

	return standings.teams?.find(
		(team: { teamExternalId: string }) => team.teamExternalId === teamId
	);
};
