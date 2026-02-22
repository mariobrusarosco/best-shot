import {
	Box,
	Chip,
	MenuItem,
	styled,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
} from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
	type CronRunStatus,
	useAdminCronRuns,
} from "@/domains/admin/hooks/use-admin-cron";
import { AppError } from "@/domains/global/components/error";
import { ScreenHeading, ScreenHeadingSkeleton } from "@/domains/global/components/screen-heading";
import { AppTypography } from "@/domains/ui-system/components";
import { AppButton } from "@/domains/ui-system/components/app-button/app-button";
import { AuthenticatedScreenLayout } from "@/domains/ui-system/layout/authenticated";

const STATUS_OPTIONS: Array<{ value: "any" | CronRunStatus; label: string }> = [
	{ value: "any", label: "any" },
	{ value: "pending", label: "pending" },
	{ value: "running", label: "running" },
	{ value: "succeeded", label: "succeeded" },
	{ value: "failed", label: "failed" },
	{ value: "canceled", label: "canceled" },
	{ value: "skipped", label: "skipped" },
];

const getStatusColor = (
	status: CronRunStatus
): "success" | "warning" | "error" | "info" | "default" => {
	switch (status) {
		case "succeeded":
			return "success";
		case "failed":
			return "error";
		case "running":
			return "info";
		case "pending":
			return "warning";
		case "canceled":
		case "skipped":
			return "default";
		default:
			return "default";
	}
};

const formatScheduledTime = (dateValue: string) => {
	const parsedDate = new Date(dateValue);
	if (Number.isNaN(parsedDate.getTime())) {
		return dateValue;
	}

	return parsedDate.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	});
};

const formatDuration = (durationMs: number | null, status: CronRunStatus) => {
	if (durationMs !== null) {
		return `${(durationMs / 1000).toFixed(1)}s`;
	}

	if (status === "running") {
		return "running";
	}

	return "-";
};

const formatRunId = (runId: string) => {
	if (runId.length <= 14) return runId;
	return `${runId.slice(0, 14)}...`;
};

const CronRunsPage = () => {
	const navigate = useNavigate();
	const [statusInput, setStatusInput] = useState<"any" | CronRunStatus>("any");
	const [jobKeyInput, setJobKeyInput] = useState("");
	const [targetInput, setTargetInput] = useState("");
	const [filters, setFilters] = useState({
		status: "any" as "any" | CronRunStatus,
		jobKey: "",
		target: "",
	});

	const queryFilters = useMemo(
		() => ({
			status: filters.status === "any" ? undefined : filters.status,
			jobKey: filters.jobKey || undefined,
			target: filters.target || undefined,
			limit: 100,
			offset: 0,
		}),
		[filters]
	);

	const { data: runs = [], isLoading, error, isFetching } = useAdminCronRuns(queryFilters);

	const handleSearch = () => {
		setFilters({
			status: statusInput,
			jobKey: jobKeyInput.trim(),
			target: targetInput.trim(),
		});
	};

	if (isLoading) {
		return <ScreenHeadingSkeleton />;
	}

	if (error) {
		return <AppError error={error} />;
	}

	return (
		<AuthenticatedScreenLayout data-ui="admin-cron-runs-page" overflow="hidden">
			<ScreenHeading title="cron runs" />

			<Container>
				<FiltersContainer>
					<AppTypography variant="body2" color="neutral.300">
						Filters
					</AppTypography>

					<FiltersGrid>
						<FilterField
							select
							label="status"
							size="small"
							value={statusInput}
							onChange={(event) => setStatusInput(event.target.value as "any" | CronRunStatus)}
						>
							{STATUS_OPTIONS.map((option) => (
								<MenuItem key={option.value} value={option.value}>
									{option.label}
								</MenuItem>
							))}
						</FilterField>

						<FilterField
							label="job_key"
							size="small"
							value={jobKeyInput}
							placeholder="rounds_update"
							onChange={(event) => setJobKeyInput(event.target.value)}
							onKeyDown={(event) => {
								if (event.key === "Enter") {
									event.preventDefault();
									handleSearch();
								}
							}}
						/>

						<FilterField
							label="target"
							size="small"
							value={targetInput}
							placeholder="rounds.sync"
							onChange={(event) => setTargetInput(event.target.value)}
							onKeyDown={(event) => {
								if (event.key === "Enter") {
									event.preventDefault();
									handleSearch();
								}
							}}
						/>

						<SearchButtonContainer>
							<AppButton variant="outlined" onClick={handleSearch}>
								Search
							</AppButton>
						</SearchButtonContainer>
					</FiltersGrid>
				</FiltersContainer>

				<TableWrapper>
					<Table>
						<TableHead>
							<TableRow>
								<HeadCell>run_id</HeadCell>
								<HeadCell>job_key</HeadCell>
								<HeadCell align="center">v</HeadCell>
								<HeadCell>status</HeadCell>
								<HeadCell>trigger</HeadCell>
								<HeadCell>scheduled_at</HeadCell>
								<HeadCell>duration</HeadCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{runs.map((run) => (
								<BodyRow
									key={run.runId}
									onClick={() => navigate({ to: `/admin/cron/runs/${run.runId}` })}
								>
									<BodyCell sx={{ fontFamily: "monospace" }}>{formatRunId(run.runId)}</BodyCell>
									<BodyCell>{run.jobKey}</BodyCell>
									<BodyCell align="center">{run.jobVersion}</BodyCell>
									<BodyCell>
										<Chip
											size="small"
											label={run.status}
											color={getStatusColor(run.status)}
											variant="outlined"
										/>
									</BodyCell>
									<BodyCell>{run.trigger}</BodyCell>
									<BodyCell sx={{ fontFamily: "monospace" }}>
										{formatScheduledTime(run.scheduledAt)}
									</BodyCell>
									<BodyCell>{formatDuration(run.durationMs, run.status)}</BodyCell>
								</BodyRow>
							))}
							{!runs.length && (
								<BodyRow>
									<BodyCell colSpan={7}>
										<AppTypography variant="body2" color="neutral.400">
											No runs found for the selected filters.
										</AppTypography>
									</BodyCell>
								</BodyRow>
							)}
						</TableBody>
					</Table>
				</TableWrapper>

				{isFetching && (
					<AppTypography variant="body2" color="neutral.400">
						Refreshing runs...
					</AppTypography>
				)}
			</Container>
		</AuthenticatedScreenLayout>
	);
};

const Container = styled(Box)(({ theme }) => ({
	padding: theme.spacing(3),
	display: "grid",
	gap: theme.spacing(2),
}));

const FiltersContainer = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.black[800],
	border: `1px solid ${theme.palette.neutral[700]}`,
	borderRadius: theme.shape.borderRadius,
	padding: theme.spacing(2),
	display: "grid",
	gap: theme.spacing(1.5),
}));

const FiltersGrid = styled(Box)(({ theme }) => ({
	display: "grid",
	gridTemplateColumns: "1fr",
	gap: theme.spacing(1.5),
	[theme.breakpoints.up("tablet")]: {
		gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
	},
	[theme.breakpoints.up("desktop")]: {
		gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
	},
}));

const FilterField = styled(TextField)(({ theme }) => ({
	"& .MuiInputBase-root": {
		backgroundColor: theme.palette.black[700],
		color: theme.palette.neutral[100],
	},
	"& .MuiOutlinedInput-notchedOutline": {
		borderColor: theme.palette.neutral[700],
	},
	"& .MuiInputBase-input::placeholder": {
		color: theme.palette.neutral[500],
		opacity: 1,
	},
	"& .MuiInputLabel-root": {
		color: theme.palette.neutral[400],
	},
}));

const SearchButtonContainer = styled(Box)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	[theme.breakpoints.up("desktop")]: {
		justifyContent: "flex-end",
	},
}));

const TableWrapper = styled(TableContainer)(({ theme }) => ({
	backgroundColor: theme.palette.black[800],
	border: `1px solid ${theme.palette.neutral[700]}`,
	borderRadius: theme.shape.borderRadius,
}));

const HeadCell = styled(TableCell)(({ theme }) => ({
	backgroundColor: theme.palette.black[700],
	color: theme.palette.neutral[200],
	textTransform: "lowercase",
	fontWeight: 600,
	borderBottom: `1px solid ${theme.palette.neutral[700]}`,
}));

const BodyRow = styled(TableRow)(({ theme }) => ({
	cursor: "pointer",
	"&:hover": {
		backgroundColor: `${theme.palette.black[700]}70`,
	},
}));

const BodyCell = styled(TableCell)(({ theme }) => ({
	borderBottom: `1px solid ${theme.palette.neutral[800]}`,
	color: theme.palette.neutral[200],
}));

export default CronRunsPage;
