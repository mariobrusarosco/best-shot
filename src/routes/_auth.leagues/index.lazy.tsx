import { ScreenHeading } from "@/domains/global/components/screen-heading";
import { LeaguesList } from "@/domains/league/components/leagues-list";
import { NewLeague } from "@/domains/league/components/new-league/new-league";
import { ScreenLayout } from "@/domains/ui-system/layout/screen-layout";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useLeagues } from "../../domains/league/hooks/use-leagues";

const LeaguesPage = () => {
	const { leagues } = useLeagues();

	if (leagues.isLoading) {
		return (
			<ScreenLayout>
				<ScreenHeading title="leagues" withBackButton />
				<ScreenMainContent>Loading...</ScreenMainContent>
			</ScreenLayout>
		);
	}

	if (leagues.isError) {
		return (
			<ScreenLayout>
				<ScreenHeading title="leagues" withBackButton />
				<ScreenMainContent>
					There was an error loading the leagues
				</ScreenMainContent>
			</ScreenLayout>
		);
	}

	return (
		<ScreenLayout data-ui="leagues-screen screen">
			<ScreenHeading title="leagues" withBackButton />

			<ScreenMainContent>
				<LeaguesList leagues={leagues.data} />

				<NewLeague />
			</ScreenMainContent>
		</ScreenLayout>
	);
};

export const Route = createLazyFileRoute("/_auth/leagues/")({
	component: LeaguesPage,
});

export { LeaguesPage };
