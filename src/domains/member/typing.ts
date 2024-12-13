export interface IMember {
	nickName: string;
	email: string;
}

export interface IMemberPerformance {
	tournaments: {
		best: {
			name: string;
			badge: string;
			points: number;
		};
		worst: {
			name: string;
			badge: string;
			points: number;
		};
	};
	mainLeague: {
		leader: {
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
