import { styled, Typography } from "@mui/material";
import { ScreenHeading, ScreenHeadingSkeleton } from "@/domains/global/components/screen-heading";
import TournamentHeading from "@/domains/tournament/components/tournament-heading";
import {
	TournamentsList,
	TournamentsListLoading,
} from "@/domains/tournament/components/tournaments-list";
import { useTournaments } from "@/domains/tournament/hooks/use-tournaments";
import type { I_Tournament } from "@/domains/tournament/schema";
import { AuthenticatedScreenLayout } from "@/domains/ui-system/layout/authenticated";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";
import { UIHelper } from "@/domains/ui-system/theme/migration";

export const TournamentsScreen = () => {
	const { data, error, isPending } = useTournaments();

	if (isPending) return <LoadingContent />;
	if (error) return <ErrorContent />;
	if (!data.length) return <EmptyStateContent />;

	return <MainContent data={data} />;
};

const LoadingContent = () => {
	return (
		<AuthenticatedScreenLayout>
			<ScreenHeadingSkeleton />

			<ScreenMainContent>
				<TournamentHeading.Skeleton />
				<TournamentsListLoading />
			</ScreenMainContent>
		</AuthenticatedScreenLayout>
	);
};

const ErrorContent = () => {
	return (
		<AuthenticatedScreenLayout>
			<ScreenMainContent>
				<Typography variant="h3" color="neutral.10">
					Ops! Something happened
				</Typography>
			</ScreenMainContent>
		</AuthenticatedScreenLayout>
	);
};

const EmptyStateContent = () => {
	return (
		<AuthenticatedScreenLayout>
			<ScreenMainContent>
				<Typography variant="h3" color="neutral.10">
					No tournaments found
				</Typography>
			</ScreenMainContent>
		</AuthenticatedScreenLayout>
	);
};

const MainContent = ({ data }: { data: I_Tournament[] }) => {
	return (
		<AuthenticatedScreenLayout data-ui="tournaments-screen">
			<ScreenHeading title="tournaments" subtitle="2024/2025 season" backTo="/dashboard" />

			<Tournaments data-ui="tournaments-main-content">
				<TournamentsList tournaments={data} />
			</Tournaments>
		</AuthenticatedScreenLayout>
	);
};

export const Tournaments = styled(ScreenMainContent)(({ theme }) => ({
	[UIHelper.startsOn("tablet")]: {
		paddingLeft: theme.spacing(0),
		paddingRight: theme.spacing(2),
	},
}));
