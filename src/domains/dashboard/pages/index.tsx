import { ScreenHeading } from "@/domains/global/components/screen-heading";
import { Box } from "@mui/system";

const DashboardPage = () => {
	return (
		<Box data-ui="dashboard-screen">
			<ScreenHeading
				title="Hello, Mario"
				sx={{
					backgroundColor: "black.800",
				}}
			/>
		</Box>
	);
};

export { DashboardPage };
