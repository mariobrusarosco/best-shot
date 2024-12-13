import { ScreenHeading } from "@/domains/global/components/screen-heading";
import { InviteToLeague } from "@/domains/league/components/invite-to-league/invite-to-league";
import { LeaguePerformanceStats } from "@/domains/league/components/league-performance-stats/league-performance-stats";
import { LeagueTournaments } from "@/domains/league/components/league-tournaments/league-tournament-list";
import { ParticipantsListSkeleton } from "@/domains/league/components/participants/participants-list-skeleton";
import { useLeague } from "@/domains/league/hooks/use-league";
import { ScreenLayout } from "@/domains/ui-system/layout/screen-layout";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";
import { Box } from "@mui/system";
import { createLazyFileRoute } from "@tanstack/react-router";

const LeaguePage = () => {
	const { league, mutation, performance } = useLeague();

	console.log("league", league, performance);

	if (league.isLoading) {
		return (
			<ScreenLayout data-ui="leagues-screen-loading">
				<ScreenHeading withBackButton title="league">
					<ScreenMainContent>
						...loading...
						<ParticipantsListSkeleton />
					</ScreenMainContent>
				</ScreenHeading>
			</ScreenLayout>
		);
	}

	if (league.isError) {
		return (
			<ScreenLayout data-ui="leagues-screen-error">
				<ScreenHeading withBackButton title="league">
					<ScreenMainContent>...error...</ScreenMainContent>
				</ScreenHeading>
			</ScreenLayout>
		);
	}

	return (
		<ScreenLayout data-ui="leagues-screen screen">
			<ScreenHeading
				withBackButton
				title="league"
				subtitle={league.data?.label}
			/>

			<ScreenMainContent>
				<Box display="grid" gap={4}>
					{league ? (
						<>
							<LeaguePerformanceStats
								performance={performance}
								mutation={mutation}
							/>
							<LeagueTournaments league={league} />
							<InviteToLeague />
						</>
					) : null}
				</Box>
			</ScreenMainContent>
		</ScreenLayout>
	);
};

export const Route = createLazyFileRoute("/_auth/leagues/$leagueId/")({
	component: LeaguePage,
});
