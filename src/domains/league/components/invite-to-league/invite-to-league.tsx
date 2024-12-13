import { AppButton } from "@/domains/ui-system/components/button/button";
import { AppInput } from "@/domains/ui-system/components/input/input";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import { TypographyProps } from "@mui/material";
import Typography from "@mui/material/Typography/Typography";
import { Box, styled } from "@mui/system";
import { useLeagues } from "../../hooks/use-leagues";

export const InviteToLeague = () => {
	const { inputs, handleLeagueInvite } = useLeagues();

	return (
		<Box>
			<Typography
				textTransform="lowercase"
				variant="paragraph"
				color="neutral.100"
			>
				Invite to League
			</Typography>

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
					<Label htmlFor="league-id">League ID</Label>
					<AppInput
						type="text"
						id="league-id"
						name="league-id"
						value={inputs.leagueInput}
						onChange={inputs.handleLeagueInput}
					/>

					<Label htmlFor="guest-id">Guest ID</Label>

					<AppInput
						type="text"
						id="guest-id"
						name="guest-id"
						value={inputs.guestIdInput}
						onChange={inputs.handleGuestIdInput}
					/>
					<SubmitButton onClick={handleLeagueInvite}>Invite</SubmitButton>
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

const Card = styled(Surface)(({ theme }) =>
	theme.unstable_sx({
		backgroundColor: "black.800",
		px: 2,
		py: 2,
		borderRadius: 2,
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		gap: 1,
	}),
);

interface MyCustomTypographyProps extends TypographyProps {
	htmlFor?: string;
}

const Label = styled((props: MyCustomTypographyProps) => (
	<Typography
		variant="label"
		component={props.component || "label"}
		{...props}
	/>
))(({ theme }) =>
	theme.unstable_sx({
		textTransform: "uppercase",
		color: "neutral.100",
	}),
);
