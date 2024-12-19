export interface IMember {
	nickName: string;
	email: string;
}

export interface IMemberPerformance {
	tournaments: {
		// best: {
		tournamentId: string;
		name: string;
		badge: string;
		points: number;
	}[];
	leagues: {
		best: {
			leagueId: string;
			name: string;
			points: number;
		};
		worst: {
			leagueId: string;
			name: string;
			points: number;
		};
	};
	// currentMonth: {
	// 	points: number;
	// };
	// currentWeek: {
	// 	points: number;
	// };
	// leagues: {
	// 	best: {
	// 		name: string;
	// 		badge: string;
	// 		leader: {
	// 			points: number;
	// 			name: string;
	// 		};
	// 		member: {
	// 			points: number;
	// 		};
	// 	};
	// 	worst: {
	// 		name: string;
	// 		badge: string;
	// 		leader: {
	// 			points: number;
	// 			name: string;
	// 		};
	// 		member: {
	// 			points: number;
	// 		};
	// 	};
	// };
}
