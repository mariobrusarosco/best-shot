import { ScreenHeading } from "@/domains/global/components/screen-heading";
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
	const { data, error, isLoading } = useTournaments();

	if (isLoading) {
		return (
			<AuthenticatedScreenLayout>
				<ScreenMainContent>
					<Typography variant="h3" color="neutral.10">
						...Loading...
					</Typography>
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
				subtitle="all current available tournaments"
				backTo="/dashboard"
			/>

			<Tournaments data-ui="tournaments-main-content">
				{isLoading ? <TournamentsListLoading /> : null}
				{data ? <TournamentsList tournaments={data} /> : null}
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
