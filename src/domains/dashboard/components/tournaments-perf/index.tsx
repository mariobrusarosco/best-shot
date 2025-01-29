import { DashCard } from "@/domains/dashboard/components/dash-card/dash-card";
import { useMemberPerformance } from "@/domains/member/hooks/use-member-performance";
import { TournamentLogo } from "@/domains/tournament/components/tournament-heading";
import { AppButton } from "@/domains/ui-system/components/button/button";
import { Counter } from "@/domains/ui-system/components/counter/counter";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { shimmerEffect } from "@/domains/ui-system/components/skeleton/skeleton";
import { Stack, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import { Link } from "@tanstack/react-router";
import { DashGrid } from "../dash-grid";

const TournamentsPerf = ({
	performance,
	loading,
}: {
	loading?: boolean;
	performance: ReturnType<typeof useMemberPerformance>;
}) => {
	if (loading) return;

	const tournaments = performance.data?.tournaments;

	if (!tournaments) return null;

	return (
		<Wrapper data-ui="tournaments-perf">
			<Stack direction="row" justifyContent="space-between">
				<AppPill.Component
					bgcolor="teal.500"
					color="neutral.100"
					height={20}
					width="120px"
				>
					<Typography textTransform="uppercase" variant="tag">
						tournaments
					</Typography>
				</AppPill.Component>

				<CardRouteButton to="/tournaments" />
			</Stack>

			<DashGrid>
				<DashCard.Component>
					<Stack
						direction="row"
						justifyContent="space-between"
						alignItems="center"
						mb={2}
					>
						<Typography
							fontWeight={500}
							textTransform="uppercase"
							variant="tag"
						>
							Best Ranked
						</Typography>

						{tournaments?.bestPerformance === null ? null : (
							<CardRouteButton
								to="/tournaments/$tournamentId/matches"
								params={{ tournamentId: tournaments?.bestPerformance?.id }}
							/>
						)}
					</Stack>

					<Stack
						direction="row"
						justifyContent="space-between"
						alignItems="end"
					>
						{tournaments?.bestPerformance ? (
							<>
								<Stack gap={1}>
									<TournamentLogo
										src={tournaments?.bestPerformance?.logo}
										sx={{
											width: 40,
											height: 40,
										}}
									/>
									<Typography variant="label" color="neutral.100">
										{tournaments?.bestPerformance?.label}
									</Typography>
								</Stack>

								<Stack gap={1} alignItems="end">
									<Typography
										textTransform="uppercase"
										variant="h4"
										color="neutral.100"
									>
										<Counter initialValue={tournaments.bestPerformance.points} />
									</Typography>
									<Typography
										textTransform="uppercase"
										variant="label"
										color="teal.500"
									>
										points
									</Typography>
								</Stack>
							</>
						) : (
							<EmptyState />
						)}
					</Stack>
				</DashCard.Component>

				<DashCard.Component>
					<Stack
						direction="row"
						justifyContent="space-between"
						alignItems="center"
						mb={2}
					>
						<Typography
							fontWeight={500}
							textTransform="uppercase"
							variant="tag"
						>
							worst Ranked
						</Typography>
						{tournaments?.worstPerformance === null ? null : (
							<CardRouteButton
								to="/tournaments/$tournamentId/matches"
								params={{ tournamentId: tournaments?.worstPerformance?.id }}
							/>
						)}
					</Stack>

					<Stack
						direction="row"
						justifyContent="space-between"
						alignItems="end"
					>
						{tournaments?.worstPerformance ? (
							<>
								<Stack gap={1}>
									<TournamentLogo
										src={tournaments?.worstPerformance?.logo}
										sx={{
											width: 40,
											height: 40,
										}}
									/>
									<Typography variant="label" color="neutral.100">
										{tournaments?.worstPerformance?.label}
									</Typography>
								</Stack>

								<Stack gap={1} alignItems="end">
									<Typography
										textTransform="uppercase"
										variant="h4"
										color="neutral.100"
									>
										<Counter initialValue={tournaments?.worstPerformance?.points} />
									</Typography>
									<Typography
										textTransform="uppercase"
										variant="label"
										color="teal.500"
									>
										points
									</Typography>
								</Stack>
							</>
						) : (
							<EmptyState />
						)}
					</Stack>
				</DashCard.Component>
			</DashGrid>
		</Wrapper>
	);
};

const EmptyState = () => (
	<Typography variant="label" color="neutral.500">
		You neeed to guess at least one match
	</Typography>
);

// TODO This can be a <AppRouteButton />
const CardRouteButton = ({ to, params = {} }: { to: string; params?: {} }) => {
	return (
		<AppButton
			sx={{
				borderRadius: 1,
				color: "teal.500",
			}}
		>
			<Link to={to} params={params}>
				<AppIcon size="extra-small" name="ChevronRight" />
			</Link>
		</AppButton>
	);
};

const CardRouteButtonSkeleton = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		position: "relative",
		backgroundColor: "black.800",
		minWidth: "30px",
		borderRadius: 2,
		...shimmerEffect(),
	}),
);
// TODO This can be a <AppRouteButton />

const TournamentsPerfSkeleton = () => {
	return (
		<Wrapper data-ui="tournaments-perf-skeleton">
			<Stack direction="row" justifyContent="space-between">
				<AppPill.Skeleton height={20} width="120px" />
				<CardRouteButtonSkeleton />
			</Stack>

			<DashGrid>
				<DashCard.Skeleton sx={{ height: "111px" }} />
				<DashCard.Skeleton sx={{ height: "111px" }} />
			</DashGrid>
		</Wrapper>
	);
};

export default {
	Component: TournamentsPerf,
	Skeleton: TournamentsPerfSkeleton,
};

const Wrapper = styled(Stack)(({ theme }) => ({
	gap: theme.spacing(3),
	color: theme.palette.neutral["100"],
}));
