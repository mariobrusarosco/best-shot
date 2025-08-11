import { Box, Stack, styled } from "@mui/material";
import { createLazyFileRoute } from "@tanstack/react-router";
import { ScreenHeading } from "@/domains/global/components/screen-heading";
import { InviteToLeague } from "@/domains/league/components/invite-to-league/invite-to-league";
import LeaguePerformanceStats from "@/domains/league/components/league-performance-stats/league-performance-stats";
import { LeagueTournaments } from "@/domains/league/components/league-tournaments/league-tournament-list";
import ParticipantsList from "@/domains/league/components/participants/participants";
import { useLeague } from "@/domains/league/hooks/use-league";
import { AuthenticatedScreenLayout } from "@/domains/ui-system/layout/authenticated";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";
import { UIHelper } from "@/domains/ui-system/theme";

const LeaguePage = () => {
	const { league, performance, mutation } = useLeague();
	const hasInvitePermission = league?.data?.permissions.invite;
	const hasEditPermission = league?.data?.permissions.edit;

	console.log("league", league, performance);

	if (league.isPending || performance.isPending) {
		return (
			<AuthenticatedScreenLayout data-ui="leagues-screen-loading">
				<ScreenHeading title="league" />
				<ScreenMainContent>
					<League>
						<LeaguePerformanceStats.Skeleton />
						<ParticipantsList.Skeleton />
					</League>
				</ScreenMainContent>
			</AuthenticatedScreenLayout>
		);
	}

	if (league.isError) {
		return (
			<AuthenticatedScreenLayout data-ui="leagues-screen-error">
				<ScreenHeading title="league" />
				<ScreenMainContent>...error...</ScreenMainContent>
			</AuthenticatedScreenLayout>
		);
	}

	return (
		<AuthenticatedScreenLayout data-ui="leagues-screen screen">
			<ScreenHeading backTo="/leagues" title="league" subtitle={league.data?.label} />

			<ScreenMainContent>
				<League data-ui="league">
					<Stack spacing={2} direction="column" flex={1}>
						<LeaguePerformanceStats.Component performance={performance} mutation={mutation} />
					</Stack>
					<Stack spacing={2} direction="column" flex={1}>
						<ParticipantsList.Component participants={league.data.participants} />
						{hasEditPermission ? <LeagueTournaments league={league} /> : null}
						{hasInvitePermission ? <InviteToLeague /> : null}
					</Stack>
				</League>
			</ScreenMainContent>
		</AuthenticatedScreenLayout>
	);
};

const League = styled(Box)(({ theme }) => ({
	padding: theme.spacing(0),
	borderRadius: theme.spacing(1),
	display: "flex",
	flex: 1,

	[UIHelper.whileIs("mobile")]: {
		flexDirection: "column",
		gap: theme.spacing(2),
	},

	[UIHelper.startsOn("tablet")]: {
		gap: theme.spacing(5),
	},
}));

export const Route = createLazyFileRoute("/_auth/leagues/$leagueId/")({
	component: LeaguePage,
});
