import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { theme, UIHelper } from "@/theming/theme";
import {
	Box,
	Stack,
	styled,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import { useTournamentStandings } from "../../hooks/use-tournament-standings";

export const TournamentStandings = () => {
	const tournamentStandings = useTournamentStandings();

	if (tournamentStandings.isPending) {
		return (
			<Stack>
				<Typography variant="h6" color={theme.palette.neutral[100]}>
					Loading
				</Typography>
			</Stack>
		);
	}

	if (tournamentStandings.error) {
		return (
			<Stack>
				<Typography variant="h6" color={theme.palette.neutral[100]}>
					Error
				</Typography>
			</Stack>
		);
	}

	return (
		<Wrapper data-ui="standings">
			<Heading>
				<AppPill.Component
					border="1px solid"
					borderColor="teal.500"
					width={80}
					height={25}
				>
					<Typography
						variant="tag"
						textTransform="uppercase"
						color="neutral.100"
						fontWeight={500}
					>
						standings
					</Typography>
				</AppPill.Component>
			</Heading>

			<TableContainer>
				<StandingsTable size="small" aria-label="standings-table">
					<TableHead>
						<Row>
							<Cell sx={{ pt: 0, pb: 0, textAlign: "left" }}>
								<Typography
									variant="label"
									textTransform="uppercase"
									color="teal.500"
								>
									team
								</Typography>
							</Cell>
							<Cell sx={{ pt: 0, pb: 0 }}>
								<Typography
									variant="label"
									textTransform="uppercase"
									color="teal.500"
								>
									pts
								</Typography>
							</Cell>
							<Cell sx={{ pt: 0, pb: 0 }}>
								<Typography
									variant="label"
									textTransform="uppercase"
									color="teal.500"
								>
									g
								</Typography>
							</Cell>
							<Cell sx={{ pt: 0, pb: 0 }}>
								<Typography
									variant="label"
									textTransform="uppercase"
									color="teal.500"
								>
									w
								</Typography>
							</Cell>
							<Cell sx={{ pt: 0, pb: 0 }}>
								<Typography
									variant="label"
									textTransform="uppercase"
									color="teal.500"
								>
									d
								</Typography>
							</Cell>
							<Cell sx={{ pt: 0, pb: 0 }}>
								<Typography
									variant="label"
									textTransform="uppercase"
									color="teal.500"
								>
									l
								</Typography>
							</Cell>
							<Cell sx={{ pt: 0, pb: 0 }}>
								<Typography
									variant="label"
									textTransform="uppercase"
									color="teal.500"
								>
									gf
								</Typography>
							</Cell>
							<Cell sx={{ pt: 0, pb: 0 }}>
								<Typography
									variant="label"
									textTransform="uppercase"
									color="teal.500"
								>
									ga
								</Typography>
							</Cell>
							<Cell sx={{ pt: 0, pb: 0 }}>
								<Typography
									variant="label"
									textTransform="uppercase"
									color="teal.500"
								>
									gd
								</Typography>
							</Cell>
						</Row>
					</TableHead>
					<TableBody>
						{tournamentStandings.data.standings?.map((row) => {
							return (
								<Row key={row.order} sx={{ color: "neutral.100" }}>
									<Cell sx={{ color: "neutral.100" }}>
										<Stack direction="row" alignItems="center" gap={1}>
											<Typography
												variant="label"
												textTransform="uppercase"
												color="teal.500"
											>
												{row.order}
											</Typography>
											<Typography
												variant="label"
												textTransform="uppercase"
												color="neutral.100"
												sx={{
													display: { all: "inline-block", tablet: "none" },
												}}
											>
												{row.shortName}
											</Typography>

											<Typography
												variant="label"
												textTransform="uppercase"
												color="neutral.100"
												sx={{
													display: { all: "none", tablet: "inline-block" },
												}}
												overflow="hidden"
												textOverflow="ellipsis"
											>
												{row.longName}
											</Typography>
										</Stack>
									</Cell>
									<Cell sx={{ color: "neutral.100" }}>
										<Typography
											variant="label"
											textTransform="uppercase"
											color="neutral.100"
										>
											{row.points}
										</Typography>
									</Cell>
									<Cell sx={{ color: "neutral.100" }} align="right">
										<Typography
											variant="label"
											textTransform="uppercase"
											color="neutral.100"
										>
											{row.games}
										</Typography>
									</Cell>
									<Cell sx={{ color: "neutral.100" }} align="right">
										<Typography
											variant="label"
											textTransform="uppercase"
											color="neutral.100"
										>
											{row.wins}
										</Typography>
									</Cell>
									<Cell sx={{ color: "neutral.100" }} align="right">
										<Typography
											variant="label"
											textTransform="uppercase"
											color="neutral.100"
										>
											{row.draws}
										</Typography>
									</Cell>
									<Cell sx={{ color: "neutral.100" }} align="right">
										<Typography
											variant="label"
											textTransform="uppercase"
											color="neutral.100"
										>
											{row.losses}
										</Typography>
									</Cell>
									<Cell sx={{ color: "neutral.100" }} align="right">
										<Typography
											variant="label"
											textTransform="uppercase"
											color="neutral.100"
										>
											{row.gf}
										</Typography>
									</Cell>
									<Cell sx={{ color: "neutral.100" }} align="right">
										<Typography
											variant="label"
											textTransform="uppercase"
											color="neutral.100"
										>
											{row.ga}
										</Typography>
									</Cell>
									<Cell sx={{ color: "neutral.100" }} align="right">
										<Typography
											variant="label"
											textTransform="uppercase"
											color="neutral.100"
										>
											{row.gd}
										</Typography>
									</Cell>
								</Row>
							);
						})}
					</TableBody>
				</StandingsTable>
			</TableContainer>
		</Wrapper>
	);
};

const Cell = styled(TableCell)`
	border: none;
	padding: ${({ theme }) => theme.spacing(1.5)};
	font-weight: 200;
	text-align: center;
`;

const StandingsTable = styled(Table)(({ theme }) => ({
	borderRadius: theme.spacing(3),
}));

const Row = styled(TableRow)(() => ({
	border: "none",
}));

const TableContainer = styled(Box)(({ theme }) => ({
	border: "none",
	padding: theme.spacing(0, 1, 0, 0),
	height: "100%",
}));

const Wrapper = styled(Box)(() => ({
	[UIHelper.whileIs("mobile")]: {
		display: "none",
	},

	[UIHelper.startsOn("tablet")]: {
		flex: 1,
		overflow: "auto",
	},
}));

const Heading = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		backgroundColor: "black.700",
		pb: 3,
	}),
);
