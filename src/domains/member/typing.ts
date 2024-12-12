export interface IMember {
	nickName: string;
	email: string;
}

export interface IMemberPerformance {
	bestRanked: {
		tournament: {
			name: string;
			badge: string;
			leader: {
				points: number;
				name: string;
			};
			member: {
				points: number;
			};
		};
		league: {
			name: string;
			badge?: string;
			leader: {
				points: number;
				name: string;
			};
			member: {
				points: number;
			};
		};
	};
	currentMonth: {
		exactMatchOutcome: number;
	};
}
