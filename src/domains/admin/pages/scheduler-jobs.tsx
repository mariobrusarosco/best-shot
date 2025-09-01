import { Box, styled, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { AppError } from "@/domains/global/components/error";
import { AppTypography } from "@/domains/ui-system/components";
import { ScheduleJobForm } from "../components/schedule-job-form/schedule-job-form";
import SchedulerJobsList from "../components/schedule-jobs/scheduler-jobs-list";
import { useAdminSchedulerJobs } from "../hooks/use-admin-scheduler-jobs";

type TabValue = "all" | "active" | "failed";

const SchedulerJobsPage = () => {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [activeTab, setActiveTab] = useState<TabValue>("all");

	// Use single hook with status filtering
	const status = activeTab === "all" ? undefined : activeTab;
	const jobsQuery = useAdminSchedulerJobs({
		page,
		limit: rowsPerPage,
		status,
	});

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	const handleRowsPerPageChange = (newRowsPerPage: number) => {
		setRowsPerPage(newRowsPerPage);
		setPage(0); // Reset to first page when changing page size
	};

	const handleTabChange = (_: React.SyntheticEvent, newValue: TabValue) => {
		setActiveTab(newValue);
		setPage(0); // Reset pagination when switching tabs
	};

	const jobs = jobsQuery.data?.data || [];
	const pagination = jobsQuery.data?.pagination;

	if (jobsQuery.error) {
		return (
			<Box>
				<AppError error={jobsQuery.error} />
			</Box>
		);
	}

	return (
		<Container>
			<Header>
				<Box>
					<AppTypography variant="h5" textTransform="lowercase" color="neutral.100">
						Scheduler Jobs
					</AppTypography>
					{pagination && (
						<AppTypography variant="body2" color="neutral.400" sx={{ mt: 0.5 }}>
							{pagination.total} total jobs • Page {page + 1} of{" "}
							{Math.ceil(pagination.total / rowsPerPage)}
							{jobsQuery.isPlaceholderData && " • Loading..."}
						</AppTypography>
					)}
					{!pagination && jobs.length > 0 && (
						<AppTypography variant="body2" color="neutral.400" sx={{ mt: 0.5 }}>
							{jobs.length} {activeTab} jobs
						</AppTypography>
					)}
				</Box>
			</Header>

			<ScheduleJobForm />

			<FilterTabs>
				<Tabs
					value={activeTab}
					onChange={handleTabChange}
					sx={{
						"& .MuiTabs-indicator": {
							backgroundColor: "teal.500",
						},
						"& .MuiTab-root": {
							color: "neutral.400",
							textTransform: "none",
							minWidth: "auto",
							"&.Mui-selected": {
								color: "teal.500",
							},
							"&:hover": {
								color: "neutral.200",
							},
						},
					}}
				>
					<Tab label="All Jobs" value="all" />
					<Tab label="Active" value="active" />
					<Tab label="Failed" value="failed" />
				</Tabs>
			</FilterTabs>

			<SchedulerJobsList
				jobs={jobs}
				isLoading={jobsQuery.isLoading && !jobsQuery.isPlaceholderData}
				pagination={pagination}
				onPageChange={handlePageChange}
				onRowsPerPageChange={handleRowsPerPageChange}
			/>
		</Container>
	);
};

const Container = styled(Box)(({ theme }) => ({
	padding: theme.spacing(3),
}));

const Header = styled(Box)(({ theme }) => ({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	marginBottom: theme.spacing(2),
	padding: theme.spacing(2),
	backgroundColor: theme.palette.black[800],
	borderRadius: theme.shape.borderRadius,
	border: `1px solid ${theme.palette.neutral[700]}`,
}));

const FilterTabs = styled(Box)(({ theme }) => ({
	marginBottom: theme.spacing(2),
	padding: theme.spacing(1, 2),
	backgroundColor: theme.palette.black[800],
	borderRadius: theme.shape.borderRadius,
	border: `1px solid ${theme.palette.neutral[700]}`,
}));

export default SchedulerJobsPage;
