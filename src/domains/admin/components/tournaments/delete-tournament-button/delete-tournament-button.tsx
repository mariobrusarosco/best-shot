import {
	Box,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAdminDeleteTournament } from "@/domains/admin/hooks/use-admin-delete-tournament";
import { AppIcon, AppTypography } from "@/domains/ui-system/components";
import { AppButton } from "@/domains/ui-system/components/app-button/app-button";
import { useNotification } from "@/domains/ui-system/components/notification/notification-context";

interface ConfirmDeleteTournamentDialogProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => Promise<void>;
	isLoading: boolean;
	tournamentLabel: string;
}

const ConfirmDeleteTournamentDialog = ({
	open,
	onClose,
	onConfirm,
	isLoading,
	tournamentLabel,
}: ConfirmDeleteTournamentDialogProps) => {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			aria-labelledby="delete-tournament-dialog-title"
			aria-describedby="delete-tournament-dialog-description"
			PaperProps={{
				sx: {
					backgroundColor: "black.800",
					border: "1px solid",
					borderColor: "neutral.700",
				},
			}}
		>
			<DialogTitle id="delete-tournament-dialog-title">
				<AppTypography variant="h6" color="error.main">
					Delete Tournament?
				</AppTypography>
			</DialogTitle>
			<DialogContent>
				<DialogContentText id="delete-tournament-dialog-description" component="div">
					<AppTypography color="neutral.300">
						This action will permanently delete{" "}
						<Box component="span" sx={{ fontWeight: 700, color: "neutral.100" }}>
							{tournamentLabel}
						</Box>{" "}
						from the admin area. This cannot be undone.
					</AppTypography>
				</DialogContentText>
			</DialogContent>
			<DialogActions sx={{ p: 2 }}>
				<AppButton variant="outlined" onClick={onClose} disabled={isLoading}>
					Cancel
				</AppButton>
				<AppButton
					variant="contained"
					color="error"
					onClick={() => void onConfirm()}
					loading={isLoading}
					data-testid="delete-tournament-confirm-button"
				>
					Delete Tournament
				</AppButton>
			</DialogActions>
		</Dialog>
	);
};

interface DeleteTournamentButtonProps {
	tournamentId: string;
	tournamentLabel: string;
}

export const DeleteTournamentButton = ({
	tournamentId,
	tournamentLabel,
}: DeleteTournamentButtonProps) => {
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { showNotification } = useNotification();
	const deleteTournamentMutation = useAdminDeleteTournament();

	const handleConfirmDelete = async () => {
		try {
			await deleteTournamentMutation.mutateAsync(tournamentId);
		} catch (error) {
			const message = error instanceof Error ? error.message : "Unknown error";
			showNotification(`Failed to delete tournament: ${message}`, "error");
			return;
		}

		setOpen(false);
		showNotification(`Tournament "${tournamentLabel}" deleted successfully`, "success");

		await navigate({ to: "/admin", replace: true });

		queryClient.removeQueries({ queryKey: ["admin", "tournament", tournamentId] });
		queryClient.removeQueries({ queryKey: ["tournament", tournamentId] });
	};

	return (
		<>
			<AppButton
				variant="contained"
				color="error"
				startIcon={<AppIcon name="Trash" size="small" />}
				onClick={() => setOpen(true)}
				data-testid="delete-tournament-button"
			>
				Delete Tournament
			</AppButton>

			<ConfirmDeleteTournamentDialog
				open={open}
				onClose={() => setOpen(false)}
				onConfirm={handleConfirmDelete}
				isLoading={deleteTournamentMutation.isPending}
				tournamentLabel={tournamentLabel}
			/>
		</>
	);
};
