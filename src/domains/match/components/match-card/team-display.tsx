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

			<TeamBox>
				<TeamLogoBox>
					<TeamLogo src={team.badge} />
				</TeamLogoBox>

				<Typography variant="caption">
					{displayFullname ? team.name : team.shortName}
				</Typography>
			</TeamBox>
		</Display>
	);
};

export const Display = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		display: "flex",
		alignItems: "center",
		gap: 1,

		"[data-open='true'] &": {
			order: 1,
			flexDirection: "column",
			alignItems: "flex-start",
		},
	}),
);

export const TeamBox = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		display: "flex",
		placeItems: "center",
		gap: 0.5,
	}),
);

export const TeamLogoBox = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		p: 0.5,
		borderRadius: 1,
		bgcolor: "black.500",
		display: "grid",
		placeItems: "center",
	}),
);

export const TeamLogo = styled("img")(({ theme }) =>
	theme?.unstable_sx({
		display: "inline-flex",
		width: 16,
		height: 16,
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
