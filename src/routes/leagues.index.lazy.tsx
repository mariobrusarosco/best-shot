import { useState } from "react";
import { useLeagues } from "../domains/league/hooks/use-leagues";
import { useLeageScore } from "../domains/league/hooks/use-leagues-score";
import { createLazyFileRoute, Link } from "@tanstack/react-router";

const LeaguesPage = () => {
	const { inputs, handleNewLeague, handleLeagueInvite, leagues } = useLeagues();
	const [inCreationMode, setInCreationMode] = useState(false);
	const [inInviteMode, setInInviteMode] = useState(false);

	return (
		<div className="leagues-screen">
			<div className="heading">
				<h3>Leagues</h3>

				<div className="league-creation">
					<button onClick={() => setInCreationMode(!inCreationMode)}>
						{inCreationMode ? "x" : "+"}
					</button>

					{inCreationMode ? (
						<div>
							<p>Create league</p>

							<label htmlFor="league-label">Name</label>
							<input
								type="text"
								id="league-label"
								name="league-label"
								value={inputs.labelInput}
								onChange={inputs.handleLabelChange}
							/>
							<label htmlFor="league-description">Description</label>
							<input
								type="text"
								id="league-description"
								name="league-description"
								onChange={inputs.handleDescriptionChange}
								value={inputs.descriptionInput}
							/>

							<button type="submit" onClick={handleNewLeague}>
								Create
							</button>
						</div>
					) : null}
				</div>

				<div className="league-invitation">
					<button onClick={() => setInInviteMode(!inInviteMode)}>
						{inInviteMode ? "x" : "invite"}
					</button>

					{inInviteMode ? (
						<div>
							<h3>Invite to League</h3>
							<label htmlFor="league-id">League ID</label>
							<input
								type="text"
								id="league-id"
								name="league-id"
								value={inputs.leagueInput}
								onChange={inputs.handleLeagueInput}
							/>
							<label htmlFor="guest-id">Guest ID</label>
							<input
								type="text"
								id="guest-id"
								name="guest-id"
								value={inputs.guestIdInput}
								onChange={inputs.handleGuestIdInput}
							/>
							<button onClick={handleLeagueInvite}>Invite</button>
						</div>
					) : null}
				</div>
			</div>

			<div className="list">
				<ul>
					{leagues?.data?.map((league) => {
						return (
							<li key={league.label} className="list-item">
								<Link to="/leagues/$id" params={{ id: league.id }}>
									{league.label}
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
};

export const Route = createLazyFileRoute("/leagues/")({
	component: LeaguesPage,
});

export { LeaguesPage };
