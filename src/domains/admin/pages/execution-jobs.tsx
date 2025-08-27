import { useState } from "react";
import { AppError } from "@/domains/global/components/error";
import ExecutionJobsList from "../components/execution-jobs/list/list";
import { useAdminExecutionJobs } from "../hooks/use-admin-execution-jobs";
import { Box, styled } from "@mui/material";
import { AppTypography } from "@/domains/ui-system/components";

const ExecutionJobsPage = () => {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const { data, isLoading, error, isPlaceholderData } = useAdminExecutionJobs({
		page,
		limit: rowsPerPage,
	});

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	const handleRowsPerPageChange = (newRowsPerPage: number) => {
		setRowsPerPage(newRowsPerPage);
		setPage(0); // Reset to first page when changing page size
	};

	if (error) {
		return (
			<Box>
				<AppError error={error} />
			</Box>
		);
	}

	return (
		<Container>
			<Header>
				<AppTypography variant="h5" textTransform="lowercase" color="neutral.100">
					Execution Jobs
				</AppTypography>
				{data?.pagination && (
					<AppTypography variant="body2" color="neutral.400" sx={{ mt: 0.5 }}>
						{data.pagination.total} total jobs • Page {page + 1} of{" "}
						{Math.ceil(data.pagination.total / rowsPerPage)}
						{isPlaceholderData && " • Loading..."}
					</AppTypography>
				)}
			</Header>
			<ExecutionJobsList
				jobs={data?.data || []}
				isLoading={isLoading && !isPlaceholderData}
				pagination={data?.pagination}
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
	marginBottom: theme.spacing(3),
	padding: theme.spacing(2),
	backgroundColor: theme.palette.black[800],
	borderRadius: theme.shape.borderRadius,
	border: `1px solid ${theme.palette.neutral[700]}`,
}));

export default ExecutionJobsPage;
