import {
	Box,
	Chip,
	CircularProgress,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { formatDistanceToNow, parseISO } from "date-fns";
import { AppTypography } from "@/domains/ui-system/components";
import type { ISchedulerJob } from "../../typing";

interface SchedulerJobsListProps {
	jobs: ISchedulerJob[];
	isLoading?: boolean;
	pagination?: {
		limit: number;
		offset: number;
		total: number;
	};
	onPageChange?: (page: number) => void;
	onRowsPerPageChange?: (rowsPerPage: number) => void;
}

const getStatusColor = (status: string): "success" | "info" | "error" | "warning" | "default" => {
	switch (status) {
		case "active":
			return "success";
		case "running":
			return "info";
		case "failed":
			return "error";
		case "paused":
			return "warning";
		case "completed":
			return "default";
		default:
			return "default";
	}
};

const SchedulerJobsList = ({
	jobs,
	isLoading = false,
	pagination,
	onPageChange,
	onRowsPerPageChange,
}: SchedulerJobsListProps) => {
	const currentPage = pagination ? Math.floor(pagination.offset / pagination.limit) : 0;

	const handlePageChange = (_: unknown, newPage: number) => {
		onPageChange?.(newPage);
	};

	const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onRowsPerPageChange?.(parseInt(event.target.value, 10));
	};

	if (isLoading) {
		return (
			<LoadingContainer>
				<CircularProgress size={40} />
				<AppTypography variant="body2" color="neutral.400" sx={{ mt: 2 }}>
					Loading scheduler jobs...
				</AppTypography>
			</LoadingContainer>
		);
	}

	return (
		<StyledTableContainer>
			<Table>
				<StyledTableHead>
					<TableRow>
						<TableCell>
							<AppTypography variant="subtitle2" color="neutral.100">
								Job Name
							</AppTypography>
						</TableCell>
						<TableCell>
							<AppTypography variant="subtitle2" color="neutral.100">
								Type
							</AppTypography>
						</TableCell>
						<TableCell>
							<AppTypography variant="subtitle2" color="neutral.100">
								Status
							</AppTypography>
						</TableCell>
						<TableCell>
							<AppTypography variant="subtitle2" color="neutral.100">
								Schedule
							</AppTypography>
						</TableCell>
						<TableCell>
							<AppTypography variant="subtitle2" color="neutral.100">
								Last Run
							</AppTypography>
						</TableCell>
						<TableCell>
							<AppTypography variant="subtitle2" color="neutral.100">
								Next Run
							</AppTypography>
						</TableCell>
					</TableRow>
				</StyledTableHead>
				<TableBody>
					{jobs.map((job) => (
						<StyledTableRow key={job.id}>
							<TableCell>
								<AppTypography variant="body2" color="neutral.200">
									{job.name}
								</AppTypography>
							</TableCell>
							<TableCell>
								<AppTypography variant="body2" color="neutral.400">
									{job.type}
								</AppTypography>
							</TableCell>
							<TableCell>
								<Chip
									label={job.status}
									color={getStatusColor(job.status)}
									size="small"
									sx={{
										textTransform: "capitalize",
										fontWeight: "medium",
									}}
								/>
							</TableCell>
							<TableCell>
								<AppTypography variant="body2" color="neutral.400" fontFamily="monospace">
									{job.schedule.cron}
								</AppTypography>
								<AppTypography variant="caption" color="neutral.500" display="block">
									{job.schedule.timezone}
								</AppTypography>
							</TableCell>
							<TableCell>
								{job.schedule.lastRun ? (
									<AppTypography variant="body2" color="neutral.400">
										{formatDistanceToNow(parseISO(job.schedule.lastRun), { addSuffix: true })}
									</AppTypography>
								) : (
									<AppTypography variant="body2" color="neutral.500">
										Never
									</AppTypography>
								)}
							</TableCell>
							<TableCell>
								{job.schedule.nextRun ? (
									<AppTypography variant="body2" color="neutral.400">
										{formatDistanceToNow(parseISO(job.schedule.nextRun), { addSuffix: true })}
									</AppTypography>
								) : (
									<AppTypography variant="body2" color="neutral.500">
										Not scheduled
									</AppTypography>
								)}
							</TableCell>
						</StyledTableRow>
					))}
					{jobs.length === 0 && (
						<TableRow>
							<TableCell colSpan={6} align="center">
								<AppTypography variant="body2" color="neutral.500" sx={{ py: 4 }}>
									No scheduler jobs found
								</AppTypography>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
			{pagination && (
				<TablePagination
					component="div"
					count={pagination.total}
					page={currentPage}
					onPageChange={handlePageChange}
					rowsPerPage={pagination.limit}
					onRowsPerPageChange={handleRowsPerPageChange}
					rowsPerPageOptions={[5, 10, 25, 50]}
					sx={{
						backgroundColor: "black.800",
						borderTop: "1px solid",
						borderColor: "neutral.700",
						color: "neutral.400",
						"& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
							color: "neutral.400",
						},
						"& .MuiTablePagination-select": {
							color: "neutral.200",
						},
						"& .MuiIconButton-root": {
							color: "neutral.400",
							"&:hover": {
								backgroundColor: "neutral.800",
							},
							"&.Mui-disabled": {
								color: "neutral.600",
							},
						},
					}}
				/>
			)}
		</StyledTableContainer>
	);
};

const LoadingContainer = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	padding: theme.spacing(6),
	backgroundColor: theme.palette.black[800],
	borderRadius: theme.shape.borderRadius,
	border: `1px solid ${theme.palette.neutral[700]}`,
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
	backgroundColor: theme.palette.black[800],
	border: `1px solid ${theme.palette.neutral[700]}`,
	borderRadius: theme.shape.borderRadius,
	"& .MuiTable-root": {
		minWidth: 650,
	},
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
	"& .MuiTableCell-root": {
		backgroundColor: theme.palette.black[800],
		borderBottom: `1px solid ${theme.palette.neutral[700]}`,
		padding: theme.spacing(2),
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:hover": {
		backgroundColor: theme.palette.neutral[900],
	},
	"& .MuiTableCell-root": {
		borderBottom: `1px solid ${theme.palette.neutral[800]}`,
		padding: theme.spacing(2),
		color: theme.palette.neutral[300],
	},
	"&:last-child .MuiTableCell-root": {
		borderBottom: 0,
	},
}));

export default SchedulerJobsList;
