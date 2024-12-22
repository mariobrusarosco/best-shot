import { ScreenHeading } from "@/domains/global/components/screen-heading";
import { LeaguesList } from "@/domains/league/components/leagues-list";
import { NewLeague } from "@/domains/league/components/new-league/new-league";
import { ScreenLayout } from "@/domains/ui-system/layout/screen-layout";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";
import { UIHelper } from "@/theming/theme";
import { styled } from "@mui/material";
import { Box } from "@mui/system";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useLeagues } from "../../domains/league/hooks/use-leagues";

const LeaguesPage = () => {
	const { leagues } = useLeagues();

	if (leagues.isLoading) {
		return (
			<ScreenLayout>
				<ScreenHeading title="leagues" />
				<ScreenMainContent>Loading...</ScreenMainContent>
			</ScreenLayout>
		);
	}

	if (leagues.isError) {
		return (
			<ScreenLayout>
				<ScreenHeading title="leagues" />
				<ScreenMainContent>
					There was an error loading the leagues
				</ScreenMainContent>
			</ScreenLayout>
		);
	}

	return (
		<ScreenLayout data-ui="leagues-screen screen">
			<ScreenHeading title="leagues" backTo="/dashboard" />

			<ScreenMainContent data-ui="leagues-content">
				<Leagues data-ui="leagues">
					<LeaguesList leagues={leagues.data} />

					<NewLeague />
				</Leagues>
			</ScreenMainContent>
		</ScreenLayout>
	);
};
const Leagues = styled(Box)(({ theme }) => ({
	padding: theme.spacing(0),
	borderRadius: theme.spacing(1),
	display: "flex",
	flex: 1,

	[UIHelper.whileIs("mobile")]: {
		flexDirection: "column",
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
