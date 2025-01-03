import { BestShotIcon } from "@/assets/best-shot-icon";
import { AppButton } from "@/domains/ui-system/components/button/button";
import { theme } from "@/theming/theme";
import { Stack } from "@mui/material";
import Typography from "@mui/material/Typography/Typography";
import { getRouteApi } from "@tanstack/react-router";
import { useTournamentSetup } from "../../hooks/use-tournament-setup";

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
				<Typography
					textTransform="uppercase"
					variant="label"
					color="teal.500"
					fontWeight={700}
				>
					scores
				</Typography>{" "}
				and then check your{" "}
				<Typography
					textTransform="uppercase"
					variant="label"
					color="teal.500"
					fontWeight={700}
				>
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
				}}
			>
				{setup.isPending ? (
					<Stack
						gap={1}
						direction="row"
						alignItems="center"
						justifyContent="center"
					>
						<Typography
							textTransform="uppercase"
							variant="label"
							color="neutral.100"
						>
							loading
						</Typography>
						<BestShotIcon fill={theme.palette.neutral[100]} width={40} />
					</Stack>
				) : (
					<Typography
						textTransform="uppercase"
						variant="label"
						color="neutral.100"
					>
						finish setup
					</Typography>
				)}
			</AppButton>
		</Stack>
	);
};
