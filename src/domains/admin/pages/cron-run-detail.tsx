import { Box, Chip, styled } from "@mui/material";
import { type CronRunStatus, useAdminCronRun } from "@/domains/admin/hooks/use-admin-cron";
import { AppError } from "@/domains/global/components/error";
import { ScreenHeading, ScreenHeadingSkeleton } from "@/domains/global/components/screen-heading";
import { AppIcon, AppTypography } from "@/domains/ui-system/components";
import { AppButton } from "@/domains/ui-system/components/app-button/app-button";
import { AuthenticatedScreenLayout } from "@/domains/ui-system/layout/authenticated";

interface CronRunDetailPageProps {
	runId: string;
	onBackToRuns: () => void;
}

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

const formatDateTime = (dateValue?: string | null) => {
	if (!dateValue) return "N/A";
	const parsedDate = new Date(dateValue);
	if (Number.isNaN(parsedDate.getTime())) return dateValue;
	return parsedDate.toLocaleString();
};

const formatTime = (dateValue?: string | null) => {
	if (!dateValue) return "N/A";
	const parsedDate = new Date(dateValue);
	if (Number.isNaN(parsedDate.getTime())) return dateValue;

	return parsedDate.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	});
};

const formatDetails = (value: unknown) => {
	if (!value) return "N/A";
	return JSON.stringify(value);
};

const CronRunDetailPage = ({ runId, onBackToRuns }: CronRunDetailPageProps) => {
	const { data: run, isLoading, error } = useAdminCronRun(runId);

	if (isLoading) {
		return <ScreenHeadingSkeleton />;
	}

	if (error) {
		return <AppError error={error} />;
	}

	if (!run) {
		return <AppError error={new Error("Cron run not found")} />;
	}

	return (
		<AuthenticatedScreenLayout data-ui="admin-cron-run-detail-page" overflow="hidden">
			<ScreenHeading title={`Run Details: ${run.runId}`}>
				<AppButton
					variant="outlined"
					onClick={onBackToRuns}
					startIcon={<AppIcon name="ChevronLeft" size="small" />}
				>
					Back to runs
				</AppButton>
			</ScreenHeading>

			<Container>
				<DetailCard>
					<DetailGrid>
						<DetailItem>
							<LabelText>Job</LabelText>
							<ValueText>{`${run.jobKey} v${run.jobVersion}`}</ValueText>
						</DetailItem>
						<DetailItem>
							<LabelText>Target</LabelText>
							<ValueText>{run.target}</ValueText>
						</DetailItem>
						<DetailItem>
							<LabelText>Status</LabelText>
							<Chip
								size="small"
								label={run.status}
								color={getStatusColor(run.status)}
								variant="outlined"
							/>
						</DetailItem>
						<DetailItem>
							<LabelText>Trigger</LabelText>
							<ValueText>{run.trigger}</ValueText>
						</DetailItem>
						<DetailItem>
							<LabelText>Scheduled</LabelText>
							<ValueText>{formatDateTime(run.scheduledAt)}</ValueText>
						</DetailItem>
						<DetailItem>
							<LabelText>Started</LabelText>
							<ValueText>{formatTime(run.startedAt)}</ValueText>
						</DetailItem>
						<DetailItem>
							<LabelText>Finished</LabelText>
							<ValueText>{formatTime(run.finishedAt)}</ValueText>
						</DetailItem>
					</DetailGrid>
				</DetailCard>

				<FailureCard>
					<FailureItem>
						<LabelText>Failure code</LabelText>
						<ValueText>{run.raw.failureCode || "N/A"}</ValueText>
					</FailureItem>
					<FailureItem>
						<LabelText>Failure reason</LabelText>
						<ValueText>{run.raw.failureMessage || "N/A"}</ValueText>
					</FailureItem>
					<FailureItem>
						<LabelText>Details (json)</LabelText>
						<JsonValueText>{formatDetails(run.raw.failureDetails)}</JsonValueText>
					</FailureItem>
				</FailureCard>
			</Container>
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

const FailureCard = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.black[800],
	border: `1px solid ${theme.palette.neutral[700]}`,
	borderRadius: theme.shape.borderRadius,
	padding: theme.spacing(2),
	display: "grid",
	gap: theme.spacing(1.5),
}));

const FailureItem = styled(Box)(({ theme }) => ({
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

const JsonValueText = styled(AppTypography)(({ theme }) => ({
	color: theme.palette.neutral[200],
	fontFamily: "monospace",
	backgroundColor: theme.palette.black[700],
	border: `1px solid ${theme.palette.neutral[700]}`,
	borderRadius: theme.shape.borderRadius,
	padding: theme.spacing(1.25),
	wordBreak: "break-all",
}));

export default CronRunDetailPage;
