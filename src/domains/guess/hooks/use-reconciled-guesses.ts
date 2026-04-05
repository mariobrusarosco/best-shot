import { useMemo } from "react";
import { buildPlaceholderGuess, reconcileMatchesWithGuesses } from "@/domains/guess/utils";
import type { IMatch } from "@/domains/match/typing";
import { useGuess } from "./use-guess";

/**
 * Fetches guesses and reconciles with matches to ensure every match has a guess
 * (either real from backend or virtual placeholder)
 *
 * @param matches Array of matches to reconcile against
 * @returns Query result with reconciled data (N guesses for N matches)
 */
export const useReconciledGuesses = (
	matches: IMatch[],
	{ enabled = true }: { enabled?: boolean } = {}
) => {
	const guessesQuery = useGuess({ enabled });

	// Reconcile real guesses with matches to fill gaps
	const reconciledGuesses = useMemo(() => {
		if (!enabled) {
			return matches.map((match) => buildPlaceholderGuess(match));
		}

		if (!guessesQuery.data || !matches.length) return [];
		return reconcileMatchesWithGuesses(matches, guessesQuery.data);
	}, [enabled, guessesQuery.data, matches]);

	return {
		...guessesQuery,
		isPending: enabled ? guessesQuery.isPending : false,
		isError: enabled ? guessesQuery.isError : false,
		data: reconciledGuesses,
	};
};
