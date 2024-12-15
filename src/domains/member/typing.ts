export interface IMember {
	nickName: string;
	email: string;
}

export interface IMemberPerformance {
	tournaments: {
		best: {
			tourmamentId: string;
			name: string;
			badge: string;
			points: number;
		};
		worst: {
			tourmamentId: string;
			name: string;
			badge: string;
			points: number;
		};
	};
	mainLeague: {
		leader: {
			leagueId: string;
			name: string;
			points: number;
		};
		you: {
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
