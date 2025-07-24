import {
	ScreenHeading,
	ScreenHeadingSkeleton,
} from "@/domains/global/components/screen-heading";
import LeaguesList from "@/domains/league/components/leagues-list";
import NewLeague from "@/domains/league/components/new-league/new-league";
import { AuthenticatedScreenLayout } from "@/domains/ui-system/layout/authenticated";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";
import { UIHelper } from "@/theming/theme";
import { Box, styled } from "@mui/material";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useLeagues } from "../../domains/league/hooks/use-leagues";

const LeaguesPage = () => {
	const { leagues } = useLeagues();

	if (leagues.isLoading) {
		return (
			<AuthenticatedScreenLayout>
				<ScreenHeadingSkeleton />
				<ScreenMainContent>
					<Leagues data-ui="leagues-skeleton">
						<LeaguesList.Skeleton />
						<NewLeague.Skeleton />
					</Leagues>
				</ScreenMainContent>
			</AuthenticatedScreenLayout>
		);
	}

	if (leagues.isError) {
		return (
			<AuthenticatedScreenLayout>
				<ScreenHeading title="leagues" />
				<ScreenMainContent>
					There was an error loading the leagues
				</ScreenMainContent>
			</AuthenticatedScreenLayout>
		);
	}

	return (
		<AuthenticatedScreenLayout data-ui="leagues-screen screen">
			<ScreenHeading title="leagues" backTo="/dashboard" />

			<ScreenMainContent data-ui="leagues-content">
				<Leagues data-ui="leagues">
					<LeaguesList.Component leagues={leagues.data} />
					<NewLeague.Component />
				</Leagues>
			</ScreenMainContent>
		</AuthenticatedScreenLayout>
	);
};
const Leagues = styled(Box)(({ theme }) => ({
	padding: theme.spacing(0),
	borderRadius: theme.spacing(1),
	display: "flex",
	flexDirection: "column",
	flex: 1,

	[UIHelper.whileIs("mobile")]: {
		gap: theme.spacing(6),
	},

	[UIHelper.startsOn("tablet")]: {
		gap: theme.spacing(3),
	},
}));

export const Route = createLazyFileRoute("/_auth/leagues/")({
	component: LeaguesPage,
});

export { LeaguesPage };
