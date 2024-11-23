import { ScreenHeading } from "@/domains/global/components/screen-heading";
import { useMember } from "@/domains/member/hooks/use-member";
import { Box } from "@mui/system";

const DashboardPage = () => {
	const member = useMember();

	console.log("---------", member.data);

	return (
		<Box data-ui="dashboard-screen">
			<ScreenHeading title="Hello," subtitle="Mario" />
		</Box>
	);
};

export { DashboardPage };
