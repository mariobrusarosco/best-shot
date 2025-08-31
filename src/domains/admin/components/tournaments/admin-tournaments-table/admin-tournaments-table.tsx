import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import type { ITournament } from "@/domains/tournament/schemas";
import { AppTypography } from "@/domains/ui-system/components";
import { StyledTableRow } from "@/domains/admin/components/tournaments/admin-tournaments-table/styles";
import { StyledTableContainer } from "@/domains/admin/components/tournaments/admin-tournaments-table/styles";
import { StyledTableHead } from "@/domains/admin/components/tournaments/admin-tournaments-table/styles";

interface TournamentsTableProps {
	tournaments: ITournament[];
	isLoading?: boolean;
}


const TournamentInfo = ({ tournament }: { tournament: ITournament }) => (
	<Box display="flex" gap={1} alignItems="end">
		<Box>	
			{tournament.logo && <img src={tournament.logo} alt={tournament.label} width={20} height={20} />	}
		</Box>
		<AppTypography variant="body2" color="neutral.100" fontWeight="medium">
			{tournament.label}
		</AppTypography>
		<AppTypography variant="tag" color="neutral.400">
			{tournament.standingsMode}
		</AppTypography>
	</Box>
);

const TournamentRow = ({ tournament }: { tournament: ITournament }) => {
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

const AdminTournamentsTable = ({ tournaments, isLoading }: TournamentsTableProps) => {
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
						<TableCell>Actions</TableCell>
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

export default AdminTournamentsTable;
