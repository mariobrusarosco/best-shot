import { Box, styled, Typography, type TypographyProps } from "@mui/material";
import { AppButtonBase } from "@/domains/ui-system/components/app-button-base";
import { AppInput } from "@/domains/ui-system/components/app-input";
import { AppPill } from "@/domains/ui-system/components/app-pill";
import { AppSurface } from "@/domains/ui-system/components/app-surface";
import { useLeague } from "../../hooks/use-league";

export const InviteToLeague = () => {
	const { inputs } = useLeague();

	return (
		<Box>
			<AppPill.Component bgcolor="teal.500" color="neutral.100" width={100} height={25}>
				<Typography variant="tag">invitations</Typography>
			</AppPill.Component>

			<Card
				sx={{
					mt: 2,
					py: 2,
					gap: 1,
					backgroundColor: "black.800",
				}}
				className="league-creation"
			>
				<Box
					sx={{
						display: "grid",
						py: 2,
						gap: 1,
					}}
					className="league-invitation"
				>
					<Label htmlFor="guest-id">Guest ID</Label>

					<AppInput
						type="text"
						id="guest-id"
						name="guest-id"
						value={inputs.guestIdInput}
						onChange={inputs.handleGuestIdInput}
					/>
					<SubmitButton onClick={inputs.handleLeagueInvite}>Invite</SubmitButton>
				</Box>
			</Card>
		</Box>
	);
};

const SubmitButton = styled(AppButtonBase)(({ theme }) => ({
	my: 2,
	width: 150,
	marginTop: theme.spacing(2),
	padding: theme.spacing(1.5),
	borderRadius: 2,
	backgroundColor: theme.palette.teal[500],
	color: theme.palette.neutral[100],

	"&:hover": {
		backgroundColor: theme.palette.black[500],
	},
}));

const Card = styled(AppSurface)(({ theme }) =>
	theme.unstable_sx({
		backgroundColor: "black.800",
		px: 2,
		py: 2,
		borderRadius: 2,
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		gap: 1,
	})
);

interface MyCustomTypographyProps extends TypographyProps {
	htmlFor?: string;
}

const Label = styled((props: MyCustomTypographyProps) => (
	<Typography variant="label" component={props.component || "label"} {...props} />
))(({ theme }) =>
	theme.unstable_sx({
		textTransform: "uppercase",
		color: "neutral.100",
	})
);
