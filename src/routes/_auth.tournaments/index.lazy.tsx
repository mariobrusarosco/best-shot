import {
	ScreenHeading,
	ScreenHeadingSkeleton,
} from "@/domains/global/components/screen-heading";
import TournamentHeading from "@/domains/tournament/components/tournament-heading";
import {
	TournamentsList,
	TournamentsListLoading,
} from "@/domains/tournament/components/tournaments-list";
import { useTournaments } from "@/domains/tournament/hooks/use-tournaments";
import { AuthenticatedScreenLayout } from "@/domains/ui-system/layout/authenticated";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";
import { UIHelper } from "@/theming/theme";
import { styled } from "@mui/material";
import Typography from "@mui/material/Typography/Typography";
import { createLazyFileRoute } from "@tanstack/react-router";

const TournamentsPage = () => {
	const { data, error, isPending } = useTournaments();

	if (isPending) {
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

	if (error) {
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

	return (
		<AuthenticatedScreenLayout data-ui="tournaments-screen">
			<ScreenHeading
				title="tournaments"
				subtitle="2024/2025 season"
				backTo="/dashboard"
			/>

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

export const Route = createLazyFileRoute("/_auth/tournaments/")({
	component: TournamentsPage,
});
