import { DashCard } from "@/domains/dashboard/components/dash-card/dash-card";
import { useMemberPerformance } from "@/domains/member/hooks/use-member-performance";
import { TournamentLogo } from "@/domains/tournament/components/tournament-heading";
import { GridOfCards } from "@/domains/ui-system/components/grid-of-cards/grid-of-cards";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { Stack, Typography } from "@mui/material";

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

			<GridOfCards>
				<DashCard.Component>
					<Typography variant="label" textTransform="uppercase">
						best
					</Typography>

					<Stack direction="row" gap={1.5} alignItems="center">
						<Typography
							textTransform="uppercase"
							variant="tag"
							color="teal.500"
						>
							{tournaments?.best?.name}
						</Typography>
						<TournamentLogo
							src={tournaments?.best?.badge}
							sx={{
								width: 25,
								height: 30,
							}}
						/>
					</Stack>

					<Stack direction="row" gap={1.5} alignItems="center">
						<Typography
							textTransform="uppercase"
							variant="tag"
							color="teal.500"
						>
							points
						</Typography>
						<Typography
							textTransform="uppercase"
							variant="tag"
							color="neutral.100"
						>
							{tournaments?.best?.points}
						</Typography>
					</Stack>
				</DashCard.Component>

				<DashCard.Component>
					<Typography variant="label" textTransform="uppercase">
						worst
					</Typography>

					<Stack direction="row" gap={1.5} alignItems="center">
						<Typography
							textTransform="uppercase"
							variant="tag"
							color="teal.500"
						>
							{tournaments?.worst?.name}
						</Typography>
						<TournamentLogo
							src={tournaments?.worst?.badge}
							sx={{
								width: 25,
								height: 30,
							}}
						/>
					</Stack>

					<Stack direction="row" gap={1.5} alignItems="center">
						<Typography
							textTransform="uppercase"
							variant="tag"
							color="teal.500"
						>
							points
						</Typography>
						<Typography
							textTransform="uppercase"
							variant="tag"
							color="neutral.100"
						>
							{tournaments?.worst?.points}
						</Typography>
					</Stack>
				</DashCard.Component>
			</GridOfCards>
		</Stack>
	);
};

const TournamentsPerfSkeleton = () => {
	return (
		<Stack color="neutral.100" gap={3}>
			<AppPill.Skeleton height={30} width="150px" />

			<GridOfCards>
				<DashCard.Skeleton />
				<DashCard.Skeleton />
			</GridOfCards>
		</Stack>
	);
};

export default {
	Component: TournamentsPerf,
	Skeleton: TournamentsPerfSkeleton,
};
