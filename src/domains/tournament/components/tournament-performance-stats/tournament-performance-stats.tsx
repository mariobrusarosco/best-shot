import { AppButton } from "@/domains/ui-system/components/button/button";
import { GridOfCards } from "@/domains/ui-system/components/grid-of-cards/grid-of-cards";
import {
	shimmerEffect,
	TypographySkeleton,
} from "@/domains/ui-system/components/skeleton/skeleton";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import Typography from "@mui/material/Typography/Typography";
import { Box, Stack, styled } from "@mui/system";
import { useTournamentPerformance } from "../../hooks/use-tournament-performance";
import { ITournamentPerformance } from "../../typing";

const TournamentPerformanceStats = ({
	data,
	mutation,
}: {
	data: ITournamentPerformance;
	mutation: ReturnType<typeof useTournamentPerformance>["mutation"];
}) => {
	if (!data) return null;

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

			<PerfCard>
				<Stack
					direction="row"
					gap={1.5}
					alignItems="start"
					justifyContent="space-between"
				>
					<Typography
						textTransform="uppercase"
						variant="topic"
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
								{data.details["correct"] ?? 0}
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
								{data.details["incorrect"] ?? 0}
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
								{data.details["waiting_for_game"] ?? 0}
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
								{data.details["not-started"] ?? 0}
							</Typography>
						</Stack>
					</PerfCard>
				</GridOfCards>
			</Stack>

			<Stack>
				{/* <GuessSection groupName={"all"} groupOfGuesses={data.details} /> */}

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

const PerfCardSkeleton = styled(PerfCard)(({ theme }) =>
	theme.unstable_sx({
		...shimmerEffect(),
	}),
);

export const Skeleton = () => {
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
					<TypographySkeleton width={100} height={20} />
					<TypographySkeleton width={150} height={30} />
				</Box>
			</Box>

			<PerfCardSkeleton>
				<Stack
					direction="row"
					gap={1.5}
					alignItems="start"
					justifyContent="space-between"
					height={102}
				/>
			</PerfCardSkeleton>

			<Stack>
				<GridOfCards>
					<PerfCardSkeleton />
					<PerfCardSkeleton />
					<PerfCardSkeleton />
					<PerfCardSkeleton />
				</GridOfCards>
			</Stack>
		</Stack>
	);
};

export default {
	Component: TournamentPerformanceStats,
	Skeleton,
};
