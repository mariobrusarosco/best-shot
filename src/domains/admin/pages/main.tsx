import { Box, styled } from "@mui/material";
import { useState } from "react";
import AdminTournamentsTable from "@/domains/admin/components/tournaments/admin-tournaments-table/admin-tournaments-table";
import { CreateTournamentModal } from "@/domains/admin/components/tournaments/create-tournament-modal/create-tournament-modal";
import { useAdminTournaments } from "@/domains/admin/hooks/use-admin-tournaments";
import { AppTypography } from "@/domains/ui-system/components";
import { AppButton } from "@/domains/ui-system/components/app-button/app-button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";

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

const StyledContainer = styled(Box)(({ theme }) => ({
	padding: theme.spacing(2),
	backgroundColor: theme.palette.black[800],
	borderRadius: theme.shape.borderRadius,
	border: `1px solid ${theme.palette.neutral[700]}`,
}));

const MainAdminPage = () => {
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const { data: tournaments, isLoading, error } = useAdminTournaments();

	console.log({ tournaments });

	if (isLoading) {
		return (
			<StyledContainer>
				<AppTypography color="neutral.400">Loading tournaments...</AppTypography>
			</StyledContainer>
		);
	}

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

	return (
		<StyledContainer>
			<Header>
				<Box>
					<AppTypography variant="h5" textTransform="lowercase" color="neutral.100">
						Tournaments
					</AppTypography>
					<AppTypography variant="body2" color="neutral.400" sx={{ mt: 0.5 }}>
						Manage tournament standings, rounds, teams, and matches
					</AppTypography>
				</Box>
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
			</Header>

			<AdminTournamentsTable tournaments={tournaments || []} isLoading={isLoading} />

			{isCreateModalOpen && <CreateTournamentModal onClose={() => setIsCreateModalOpen(false)} />}
		</StyledContainer>
	);
};

export default MainAdminPage;
