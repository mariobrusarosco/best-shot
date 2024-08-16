import { createLazyFileRoute, getRouteApi } from "@tanstack/react-router";
import { useLeagues } from "../../domains/league/hooks/use-leagues";
import { useLeageScore } from "../../domains/league/hooks/use-leagues-score";
import { ILeague } from "../../domains/league/typing";

const route = getRouteApi("/_auth/leagues/$leagueId");

const LeaguePage = () => {
	const leagueId = route.useParams().leagueId;
	const { leagues } = useLeagues();
	const leagueName = leagues.data?.find(
		(league: ILeague) => league.id === leagueId,
	).label;

	const { data } = useLeageScore(leagueId);
	const scoreboard = data && (Object.entries(data) as [string, number][]);

	return (
		<div className="leagues-screen screen">
			<div className="heading">
				<h3>{leagueName}</h3>
			</div>

			<div className="ranking">
				<div className="list">
					<p>Ranking</p>
					<ul>
						{(scoreboard as [string, number][])?.map(
							([member, score]: [string, number]) => {
								return (
									<li>
										{member} : {score}
									</li>
								);
							},
						)}
					</ul>
				</div>
			</div>
		</div>
	);
};

export const Route = createLazyFileRoute("/_auth/leagues/$leagueId")({
	component: LeaguePage,
});
