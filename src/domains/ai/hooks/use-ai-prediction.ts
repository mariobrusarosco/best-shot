import { useQuery } from "@tanstack/react-query";
import { getMatchPrediction } from "../api/fetchers";

export interface AIPrediction {
	matchId: string;
	homeWinProbability: number;
	drawProbability: number;
	awayWinProbability: number;
	predictedScore: string;
	analysis: string;
	confidence: number;
}

/**

/**
 * Hook to fetch AI prediction for a specific match
 * 
 * @param matchId The ID of the match to get prediction for
 * @param options Additional options for the query
 * @returns useQuery result with the AI prediction
 */
export const useAIPrediction = (matchId: string, options = {}) => {
	return useQuery<AIPrediction>({
		queryKey: ["ai-prediction", matchId],
		queryFn: () => getMatchPrediction(matchId),
		enabled: false, // Always disable auto-fetching, only fetch when explicitly triggered
		...options,
	});
};
