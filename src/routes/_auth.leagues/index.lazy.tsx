import { ScreenHeading } from "@/domains/global/components/screen-heading";
import { LeaguesList } from "@/domains/league/components/leagues-list";
import { AppButton } from "@/domains/ui-system/components/button/button";
import { AppInput } from "@/domains/ui-system/components/input/input";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import { ScreenLayout } from "@/domains/ui-system/layout/screen-layout";
import { Box, styled, Typography, TypographyProps } from "@mui/material";
import { createLazyFileRoute, useSearch } from "@tanstack/react-router";
import { useLeagues } from "../../domains/league/hooks/use-leagues";

const LeaguesPage = () => {
	const { inputs, handleNewLeague, handleLeagueInvite, leagues } = useLeagues();
	const search = useSearch({ from: "/_auth/leagues/" }) as { founder: boolean };

	const founderDemoPrivelage = search["founder"];

	if (leagues.isError) {
		return <div>There was an error loading the leagues</div>;
	}

	if (leagues.isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<ScreenLayout data-ui="leagues-screen screen">
			<ScreenHeading title="leagues" withBackButton />

			<Box pt={[6, 10]} pb={14} px={[2, 6]}>
				<LeaguesList leagues={leagues.data} />

				{founderDemoPrivelage ? (
					<>
						<Typography
							sx={{
								mb: 1,
							}}
							textTransform="lowercase"
							variant="paragraph"
							color="neutral.100"
						>
							create a new league
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
							<Label htmlFor="league-label">Name</Label>

							<AppInput
								type="text"
								id="league-label"
								name="league-label"
								value={inputs.labelInput}
								onChange={inputs.handleLabelChange}
							/>

							<SubmitButton type="submit" onClick={handleNewLeague}>
								create
							</SubmitButton>
						</Card>

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
					</>
				) : null}
			</Box>
		</ScreenLayout>
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

interface MyCustomTypographyProps extends TypographyProps {
	htmlFor?: string;
}

const Label = styled((props: MyCustomTypographyProps) => (
	<Typography
		variant="label"
		component={props.component || "label"}
		{...props}
	/>
))(({ theme }) => ({
	textTransform: "uppercase",
	color: theme.palette.neutral[100],
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

export const Route = createLazyFileRoute("/_auth/leagues/")({
	component: LeaguesPage,
});

export { LeaguesPage };
