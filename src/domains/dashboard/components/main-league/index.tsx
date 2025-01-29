import { useMemberPerformance } from "@/domains/member/hooks/use-member-performance";
import { AppButton } from "@/domains/ui-system/components/button/button";
import { GridOfCards } from "@/domains/ui-system/components/grid-of-cards/grid-of-cards";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { shimmerEffect } from "@/domains/ui-system/components/skeleton/skeleton";
import { Box, Stack, styled, Typography } from "@mui/material";
import { Link } from "@tanstack/react-router";

import { DashCard } from "../dash-card/dash-card";
import { DashGrid } from "../dash-grid";

const MainLeague = ({
	performance,
	loading,
}: {
	performance: ReturnType<typeof useMemberPerformance>;
	loading?: boolean;
}) => {
	if (loading) return;

	const tournaments = performance.data?.tournaments

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
						leagues
					</Typography>
				</AppPill.Component>

				<CardRouteButton to="/leagues" />
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
								to="tournaments/$tournamentId/matches"
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
									<Stack
										sx={{
											width: 40,
											height: 40,
										}}
									/>
									<Typography variant="paragraph" color="neutral.100">
										{tournaments?.bestPerformance?.label}
									</Typography>
								</Stack>

								<Stack gap={1} alignItems="end">
									<Typography
										textTransform="uppercase"
										variant="h4"
										color="neutral.100"
									>
										{tournaments?.bestPerformance?.points}
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
								to="tournaments/$tournamentId/matches"
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
									<Stack
										sx={{
											width: 40,
											height: 40,
										}}
									/>
									<Typography variant="paragraph" color="neutral.100">
										{tournaments?.worstPerformance?.label}
									</Typography>
								</Stack>

								<Stack gap={1} alignItems="end">
									<Typography
										textTransform="uppercase"
										variant="h4"
										color="neutral.100"
									>
										{tournaments?.worstPerformance	?.points}
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

const EmptyState = () => (
	<Typography variant="label" color="neutral.500">
		You neeed to be part of a league
	</Typography>
);

const CardRouteButtonSkeleton = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		position: "relative",
		...shimmerEffect(),
		backgroundColor: "black.800",
		minWidth: "30px",
		borderRadius: 2,
	}),
);
// TODO This can be a <AppRouteButton />

const MainLeagueSkeleton = () => {
	return (
		<Stack color="neutral.100" gap={3}>
			<Stack direction="row" justifyContent="space-between">
				<AppPill.Skeleton height={20} width="120px" />
				<CardRouteButtonSkeleton />
			</Stack>

			<GridOfCards>
				<DashCard.Skeleton />
				<DashCard.Skeleton />
			</GridOfCards>
		</Stack>
	);
};

export default {
	Component: MainLeague,
	Skeleton: MainLeagueSkeleton,
};
