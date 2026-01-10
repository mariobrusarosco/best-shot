import { Box, styled, Typography } from "@mui/material";
import { useLeague } from "@/domains/league/hooks/use-league";
import { AppButton } from "@/domains/ui-system/components/button/button";
import { AppDialog } from "@/domains/ui-system/components/dialog";
import { AppInput } from "@/domains/ui-system/components/input/input";

interface InviteToLeagueDialogProps {
	open: boolean;
	onClose: () => void;
}

export const InviteToLeagueDialog = ({ open, onClose }: InviteToLeagueDialogProps) => {
	const { inputs } = useLeague();

	const handleInvite = () => {
		inputs.handleLeagueInvite();
		// Close dialog after successful invite
		onClose();
	};

	const handleClose = () => {
		// Reset input when closing
		inputs.handleGuestIdInput({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
		onClose();
	};

	return (
		<AppDialog
			open={open}
			onClose={handleClose}
			title="Invite Someone to League"
			maxWidth="tablet"
			actions={
				<DialogActions>
					<CancelButton onClick={handleClose}>Cancel</CancelButton>
					<SubmitButton onClick={handleInvite} disabled={!inputs.guestIdInput}>
						Send Invite
					</SubmitButton>
				</DialogActions>
			}
		>
			<Form>
				<Box>
					<StyledLabel>Guest ID</StyledLabel>
					<AppInput
						type="text"
						id="guest-id"
						name="guest-id"
						placeholder="Enter guest ID..."
						value={inputs.guestIdInput}
						onChange={inputs.handleGuestIdInput}
					/>
				</Box>
			</Form>
		</AppDialog>
	);
};

// ===== STYLED COMPONENTS =====

const Form = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	gap: theme.spacing(2),
}));

const DialogActions = styled(Box)(({ theme }) => ({
	display: "flex",
	gap: theme.spacing(2),
	justifyContent: "flex-end",
	width: "100%",
}));

const CancelButton = styled(AppButton)(({ theme }) => ({
	padding: theme.spacing(1.5, 3),
	borderRadius: theme.spacing(0.5),
	backgroundColor: "transparent",
	color: theme.palette.neutral[500],
	border: `1px solid ${theme.palette.black[400]}`,

	"&:hover": {
		backgroundColor: theme.palette.black[800],
		borderColor: theme.palette.neutral[500],
	},
}));

const SubmitButton = styled(AppButton)(({ theme }) => ({
	padding: theme.spacing(1.5, 3),
	borderRadius: theme.spacing(0.5),
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.neutral[100],

	"&:hover": {
		backgroundColor: theme.palette.primary.dark,
	},

	"&:disabled": {
		opacity: 0.5,
		cursor: "not-allowed",
	},
}));

const StyledLabel = styled(Typography)(({ theme }) => ({
	textTransform: "uppercase",
	color: theme.palette.neutral[100],
	marginBottom: theme.spacing(1),
	fontSize: "0.875rem",
	fontWeight: 600,
}));
