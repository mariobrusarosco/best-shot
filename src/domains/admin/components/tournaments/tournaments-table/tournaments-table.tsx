import {
	Box,
	styled,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { AppTypography } from "@/domains/ui-system/components";
import type { IAdminTournament } from "@/domains/admin/typing";

interface TournamentsTableProps {
	tournaments: IAdminTournament[];
	isLoading?: boolean;
}

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
	marginTop: theme.spacing(3),
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
	cursor: "pointer",
	transition: "background-color 0.2s ease",
	"&:hover": {
		backgroundColor: theme.palette.black[700],
	},
	"& .MuiTableCell-root": {
		borderBottom: `1px solid ${theme.palette.neutral[800]}`,
		color: theme.palette.neutral[200],
		padding: theme.spacing(1.5, 2),
	},
}));

const TournamentInfo = ({ tournament }: { tournament: IAdminTournament }) => (
	<Box>
		<AppTypography variant="body2" color="neutral.100" fontWeight="medium">
			{tournament.label}
		</AppTypography>
		<AppTypography variant="caption" color="neutral.400">
			{tournament.provider} • {tournament.mode}
		</AppTypography>
	</Box>
);

const TournamentRow = ({ tournament }: { tournament: IAdminTournament }) => {
	const navigate = useNavigate();

	const handleRowClick = () => {
		navigate({ to: `/admin/tournament/${tournament.id}` });
	};

	return (
		<StyledTableRow onClick={handleRowClick}>
			<TableCell>
				<TournamentInfo tournament={tournament} />
			</TableCell>

			<TableCell>
				<AppTypography variant="body2" color="neutral.200">
					{tournament.season || "N/A"}
				</AppTypography>
			</TableCell>

			<TableCell>
				<AppTypography variant="body2" color="neutral.200" sx={{ textTransform: "capitalize" }}>
					{tournament.provider}
				</AppTypography>
			</TableCell>

			<TableCell>
				<AppTypography variant="body2" color="neutral.200" sx={{ textTransform: "capitalize" }}>
					{tournament?.mode?.replace(/-/g, " ")}
				</AppTypography>
			</TableCell>
		</StyledTableRow>
	);
};

const TournamentsTable = ({ tournaments, isLoading }: TournamentsTableProps) => {
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
					</TableRow>
				</StyledTableHead>
				<TableBody>
					{tournaments.map((tournament) => (
						<TournamentRow key={tournament.id} tournament={tournament} />
					))}
				</TableBody>
			</Table>
		</StyledTableContainer>
	);
};

export default TournamentsTable;
