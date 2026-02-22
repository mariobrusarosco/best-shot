import {
	Box,
	Chip,
	styled,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
	CronJobFormModal,
	type ICronJobFormValues,
} from "@/domains/admin/components/cron/cron-job-form-modal";
import {
	type CronRunStatus,
	type ICreateCronJobVersionInput,
	useAdminCreateCronJobVersion,
	useAdminCronJob,
	useAdminCronJobRuns,
	useAdminRunCronJob,
	useAdminToggleCronJobStatus,
} from "@/domains/admin/hooks/use-admin-cron";
import { AppError } from "@/domains/global/components/error";
import { ScreenHeading, ScreenHeadingSkeleton } from "@/domains/global/components/screen-heading";
import { AppIcon, AppTypography } from "@/domains/ui-system/components";
import { AppButton } from "@/domains/ui-system/components/app-button/app-button";
import { useNotification } from "@/domains/ui-system/components/notification/notification-context";
import { AuthenticatedScreenLayout } from "@/domains/ui-system/layout/authenticated";

interface CronJobDetailPageProps {
	jobId: string;
	onBackToList: () => void;
}

const formatDateTime = (dateString?: string | null) => {
	if (!dateString) return "N/A";
	const date = new Date(dateString);
	if (Number.isNaN(date.getTime())) return dateString;

	return date.toLocaleString();
};

const shortId = (value: string) => {
	if (value.length <= 10) return value;
	return `${value.slice(0, 10)}...`;
};

const getRunStatusColor = (
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

const CronJobDetailPage = ({ jobId, onBackToList }: CronJobDetailPageProps) => {
	const navigate = useNavigate();
	const { data: job, isLoading, error } = useAdminCronJob(jobId);
	const {
		data: runs = [],
		isLoading: areRunsLoading,
		error: runsError,
	} = useAdminCronJobRuns(jobId, 10);
	const createCronJobVersion = useAdminCreateCronJobVersion();
	const runCronJob = useAdminRunCronJob();
	const toggleCronJobStatus = useAdminToggleCronJobStatus();
	const { showNotification } = useNotification();
	const [isVersionFormOpen, setIsVersionFormOpen] = useState(false);
	const [isSavingVersionForm, setIsSavingVersionForm] = useState(false);

	const payload = useMemo(() => {
		if (!job) return null;

		return job.raw.payload;
	}, [job]);

	const handleRunNow = async () => {
		if (!job) return;

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

	const handleToggleStatus = async () => {
		if (!job) return;
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

	const handleCreateNewVersion = () => {
		setIsVersionFormOpen(true);
	};

	const handleSaveNewVersion = async (values: ICronJobFormValues) => {
		setIsSavingVersionForm(true);

		try {
			if (!job) {
				throw new Error("Cron job not found");
			}

			const payloadJson = JSON.parse(values.payloadJson) as Record<string, unknown>;
			const newVersionPayload: ICreateCronJobVersionInput = {
				target: values.target.trim(),
				payload: payloadJson,
				scheduleType: values.scheduleType,
				cronExpression:
					values.scheduleType === "recurring" ? values.cronExpression.trim() || null : null,
				runAt:
					values.scheduleType === "one_time" && values.runAt
						? new Date(values.runAt).toISOString()
						: null,
				timezone: values.timezone.trim() || "UTC",
			};

			await createCronJobVersion.mutateAsync({
				jobId: job.id,
				data: newVersionPayload,
			});
			showNotification(`New version created for ${values.jobKey}`, "success");
			setIsVersionFormOpen(false);
		} catch (saveError) {
			showNotification(getErrorMessage(saveError, "Failed to save new version"), "error");
		} finally {
			setIsSavingVersionForm(false);
		}
	};

	if (isLoading) {
		return <ScreenHeadingSkeleton />;
	}

	if (error) {
		return <AppError error={error} />;
	}

	if (!job) {
		return <AppError error={new Error("Cron job not found")} />;
	}

	return (
		<AuthenticatedScreenLayout data-ui="admin-cron-job-detail-page" overflow="hidden">
			<ScreenHeading title={`Job Detail: ${job.jobKey} (v${job.versions})`}>
				<AppButton
					variant="outlined"
					onClick={onBackToList}
					startIcon={<AppIcon name="ChevronLeft" size="small" />}
				>
					Back to list
				</AppButton>
			</ScreenHeading>

			<Container>
				<DetailCard>
					<DetailGrid>
						<DetailItem>
							<LabelText>Status</LabelText>
							<ValueText>{job.status}</ValueText>
						</DetailItem>
						<DetailItem>
							<LabelText>Schedule</LabelText>
							<ValueText>{job.schedule}</ValueText>
						</DetailItem>
						<DetailItem>
							<LabelText>Created</LabelText>
							<ValueText>{formatDateTime(job.raw.createdAt)}</ValueText>
						</DetailItem>
						<DetailItem>
							<LabelText>Cron</LabelText>
							<ValueText>{job.raw.cronExpression || "N/A"}</ValueText>
						</DetailItem>
						<DetailItem>
							<LabelText>Timezone</LabelText>
							<ValueText>{job.raw.timezone || "UTC"}</ValueText>
						</DetailItem>
						<DetailItem>
							<LabelText>Target</LabelText>
							<ValueText>{job.target}</ValueText>
						</DetailItem>
					</DetailGrid>

					<PayloadContainer>
						<LabelText>Payload</LabelText>
						<PayloadText>{JSON.stringify(payload)}</PayloadText>
					</PayloadContainer>
				</DetailCard>

				<ActionsBar>
					<AppButton
						variant="contained"
						onClick={() => void handleRunNow()}
						disabled={job.status === "retired" || runCronJob.isPending}
					>
						Run now
					</AppButton>
					<AppButton
						variant="outlined"
						onClick={() => void handleToggleStatus()}
						disabled={job.status === "retired" || toggleCronJobStatus.isPending}
					>
						{job.status === "retired" ? "Retired" : job.status === "active" ? "Pause" : "Resume"}
					</AppButton>
					<AppButton variant="outlined" onClick={handleCreateNewVersion}>
						Create new version
					</AppButton>
				</ActionsBar>

				<RunsCard>
					<AppTypography variant="h6" color="neutral.100">
						Last Runs (latest 10)
					</AppTypography>

					{runsError ? (
						<Box sx={{ p: 2 }}>
							<AppTypography variant="body2" color="error.main">
								Failed to load runs: {getErrorMessage(runsError, "Unknown error")}
							</AppTypography>
						</Box>
					) : (
						<TableContainer>
							<Table>
								<TableHead>
									<TableRow>
										<HeadCell>run_id</HeadCell>
										<HeadCell>status</HeadCell>
										<HeadCell>started_at</HeadCell>
										<HeadCell>finished_at</HeadCell>
										<HeadCell>trigger</HeadCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{runs.map((run) => (
										<BodyRow
											key={run.runId}
											onClick={() => navigate({ to: `/admin/cron/runs/${run.runId}` })}
											sx={{ cursor: "pointer" }}
										>
											<BodyCell sx={{ fontFamily: "monospace" }}>{shortId(run.runId)}</BodyCell>
											<BodyCell>
												<Chip
													size="small"
													label={run.status}
													color={getRunStatusColor(run.status)}
													variant="outlined"
												/>
											</BodyCell>
											<BodyCell>{formatDateTime(run.startedAt)}</BodyCell>
											<BodyCell>{formatDateTime(run.finishedAt)}</BodyCell>
											<BodyCell>{run.trigger}</BodyCell>
										</BodyRow>
									))}
									{!runs.length && !areRunsLoading && (
										<BodyRow>
											<BodyCell colSpan={5}>
												<AppTypography variant="body2" color="neutral.400">
													No runs found for this job.
												</AppTypography>
											</BodyCell>
										</BodyRow>
									)}
								</TableBody>
							</Table>
						</TableContainer>
					)}
				</RunsCard>
			</Container>

			<CronJobFormModal
				open={isVersionFormOpen}
				mode="new-version"
				initialValues={{
					jobKey: job.jobKey,
					scheduleType: job.schedule,
					cronExpression: job.schedule === "recurring" ? job.raw.cronExpression || "" : "",
					runAt: job.schedule === "one_time" ? toDateTimeLocalValue(job.raw.runAt || "") : "",
					timezone: job.raw.timezone || "UTC",
					target: job.target,
					payloadJson: JSON.stringify(job.raw.payload || { mode: "full" }),
				}}
				isSaving={isSavingVersionForm}
				onCancel={() => setIsVersionFormOpen(false)}
				onSave={handleSaveNewVersion}
			/>
		</AuthenticatedScreenLayout>
	);
};

const Container = styled(Box)(({ theme }) => ({
	padding: theme.spacing(3),
	display: "grid",
	gap: theme.spacing(2),
}));

const DetailCard = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.black[800],
	border: `1px solid ${theme.palette.neutral[700]}`,
	borderRadius: theme.shape.borderRadius,
	padding: theme.spacing(2),
	display: "grid",
	gap: theme.spacing(2),
}));

const DetailGrid = styled(Box)(({ theme }) => ({
	display: "grid",
	gridTemplateColumns: "1fr",
	gap: theme.spacing(1.5),
	[theme.breakpoints.up("tablet")]: {
		gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
	},
}));

const DetailItem = styled(Box)(({ theme }) => ({
	display: "grid",
	gap: theme.spacing(0.5),
}));

const LabelText = styled(AppTypography)(({ theme }) => ({
	color: theme.palette.neutral[400],
	fontSize: "0.8rem",
	textTransform: "uppercase",
	letterSpacing: "0.05em",
}));

const ValueText = styled(AppTypography)(({ theme }) => ({
	color: theme.palette.neutral[100],
	fontWeight: 500,
}));

const PayloadContainer = styled(Box)(({ theme }) => ({
	display: "grid",
	gap: theme.spacing(0.5),
}));

const PayloadText = styled(AppTypography)(({ theme }) => ({
	color: theme.palette.neutral[200],
	fontFamily: "monospace",
	backgroundColor: theme.palette.black[700],
	border: `1px solid ${theme.palette.neutral[700]}`,
	borderRadius: theme.shape.borderRadius,
	padding: theme.spacing(1.25),
	wordBreak: "break-all",
}));

const ActionsBar = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.black[800],
	border: `1px solid ${theme.palette.neutral[700]}`,
	borderRadius: theme.shape.borderRadius,
	padding: theme.spacing(1.5),
	display: "flex",
	flexWrap: "wrap",
	gap: theme.spacing(1),
}));

const RunsCard = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.black[800],
	border: `1px solid ${theme.palette.neutral[700]}`,
	borderRadius: theme.shape.borderRadius,
	padding: theme.spacing(2),
	display: "grid",
	gap: theme.spacing(1.5),
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
}));

export default CronJobDetailPage;
