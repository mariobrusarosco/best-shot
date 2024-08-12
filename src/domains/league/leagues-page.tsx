import { useState } from "react";
import { useLeagues } from "./hooks/use-leagues";
import { useLeageScore } from "./hooks/use-leagues-score";

const LeaguesPage = () => {
	const { inputs, handleNewLeague, handleLeagueInvite, leagues } = useLeagues();

	// const guesses = useGuess(tournament);
	const leagueScore = useLeageScore(selectedLeague);

	console.log(leagueScore.data);
	return (
		<>
			<h3>Leagues</h3>
			<ul>
				{leagues?.data?.map((league) => {
					return (
						<li
							onClick={() => handleSelectLeague(league.id)}
							key={league.label}
						>
							{league.label}
						</li>
					);
				})}
			</ul>
			<div>
				<h4>Selected League</h4>
				{selectedLeague}
			</div>

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
		</>
	);
};

export { LeaguesPage };
