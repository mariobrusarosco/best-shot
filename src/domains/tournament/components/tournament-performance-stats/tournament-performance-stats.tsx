import { AppButton } from "@/domains/ui-system/components/button/button";
import { GridOfCards } from "@/domains/ui-system/components/grid-of-cards/grid-of-cards";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import Typography from "@mui/material/Typography/Typography";
import { Box, Stack, styled } from "@mui/system";
import { useTournamentPerformance } from "../../hooks/use-tournament-performance";
import { ITournamentPerformance } from "../../typing";
import { GuessSection } from "./guess-section";

export const TournamentPerformanceStats = ({
	data,
	mutation,
}: {
	data: ITournamentPerformance;
	mutation: ReturnType<typeof useTournamentPerformance>["mutation"];
}) => {
	if (!data) return null;

	const guessesByStatus = Object.groupBy(data.details, ({ status }) => status);

	console.log({ guessesByStatus });

	return (
		<Stack gap={4} pt={5}>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
				}}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 1,
					}}
				>
					<Typography
						textTransform="uppercase"
						variant="caption"
						color="teal.500"
					>
						last updated at:
					</Typography>
					<Typography
						textTransform="uppercase"
						variant="caption"
						color="neutral.100"
					>
						{data?.lastUpdated && new Date(data.lastUpdated).toUTCString()}
					</Typography>
					<AppButton
						sx={{
							width: "150px",
							height: "30px",
							borderRadius: 2,
							backgroundColor: "teal.500",
						}}
						// disabled={setup.isPending}
						onClick={async () => {
							mutation.mutate();
						}}
					>
						<Typography variant="caption" color="neutral.100">
							Update
						</Typography>
					</AppButton>
				</Box>
			</Box>

			<GridOfCards>
				<PerfCard>
					<Stack direction="row" gap={1.5} alignItems="center">
						<Typography
							textTransform="uppercase"
							variant="paragraph"
							color="teal.500"
						>
							points
						</Typography>
						<Typography
							textTransform="uppercase"
							variant="h1"
							color="neutral.100"
						>
							{data?.points}
						</Typography>
					</Stack>
				</PerfCard>
			</GridOfCards>

			<Stack>
				<GridOfCards>
					<PerfCard>
						<Stack direction="row" gap={1.5} alignItems="center">
							<Typography
								textTransform="uppercase"
								variant="caption"
								color="teal.500"
							>
								correct guesses
							</Typography>
							<Typography
								textTransform="uppercase"
								variant="h4"
								color="neutral.100"
							>
								{guessesByStatus["correct"]?.length ?? 0}
							</Typography>
						</Stack>
					</PerfCard>
					<PerfCard>
						<Stack direction="row" gap={1.5} alignItems="center">
							<Typography
								textTransform="uppercase"
								variant="caption"
								color="teal.500"
							>
								incorrect guesses
							</Typography>
							<Typography
								textTransform="uppercase"
								variant="h4"
								color="neutral.100"
							>
								{guessesByStatus["incorrect"]?.length ?? 0}
							</Typography>
						</Stack>
					</PerfCard>
					<PerfCard>
						<Stack direction="row" gap={1.5} alignItems="center">
							<Typography
								textTransform="uppercase"
								variant="caption"
								color="teal.500"
							>
								waiting for macth outcome
							</Typography>
							<Typography
								textTransform="uppercase"
								variant="h4"
								color="neutral.100"
							>
								{guessesByStatus["waiting_for_game"]?.length ?? 0}
							</Typography>
						</Stack>
					</PerfCard>
					<PerfCard>
						<Stack direction="row" gap={1.5} alignItems="center">
							<Typography
								textTransform="uppercase"
								variant="caption"
								color="teal.500"
							>
								you still can guess
							</Typography>
							<Typography
								textTransform="uppercase"
								variant="h4"
								color="neutral.100"
							>
								{guessesByStatus["not-started"]?.length ?? 0}
							</Typography>
						</Stack>
					</PerfCard>
				</GridOfCards>
			</Stack>

			<Stack>
				<GuessSection groupName={"all"} groupOfGuesses={data.details} />

				{/* {Object.values(GUESS_STATUSES).map((status) => {
					return (
						<GuessSection
							groupName={status}
							groupOfGuesses={guessesByStatus[status]}
						/>
					);
				})} */}
			</Stack>
		</Stack>
	);
};

const PerfCard = styled(Surface)(({ theme }) =>
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
