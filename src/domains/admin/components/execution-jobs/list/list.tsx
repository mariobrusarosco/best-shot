import {
	Box,
	Chip,
	styled,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
} from "@mui/material";
import { format } from "date-fns";
import type { IExecutionJob } from "@/domains/admin/typing";
import { AppIcon, AppTypography } from "@/domains/ui-system/components";
import { AppButton } from "@/domains/ui-system/components/app-button/app-button";

interface ExecutionJobsListProps {
	jobs: IExecutionJob[];
	isLoading?: boolean;
	pagination?: {
		limit: number;
		offset: number;
		total: number;
	};
	onPageChange?: (page: number) => void;
	onRowsPerPageChange?: (rowsPerPage: number) => void;
}

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
	backgroundColor: theme.palette.black[800],
	border: `1px solid ${theme.palette.neutral[700]}`,
	borderRadius: theme.shape.borderRadius,
	"& .MuiTable-root": {
		minWidth: 650,
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

const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => {
	const getStatusColor = () => {
		switch (status) {
			case "completed":
				return {
					backgroundColor: `${theme.palette.teal[500]}20`,
					color: theme.palette.teal[400],
					borderColor: theme.palette.teal[500],
				};
			case "running":
				return {
					backgroundColor: `${theme.palette.warning.main}20`,
					color: theme.palette.warning.light,
					borderColor: theme.palette.warning.main,
				};
			case "failed":
				return {
					backgroundColor: `${theme.palette.error.main}20`,
					color: theme.palette.error.light,
					borderColor: theme.palette.error.main,
				};
			default:
				return {
					backgroundColor: theme.palette.neutral[700],
					color: theme.palette.neutral[300],
					borderColor: theme.palette.neutral[600],
				};
		}
	};

	return {
		...getStatusColor(),
		border: "1px solid",
		fontWeight: 600,
		textTransform: "capitalize",
		fontSize: "0.75rem",
		height: 24,
	};
});

const OperationCell = styled(Box)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	gap: theme.spacing(1.5),
}));

const TournamentCell = styled(Box)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	gap: theme.spacing(1),
}));

const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
	backgroundColor: theme.palette.black[800],
	borderTop: `1px solid ${theme.palette.neutral[700]}`,
	color: theme.palette.neutral[200],
	"& .MuiTablePagination-toolbar": {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
	},
	"& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
		color: theme.palette.neutral[300],
		fontSize: "0.875rem",
	},
	"& .MuiSelect-select": {
		color: theme.palette.neutral[200],
		backgroundColor: theme.palette.black[700],
		"&:focus": {
			backgroundColor: theme.palette.black[700],
		},
	},
	"& .MuiTablePagination-actions": {
		color: theme.palette.neutral[300],
		"& .MuiIconButton-root": {
			color: theme.palette.neutral[300],
			"&:hover": {
				backgroundColor: theme.palette.black[700],
				color: theme.palette.teal[400],
			},
			"&.Mui-disabled": {
				color: theme.palette.neutral[600],
			},
		},
	},
}));

const formatDuration = (ms: number | null) => {
	if (!ms) return "—";
	const seconds = Math.floor(ms / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);

	if (hours > 0) return `${hours}h ${minutes % 60}m`;
	if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
	return `${seconds}s`;
};

const formatOperationType = (operationType: string) => {
	return operationType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

const ExecutionJobsList = ({
	jobs,
	isLoading,
	pagination,
	onPageChange,
	onRowsPerPageChange,
}: ExecutionJobsListProps) => {
	if (isLoading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
				<AppTypography color="neutral.400">Loading execution jobs...</AppTypography>
			</Box>
		);
	}

	if (!jobs || jobs.length === 0) {
		return (
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					height: "100%",
				}}
			>
				<AppTypography variant="h6" color="neutral.400" sx={{ mt: 2 }}>
					No execution jobs found
				</AppTypography>
				<AppTypography variant="body2" color="neutral.500" sx={{ mt: 1 }}>
					Execution jobs will appear here when data provider operations are triggered
				</AppTypography>
			</Box>
		);
	}

	return (
		<Box>
			<StyledTableContainer>
				<Table>
					<StyledTableHead>
						<TableRow>
							<TableCell>Operation</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Tournament</TableCell>
							<TableCell>Started</TableCell>
							<TableCell>Completed</TableCell>
							<TableCell>Duration</TableCell>
							<TableCell>Progress</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</StyledTableHead>
					<TableBody>
						{jobs.map((job) => {
							const summary = job.summary;
							return (
								<StyledTableRow key={job.id}>
									<TableCell>
										<OperationCell>
											<Box>
												<AppTypography variant="body2" color="neutral.100" fontWeight="medium">
													{formatOperationType(job.operationType)}
												</AppTypography>
												<AppTypography variant="caption" color="neutral.400">
													{job.requestId.slice(0, 8)}...
												</AppTypography>
											</Box>
										</OperationCell>
									</TableCell>

									<TableCell>
										<StatusChip label={job.status} status={job.status} size="small" />
									</TableCell>

									<TableCell>
										<TournamentCell>
											{job.tournament?.logo && (
												<img
													src={job.tournament.logo}
													alt={job.tournament.label}
													style={{ width: 24, height: 24, borderRadius: 4 }}
												/>
											)}
											<Box>
												<AppTypography variant="body2" color="neutral.100">
													{summary?.tournamentLabel || job.tournament?.label || "—"}
												</AppTypography>
												{summary?.provider && (
													<AppTypography variant="caption" color="neutral.400">
														{summary.provider}
													</AppTypography>
												)}
											</Box>
										</TournamentCell>
									</TableCell>

									<TableCell>
										<AppTypography variant="body2" color="neutral.200">
											{job.startedAt ? format(new Date(job.startedAt), "MMM dd, HH:mm") : "—"}
										</AppTypography>
									</TableCell>

									<TableCell>
										<AppTypography variant="body2" color="neutral.200">
											{job.completedAt ? format(new Date(job.completedAt), "MMM dd, HH:mm") : "—"}
										</AppTypography>
									</TableCell>

									<TableCell>
										<AppTypography variant="body2" color="neutral.200">
											{formatDuration(job.duration)}
										</AppTypography>
									</TableCell>

									<TableCell>
										{summary && (
											<Box>
												<AppTypography variant="body2" color="neutral.200">
													{summary.successfulOperations}/{summary.operationsCount}
												</AppTypography>
												<AppTypography
													variant="caption"
													color={summary.failedOperations > 0 ? "error.light" : "neutral.400"}
												>
													{summary.failedOperations} failed
												</AppTypography>
											</Box>
										)}
									</TableCell>

									<TableCell>
										{job.reportFileUrl && (
											<AppButton
												variant="text"
												size="small"
												startIcon={<AppIcon name="Info" size="small" />}
												onClick={() =>
													job.reportFileUrl && window.open(job.reportFileUrl, "_blank")
												}
												sx={{
													color: "teal.400",
													fontSize: "0.75rem",
													minWidth: "auto",
													padding: "4px 8px",
													"&:hover": {
														color: "teal.300",
														backgroundColor: "teal.500" + "10",
													},
												}}
											>
												Report
											</AppButton>
										)}
									</TableCell>
								</StyledTableRow>
							);
						})}
						{pagination && (
							<StyledTablePagination
								count={pagination.total}
								page={Math.floor(pagination.offset / pagination.limit)}
								onPageChange={(_, page) => onPageChange?.(page)}
								rowsPerPage={pagination.limit}
								onRowsPerPageChange={(event) => {
									const newRowsPerPage = parseInt(event.target.value, 10);
									onRowsPerPageChange?.(newRowsPerPage);
								}}
								rowsPerPageOptions={[10, 25, 50, 100]}
								showFirstButton
								showLastButton
							/>
						)}
					</TableBody>
				</Table>
			</StyledTableContainer>
		</Box>
	);
};

export default ExecutionJobsList;
