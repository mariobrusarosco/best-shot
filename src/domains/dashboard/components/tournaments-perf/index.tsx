import { DashCard } from "@/domains/dashboard/components/dash-card/dash-card";
import { useMemberPerformance } from "@/domains/member/hooks/use-member-performance";
import { TournamentLogo } from "@/domains/tournament/components/tournament-heading";
import { AppButton } from "@/domains/ui-system/components/button/button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { shimmerEffect } from "@/domains/ui-system/components/skeleton/skeleton";
import { Stack, styled, Typography } from "@mui/material";
import { Box } from "@mui/system";
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
	const best = performance.data?.tournaments?.at(0);
	const worst =
		performance.data?.tournaments?.at(-1) ||
		performance.data?.tournaments?.at(0);

	return (
		<Stack color="neutral.100" gap={3}>
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

						{best === null ? null : (
							<CardRouteButton
								to="/tournaments/$tournamentId/matches"
								params={{ tournamentId: best?.tournamentId }}
							/>
						)}
					</Stack>

					<Stack
						direction="row"
						justifyContent="space-between"
						alignItems="end"
					>
						{best ? (
							<>
								<Stack gap={1}>
									<TournamentLogo
										src={best?.badge}
										sx={{
											width: 40,
											height: 40,
										}}
									/>
									<Typography variant="label" color="neutral.100">
										{best?.name}
									</Typography>
								</Stack>

								<Stack gap={1} alignItems="end">
									<Typography
										textTransform="uppercase"
										variant="h4"
										color="neutral.100"
									>
										{best?.points}
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
						{worst === null ? null : (
							<CardRouteButton
								to="/tournaments/$tournamentId/matches"
								params={{ tournamentId: worst?.tournamentId }}
							/>
						)}
					</Stack>

					<Stack
						direction="row"
						justifyContent="space-between"
						alignItems="end"
					>
						{worst ? (
							<>
								<Stack gap={1}>
									<TournamentLogo
										src={worst?.badge}
										sx={{
											width: 40,
											height: 40,
										}}
									/>
									<Typography variant="label" color="neutral.100">
										{worst?.name}
									</Typography>
								</Stack>

								<Stack gap={1} alignItems="end">
									<Typography
										textTransform="uppercase"
										variant="h4"
										color="neutral.100"
									>
										{worst?.points}
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
		</Stack>
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
		...shimmerEffect(),
		backgroundColor: "black.800",
		minWidth: "30px",
		borderRadius: 2,
	}),
);
// TODO This can be a <AppRouteButton />

const TournamentsPerfSkeleton = () => {
	return (
		<Stack color="neutral.100" gap={3}>
			<Stack direction="row" justifyContent="space-between">
				<AppPill.Skeleton height={20} width="120px" />
				<CardRouteButtonSkeleton />
			</Stack>

			<DashGrid>
				<DashCard.Skeleton />
				<DashCard.Skeleton />
			</DashGrid>
		</Stack>
	);
};

export default {
	Component: TournamentsPerf,
	Skeleton: TournamentsPerfSkeleton,
};
