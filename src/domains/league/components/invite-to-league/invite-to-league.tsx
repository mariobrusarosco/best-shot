import { Box, styled, Typography, type TypographyProps } from "@mui/material";
import { useLeague } from "@/domains/league/hooks/use-league";
import { AppButton } from "@/domains/ui-system/components/button/button";
import { AppInput } from "@/domains/ui-system/components/input/input";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { Surface } from "@/domains/ui-system/components/surface/surface";

export const InviteToLeague = () => {
	const { league } = useLeague();

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
						value={league.states.guestIdInput}
						onChange={league.handlers.handleGuestIdInput}
					/>
					<SubmitButton onClick={league.handlers.handleLeagueInvite}>Invite</SubmitButton>
				</Box>
			</Card>
		</Box>
	);
};

const SubmitButton = styled(AppButton)(({ theme }) => ({
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

const Card = styled(Surface)(({ theme }) => ({
	backgroundColor: theme.palette.black[800],
	paddingLeft: theme.spacing(2),
	paddingRight: theme.spacing(2),
	paddingTop: theme.spacing(2),
	paddingBottom: theme.spacing(2),
	borderRadius: theme.spacing(2),
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	gap: theme.spacing(1),
}));

interface MyCustomTypographyProps extends TypographyProps {
	htmlFor?: string;
}

const Label = styled((props: MyCustomTypographyProps) => (
	<Typography variant="label" component={props.component || "label"} {...props} />
))(({ theme }) => ({
	textTransform: "uppercase",
	color: theme.palette.neutral[100],
}));
