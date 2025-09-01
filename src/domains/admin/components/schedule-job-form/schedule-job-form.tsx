import { Box, styled, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import type { ITournament } from "@/domains/tournament/schemas";
import { AppTypography } from "@/domains/ui-system/components";
import { DailyUpdateJobForm } from "./daily-update-job-form";
import { KnockoutRoundsJobForm } from "./knockout-rounds-job-form";
import { ScoresAndStandingsJobForm } from "./scores-standings-job-form";

type JobFormType = "daily_update" | "scores_and_standings" | "knockout_rounds";

interface ScheduleJobFormProps {
	preselectedTournament?: ITournament;
}

export const ScheduleJobForm = ({ preselectedTournament }: ScheduleJobFormProps) => {
	const [activeTab, setActiveTab] = useState<JobFormType>("daily_update");

	const handleTabChange = (_: React.SyntheticEvent, newValue: JobFormType) => {
		setActiveTab(newValue);
	};

	const renderActiveForm = () => {
		switch (activeTab) {
			case "daily_update":
				return <DailyUpdateJobForm />;
			case "scores_and_standings":
				return <ScoresAndStandingsJobForm preselectedTournament={preselectedTournament} />;
			case "knockout_rounds":
				return <KnockoutRoundsJobForm preselectedTournament={preselectedTournament} />;
			default:
				return <DailyUpdateJobForm />;
		}
	};

	return (
		<Container>
			<HeaderBox>
				<AppTypography variant="h6" color="neutral.100">
					Create Scheduler Jobs{preselectedTournament ? ` for ${preselectedTournament.label}` : ""}
				</AppTypography>
				<AppTypography variant="body2" color="neutral.400">
					Create different types of scheduled jobs for the backend API
				</AppTypography>
			</HeaderBox>

			<TabsContainer>
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
					<Tab label="Daily Update" value="daily_update" />
					<Tab label="Scores & Standings" value="scores_and_standings" />
					<Tab label="Knockout Rounds" value="knockout_rounds" />
				</Tabs>
			</TabsContainer>

			{renderActiveForm()}
		</Container>
	);
};

const Container = styled(Box)(({ theme }) => ({
	marginBottom: theme.spacing(2),
}));

const HeaderBox = styled(Box)(({ theme }) => ({
	padding: theme.spacing(2),
	backgroundColor: theme.palette.black[800],
	borderRadius: theme.shape.borderRadius,
	border: `1px solid ${theme.palette.neutral[700]}`,
	marginBottom: theme.spacing(2),
}));

const TabsContainer = styled(Box)(({ theme }) => ({
	padding: theme.spacing(1, 2),
	backgroundColor: theme.palette.black[800],
	borderRadius: theme.shape.borderRadius,
	border: `1px solid ${theme.palette.neutral[700]}`,
	marginBottom: theme.spacing(2),
}));
