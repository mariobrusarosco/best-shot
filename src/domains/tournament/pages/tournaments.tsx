import { ScreenHeading } from "@/domains/global/components/screen-heading";
import { Box } from "@mui/system";
import { TournamentsList } from "../components/tournaments-list";
import { useTournaments } from "../hooks/use-tournaments";

const TournamentsPage = () => {
	const { data, error } = useTournaments();

	if (error) {
		return (
			<div className="error tournaments-page-error">
				We could not load all available tournaments
			</div>
		);
	}

	return (
		<Box data-ui="tournaments-screen">
			<ScreenHeading
				title="tournaments"
				subtitle="all current available tournaments"
			/>

			{data ? (
				<Box py={[6, 10]} px={[2, 6]}>
					<TournamentsList tournaments={data} />
				</Box>
			) : null}
		</Box>
	);
};

export { TournamentsPage };
