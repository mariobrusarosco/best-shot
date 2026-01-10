import type { IMatch } from "@/domains/match/typing";
import type { GUESS_STATUS, IGuess } from "./typing";
import { GUESS_STATUSES } from "./typing";

/**
 * Calculates if user has lost the time window to guess based on match date
 * @param matchDate ISO datetime string (e.g., "2025-01-15T14:00:00Z")
 * @returns true if match has already started
 */
export const hasLostTimewindow = (matchDate: string): boolean => {
	try {
		const matchTime = new Date(matchDate).getTime();
		const now = Date.now();
		return now >= matchTime;
	} catch {
		// If date parsing fails, default to allowing guesses
		return false;
	}
};

/**
 * Creates a placeholder guess for a match that has no guess yet
 * @param match The match to create a placeholder for
 * @returns A virtual IGuess with null id and calculated status
 */
export const buildPlaceholderGuess = (match: IMatch): IGuess => {
	const hasLostWindow = hasLostTimewindow(match.date);

	// Determine status based on match state
	let status: GUESS_STATUS = GUESS_STATUSES.NOT_STARTED;
	if (hasLostWindow && match.status === "open") {
		status = GUESS_STATUSES.EXPIRED;
	} else if (match.status === "ended") {
		status = GUESS_STATUSES.FINALIZED;
	}

	return {
		id: null,
		matchId: match.id,
		home: {
			status,
			value: null,
			points: null,
		},
		away: {
			status,
			value: null,
			points: null,
		},
		fullMatch: {
			status,
			points: null,
			label: "",
		},
		total: null,
		status,
		hasLostTimewindowToGuess: hasLostWindow,
	};
};

/**
 * Reconciles matches with sparse guess data
 * Ensures every match has a corresponding guess (real or placeholder)
 *
 * @param matches Array of matches (N items)
 * @param guesses Array of real guesses from backend (0 to N items)
 * @returns Array of N guesses (real + virtual merged)
 *
 * @example
 * // 10 matches, 2 real guesses
 * reconcileMatchesWithGuesses(matches, guesses)
 * // Returns: 10 guesses (2 real, 8 placeholders)
 */
export const reconcileMatchesWithGuesses = (matches: IMatch[], guesses: IGuess[]): IGuess[] => {
	return matches.map((match) => {
		const existingGuess = guesses.find((g) => g.matchId === match.id);
		return existingGuess ?? buildPlaceholderGuess(match);
	});
};
