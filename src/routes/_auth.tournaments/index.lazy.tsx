import { ScreenHeading } from "@/domains/global/components/screen-heading";
import {
	TournamentsList,
	TournamentsListLoading,
} from "@/domains/tournament/components/tournaments-list";
import { useTournaments } from "@/domains/tournament/hooks/use-tournaments";
import { ScreenLayout } from "@/domains/ui-system/layout/screen-layout";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";
import Typography from "@mui/material/Typography/Typography";
import { createLazyFileRoute } from "@tanstack/react-router";

const TournamentsPage = () => {
	const { data, error, isLoading } = useTournaments();

	if (isLoading) {
		return (
			<ScreenLayout>
				<ScreenMainContent>
					<Typography variant="h3" color="neutral.10">
						...Loading...
					</Typography>
				</ScreenMainContent>
			</ScreenLayout>
		);
	}

	if (error) throw error;

	return (
		<ScreenLayout data-ui="tournaments-screen">
			<ScreenHeading
				title="tournaments"
				subtitle="all current available tournaments"
				backTo="/dashboard"
			/>

			<ScreenMainContent>
				{isLoading ? <TournamentsListLoading /> : null}
				{data ? <TournamentsList tournaments={data} /> : null}
			</ScreenMainContent>
		</ScreenLayout>
	);
};

export const Route = createLazyFileRoute("/_auth/tournaments/")({
	component: TournamentsPage,
});
