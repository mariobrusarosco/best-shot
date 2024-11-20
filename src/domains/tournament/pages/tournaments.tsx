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
				sx={{
					backgroundColor: "teal.500",
				}}
			/>

			{data ? (
				<div>
					<TournamentsList tournaments={data} />
				</div>
			) : null}
		</Box>
	);
};

export { TournamentsPage };
