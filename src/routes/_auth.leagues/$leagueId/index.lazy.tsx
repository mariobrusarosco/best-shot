import { ScreenHeading } from "@/domains/global/components/screen-heading";
import { InviteToLeague } from "@/domains/league/components/invite-to-league/invite-to-league";
import { LeaguePerformanceStats } from "@/domains/league/components/league-performance-stats/league-performance-stats";
import { LeagueTournaments } from "@/domains/league/components/league-tournaments/league-tournament-list";
import { useLeague } from "@/domains/league/hooks/use-league";
import { ScreenLayout } from "@/domains/ui-system/layout/screen-layout";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";
import { UIHelper } from "@/theming/theme";
import { Box, Stack } from "@mui/system";
import { createLazyFileRoute } from "@tanstack/react-router";

const LeaguePage = () => {
	const { league, performance } = useLeague();
	const hasInvitePermission = league?.data?.permissions.invite;

	console.log("league", league, performance);

	if (league.isLoading) {
		return (
			<ScreenLayout data-ui="leagues-screen-loading">
				<ScreenHeading title="league">
					<ScreenMainContent>
						...loading...
						{/* <ParticipantsListSkeleton /> */}
					</ScreenMainContent>
				</ScreenHeading>
			</ScreenLayout>
		);
	}

	if (league.isError) {
		return (
			<ScreenLayout data-ui="leagues-screen-error">
				<ScreenHeading title="league">
					<ScreenMainContent>...error...</ScreenMainContent>
				</ScreenHeading>
			</ScreenLayout>
		);
	}

	return (
		<ScreenLayout data-ui="leagues-screen screen">
			<ScreenHeading
				backTo="/leagues"
				title="league"
				subtitle={league.data?.label}
			/>

			<ScreenMainContent>
				<Box
					display="grid"
					gap={4}
					maxWidth={900}
					overflow="auto"
					maxHeight={"100%"}
					pr={4}
					sx={{
						[UIHelper.startsOn("tablet")]: {
							height:
								"calc(100vh - var(--screeh-heading-height-tablet) - var(--tournament-heading-height-tablet))",
						},
					}}
				>
					{league ? (
						<Stack>
							<LeaguePerformanceStats performance={performance} />
							<LeagueTournaments league={league} />
							<InviteToLeague hasInvitePermission={hasInvitePermission} />
						</Stack>
					) : null}
				</Box>
			</ScreenMainContent>
		</ScreenLayout>
	);
};

export const Route = createLazyFileRoute("/_auth/leagues/$leagueId/")({
	component: LeaguePage,
});
