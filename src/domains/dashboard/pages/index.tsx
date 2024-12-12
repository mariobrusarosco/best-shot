import { ScreenHeading } from "@/domains/global/components/screen-heading";
import { useMember } from "@/domains/member/hooks/use-member";
import { ScreenLayout } from "@/domains/ui-system/layout/screen-layout";

const DashboardPage = () => {
	const member = useMember();
	// const performance = useMemberPerformance();

	console.log("---------", member?.data);

	return (
		<ScreenLayout data-ui="dashboard-screen">
			<ScreenHeading title="Hello," subtitle={member?.data?.nickName} />
		</ScreenLayout>
	);
};

export { DashboardPage };
