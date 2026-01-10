import { Stack, Typography } from "@mui/material";
import { getRouteApi } from "@tanstack/react-router";
import { BestShotIcon } from "@/assets/best-shot-icon";
import { useTournamentSetup } from "@/domains/tournament/hooks/use-tournament-setup";
import { AppButton } from "@/domains/ui-system/components/button/button";
import { theme } from "@/domains/ui-system/theme";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const TournamentSetup = () => {
	const tournamentId = route.useParams().tournamentId || "";
	const setup = useTournamentSetup();

	return (
		<Stack gap={4}>
			<Stack mt={6}>
				<Typography variant="h4" color="neutral.100">
					Let's get Started
				</Typography>
			</Stack>
			<Typography variant="topic" color="neutral.100">
				We need to setup this tournament for you, so you'll be able to guess{" "}
				<Typography textTransform="uppercase" variant="label" color="teal.500" fontWeight={700}>
					scores
				</Typography>{" "}
				and then check your{" "}
				<Typography textTransform="uppercase" variant="label" color="teal.500" fontWeight={700}>
					performance
				</Typography>
			</Typography>
			<AppButton
				sx={{
					width: "150px",
					height: "50px",
					borderRadius: 2,
					backgroundColor: "teal.500",
				}}
				disabled={setup.isPending}
				onClick={async () => {
					await setup.mutateAsync({
						tournamentId,
					});
					console.log("Mutate is over");
				}}
			>
				{setup.isPending ? (
					<BestShotIcon isAnimated fill={theme.palette.neutral[100]} width={30} />
				) : (
					<Typography textTransform="uppercase" variant="label" color="neutral.100">
						finish setup
					</Typography>
				)}
			</AppButton>
		</Stack>
	);
};
