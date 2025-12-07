import { Box, styled } from "@mui/material";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { ScreenHeading, ScreenHeadingSkeleton } from "@/domains/global/components/screen-heading";
import { CreateLeagueDialog } from "@/domains/league/components/create-league-dialog";
import LeaguesList from "@/domains/league/components/leagues-list";
import { type FABAction, FABMenu } from "@/domains/ui-system/components/fab-menu";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { AuthenticatedScreenLayout } from "@/domains/ui-system/layout/authenticated";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";
import { UIHelper } from "@/domains/ui-system/theme";
import { useLeagues } from "../../domains/league/hooks/use-leagues";

const LeaguesPage = () => {
	const { leagues } = useLeagues();
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const handleOpenDialog = useCallback(() => setIsDialogOpen(true), []);
	const handleCloseDialog = useCallback(() => setIsDialogOpen(false), []);

	// FAB actions - can be extended with more actions in the future
	const fabActions: FABAction[] = useMemo(
		() => [
			{
				id: "create-league",
				label: "Create League",
				icon: <AppIcon name="Plus" size="medium" />,
				onClick: handleOpenDialog,
			},
			// Future actions can be added here:
			// {
			//   id: "create-tournament",
			//   label: "Create Tournament",
			//   icon: <AppIcon name="Trophy" size="small" />,
			//   onClick: handleOpenTournamentDialog,
			// },
		],
		[handleOpenDialog]
	);

	if (leagues.isLoading) {
		return (
			<AuthenticatedScreenLayout>
				<ScreenHeadingSkeleton />
				<ScreenMainContent>
					<Leagues data-ui="leagues-skeleton">
						<LeaguesList.Skeleton />
					</Leagues>
				</ScreenMainContent>
			</AuthenticatedScreenLayout>
		);
	}

	if (leagues.isError) {
		return (
			<AuthenticatedScreenLayout>
				<ScreenHeading title="leagues" />
				<ScreenMainContent>There was an error loading the leagues</ScreenMainContent>
			</AuthenticatedScreenLayout>
		);
	}

	return (
		<AuthenticatedScreenLayout data-ui="leagues-screen screen">
			<ScreenHeading title="leagues" backTo="/dashboard" />

			<ScreenMainContent data-ui="leagues-content">
				<Leagues data-ui="leagues">
					<LeaguesList.Component leagues={leagues.data} />
				</Leagues>

				<FABMenu
					actions={fabActions}
					position={{
						bottom: 24,
						right: 24,
					}}
				/>

				<CreateLeagueDialog open={isDialogOpen} onClose={handleCloseDialog} />
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
