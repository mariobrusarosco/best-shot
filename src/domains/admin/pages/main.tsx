import { Box, styled } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ResetUserActivityButton } from "@/domains/admin/components/reset-user-activity/reset-user-activity";
import { CreateTournamentModal } from "@/domains/admin/components/tournaments/create-tournament-modal/create-tournament-modal";
import TournamentsTable from "@/domains/admin/components/tournaments/tournaments-table/tournaments-table";
import { useAdminTournaments } from "@/domains/admin/hooks/use-admin-tournaments";
import { ScreenHeading, ScreenHeadingSkeleton } from "@/domains/global/components/screen-heading";
import { AppTypography } from "@/domains/ui-system/components";
import { AppButton } from "@/domains/ui-system/components/app-button/app-button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { AuthenticatedScreenLayout } from "@/domains/ui-system/layout/authenticated";

const StyledContainer = styled(Box)(({ theme }) => ({
	padding: theme.spacing(2),
	backgroundColor: theme.palette.black[800],
	borderRadius: theme.shape.borderRadius,
	border: `1px solid ${theme.palette.neutral[700]}`,
}));

const MainAdminPage = () => {
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const navigate = useNavigate();
	const { data: tournaments, isPending: isLoading, error } = useAdminTournaments();

	if (error) {
		return (
			<StyledContainer>
				<Box sx={{ p: 3 }}>
					<AppTypography color="error.main">
						Failed to load tournaments. Please try again later.
					</AppTypography>
				</Box>
			</StyledContainer>
		);
	}

	if (isLoading) {
		return <ScreenHeadingSkeleton />;
	}

	return (
		<AuthenticatedScreenLayout data-ui="admin-page" overflow="hidden">
			<ScreenHeading title="admin">
				<Box sx={{ display: "flex", gap: 2 }}>
					<ResetUserActivityButton />
					<AppButton
						variant="contained"
						startIcon={<AppIcon name="Plus" size="small" />}
						onClick={() => setIsCreateModalOpen(true)}
						sx={{
							backgroundColor: "teal.500",
							"&:hover": { backgroundColor: "teal.600" },
						}}
					>
						Create Tournament
					</AppButton>
				</Box>
			</ScreenHeading>

			<Box sx={{ my: 4 }} bgcolor="black.800" px={4} py={4}>
				<Box
					sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}
				>
					<AppTypography variant="h4" color="neutral.100">
						Cron Jobs
					</AppTypography>
					<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "flex-end" }}>
						<AppButton
							variant="outlined"
							onClick={() => navigate({ to: "/admin/cron/jobs" })}
							startIcon={<AppIcon name="ClockFilled" size="small" />}
							sx={{
								borderColor: "teal.500",
								color: "teal.400",
								"&:hover": {
									borderColor: "teal.400",
									backgroundColor: "teal.500",
									color: "neutral.100",
								},
							}}
						>
							Open Cron Jobs
						</AppButton>
						<AppButton
							variant="outlined"
							onClick={() => navigate({ to: "/admin/cron/runs" })}
							sx={{
								borderColor: "neutral.600",
								color: "neutral.200",
								"&:hover": {
									borderColor: "neutral.500",
									backgroundColor: "black.700",
								},
							}}
						>
							Open Runs
						</AppButton>
					</Box>
				</Box>

				<AppTypography variant="body2" color="neutral.400" sx={{ mt: 1.5 }}>
					View and control recurring admin jobs, triggers, and execution status.
				</AppTypography>
			</Box>

			<Box sx={{ my: 4 }} bgcolor="black.800" px={4} py={4}>
				<AppTypography variant="h4" color="neutral.100">
					Tournaments
				</AppTypography>

				<TournamentsTable tournaments={tournaments || []} isLoading={isLoading} />
			</Box>

			{isCreateModalOpen && <CreateTournamentModal onClose={() => setIsCreateModalOpen(false)} />}
		</AuthenticatedScreenLayout>
	);
};

export default MainAdminPage;
