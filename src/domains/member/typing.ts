export interface IMember {
	id: string;
	nickName: string;
	email: string;
}

export interface IMemberPerformance {
	tournaments: {
		worstPerformance: {
			id: string;
			points: number;
			label: string;
			logo: string;
		};
		bestPerformance: {
			id: string;
			points: number;
			label: string;
			logo: string;
		};
	};

	leagues: {
		worstPerformance: {
			id: string;
			points: number;
			label: string;
			logo: string;
		};
		bestPerformance: {
			id: string;
			points: number;
			label: string;
			logo: string;
		};
	};
}