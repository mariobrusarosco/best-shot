import { AppButton } from "@/domains/ui-system/components/button/button";
import { Stack } from "@mui/material";
import Typography from "@mui/material/Typography/Typography";
import { useTournamentSetup } from "../../hooks/use-tournament-setup";
import { ITournament } from "../../typing";

export const TournamentSetup = ({
	tournament,
}: {
	tournament: ITournament;
}) => {
	const setup = useTournamentSetup();

	return (
		<Stack gap={4}>
			<Stack mt={6}>
				<Typography variant="h4" color="neutral.100">
					Let's get Started
				</Typography>
			</Stack>
			<Typography variant="topic" color="neutral.100">
				We need to setup this tournament for you!
			</Typography>

			<Typography variant="topic" color="neutral.100">
				After that you'll be able to guess{" "}
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
						tournamentId: tournament.id || "",
					});
				}}
			>
				<Typography
					textTransform="uppercase"
					variant="label"
					color="neutral.100"
				>
					{setup.isPending ? "...working on it..." : "finish the setup"}
				</Typography>
			</AppButton>
		</Stack>
	);
};
