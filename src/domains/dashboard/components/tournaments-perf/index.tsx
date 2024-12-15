import { DashCard } from "@/domains/dashboard/components/dash-card/dash-card";
import { useMemberPerformance } from "@/domains/member/hooks/use-member-performance";
import { TournamentLogo } from "@/domains/tournament/components/tournament-heading";
import { AppButton } from "@/domains/ui-system/components/button/button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { Stack, Typography } from "@mui/material";
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

	const tournaments = performance?.data?.tournaments;

	return (
		<Stack color="neutral.100" gap={3}>
			<AppPill.Component
				bgcolor="teal.500"
				color="neutral.100"
				height={30}
				width="150px"
			>
				<Typography textTransform="uppercase" variant="label">
					tournaments
				</Typography>
			</AppPill.Component>

			<DashGrid>
				<DashCard.Component>
					<Stack
						direction="row"
						justifyContent="space-between"
						alignItems="center"
						mb={2}
					>
						<Typography
							fontWeight={700}
							textTransform="uppercase"
							variant="tag"
						>
							Best Ranked
						</Typography>
						<AppButton
							sx={{
								borderRadius: 1,
								color: "teal.500",
							}}
						>
							<Link
								to="/tournaments/$tournamentId/matches"
								params={{
									tournamentId: tournaments?.best.tourmamentId as string,
								}}
							>
								<AppIcon size="extra-small" name="ChevronRight" />
							</Link>
						</AppButton>
					</Stack>

					<Stack
						direction="row"
						justifyContent="space-between"
						alignItems="end"
					>
						<Stack gap={1}>
							<TournamentLogo
								src={tournaments?.best?.badge}
								sx={{
									width: 40,
									height: 40,
								}}
							/>
							<Typography variant="label" color="neutral.500">
								{tournaments?.best?.name}
							</Typography>
						</Stack>

						<Stack gap={1} alignItems="end">
							<Typography
								textTransform="uppercase"
								variant="h4"
								color="neutral.100"
							>
								{tournaments?.best?.points}
							</Typography>
							<Typography
								textTransform="uppercase"
								variant="label"
								color="teal.500"
							>
								points
							</Typography>
						</Stack>
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
							fontWeight={700}
							textTransform="uppercase"
							variant="tag"
						>
							worst Ranked
						</Typography>
						<AppButton
							sx={{
								borderRadius: 1,
								color: "teal.500",
							}}
						>
							<Link
								to="/tournaments/$tournamentId/matches"
								params={{
									tournamentId: tournaments?.worst.tourmamentId as string,
								}}
							>
								<AppIcon size="extra-small" name="ChevronRight" />
							</Link>
						</AppButton>
					</Stack>

					<Stack
						direction="row"
						justifyContent="space-between"
						alignItems="end"
					>
						<Stack gap={1}>
							<TournamentLogo
								src={tournaments?.worst?.badge}
								sx={{
									width: 40,
									height: 40,
								}}
							/>
							<Typography variant="label" color="neutral.500">
								{tournaments?.worst?.name}
							</Typography>
						</Stack>

						<Stack gap={1} alignItems="end">
							<Typography
								textTransform="uppercase"
								variant="h4"
								color="neutral.100"
							>
								{tournaments?.worst?.points}
							</Typography>
							<Typography
								textTransform="uppercase"
								variant="label"
								color="teal.500"
							>
								points
							</Typography>
						</Stack>
					</Stack>
				</DashCard.Component>
			</DashGrid>
		</Stack>
	);
};

const TournamentsPerfSkeleton = () => {
	return (
		<Stack color="neutral.100" gap={3}>
			<AppPill.Skeleton height={30} width="150px" />

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
