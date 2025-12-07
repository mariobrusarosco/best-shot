import { Box, styled } from "@mui/material";
import { useState } from "react";
import { ResetUserActivityButton } from "@/domains/admin/components/reset-user-activity/reset-user-activity";
import { CreateTournamentModal } from "@/domains/admin/components/tournaments/create-tournament-modal/create-tournament-modal";
import TournamentsTable from "@/domains/admin/components/tournaments/tournaments-table/tournaments-table";
import { ScreenHeading, ScreenHeadingSkeleton } from "@/domains/global/components/screen-heading";
import { AppTypography } from "@/domains/ui-system/components";
import { AppButton } from "@/domains/ui-system/components/app-button/app-button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { AuthenticatedScreenLayout } from "@/domains/ui-system/layout/authenticated";
import { useAdminTournaments } from "../hooks/use-admin-tournaments";

const StyledContainer = styled(Box)(({ theme }) => ({
	padding: theme.spacing(2),
	backgroundColor: theme.palette.black[800],
	borderRadius: theme.shape.borderRadius,
	border: `1px solid ${theme.palette.neutral[700]}`,
}));

const MainAdminPage = () => {
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const { data: tournaments, isPending: isLoading, error } = useAdminTournaments();

	// console.log({ data, error });

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

			<TournamentsTable tournaments={tournaments || []} isLoading={isLoading} />

			{isCreateModalOpen && <CreateTournamentModal onClose={() => setIsCreateModalOpen(false)} />}
		</AuthenticatedScreenLayout>
	);
};

export default MainAdminPage;
