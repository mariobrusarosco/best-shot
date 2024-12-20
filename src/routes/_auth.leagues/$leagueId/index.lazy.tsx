import { ScreenHeading } from "@/domains/global/components/screen-heading";
import { InviteToLeague } from "@/domains/league/components/invite-to-league/invite-to-league";
import { LeaguePerformanceStats } from "@/domains/league/components/league-performance-stats/league-performance-stats";
import { LeagueTournaments } from "@/domains/league/components/league-tournaments/league-tournament-list";
import ParticipantsList from "@/domains/league/components/participants/participants";
import { useLeague } from "@/domains/league/hooks/use-league";
import { ScreenLayout } from "@/domains/ui-system/layout/screen-layout";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";
import { UIHelper } from "@/theming/theme";
import { styled } from "@mui/material";
import { Box } from "@mui/system";
import { createLazyFileRoute } from "@tanstack/react-router";

const LeaguePage = () => {
	const { league, performance } = useLeague();
	const hasInvitePermission = league?.data?.permissions.invite;

	console.log("league", league, performance);

	if (league.isPending) {
		return (
			<ScreenLayout data-ui="leagues-screen-loading">
				<ScreenHeading title="league">
					<ScreenMainContent>
						<ParticipantsList.Skeleton />
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
				<Wrapper>
					<LeaguePerformanceStats performance={performance} />
					<LeagueTournaments league={league} />
					<ParticipantsList.Component participants={league.data.participants} />
					<InviteToLeague hasInvitePermission={hasInvitePermission} />
				</Wrapper>
			</ScreenMainContent>
		</ScreenLayout>
	);
};

const Wrapper = styled(Box)(({ theme }) => ({
	padding: theme.spacing(0),
	borderRadius: theme.spacing(1),
	display: "flex",

	[UIHelper.whileIs("mobile")]: {
		flexDirection: "column",
		gap: theme.spacing(2),
	},

	[UIHelper.startsOn("tablet")]: {
		flexDirection: "row",
		gap: theme.spacing(3),
		height: "calc(100vh - var(--screeh-heading-height-tablet))",
	},
}));

export const Route = createLazyFileRoute("/_auth/leagues/$leagueId/")({
	component: LeaguePage,
});
