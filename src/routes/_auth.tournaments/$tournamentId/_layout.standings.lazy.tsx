import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
	"/_auth/tournaments/$tournamentId/_layout/standings",
)({
	component: () => (
		<div>
			<iframe
				id="sofa-standings-embed-83-58766"
				src="https://widgets.sofascore.com/pt-BR/embed/tournament/83/season/58766/standings/Brasileiro%20Serie%20A?widgetTitle=Brasileiro%20Serie%20A&showCompetitionLogo=true"
				scrolling="no"
			></iframe>
		</div>
	),
});
