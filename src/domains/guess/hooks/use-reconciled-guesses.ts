import { useMemo } from "react";
import type { IMatch } from "@/domains/match/typing";
import { reconcileMatchesWithGuesses } from "../utils";
import { useGuess } from "./use-guess";

/**
 * Fetches guesses and reconciles with matches to ensure every match has a guess
 * (either real from backend or virtual placeholder)
 *
 * @param matches Array of matches to reconcile against
 * @returns Query result with reconciled data (N guesses for N matches)
 */
export const useReconciledGuesses = (matches: IMatch[]) => {
	const guessesQuery = useGuess();

	// Reconcile real guesses with matches to fill gaps
	const reconciledGuesses = useMemo(() => {
		if (!guessesQuery.data || !matches.length) return [];
		return reconcileMatchesWithGuesses(matches, guessesQuery.data);
	}, [guessesQuery.data, matches]);

	return {
		...guessesQuery,
		data: reconciledGuesses,
	};
};
