import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { shimmerEffect } from "@/domains/ui-system/components/skeleton/skeleton";
import { OverflowOnHover } from "@/domains/ui-system/utils";
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
import { useTournament } from "../../hooks/use-tournament";
import { useTournamentStandings } from "../../hooks/use-tournament-standings";
import { ITournamentStandings } from "../../schemas";

const TournamentStandings = () => {
	const tournamentStandings = useTournamentStandings();
	const tournamentQuery = useTournament();

	if (tournamentStandings.isPending) {
		return (
			<Wrapper>
				<Typography variant="h6" color={theme.palette.neutral[100]}>
					Loading
				</Typography>
			</Wrapper>
		);
	}

	if (tournamentStandings.error) {
		return (
			<Wrapper>
				<Typography variant="h6" color={theme.palette.neutral[100]}>
					Error
				</Typography>
			</Wrapper>
		);
	}

	if (tournamentQuery.data?.mode === "knockout-only") {
		return (
			<Wrapper>
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
				<Typography variant="label" color={theme.palette.neutral[100]}>
					Knockout tournaments do not have standings
				</Typography>
			</Wrapper>
		);
	}

	const standings = parseStandinsByFormat(tournamentStandings.data);

	if (!standings) {
		return (
			<Stack>
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
				<Typography variant="topic" color={theme.palette.neutral[100]}>
					It seems that there are no standings available for this tournament
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

			{Object.keys(standings).map((group) => {
				return (
					<>
						{group !== "unique-group" ? (
							<AppPill.Component
								bgcolor="teal.500"
								width={120}
								height={25}
								mb={3}
							>
								<Typography
									variant="tag"
									textTransform="uppercase"
									color="neutral.100"
									fontWeight={500}
								>
									{group}
								</Typography>
							</AppPill.Component>
						) : null}

						<StandingsTable
							size="small"
							aria-label={`standings-table-${group}`}
						>
							<TableHead>
								<Row>
									<Cell sx={{ pt: 0, pb: 0, textAlign: "left" }}>
										<Typography
											variant="label"
											fontWeight={300}
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
											fontWeight={300}
										>
											pts
										</Typography>
									</Cell>
									<Cell sx={{ pt: 0, pb: 0 }}>
										<Typography
											variant="label"
											textTransform="uppercase"
											color="teal.500"
											fontWeight={300}
										>
											g
										</Typography>
									</Cell>
									<Cell sx={{ pt: 0, pb: 0 }}>
										<Typography
											variant="label"
											textTransform="uppercase"
											color="teal.500"
											fontWeight={300}
										>
											w
										</Typography>
									</Cell>
									<Cell sx={{ pt: 0, pb: 0 }}>
										<Typography
											variant="label"
											textTransform="uppercase"
											color="teal.500"
											fontWeight={300}
										>
											d
										</Typography>
									</Cell>
									<Cell sx={{ pt: 0, pb: 0 }}>
										<Typography
											variant="label"
											textTransform="uppercase"
											color="teal.500"
											fontWeight={300}
										>
											l
										</Typography>
									</Cell>
									<Cell sx={{ pt: 0, pb: 0 }}>
										<Typography
											variant="label"
											textTransform="uppercase"
											color="teal.500"
											fontWeight={300}
										>
											gf
										</Typography>
									</Cell>
									<Cell sx={{ pt: 0, pb: 0 }}>
										<Typography
											variant="label"
											textTransform="uppercase"
											color="teal.500"
											fontWeight={300}
										>
											ga
										</Typography>
									</Cell>
									<Cell sx={{ pt: 0, pb: 0 }}>
										<Typography
											variant="label"
											textTransform="uppercase"
											color="teal.500"
											fontWeight={300}
										>
											gd
										</Typography>
									</Cell>
								</Row>
							</TableHead>

							<TableBody>
								{standings[group]?.map((row) => {
									return (
										<Row key={row.order} sx={{ color: "neutral.100" }}>
											<Cell sx={{ color: "neutral.100" }}>
												<Stack direction="row" alignItems="center" gap={1}>
													<Typography
														variant="label"
														textTransform="uppercase"
														fontWeight={300}
														color="teal.500"
													>
														{row.order}
													</Typography>
													<Typography
														variant="label"
														textTransform="uppercase"
														fontWeight={300}
														color="neutral.100"
														sx={{
															display: {
																all: "none",
																tablet: "inline-block",
															},
														}}
														overflow="hidden"
														textOverflow="ellipsis"
														textAlign="left"
													>
														{row.longName}
													</Typography>
												</Stack>
											</Cell>
											<Cell sx={{ color: "neutral.100" }}>
												<Typography
													variant="label"
													textTransform="uppercase"
													fontWeight={300}
													color="neutral.100"
												>
													{row.points}
												</Typography>
											</Cell>
											<Cell sx={{ color: "neutral.100" }} align="right">
												<Typography
													variant="label"
													textTransform="uppercase"
													fontWeight={300}
													color="neutral.100"
												>
													{row.games}
												</Typography>
											</Cell>
											<Cell sx={{ color: "neutral.100" }} align="right">
												<Typography
													variant="label"
													textTransform="uppercase"
													fontWeight={300}
													color="neutral.100"
												>
													{row.wins}
												</Typography>
											</Cell>
											<Cell sx={{ color: "neutral.100" }} align="right">
												<Typography
													variant="label"
													textTransform="uppercase"
													fontWeight={300}
													color="neutral.100"
												>
													{row.draws}
												</Typography>
											</Cell>
											<Cell sx={{ color: "neutral.100" }} align="right">
												<Typography
													variant="label"
													textTransform="uppercase"
													fontWeight={300}
													color="neutral.100"
												>
													{row.losses}
												</Typography>
											</Cell>
											<Cell sx={{ color: "neutral.100" }} align="right">
												<Typography
													variant="label"
													textTransform="uppercase"
													fontWeight={300}
													color="neutral.100"
												>
													{row.gf}
												</Typography>
											</Cell>
											<Cell sx={{ color: "neutral.100" }} align="right">
												<Typography
													variant="label"
													textTransform="uppercase"
													fontWeight={300}
													color="neutral.100"
												>
													{row.ga}
												</Typography>
											</Cell>
											<Cell sx={{ color: "neutral.100" }} align="right">
												<Typography
													variant="label"
													textTransform="uppercase"
													fontWeight={300}
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
					</>
				);
			})}
			{/* </Stack> */}
		</Wrapper>
	);
};

const Skeleton = () => {
	return (
		<Wrapper data-ui="standings">
			<Heading sx={{ ...shimmerEffect() }}></Heading>

			<StandingsTable size="small" aria-label="standings-table">
				<TableHead>
					<Row sx={{ ...shimmerEffect(), height: "20px" }} />
				</TableHead>
				<TableBody>
					<Row sx={{ ...shimmerEffect(), py: 2 }} />
				</TableBody>
			</StandingsTable>
		</Wrapper>
	);
};

export default {
	Component: TournamentStandings,
	Skeleton,
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

const Wrapper = styled(Box)(() => ({
	[UIHelper.whileIs("mobile")]: {
		display: "none",
	},

	[UIHelper.startsOn("tablet")]: {
		flex: 1,
	},
	...OverflowOnHover(),
}));

const Heading = styled(Box)(() => ({
	backgroundColor: theme.palette.black[700],
	paddingBottom: theme.spacing(3),
}));

const parseStandinsByFormat = (standings: ITournamentStandings) => {
	if (!standings?.teams?.length) return null;

	if (standings.format === "multi-group") {
		return Object.groupBy(standings.teams, (item) => item.groupName!);
	}

	return { "unique-group": standings.teams };
};
