import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	styled,
	CircularProgress,
	IconButton,
	Tooltip,
} from "@mui/material";
import { AppIcon, AppTypography } from "@/domains/ui-system/components";
import type { ITournament } from "@/domains/tournament/schemas";

interface TournamentsTableProps {
	tournaments: ITournament[];
	isLoading?: boolean;
	// Mutation objects with isPending states
	createStandingsMutation: { mutate: (tournamentId: string) => void; isPending: boolean };
	updateStandingsMutation: { mutate: (tournamentId: string) => void; isPending: boolean };
	createRoundsMutation: { mutate: (tournamentId: string) => void; isPending: boolean };
	updateRoundsMutation: { mutate: (tournamentId: string) => void; isPending: boolean };
	createTeamsMutation: { mutate: (tournamentId: string) => void; isPending: boolean };
	updateTeamsMutation: { mutate: (tournamentId: string) => void; isPending: boolean };
	createMatchesMutation: { mutate: (tournamentId: string) => void; isPending: boolean };
	updateMatchesMutation: { mutate: (tournamentId: string) => void; isPending: boolean };
}

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
	backgroundColor: theme.palette.black[800],
	border: `1px solid ${theme.palette.neutral[700]}`,
	borderRadius: theme.shape.borderRadius,
	"& .MuiTable-root": {
		minWidth: 800,
	},
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
	backgroundColor: theme.palette.black[700],
	"& .MuiTableCell-head": {
		backgroundColor: theme.palette.black[700],
		color: theme.palette.neutral[200],
		fontWeight: 600,
		textTransform: "uppercase",
		fontSize: "0.75rem",
		letterSpacing: "0.5px",
		borderBottom: `1px solid ${theme.palette.neutral[700]}`,
		padding: theme.spacing(1.5, 2),
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:hover": {
		backgroundColor: `${theme.palette.black[700]}50`,
	},
	"& .MuiTableCell-root": {
		borderBottom: `1px solid ${theme.palette.neutral[800]}`,
		color: theme.palette.neutral[200],
		padding: theme.spacing(1.5, 2),
	},
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
	width: "32px",
	height: "32px",
	backgroundColor: theme.palette.black[700],
	border: `1px solid ${theme.palette.neutral[700]}`,
	color: theme.palette.neutral[300],
	"&:hover": {
		backgroundColor: theme.palette.teal[500],
		color: theme.palette.neutral[100],
		borderColor: theme.palette.teal[500],
	},
}));

const ActionsCell = styled(Box)({
	display: "flex",
	alignItems: "center",
	gap: 4,
	justifyContent: "center",
	flexWrap: "wrap",
});

const TournamentsTable = ({
	tournaments,
	isLoading,
	createStandingsMutation,
	updateStandingsMutation,
	createRoundsMutation,
	updateRoundsMutation,
	createTeamsMutation,
	updateTeamsMutation,
	createMatchesMutation,
	updateMatchesMutation,
}: TournamentsTableProps) => {
	if (isLoading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
				<AppTypography color="neutral.400">Loading tournaments...</AppTypography>
			</Box>
		);
	}

	if (!tournaments || tournaments.length === 0) {
		return (
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					py: 8,
				}}
			>
				<AppTypography variant="h6" color="neutral.400" sx={{ mt: 2 }}>
					No tournaments found
				</AppTypography>
				<AppTypography variant="body2" color="neutral.500" sx={{ mt: 1 }}>
					Create your first tournament to get started
				</AppTypography>
			</Box>
		);
	}

	return (
		<StyledTableContainer>
			<Table>
				<StyledTableHead>
					<TableRow>
						<TableCell>Tournament</TableCell>
						<TableCell>Season</TableCell>
						<TableCell>Provider</TableCell>
						<TableCell>Mode</TableCell>
						<TableCell align="center">Actions</TableCell>
					</TableRow>
				</StyledTableHead>
				<TableBody>
					{tournaments.map((tournament) => (
						<StyledTableRow key={tournament.id}>
							<TableCell>
								<Box>
									<AppTypography variant="body2" color="neutral.100" fontWeight="medium">
										{tournament.label}
									</AppTypography>
									<AppTypography variant="caption" color="neutral.400">
										{tournament.provider} • {tournament.mode}
									</AppTypography>
								</Box>
							</TableCell>

							<TableCell>
								<AppTypography variant="body2" color="neutral.200">
									{tournament.season || "N/A"}
								</AppTypography>
							</TableCell>

							<TableCell>
								<AppTypography
									variant="body2"
									color="neutral.200"
									sx={{ textTransform: "capitalize" }}
								>
									{tournament.provider}
								</AppTypography>
							</TableCell>

							<TableCell>
								<AppTypography
									variant="body2"
									color="neutral.200"
									sx={{ textTransform: "capitalize" }}
								>
									{tournament?.mode?.replace(/-/g, " ")}
								</AppTypography>
							</TableCell>

							<TableCell>
								<ActionsCell>
									{/* Standings Actions */}
									<Tooltip title="Create Standings" arrow>
										<ActionButton
											onClick={() => createStandingsMutation.mutate(tournament.id)}
											disabled={createStandingsMutation.isPending}
										>
											{createStandingsMutation.isPending &&
											createStandingsMutation.variables === tournament.id ? (
												<CircularProgress size={16} sx={{ color: "teal.500" }} />
											) : (
												<AppIcon name="Plus" size="small" />
											)}
										</ActionButton>
									</Tooltip>
									<Tooltip title="Update Standings" arrow>
										<ActionButton
											onClick={() => updateStandingsMutation.mutate(tournament.id)}
											disabled={updateStandingsMutation.isPending}
										>
											{updateStandingsMutation.isPending &&
											updateStandingsMutation.variables === tournament.id ? (
												<CircularProgress size={16} sx={{ color: "teal.500" }} />
											) : (
												<AppIcon name="Trophy" size="small" />
											)}
										</ActionButton>
									</Tooltip>

									{/* Rounds Actions */}
									<Tooltip title="Create Rounds" arrow>
										<ActionButton
											onClick={() => createRoundsMutation.mutate(tournament.id)}
											disabled={createRoundsMutation.isPending}
										>
											{createRoundsMutation.isPending &&
											createRoundsMutation.variables === tournament.id ? (
												<CircularProgress size={16} sx={{ color: "teal.500" }} />
											) : (
												<AppIcon name="Plus" size="small" />
											)}
										</ActionButton>
									</Tooltip>
									<Tooltip title="Update Rounds" arrow>
										<ActionButton
											onClick={() => updateRoundsMutation.mutate(tournament.id)}
											disabled={updateRoundsMutation.isPending}
										>
											{updateRoundsMutation.isPending &&
											updateRoundsMutation.variables === tournament.id ? (
												<CircularProgress size={16} sx={{ color: "teal.500" }} />
											) : (
												<AppIcon name="ClockFilled" size="small" />
											)}
										</ActionButton>
									</Tooltip>

									{/* Teams Actions */}
									<Tooltip title="Create Teams" arrow>
										<ActionButton
											onClick={() => createTeamsMutation.mutate(tournament.id)}
											disabled={createTeamsMutation.isPending}
										>
											{createTeamsMutation.isPending &&
											createTeamsMutation.variables === tournament.id ? (
												<CircularProgress size={16} sx={{ color: "teal.500" }} />
											) : (
												<AppIcon name="Plus" size="small" />
											)}
										</ActionButton>
									</Tooltip>
									<Tooltip title="Update Teams" arrow>
										<ActionButton
											onClick={() => updateTeamsMutation.mutate(tournament.id)}
											disabled={updateTeamsMutation.isPending}
										>
											{updateTeamsMutation.isPending &&
											updateTeamsMutation.variables === tournament.id ? (
												<CircularProgress size={16} sx={{ color: "teal.500" }} />
											) : (
												<AppIcon name="Users" size="small" />
											)}
										</ActionButton>
									</Tooltip>

									{/* Matches Actions */}
									<Tooltip title="Create Matches" arrow>
										<ActionButton
											onClick={() => createMatchesMutation.mutate(tournament.id)}
											disabled={createMatchesMutation.isPending}
										>
											{createMatchesMutation.isPending &&
											createMatchesMutation.variables === tournament.id ? (
												<CircularProgress size={16} sx={{ color: "teal.500" }} />
											) : (
												<AppIcon name="Plus" size="small" />
											)}
										</ActionButton>
									</Tooltip>
									<Tooltip title="Update Matches" arrow>
										<ActionButton
											onClick={() => updateMatchesMutation.mutate(tournament.id)}
											disabled={updateMatchesMutation.isPending}
										>
											{updateMatchesMutation.isPending &&
											updateMatchesMutation.variables === tournament.id ? (
												<CircularProgress size={16} sx={{ color: "teal.500" }} />
											) : (
												<AppIcon name="LayoutDashboard" size="small" />
											)}
										</ActionButton>
									</Tooltip>
								</ActionsCell>
							</TableCell>
						</StyledTableRow>
					))}
				</TableBody>
			</Table>
		</StyledTableContainer>
	);
};

export default TournamentsTable;
