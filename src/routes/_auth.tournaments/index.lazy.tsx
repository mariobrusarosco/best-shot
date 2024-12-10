import { ScreenHeading } from "@/domains/global/components/screen-heading";
import {
	TournamentsList,
	TournamentsListLoading,
} from "@/domains/tournament/components/tournaments-list";
import { useTournaments } from "@/domains/tournament/hooks/use-tournaments";
import { ScreenLayout } from "@/domains/ui-system/layout/screen-layout";
import { Box } from "@mui/system";
import { createLazyFileRoute } from "@tanstack/react-router";

const TournamentsPage = () => {
	const { data, error, isLoading } = useTournaments();

	if (error) {
		return (
			<div className="error tournaments-page-error">
				We could not load all available tournaments
			</div>
		);
	}

	return (
		<ScreenLayout data-ui="tournaments-screen">
			<ScreenHeading
				title="tournaments"
				subtitle="all current available tournaments"
				withBackButton
			/>

			<Box py={[6, 10]} px={[2, 6]}>
				{isLoading ? <TournamentsListLoading /> : null}
				{data ? <TournamentsList tournaments={data} /> : null}
			</Box>
		</ScreenLayout>
	);
};

export const Route = createLazyFileRoute("/_auth/tournaments/")({
	component: TournamentsPage,
});
