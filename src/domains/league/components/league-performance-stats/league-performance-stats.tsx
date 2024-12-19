import { TournamentLogo } from "@/domains/tournament/components/tournament-heading";

import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import Typography from "@mui/material/Typography/Typography";
import { Box, Stack, styled } from "@mui/system";
import { useLeaguePerformance } from "../../hooks/use-league-performance";

export const LeaguePerformanceStats = ({
	performance,
}: {
	performance?: ReturnType<typeof useLeaguePerformance>["performance"];
}) => {
	console.log(performance?.data);

	return (
		<Box data-ui="league-performance-stats">
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					my: 2,
				}}
			>
				<AppPill.Component
					bgcolor="teal.500"
					color="neutral.100"
					width={100}
					height={25}
				>
					<Typography variant="tag">leaderboard</Typography>
				</AppPill.Component>
			</Box>

			<Stack gap={4}>
				{performance?.data?.map((tournament) => (
					<Stack gap={1}>
						<Stack direction="row" gap={1} alignItems="center">
							<TournamentLogo sx={{ width: "20px" }} src={tournament?.logo} />
							<Typography
								variant="label"
								textTransform="uppercase"
								color="neutral.100"
							>
								{tournament?.id}
							</Typography>
						</Stack>

						<Stack direction="row" gap={2}>
							{tournament?.members?.map((member, index) => (
								<Card>
									<Stack direction="row" gap={1} justifyContent="space-between">
										<Stack
											direction="row"
											alignItems="center"
											width={30}
											sx={{
												backgroundColor: "teal.500",
												color: "neutral.100",
												borderRadius: 2,
												px: 1.5,
											}}
										>
											<Typography variant="tag" textTransform="capitalize">
												{index + 1}
											</Typography>
										</Stack>

										<Stack
											direction="row"
											gap={2}
											alignItems="center"
											justifyContent="center"
											sx={{
												backgroundColor: "black.500",
												color: "neutral.100",
												borderRadius: 2,
												px: 1,
												py: 0.5,
											}}
										>
											<Typography
												variant="tag"
												textTransform="uppercase"
												color="teal.500"
											>
												points
											</Typography>
											<Typography
												color="neutral.100"
												variant="topic"
												textTransform="capitalize"
											>
												{member.points}
											</Typography>
										</Stack>
									</Stack>

									<Typography
										color="neutral.100"
										variant="label"
										textTransform="capitalize"
									>
										{member.member}
									</Typography>
								</Card>
							))}
						</Stack>
					</Stack>
				))}
			</Stack>
		</Box>
	);
};

// TODO Unify this Card, if possible
export const Card = styled(Surface)(({ theme }) =>
	theme.unstable_sx({
		backgroundColor: "black.800",
		padding: 2,
		borderRadius: 2,
		display: "flex",
		flexDirection: "column",
		gap: 2,
		flex: 1,
	}),
);
