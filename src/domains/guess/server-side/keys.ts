export const guessKey = (tournamentId: string, round: string | null | undefined = undefined) => [
	"guess",
	{ tournamentId, round },
];
