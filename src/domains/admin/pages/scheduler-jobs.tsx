import { Box, styled, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { AppError } from "@/domains/global/components/error";
import { AppTypography } from "@/domains/ui-system/components";
import SchedulerJobsList from "../components/schedule-jobs/scheduler-jobs-list";
import {
	useActiveSchedulerJobs,
	useAdminSchedulerJobs,
	useFailedSchedulerJobs,
} from "../hooks/use-admin-scheduler-jobs";

type TabValue = "all" | "active" | "failed";

const SchedulerJobsPage = () => {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [activeTab, setActiveTab] = useState<TabValue>("all");

	// Use different hooks based on active tab
	const allJobsQuery = useAdminSchedulerJobs({
		page,
		limit: rowsPerPage,
	});

	const activeJobsQuery = useActiveSchedulerJobs();
	const failedJobsQuery = useFailedSchedulerJobs();

	// Select the appropriate query based on active tab
	const currentQuery =
		activeTab === "active"
			? activeJobsQuery
			: activeTab === "failed"
				? failedJobsQuery
				: allJobsQuery;

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

	// Get data based on the active tab
	const getData = () => {
		if (activeTab === "active") {
			return {
				jobs: activeJobsQuery.data || [],
				pagination: undefined, // Active and failed endpoints don't return pagination
			};
		}
		if (activeTab === "failed") {
			return {
				jobs: failedJobsQuery.data || [],
				pagination: undefined,
			};
		}
		return {
			jobs: allJobsQuery.data?.data || [],
			pagination: allJobsQuery.data?.pagination,
		};
	};

	const { jobs, pagination } = getData();

	if (currentQuery.error) {
		return (
			<Box>
				<AppError error={currentQuery.error} />
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
							{allJobsQuery.isPlaceholderData && " • Loading..."}
						</AppTypography>
					)}
					{!pagination && jobs.length > 0 && (
						<AppTypography variant="body2" color="neutral.400" sx={{ mt: 0.5 }}>
							{jobs.length} {activeTab} jobs
						</AppTypography>
					)}
				</Box>
			</Header>

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
				isLoading={currentQuery.isLoading && !allJobsQuery.isPlaceholderData}
				pagination={pagination}
				onPageChange={activeTab === "all" ? handlePageChange : undefined}
				onRowsPerPageChange={activeTab === "all" ? handleRowsPerPageChange : undefined}
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
