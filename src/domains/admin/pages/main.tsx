import { useState } from "react";
import { Box, styled } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";
import { AppButton } from "@/domains/ui-system/components/app-button/app-button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { AppTypography } from "@/domains/ui-system/components";
import { CreateTournamentModal } from "@/domains/admin/components/tournaments/create-tournament-modal/create-tournament-modal";
import TournamentsTable from "@/domains/admin/components/tournaments/tournaments-table/tournaments-table";
import { useTournaments } from "@/domains/tournament/hooks/use-tournaments";

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
	const { data: tournaments, isPending: isLoading, error } = useTournaments();

	// Create mutations for all actions
	const createStandingsMutation = useMutation({
		mutationFn: async (tournamentId: string) => {
			console.log("Create standings for tournament:", tournamentId);
			const response = await api.post(
				"/admin/standings",
				{ tournamentId },
				{ baseURL: import.meta.env.VITE_BEST_SHOT_API_V2 }
			);
			return response.data;
		},
	});

	const updateStandingsMutation = useMutation({
		mutationFn: async (tournamentId: string) => {
			console.log("Update standings for tournament:", tournamentId);
			const response = await api.patch(
				"/admin/standings",
				{ tournamentId },
				{ baseURL: import.meta.env.VITE_BEST_SHOT_API_V2 }
			);
			return response.data;
		},
	});

	const createRoundsMutation = useMutation({
		mutationFn: async (tournamentId: string) => {
			console.log("Create rounds for tournament:", tournamentId);
			const response = await api.post(
				"/admin/rounds",
				{ tournamentId },
				{ baseURL: import.meta.env.VITE_BEST_SHOT_API_V2 }
			);
			return response.data;
		},
	});

	const updateRoundsMutation = useMutation({
		mutationFn: async (tournamentId: string) => {
			console.log("Update rounds for tournament:", tournamentId);
			const response = await api.patch(
				"/admin/rounds",
				{ tournamentId },
				{ baseURL: import.meta.env.VITE_BEST_SHOT_API_V2 }
			);
			return response.data;
		},
	});

	const createTeamsMutation = useMutation({
		mutationFn: async (tournamentId: string) => {
			console.log("Create teams for tournament:", tournamentId);
			const response = await api.post(
				"/admin/teams",
				{ tournamentId },
				{ baseURL: import.meta.env.VITE_BEST_SHOT_API_V2 }
			);
			return response.data;
		},
	});

	const updateTeamsMutation = useMutation({
		mutationFn: async (tournamentId: string) => {
			console.log("Update teams for tournament:", tournamentId);
			const response = await api.patch(
				"/admin/teams",
				{ tournamentId },
				{ baseURL: import.meta.env.VITE_BEST_SHOT_API_V2 }
			);
			return response.data;
		},
	});

	const createMatchesMutation = useMutation({
		mutationFn: async (tournamentId: string) => {
			console.log("Create matches for tournament:", tournamentId);
			const response = await api.post(
				"/admin/matches",
				{ tournamentId },
				{ baseURL: import.meta.env.VITE_BEST_SHOT_API_V2 }
			);
			return response.data;
		},
	});

	const updateMatchesMutation = useMutation({
		mutationFn: async (tournamentId: string) => {
			console.log("Update matches for tournament:", tournamentId);
			const response = await api.patch(
				"/admin/matches",
				{ tournamentId },
				{ baseURL: import.meta.env.VITE_BEST_SHOT_API_V2 }
			);
			return response.data;
		},
	});

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

			<TournamentsTable
				tournaments={tournaments || []}
				isLoading={isLoading}
				createStandingsMutation={createStandingsMutation}
				updateStandingsMutation={updateStandingsMutation}
				createRoundsMutation={createRoundsMutation}
				updateRoundsMutation={updateRoundsMutation}
				createTeamsMutation={createTeamsMutation}
				updateTeamsMutation={updateTeamsMutation}
				createMatchesMutation={createMatchesMutation}
				updateMatchesMutation={updateMatchesMutation}
			/>

			{isCreateModalOpen && <CreateTournamentModal onClose={() => setIsCreateModalOpen(false)} />}
		</StyledContainer>
	);
};

export default MainAdminPage;
