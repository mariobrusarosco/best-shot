import { styled, Typography } from "@mui/material";
import { ScreenHeading, ScreenHeadingSkeleton } from "@/domains/global/components/screen-heading";
import TournamentHeading from "@/domains/tournament/components/tournament-heading";
import {
	TournamentsList,
	TournamentsListLoading,
} from "@/domains/tournament/components/tournaments-list";
import { useTournaments } from "@/domains/tournament/hooks/use-tournaments";
import { AuthenticatedScreenLayout } from "@/domains/ui-system/layout/authenticated";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";
import { UIHelper } from "@/domains/ui-system/theme";

export const AllTournamentsScreen = () => {
	const { data, states } = useTournaments();

	console.log({ data, states });

	if (states.isLoading) {
		return (
			<AuthenticatedScreenLayout>
				<ScreenHeadingSkeleton />

				<ScreenMainContent>
					<TournamentHeading.Skeleton />
					<TournamentsListLoading />
				</ScreenMainContent>
			</AuthenticatedScreenLayout>
		);
	}

	if (states.isError) {
		return (
			<AuthenticatedScreenLayout>
				<ScreenMainContent>
					<Typography variant="h3" color="neutral.10">
						Ops! Something happened
					</Typography>
				</ScreenMainContent>
			</AuthenticatedScreenLayout>
		);
	}

	if (states.isEmpty) {
		return (
			<AuthenticatedScreenLayout>
				<ScreenHeadingSkeleton />

				<ScreenMainContent>
					<Typography variant="h3" color="neutral.10">
						No tournaments found
					</Typography>
				</ScreenMainContent>
			</AuthenticatedScreenLayout>
		);
	}

	return (
		<AuthenticatedScreenLayout data-ui="tournaments-screen">
			<ScreenHeading title="tournaments" subtitle="2025/2026 season" backTo="/dashboard" />

			<ScreenContainer data-ui="tournaments-main-content">
				<TournamentsList tournaments={data.tournaments} />
			</ScreenContainer>
		</AuthenticatedScreenLayout>
	);
};

export const ScreenContainer = styled(ScreenMainContent)(({ theme }) => ({
	[UIHelper.startsOn("tablet")]: {
		paddingLeft: theme.spacing(0),
		paddingRight: theme.spacing(2),
	},
}));
