import { AppError } from "@/domains/global/components/error";
import ExecutionJobsList from "../components/execution-jobs/list/list";
import { useAdminExecutionJobs } from "../hooks/use-admin-execution-jobs";
import { Box, styled } from "@mui/material";
import { AppTypography } from "@/domains/ui-system/components";

const ExecutionJobsPage = () => {
	const { data, isLoading, error } = useAdminExecutionJobs();

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
			</Header>
			<ExecutionJobsList jobs={data || []} isLoading={isLoading} />
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
