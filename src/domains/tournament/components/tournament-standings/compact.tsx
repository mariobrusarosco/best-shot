import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
	IconCircleLetterDFilled,
	IconCircleLetterLFilled,
	IconCircleLetterWFilled,
} from "@tabler/icons-react";
import type { ITournamentStandings } from "@/domains/tournament/schemas";

interface Props {
	teams: ITournamentStandings["teams"];
}

export const CompactStandings = ({ teams }: Props) => {
	return (
		<StandingsTable>
			<thead>
				<tr>
					<th>
						<PositionHeading>
							<Typography
								variant="body1"
								fontWeight={700}
								textTransform="uppercase"
								sx={{
									color: "neutral.100",
									textAlign: "center",
								}}
							>
								#
							</Typography>
						</PositionHeading>
					</th>
					<th>
						<TeamHeading>
							<Typography variant="body1" fontWeight={700} textTransform="uppercase">
								team
							</Typography>
						</TeamHeading>
					</th>
					<th>
						<LastFiveHeading>
							<Typography
								variant="body1"
								fontWeight={700}
								textTransform="uppercase"
								sx={{
									color: "neutral.100",
									textAlign: "center",
								}}
								whiteSpace="nowrap"
							>
								last five
							</Typography>
						</LastFiveHeading>
					</th>
				</tr>
			</thead>

			<tbody>
				{teams?.map((team) => (
					<tr key={team.order}>
						<td>
							<PositionCell>
								<Typography
									variant="body1"
									fontWeight={700}
									textTransform="uppercase"
									sx={{
										color: "black.500",
										textAlign: "center",
									}}
								>
									{team.order}
								</Typography>
							</PositionCell>
						</td>
						<td>
							<TeamCell>
								<TeamLogo src={team.teamBadge} />
								<Typography
									variant="body1"
									fontWeight={700}
									textTransform="uppercase"
									color="black.500"
								>
									{team.shortName}
								</Typography>
							</TeamCell>
						</td>
						<td>
							<LastFiveCell>
								<LastFiveOutcomes form={team.form} />
							</LastFiveCell>
						</td>
					</tr>
				))}
			</tbody>
		</StandingsTable>
	);
};

const StandingsTable = styled("table")({
	width: "100%",
	borderCollapse: "separate",
	borderSpacing: "0 8px",
});
const CellContainer = styled("div")(({ theme }) => ({
	padding: theme.spacing(1),
}));

const PositionHeading = styled(CellContainer)(({ theme }) => ({
	backgroundColor: theme.palette.black[400],
	borderRadius: theme.borderRadius.medium,
	width: "32px",
}));

const TeamHeading = styled(CellContainer)(({ theme }) => ({
	backgroundColor: theme.palette.neutral[100],
	color: theme.palette.black[400],
	width: "150px",
	textAlign: "left",
}));

const LastFiveHeading = styled(CellContainer)(({ theme }) => ({
	backgroundColor: theme.palette.black[400],
	borderRadius: theme.borderRadius.medium,
	width: "70px",
}));

const PositionCell = styled(CellContainer)(({ theme }) => ({
	border: `1px solid ${theme.palette.black[400]}`,
	borderRadius: theme.borderRadius.medium,
	width: "32px",
}));

const TeamCell = styled(CellContainer)(({ theme }) => ({
	width: "150px",
	textAlign: "left",
	padding: theme.spacing(0, 1),
	display: "flex",
	alignItems: "center",
	gap: theme.spacing(1),
}));

const LastFiveCell = styled(CellContainer)(() => ({
	display: "flex",
	width: "120px",
	padding: 0,
}));

const LastFiveOutcomes = ({ form }: { form: string[] }) => {
	if (form === undefined || form === null) return null;

	return form?.map((outcome) => {
		const lowerCaseOutcome = outcome.toLocaleLowerCase();

		if (lowerCaseOutcome === "w") return <IconCircleLetterWFilled size={24} fill="#5AB1A3" />;
		if (lowerCaseOutcome === "l") return <IconCircleLetterLFilled size={24} fill="#C63F3E" />;
		if (lowerCaseOutcome === "d") return <IconCircleLetterDFilled size={24} fill="#FB9A66" />;
		return null;
	});
};

const TeamLogo = styled("img")(() => ({
	width: "28px",
	objectFit: "cover",
}));
