import {
	ScreenHeading,
	ScreenHeadingSkeleton,
} from "@/domains/global/components/screen-heading";
import { useMember } from "@/domains/member/hooks/use-member";
import { useMemberPerformance } from "@/domains/member/hooks/use-member-performance";
import { TournamentLogo } from "@/domains/tournament/components/tournament-heading";
import { GridOfCards } from "@/domains/ui-system/components/grid-of-cards/grid-of-cards";

import { ScreenLayout } from "@/domains/ui-system/layout/screen-layout";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";
import { Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { DashCard } from "../components/dash-card/dash-card";
import MainLeague from "../components/main-league";
import TournamentsPerf from "../components/tournaments-perf";

const DashboardPage = () => {
	const member = useMember();
	const performance = useMemberPerformance();

	if (performance.isPending || performance.isPending) {
		return (
			<ScreenLayout data-ui="dashboard-screen">
				<ScreenHeadingSkeleton />

				<ScreenMainContent>
					<Stack mt={3} gap={4}>
						<TournamentsPerf.Skeleton />
						<MainLeague.Skeleton />
					</Stack>
				</ScreenMainContent>
			</ScreenLayout>
		);
	}

	if (performance.isError || member.isError) {
		return (
			<ScreenLayout data-ui="dashboard-screen">
				<ScreenHeading title="Dashboard" subtitle="" />

				<ScreenMainContent>Error</ScreenMainContent>
			</ScreenLayout>
		);
	}

	return (
		<ScreenLayout data-ui="dashboard-screen">
			<ScreenHeading title="Hello," subtitle={member?.data?.nickName} />

			<ScreenMainContent>
				<Stack mt={3} gap={4}>
					<TournamentsPerf.Component performance={performance} />
					<MainLeague.Component performance={performance} />
				</Stack>
			</ScreenMainContent>
		</ScreenLayout>
	);
};

// @ts-ignore
const CurrentMonth = ({
	performance,
}: {
	performance: ReturnType<typeof useMemberPerformance>;
}) => {
	const tournaments = performance?.data?.tournaments;

	return (
		<Box color="neutral.100" py={2} px={2}>
			<Typography variant="h6">this month</Typography>

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
		</Box>
	);
};

// @ts-ignore
const CurrentWeek = ({
	performance,
}: {
	performance: ReturnType<typeof useMemberPerformance>;
}) => {
	const tournaments = performance?.data?.tournaments;

	return (
		<Box color="neutral.100" py={2} px={2}>
			<Typography variant="h6">Tournaments</Typography>

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
		</Box>
	);
};

export { DashboardPage };
performance;
