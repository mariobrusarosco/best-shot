import { Box, Stack, styled, Typography } from "@mui/material";
import { TournamentLogo } from "@/domains/tournament/components/tournament-heading";
import { AppPill } from "@/domains/ui-system/components/app-pill/app-pill";
import { appShimmerEffect } from "@/domains/ui-system/components/app-skeleton/app-skeleton";
import { AppSurface } from "@/domains/ui-system/components/app-surface/app-surface";
import { OverflowOnHover } from "@/domains/ui-system/utils";
import type { useLeaguePerformance } from "../../hooks/use-league-performance";

const LeaguePerformanceStats = ({
	performance,
}: {
	performance?: ReturnType<typeof useLeaguePerformance>["performance"];
	mutation?: ReturnType<typeof useLeaguePerformance>["mutation"];
}) => {
	if (!performance?.data) return null;

	const leaderBoard = performance?.data.leaderBoard;

	return (
		<Wrapper data-ui="league-performance-stats">
			{/* <Stack direction="row" justifyContent="space-between" alignItems="center" pb={4}>	
				<Stack direction="row" gap={1} alignItems="center">
					<Typography variant="label" color="neutral.100">last updated: </Typography>
					<Typography variant="label" color="neutral.100">{lastUpdated.toLocaleString()}</Typography>
				</Stack>

				<AppButton variant="text" color="neutral.100" sx={{
								bgcolor: "teal.500",
								borderRadius: 2,
								padding: 1,
							}}	
							onClick={() => {
								mutation?.mutate();
							}}
							>
								<Typography variant="tag" color="neutral.100">Update Standings</Typography>
							</AppButton>
				</Stack> */}
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					pb: 3,
				}}
			>
				<AppPill.Component bgcolor="teal.500" color="neutral.100" width={100} height={25}>
					<Typography variant="tag">leaderboard</Typography>
				</AppPill.Component>
			</Box>

			{leaderBoard && (
				<Stack gap={4}>
					{leaderBoard.map((member, index) => (
						<Stack>
							<Card>
								<Stack direction="row" gap={3} justifyContent="space-between" alignItems="center">
									<Stack
										direction="row"
										alignItems="center"
										justifyContent="center"
										sx={{
											width: 25,
											height: 25,
											backgroundColor: "teal.500",
											color: "neutral.100",
											borderRadius: 2,
										}}
									>
										<Typography variant="label" textTransform="capitalize">
											{index + 1}
										</Typography>
									</Stack>

									<Typography
										color="neutral.100"
										variant="label"
										textAlign="left"
										textTransform="capitalize"
										flex={1}
									>
										{member.memberName}
									</Typography>
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
										<Typography variant="tag" textTransform="uppercase" color="teal.500">
											points
										</Typography>
										<Typography color="neutral.100" variant="topic" textTransform="capitalize">
											{member.points}
										</Typography>
									</Stack>
								</Stack>
							</Card>

							<Typography variant="tag" color="neutral.100">
								{new Date(member.lastUpdated).toDateString()}
							</Typography>
						</Stack>
					))}
				</Stack>
			)}

			<Stack gap={4}>
				{Object.entries(performance?.data.standings || {}).map(([_, tournament]) => (
					<Stack gap={1}>
						<Stack direction="row" gap={1} alignItems="center">
							<TournamentLogo sx={{ width: "20px" }} src={tournament?.logo} />
							<Typography variant="label" textTransform="uppercase" color="neutral.100">
								{tournament?.id}
							</Typography>
						</Stack>

						{tournament?.members?.map((member, index) => (
							<Card>
								<Stack direction="row" gap={3} justifyContent="space-between" alignItems="center">
									<Stack
										direction="row"
										alignItems="center"
										justifyContent="center"
										sx={{
											width: 25,
											height: 25,
											backgroundColor: "teal.500",
											color: "neutral.100",
											borderRadius: 2,
										}}
									>
										<Typography variant="label" textTransform="capitalize">
											{index + 1}
										</Typography>
									</Stack>

									<Typography
										color="neutral.100"
										variant="label"
										textAlign="left"
										textTransform="capitalize"
										flex={1}
									>
										{member.member}
									</Typography>
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
										<Typography variant="tag" textTransform="uppercase" color="teal.500">
											points
										</Typography>
										<Typography color="neutral.100" variant="topic" textTransform="capitalize">
											{member.points}
										</Typography>
									</Stack>
								</Stack>
							</Card>
						))}
					</Stack>
				))}
			</Stack>
		</Wrapper>
	);
};

const Wrapper = styled(Box)(() => ({
	display: "flex",
	flexDirection: "column",
	flex: 1,

	...OverflowOnHover(),
}));

// TODO Unify this Card, if possible
export const Card = styled(AppSurface)(({ theme }) =>
	theme.unstable_sx({
		backgroundColor: "black.800",
		padding: 2,
		borderRadius: 2,
		display: "flex",
		flexDirection: "column",
		gap: 2,
		flex: 1,
	})
);

const LeaguePerformanceStatsSkeleton = () => {
	const stats = Array.from({ length: 6 }).map((_) => _);

	return (
		<Wrapper data-ui="league-performance-stats-skeleton">
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					pb: 3,
				}}
			>
				<AppPill.Skeleton width={100} height={25} />
			</Box>

			<Stack gap={4}>
				{stats.map(() => (
					<Skeleton />
				))}
			</Stack>
		</Wrapper>
	);
};

const Skeleton = styled(Box)(() => ({
	position: "relative",
	height: "87px",
	...appShimmerEffect(),
}));

export default {
	Component: LeaguePerformanceStats,
	Skeleton: LeaguePerformanceStatsSkeleton,
};
