import { ScreenHeading } from "@/domains/global/components/screen-heading";
import { useMember } from "@/domains/member/hooks/use-member";
import { useMemberPerformance } from "@/domains/member/hooks/use-member-performance";
import { TournamentLogo } from "@/domains/tournament/components/tournament-heading";
import { GridOfCards } from "@/domains/ui-system/components/grid-of-cards/grid-of-cards";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import { ScreenLayout } from "@/domains/ui-system/layout/screen-layout";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";
import { Typography } from "@mui/material";
import { Box, Stack, styled } from "@mui/system";

const DashboardPage = () => {
	const member = useMember();
	const performance = useMemberPerformance();

	if (performance.isPending || performance.isPending) {
		return (
			<ScreenLayout data-ui="dashboard-screen">
				<ScreenHeading title="" subtitle="" />

				<ScreenMainContent>Loading</ScreenMainContent>
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
					<BestAndWorstTournaments performance={performance} />
					<MainLeague performance={performance} />
				</Stack>
			</ScreenMainContent>
		</ScreenLayout>
	);
};

export const DashCard = styled(Surface)(({ theme }) =>
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

const BestAndWorstTournaments = ({
	performance,
}: {
	performance: ReturnType<typeof useMemberPerformance>;
}) => {
	const tournaments = performance?.data?.tournaments;

	return (
		<Stack color="neutral.100" gap={3}>
			<AppPill bgcolor="teal.500" color="neutral.100" height={30} width="150px">
				<Typography textTransform="uppercase" variant="label">
					tournaments
				</Typography>
			</AppPill>

			<GridOfCards>
				<DashCard>
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
				</DashCard>

				<DashCard>
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
				</DashCard>
			</GridOfCards>
		</Stack>
	);
};

const MainLeague = ({
	performance,
}: {
	performance: ReturnType<typeof useMemberPerformance>;
}) => {
	const mainLeague = performance?.data?.mainLeague;

	return (
		<Stack color="neutral.100" gap={3}>
			<AppPill bgcolor="teal.500" color="neutral.100" height={30} width="150px">
				<Typography textTransform="uppercase" variant="label">
					main league
				</Typography>
			</AppPill>

			<GridOfCards>
				<DashCard>
					<Typography variant="label" textTransform="uppercase">
						leader
					</Typography>

					<Stack direction="row" gap={1.5} alignItems="center">
						<Typography
							textTransform="uppercase"
							variant="tag"
							color="teal.500"
						>
							{mainLeague?.leader?.name}
						</Typography>
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
							{mainLeague?.leader?.points}
						</Typography>
					</Stack>
				</DashCard>

				<DashCard>
					<Typography variant="label" textTransform="uppercase">
						you
					</Typography>

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
							{mainLeague?.you?.points}
						</Typography>
					</Stack>
				</DashCard>
			</GridOfCards>
		</Stack>
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
				<DashCard>
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
				</DashCard>

				<DashCard>
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
				</DashCard>
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
				<DashCard>
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
				</DashCard>

				<DashCard>
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
				</DashCard>
			</GridOfCards>
		</Box>
	);
};

export { DashboardPage };
performance;
