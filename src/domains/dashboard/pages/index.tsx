import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import dayjs, { type Dayjs } from "dayjs";
import { useState } from "react";
import Matchday from "@/domains/dashboard/components/matchday";
import { useDashboard } from "@/domains/dashboard/hooks/use-dashboard";
import { ScreenHeading, ScreenHeadingSkeleton } from "@/domains/global/components/screen-heading";
import { useMember } from "@/domains/member/hooks/use-member";
import { useMemberPerformance } from "@/domains/member/hooks/use-member-performance";
import { AppDatePicker } from "@/domains/ui-system/components/date-picker";
import { AuthenticatedScreenLayout } from "@/domains/ui-system/layout/authenticated";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";
import { UIHelper } from "@/theming/theme";
import TournamentsPerf from "../components/tournaments-perf";

const DashboardPage = () => {
	const member = useMember();
	const performance = useMemberPerformance();
	const dashboard = useDashboard();

	// State for date picker instances
	const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
	const [endDate, setEndDate] = useState<Dayjs | null>(null);
	const [filterDate, setFilterDate] = useState<Dayjs | null>(null);

	if (member.isPending || performance.isPending || dashboard.isPending) {
		return (
			<AuthenticatedScreenLayout data-ui="dashboard-screen">
				<ScreenHeadingSkeleton />

				<Dashboard data-ui="dashboard-content-skeleton">
					<Matchday.Skeleton />
					<TournamentsPerf.Skeleton />
				</Dashboard>
			</AuthenticatedScreenLayout>
		);
	}

	if (member.isError || performance.isError || dashboard.isError) {
		return (
			<AuthenticatedScreenLayout data-ui="dashboard-screen">
				<ScreenHeading title="Dashboard" subtitle="" />

				<ScreenMainContent>
					<Typography variant="h6" color="error">
						Error
					</Typography>
				</ScreenMainContent>
			</AuthenticatedScreenLayout>
		);
	}

	return (
		<AuthenticatedScreenLayout data-ui="dashboard-screen">
			<ScreenHeading title="Hello," subtitle={member?.data?.nickName} />

			<Dashboard data-ui="dashboard-content">
				{/* Date Picker Demo Section */}
				<DatePickerSection>
					<Typography variant="h6" gutterBottom>
						Date Filters
					</Typography>
					<DatePickerGrid>
						<AppDatePicker
							label="Start Date"
							value={startDate}
							onChange={setStartDate}
							maxDate={endDate || undefined}
						/>
						<AppDatePicker
							label="End Date"
							value={endDate}
							onChange={setEndDate}
							minDate={startDate || undefined}
						/>
						<AppDatePicker
							label="Filter Date"
							value={filterDate}
							onChange={setFilterDate}
							disablePast
							size="small"
						/>
					</DatePickerGrid>
				</DatePickerSection>

				<Matchday.Component matchday={dashboard.data.matchday} />
				<TournamentsPerf.Component performance={performance} />
			</Dashboard>
		</AuthenticatedScreenLayout>
	);
};

export const Dashboard = styled(ScreenMainContent)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	gap: theme.spacing(2),

	[UIHelper.startsOn("tablet")]: {
		gap: theme.spacing(4),
	},
}));

const DatePickerSection = styled(Box)(({ theme }) => ({
	padding: theme.spacing(2),
	backgroundColor: theme.palette.background.paper,
	borderRadius: theme.shape.borderRadius,
	border: `1px solid ${theme.palette.divider}`,
}));

const DatePickerGrid = styled(Box)(({ theme }) => ({
	display: "grid",
	gridTemplateColumns: "1fr",
	gap: theme.spacing(2),

	[UIHelper.startsOn("tablet")]: {
		gridTemplateColumns: "repeat(3, 1fr)",
	},
}));

export { DashboardPage };
performance;
