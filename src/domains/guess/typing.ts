export type IGuess = {
	id: string;
	memberId: string;
	matchId: string;
	tournamentId: string;
	homeScore: number;
	awayScore: number;
	createdAt: Date;
	updatedAt: Date;
};
