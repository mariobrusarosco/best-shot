import { ScreenHeading } from "@/domains/global/components/screen-heading";
import { Button } from "@/domains/ui-system/components/button/button";
import { AppInput } from "@/domains/ui-system/components/input/input";
import { Box, styled, Typography, TypographyProps } from "@mui/material";
import { createLazyFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useLeagues } from "../../domains/league/hooks/use-leagues";
import { ILeague } from "../../domains/league/typing";

const LeaguesPage = () => {
	const { inputs, handleNewLeague, handleLeagueInvite, leagues } = useLeagues();
	const search = useSearch({ from: "/_auth/leagues/" }) as { founder: boolean };

	const founderDemoPrivelage = search["founder"];
	console.log({ founderDemoPrivelage });

	return (
		<Box data-ui="leagues-screen screen">
			<ScreenHeading title="leagues" withBackButton />

			<Box pt={[6, 10]} pb={14} px={[2, 6]}>
				{founderDemoPrivelage ? (
					<>
						<Box
							sx={{
								display: "grid",
								py: 2,
								gap: 1,
							}}
							className="league-creation"
						>
							<Typography
								sx={{
									mb: 3,
								}}
								textTransform="lowercase"
								variant="h6"
								color="neutral.100"
							>
								create a new league
							</Typography>

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
						</Box>

						<Box
							sx={{
								display: "grid",
								py: 2,
								gap: 1,
							}}
							className="league-creation"
						>
							<Typography
								sx={{
									mb: 3,
								}}
								textTransform="lowercase"
								variant="h6"
								color="neutral.100"
							>
								Invite to League
							</Typography>
						</Box>

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
					</>
				) : null}

				<div className="list">
					<ul>
						{leagues?.data?.map((league: ILeague) => {
							return (
								<li key={league.label} className="list-item">
									<Link
										to="/leagues/$leagueId"
										params={{ leagueId: league.id }}
									>
										{league.label}
									</Link>
								</li>
							);
						})}
					</ul>
				</div>
			</Box>
		</Box>
	);
};

const SubmitButton = styled(Button)(({ theme }) => ({
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

export const Route = createLazyFileRoute("/_auth/leagues/")({
	component: LeaguesPage,
});

export { LeaguesPage };
