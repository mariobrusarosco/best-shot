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
import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
	CronJobFormModal,
	type CronFormMode,
	type ICronJobFormValues,
} from "@/domains/admin/components/cron/cron-job-form-modal";
import {
	type ICreateCronJobInput,
	type ICreateCronJobVersionInput,
	type CronSchedule,
	type CronStatus,
	type IAdminCronJob,
	useAdminCreateCronJob,
	useAdminCreateCronJobVersion,
	useAdminCronJobs,
	useAdminRunCronJob,
	useAdminToggleCronJobStatus,
} from "@/domains/admin/hooks/use-admin-cron";
import { AppError } from "@/domains/global/components/error";
import { ScreenHeading, ScreenHeadingSkeleton } from "@/domains/global/components/screen-heading";
import { AppIcon, AppTypography } from "@/domains/ui-system/components";
import { AppButton } from "@/domains/ui-system/components/app-button/app-button";
import { useNotification } from "@/domains/ui-system/components/notification/notification-context";
import { AuthenticatedScreenLayout } from "@/domains/ui-system/layout/authenticated";

const PAGE_SIZE = 10;

const STATUS_OPTIONS: Array<{ value: "all" | CronStatus; label: string }> = [
	{ value: "active", label: "active" },
	{ value: "paused", label: "paused" },
	{ value: "retired", label: "retired" },
	{ value: "all", label: "all" },
];

const SCHEDULE_OPTIONS: Array<{ value: "all" | CronSchedule; label: string }> = [
	{ value: "recurring", label: "recurring" },
	{ value: "one_time", label: "one_time" },
	{ value: "all", label: "all" },
];

const getStatusColor = (status: CronStatus): "success" | "warning" | "error" | "info" | "default" => {
	switch (status) {
		case "active":
			return "success";
		case "paused":
			return "warning";
		case "retired":
			return "error";
		default:
			return "default";
	}
};

const formatSchedule = (job: IAdminCronJob) => {
	if (job.schedule === "recurring") {
		return job.cronOrRunAt;
	}

	const parsedDate = new Date(job.cronOrRunAt);
	if (Number.isNaN(parsedDate.getTime())) {
		return job.cronOrRunAt;
	}

	return parsedDate.toLocaleString();
};

const getErrorMessage = (error: unknown, fallback: string) => {
	return error instanceof Error ? error.message : fallback;
};

const toDateTimeLocalValue = (value: string) => {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return "";
	}

	const pad = (num: number) => num.toString().padStart(2, "0");
	const year = date.getFullYear();
	const month = pad(date.getMonth() + 1);
	const day = pad(date.getDate());
	const hour = pad(date.getHours());
	const minutes = pad(date.getMinutes());

	return `${year}-${month}-${day}T${hour}:${minutes}`;
};

const CronJobsPage = () => {
	const { data: jobs = [], isLoading, error, isFetching } = useAdminCronJobs();
	const createCronJob = useAdminCreateCronJob();
	const createCronJobVersion = useAdminCreateCronJobVersion();
	const runCronJob = useAdminRunCronJob();
	const toggleCronJobStatus = useAdminToggleCronJobStatus();
	const { showNotification } = useNotification();

	const [statusFilter, setStatusFilter] = useState<"all" | CronStatus>("active");
	const [scheduleFilter, setScheduleFilter] = useState<"all" | CronSchedule>("recurring");
	const [targetFilter, setTargetFilter] = useState("");
	const [searchInput, setSearchInput] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [page, setPage] = useState(1);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [formMode, setFormMode] = useState<CronFormMode>("create");
	const [isSavingForm, setIsSavingForm] = useState(false);
	const [formInitialValues, setFormInitialValues] = useState<Partial<ICronJobFormValues>>({});
	const [selectedVersionJobId, setSelectedVersionJobId] = useState<string | null>(null);

	const filteredJobs = useMemo(() => {
		const normalizedTarget = targetFilter.trim().toLowerCase();
		const normalizedSearch = searchQuery.trim().toLowerCase();

		return jobs.filter((job) => {
			if (statusFilter !== "all" && job.status !== statusFilter) {
				return false;
			}

			if (scheduleFilter !== "all" && job.schedule !== scheduleFilter) {
				return false;
			}

			if (normalizedTarget && !job.target.toLowerCase().includes(normalizedTarget)) {
				return false;
			}

			if (!normalizedSearch) {
				return true;
			}

			const searchTarget = `${job.jobKey} ${job.target}`.toLowerCase();
			return searchTarget.includes(normalizedSearch);
		});
	}, [jobs, scheduleFilter, searchQuery, statusFilter, targetFilter]);

	const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const pageStartIndex = (currentPage - 1) * PAGE_SIZE;
	const paginatedJobs = filteredJobs.slice(pageStartIndex, pageStartIndex + PAGE_SIZE);

	const handleSearch = () => {
		setSearchQuery(searchInput);
		setPage(1);
	};

	const handleRunNow = async (job: IAdminCronJob) => {
		try {
			await runCronJob.mutateAsync(job.id);
			showNotification(`Job triggered: ${job.jobKey}`, "success");
		} catch (mutationError) {
			showNotification(
				`Failed to trigger ${job.jobKey}: ${getErrorMessage(mutationError, "Unknown error")}`,
				"error"
			);
		}
	};

	const handleToggleStatus = async (job: IAdminCronJob) => {
		if (job.status === "retired") {
			showNotification("Retired jobs cannot be resumed or paused", "warning");
			return;
		}

		try {
			await toggleCronJobStatus.mutateAsync({ jobId: job.id, currentStatus: job.status });
			const actionLabel = job.status === "active" ? "paused" : "resumed";
			showNotification(`Job ${actionLabel}: ${job.jobKey}`, "success");
		} catch (mutationError) {
			showNotification(
				`Failed to update ${job.jobKey}: ${getErrorMessage(mutationError, "Unknown error")}`,
				"error"
			);
		}
	};

	const handleNewVersion = (job: IAdminCronJob) => {
		setFormMode("new-version");
		setSelectedVersionJobId(job.id);
		setFormInitialValues({
			jobKey: job.jobKey,
			scheduleType: job.schedule,
			cronExpression: job.schedule === "recurring" ? job.raw.cronExpression || "" : "",
			runAt: job.schedule === "one_time" ? toDateTimeLocalValue(job.raw.runAt || "") : "",
			timezone: job.raw.timezone || "UTC",
			target: job.target,
			payloadJson: JSON.stringify(job.raw.payload || { mode: "full" }),
		});
		setIsFormOpen(true);
	};

	const handleOpenCreateForm = () => {
		setFormMode("create");
		setSelectedVersionJobId(null);
		setFormInitialValues({
			jobKey: "",
			scheduleType: "recurring",
			cronExpression: "",
			runAt: "",
			timezone: "UTC",
			target: "",
			payloadJson: '{"mode":"full"}',
		});
		setIsFormOpen(true);
	};

	const handleSaveForm = async (values: ICronJobFormValues) => {
		setIsSavingForm(true);

		try {
			const payload = JSON.parse(values.payloadJson) as Record<string, unknown>;
			const normalizedScheduleData = {
				target: values.target.trim(),
				payload,
				scheduleType: values.scheduleType,
				cronExpression:
					values.scheduleType === "recurring" ? values.cronExpression.trim() || null : null,
				runAt:
					values.scheduleType === "one_time" && values.runAt
						? new Date(values.runAt).toISOString()
						: null,
				timezone: values.timezone.trim() || "UTC",
			};

			if (formMode === "create") {
				const createPayload: ICreateCronJobInput = {
					jobKey: values.jobKey.trim(),
					...normalizedScheduleData,
				};
				await createCronJob.mutateAsync(createPayload);
				showNotification(`Cron job created: ${values.jobKey}`, "success");
			} else {
				if (!selectedVersionJobId) {
					throw new Error("Missing base job id for new version");
				}

				const versionPayload: ICreateCronJobVersionInput = {
					...normalizedScheduleData,
				};

				await createCronJobVersion.mutateAsync({
					jobId: selectedVersionJobId,
					data: versionPayload,
				});
				showNotification(`New version created for ${values.jobKey}`, "success");
			}

			setIsFormOpen(false);
		} catch (saveError) {
			showNotification(getErrorMessage(saveError, "Failed to save cron job form"), "error");
		} finally {
			setIsSavingForm(false);
		}
	};

	if (isLoading) {
		return <ScreenHeadingSkeleton />;
	}

	if (error) {
		return <AppError error={error} />;
	}

	return (
		<AuthenticatedScreenLayout data-ui="admin-cron-jobs-page" overflow="hidden">
			<ScreenHeading title="cron jobs">
				<AppButton
					variant="contained"
					startIcon={<AppIcon name="Plus" size="small" />}
					onClick={handleOpenCreateForm}
					sx={{
						backgroundColor: "teal.500",
						"&:hover": { backgroundColor: "teal.600" },
					}}
				>
					New Job
				</AppButton>
			</ScreenHeading>

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
							value={statusFilter}
							onChange={(event) => {
								setStatusFilter(event.target.value as "all" | CronStatus);
								setPage(1);
							}}
						>
							{STATUS_OPTIONS.map((option) => (
								<MenuItem key={option.value} value={option.value}>
									{option.label}
								</MenuItem>
							))}
						</FilterField>

						<FilterField
							select
							label="schedule"
							size="small"
							value={scheduleFilter}
							onChange={(event) => {
								setScheduleFilter(event.target.value as "all" | CronSchedule);
								setPage(1);
							}}
						>
							{SCHEDULE_OPTIONS.map((option) => (
								<MenuItem key={option.value} value={option.value}>
									{option.label}
								</MenuItem>
							))}
						</FilterField>

						<FilterField
							label="target"
							size="small"
							value={targetFilter}
							placeholder="rounds.sync"
							onChange={(event) => {
								setTargetFilter(event.target.value);
								setPage(1);
							}}
						/>

						<FilterField
							label="search"
							size="small"
							value={searchInput}
							placeholder="job key or target"
							onChange={(event) => setSearchInput(event.target.value)}
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
								<HeadCell>job_key</HeadCell>
								<HeadCell align="center">v</HeadCell>
								<HeadCell>status</HeadCell>
								<HeadCell>schedule</HeadCell>
								<HeadCell>cron/run_at</HeadCell>
								<HeadCell>target</HeadCell>
								<HeadCell>actions</HeadCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{paginatedJobs.map((job) => (
								<BodyRow key={job.id}>
									<BodyCell>
										<AppTypography variant="body2" color="neutral.100" fontWeight="medium">
											{job.jobKey}
										</AppTypography>
									</BodyCell>
									<BodyCell align="center">{job.versions}</BodyCell>
									<BodyCell>
										<Chip
											size="small"
											label={job.status}
											color={getStatusColor(job.status)}
											variant="outlined"
										/>
									</BodyCell>
									<BodyCell>{job.schedule}</BodyCell>
									<BodyCell sx={{ fontFamily: "monospace" }}>{formatSchedule(job)}</BodyCell>
									<BodyCell>{job.target}</BodyCell>
									<BodyCell>
										<ActionsContainer>
											<Link
												to="/admin/cron/jobs/$jobId"
												params={{ jobId: job.id }}
												style={{ textDecoration: "none" }}
											>
												<AppButton variant="text" size="small" component="span">
													View
												</AppButton>
											</Link>
											<AppButton
												variant="text"
												size="small"
												onClick={() => void handleRunNow(job)}
												disabled={job.status === "retired" || runCronJob.isPending}
											>
												Run now
											</AppButton>
											<AppButton
												variant="text"
												size="small"
												onClick={() => void handleToggleStatus(job)}
												disabled={job.status === "retired" || toggleCronJobStatus.isPending}
											>
												{job.status === "active" ? "Pause" : "Resume"}
											</AppButton>
											<AppButton
												variant="text"
												size="small"
												onClick={() => handleNewVersion(job)}
											>
												New version
											</AppButton>
										</ActionsContainer>
									</BodyCell>
								</BodyRow>
							))}
						</TableBody>
					</Table>

					{!paginatedJobs.length && (
						<EmptyState>
							<AppTypography variant="h6" color="neutral.300">
								No cron jobs found
							</AppTypography>
							<AppTypography variant="body2" color="neutral.400">
								Adjust filters or search terms to find jobs.
							</AppTypography>
						</EmptyState>
					)}
				</TableWrapper>

				<PaginationBar>
					<AppButton
						variant="outlined"
						size="small"
						startIcon={<AppIcon name="ChevronLeft" size="small" />}
						onClick={() => setPage((current) => Math.max(1, current - 1))}
						disabled={currentPage <= 1}
					>
						Prev
					</AppButton>

					<AppTypography variant="body2" color="neutral.300">
						Page {currentPage} of {totalPages}
						{isFetching ? " • refreshing..." : ""}
					</AppTypography>

					<AppButton
						variant="outlined"
						size="small"
						endIcon={<AppIcon name="ChevronRight" size="small" />}
						onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
						disabled={currentPage >= totalPages}
					>
						Next
					</AppButton>
				</PaginationBar>
			</Container>

			<CronJobFormModal
				open={isFormOpen}
				mode={formMode}
				initialValues={formInitialValues}
				isSaving={isSavingForm}
				onCancel={() => setIsFormOpen(false)}
				onSave={handleSaveForm}
			/>
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
		gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
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
	"& .MuiInputLabel-root": {
		color: theme.palette.neutral[400],
	},
	"& .MuiSelect-icon": {
		color: theme.palette.neutral[300],
	},
}));

const SearchButtonContainer = styled(Box)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	[theme.breakpoints.up("desktop")]: {
		justifyContent: "stretch",
		"& > button": {
			width: "100%",
		},
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
	"&:hover": {
		backgroundColor: `${theme.palette.black[700]}70`,
	},
}));

const BodyCell = styled(TableCell)(({ theme }) => ({
	borderBottom: `1px solid ${theme.palette.neutral[800]}`,
	color: theme.palette.neutral[200],
	verticalAlign: "top",
}));

const ActionsContainer = styled(Box)(({ theme }) => ({
	display: "flex",
	flexWrap: "wrap",
	gap: theme.spacing(0.5),
}));

const EmptyState = styled(Box)(({ theme }) => ({
	padding: theme.spacing(5),
	textAlign: "center",
	display: "grid",
	gap: theme.spacing(1),
}));

const PaginationBar = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.black[800],
	border: `1px solid ${theme.palette.neutral[700]}`,
	borderRadius: theme.shape.borderRadius,
	padding: theme.spacing(1.5, 2),
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	gap: theme.spacing(1),
}));

export default CronJobsPage;
