import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material";
import { useState } from "react";
import { useResetUserActivity } from "../../hooks/use-reset-user-activity";
import { AppButton } from "@/domains/ui-system/components/app-button/app-button";
import { AppTypography } from "@/domains/ui-system/components";
import { useErrorNotification } from "@/domains/error-handling/hooks/use-error-notification";

interface ConfirmResetDialogProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	isLoading: boolean;
}

const ConfirmResetDialog = ({
	open,
	onClose,
	onConfirm,
	isLoading,
}: ConfirmResetDialogProps) => {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			PaperProps={{
				sx: {
					backgroundColor: "black.800",
					border: "1px solid",
					borderColor: "neutral.700",
				},
			}}
		>
			<DialogTitle id="alert-dialog-title">
				<AppTypography variant="h6" color="error.main">
					Reset User Activity?
				</AppTypography>
			</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description" component="div">
					<AppTypography color="neutral.300">
						This action will reset all user activity including guesses, leagues, and standings.
						This cannot be undone.
					</AppTypography>
					<AppTypography color="neutral.300" sx={{ mt: 2, fontWeight: "bold" }}>
						Are you sure you want to proceed?
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
					onClick={onConfirm}
					loading={isLoading}
					autoFocus
				>
					Reset Activity
				</AppButton>
			</DialogActions>
		</Dialog>
	);
};

export const ResetUserActivityButton = () => {
	const [open, setOpen] = useState(false);
	const { mutateAsync: resetActivity, isPending } = useResetUserActivity();
	const { showErrorNotification } = useErrorNotification();

    // if( import.meta.env.MODE === "local-dev") return null;

	const handleConfirm = async () => {
		try {
			const response = await resetActivity();
			if (response.success) {
				// We can add a success toast here if we have one, 
                // for now we close the dialog.
                // Assuming console log for dev or if there's a global success handler
                console.log(response.message);
				setOpen(false);
			}
		} catch (error) {
			showErrorNotification(error);
		}
	};

	return (
		<>
			<AppButton
				variant="contained"
				color="error"
				onClick={() => setOpen(true)}
			>
				Reset Demo
			</AppButton>
			<ConfirmResetDialog
				open={open}
				onClose={() => setOpen(false)}
				onConfirm={handleConfirm}
				isLoading={isPending}
			/>
		</>
	);
};

